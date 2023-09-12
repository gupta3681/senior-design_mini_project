import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import InputBase from "@mui/material/InputBase";

import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import ChatBox from "../components/ChatBox";

const LeftNav = styled(Box)({
  width: "240px",
  height: "100vh",
  position: "fixed",
  backgroundColor: "#f7f7f7",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "2px 0px 5px rgba(0, 0, 0, 0.1)",
});

const StyledButton = styled(Button)({
  margin: "10px 0",
  width: "80%",
  textTransform: "none",
});

const HomePage = () => {
  return (
    <div>
      <LeftNav>
        <Typography variant="h5" gutterBottom>
          Hi Aryan ! 👋
        </Typography>
        <StyledButton variant="outlined" color="primary">
          Button 1
        </StyledButton>
        <StyledButton variant="outlined" color="primary">
          Button 2
        </StyledButton>
        <StyledButton variant="outlined" color="primary">
          Button 3
        </StyledButton>
      </LeftNav>
      <Box marginLeft="240px">
        <ChatBox />
      </Box>
    </div>
  );
};

export default HomePage;
