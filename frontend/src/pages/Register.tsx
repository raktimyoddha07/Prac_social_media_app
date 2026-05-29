import { Box, Button, Heading, Input, VStack } from "@chakra-ui/react";

import { useState } from "react";

import { registerUser } from "../features/auth/authAPI";

import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await registerUser({
        username,
        email,
        password,
      });

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box maxW="400px" mx="auto" mt={10}>
      <VStack>
        <Heading>Register</Heading>

        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button colorScheme="green" width="100%" onClick={handleRegister}>
          Register
        </Button>
      </VStack>
    </Box>
  );
};

export default Register;
