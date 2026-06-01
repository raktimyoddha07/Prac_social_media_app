import { Box, Button, Heading, Input, VStack, Text } from "@chakra-ui/react";

import { useState } from "react";

import { registerUser } from "../features/auth/authAPI";

import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "../features/auth/authSlice";



const Register = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const data = await registerUser({
        username,
        email,
        password,
      });

      localStorage.setItem("token", data.access_token);
      dispatch(setToken(data.access_token));
      navigate("/");
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
        <Text>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "blue" }}>
            Login
          </Link>
        </Text>
      </VStack>
    </Box>
  );
};

export default Register;
