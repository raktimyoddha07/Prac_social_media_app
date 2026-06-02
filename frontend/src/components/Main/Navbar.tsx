import { Box, Button, Flex, Heading } from "@chakra-ui/react";

import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { logout } from "../../features/auth/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const token = useSelector((state: any) => state.auth.token);
  const user = useSelector((state: any) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());

    navigate("/login");
  };

  return (
    <Box borderBottomWidth="1px" p={4} mb={6}>
      <Flex justify="space-between" align="center">
        <Heading size="md"><Link to="/">Social App</Link></Heading>

        <Flex gap={3}>
          {!token ? (
            <>
              <Button as={Link} to="/login" colorScheme="blue">
                Login
              </Button>

              <Button as={Link} to="/register" colorScheme="green">
                Register
              </Button>
            </>
          ) : (
            <Flex gap={3} align="center">
              <Button
                as={Link}
                to={`/profile/${user?.id}`}
                colorScheme="blue"
                variant="ghost"
              >
                {user?.username}
              </Button>

              <Button colorScheme="red" onClick={handleLogout}>
                Logout
              </Button>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
