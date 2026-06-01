import { Box, Button, Heading, Input, VStack, Text } from "@chakra-ui/react";

import { useState } from "react";

import { useDispatch } from "react-redux";

import { useNavigate, Link } from "react-router-dom";

import { loginUser } from "../features/auth/authAPI";

import { setToken } from "../features/auth/authSlice";


const Login = () => {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const data = await loginUser({
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
        <Heading>Login</Heading>

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

        <Button colorScheme="blue" width="100%" onClick={handleLogin}>
          Login
        </Button>
        <Text>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "blue" }}>
            Register
          </Link>
        </Text>
      </VStack>
    </Box>
  );
};

export default Login;
