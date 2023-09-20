import React, { useRef, useState } from "react";
import "./App.css";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/analytics";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

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
        <h1>Private Messaging</h1>
        <SignOut />
      </header>

      <section>
        {user ? (
          <>
            <UserSearch setSelectedUser={setSelectedUser} />
            {selectedUser && <ChatRoom selectedUser={selectedUser} />}
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
        placeholder="Search users..."
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
      <p>
        Do not violate the community guidelines or you will be banned for life!
      </p>
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

function ChatRoom({ selectedUser }) {
  const dummy = useRef();
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    // Create a unique conversation ID based on user IDs
    const conversationId =
      uid < selectedUser.uid
        ? `${uid}-${selectedUser.uid}`
        : `${selectedUser.uid}-${uid}`;

    const conversationRef = firestore
      .collection("conversations")
      .doc(conversationId);

    // Fetch the existing conversation
    const conversationSnapshot = await conversationRef.get();

    const newMessage = {
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      sender: uid,
      photoURL,
    };

    if (!conversationSnapshot.exists) {
      // If the conversation doesn't exist, create a new one
      await conversationRef.set({
        participants: [uid, selectedUser.uid],
        messages: [newMessage],
      });
    } else {
      // If the conversation exists, append the new message
      const currentMessages = conversationSnapshot.data().messages || [];
      await conversationRef.update({
        messages: [...currentMessages, newMessage],
      });
    }

    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <main>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="say something nice"
        />

        <button type="submit" disabled={!formValue}>
          🕊️
        </button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img
          src={
            photoURL || "https://api.adorable.io/avatars/23/abott@adorable.png"
          }
        />
        <p>{text}</p>
      </div>
    </>
  );
}

export default App;
