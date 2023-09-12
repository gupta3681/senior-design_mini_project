import React from "react";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import InputBase from "@mui/material/InputBase";

import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

const ChatBox = () => {
  const ChatCard = styled(Card)({
    maxWidth: "600px",
    margin: "50px auto",
    minHeight: "80vh",
  });
  const SearchBar = styled("div")({
    display: "flex",
    alignItems: "center",
    padding: "10px",
    borderBottom: "1px solid #e0e0e0",
  });

  const StyledInputBase = styled(InputBase)({
    flex: 1,
    marginLeft: "10px",
  });

  return (
    <ChatCard>
      <SearchBar>
        <StyledInputBase placeholder="Search" />
      </SearchBar>
      <CardContent>{/* Chat content goes here */}</CardContent>
    </ChatCard>
  );
};

export default ChatBox;
