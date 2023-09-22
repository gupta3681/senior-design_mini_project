import React, { useRef, useState } from "react";
import "./App.css";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/analytics";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyDuDwaCWKBOrw0HA6jwOnhLxgIx2wbsZfc",
  authDomain: "sw-mini-senior-design.firebaseapp.com",
  projectId: "sw-mini-senior-design",
  storageBucket: "sw-mini-senior-design.appspot.com",
  messagingSenderId: "278011849314",
  appId: "1:278011849314:web:0229ac7ff681649889bf3b",
  measurementId: "G-60KH2T4ZG8",
});

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();

// eslint-disable-next-line react-hooks/rules-of-hooks

function App() {
  const [user] = useAuthState(auth);
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="App">
      <header>
        <h1>Direct Messaging</h1>
        <SignOut />
      </header>

      <section>
        {user ? (
          <>
            <UserSearch setSelectedUser={setSelectedUser} />
            {selectedUser ? (
              <ChatRoom
                selectedUser={selectedUser}
                onBackToSearch={() => setSelectedUser(null)} // Pass the handler
              />
            ) : (
              <UserSearch setSelectedUser={setSelectedUser} />
            )}
          </>
        ) : (
          <SignIn />
        )}
      </section>
    </div>
  );
}

function UserSearch({ setSelectedUser }) {
  const [searchTerm, setSearchTerm] = useState("");
  const usersRef = firestore.collection("users");
  const query = usersRef.where("name", "==", searchTerm); // Simplified search by name
  const [users] = useCollectionData(query);

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search users"
      />
      <ul>
        {users &&
          users.map((user) => (
            <li key={user.uid} onClick={() => setSelectedUser(user)}>
              {user.name}
            </li>
          ))}
      </ul>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);
    console.log("user Exisits");

    if (result.additionalUserInfo?.isNewUser) {
      const { uid, displayName, email } = result.user;
      console.log(result.user);

      firestore.collection("users").doc(uid).set({
        uid,
        name: displayName,

        email,
      });
    }
  };
  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        Sign Out
      </button>
    )
  );
}

function ChatRoom({ selectedUser, onBackToSearch }) {
  const dummy = useRef();
  const { uid } = auth.currentUser;

  // Create a unique conversation ID based on user IDs
  const conversationId =
    uid < selectedUser.uid
      ? `${uid}-${selectedUser.uid}`
      : `${selectedUser.uid}-${uid}`;

  const conversationRef = firestore
    .collection("conversations")
    .doc(conversationId);
  const [conversation] = useDocumentData(conversationRef);

  const messages = conversation?.messages || [];
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [formValue1, setFormValue1] = useState("");

  const messagesArray = Array.isArray(messages) ? messages : [];

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    const newMessage = {
      text: formValue1,
      sender: uid,
      photoURL,
    };

    if (!conversation) {
      // If the conversation doesn't exist, create a new one
      await conversationRef.set({
        participants: [uid, selectedUser.uid],
        messages: [newMessage],
      });
    } else {
      // If the conversation exists, update the messages array
      await conversationRef.update({
        messages: [...messagesArray, newMessage], // Append the new message to the existing array
      });
    }

    setFormValue1("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <main>
        {/* Display messages */}
        {messagesArray &&
          messagesArray.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

        <span ref={dummy}></span>
      </main>

      {/* Add a button to go back to search users */}

      <form onSubmit={sendMessage}>
        {/* Input for sending messages */}
        <input
          value={formValue1}
          onChange={(e) => setFormValue1(e.target.value)}
        />
        <button onClick={onBackToSearch}>Back</button>
        <button type="submit" disabled={!formValue1}>
          Send
        </button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, sender, photoURL } = props.message;
  const currentUser = auth.currentUser;

  // Check if the user is authenticated and the message is sent by the current user
  const isSender = currentUser && sender === currentUser.uid;

  // Apply different CSS classes based on whether it's a sender or receiver message
  const messageClass = isSender ? "sent" : "received";

  return (
    <>
      <div className={`message ${messageClass}`}>
        {/* Apply different styling to the message container */}
        <div class="sent">
          <img src={photoURL} alt="User" />
          <p>{text}</p>
        </div>
      </div>
    </>
  );
}

export default App;
