import React from "react";
import {
  Card,
  Stack,
  TextField,
  Button,
  CardContent,
  Typography,
} from "@mui/material";

const isUser = false;

const LoginRegister = () => {
  return (
    <Stack
      spacing={2}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      {isUser ? (
        <Card variant="outlined" style={{ width: "300px" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Login
            </Typography>
            <Stack spacing={2} direction="column">
              <TextField label="Username" variant="outlined" fullWidth />
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
              />
              <Button variant="contained" color="primary" fullWidth>
                Login
              </Button>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <Card variant="outlined" style={{ width: "300px" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Register
            </Typography>
            <Stack spacing={2} direction="column">
              <TextField label="Username" variant="outlined" fullWidth />
              <TextField label="Email" variant="outlined" fullWidth />
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
              />
              <TextField
                label="Confirm Password"
                variant="outlined"
                type="password"
                fullWidth
              />
              <Button variant="contained" color="primary" fullWidth>
                Register
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
};

export default LoginRegister;
