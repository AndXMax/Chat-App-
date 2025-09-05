import { Heading, VStack } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
import { Button } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { Box } from "@chakra-ui/react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = ChatState();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    if (!email || !password) {
      toaster.create({
        title: "Please Fill all the Feilds",
        type: "warning",
        duration: 5000,
      });
      return;
    }
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/user/login",
        {
          email,
          password,
        },
        config
      );
      console.log(data);
      setLoading(false);
      localStorage.setItem("userInfo", JSON.stringify(data));
      toaster.create({
        title: "Login Successful",
        type: "success",
        duration: 5000,
      });
      setUser(data);
      navigate("/chats");
    } catch (error: unknown) {
      const err = error as AxiosError;
      if (err.response && err.response.data) {
        toaster.create({
          title: "Error Occured!",
          description: (err.response.data as { message: string }).message,
          type: "error",
          duration: 5000,
        });
        setLoading(false);
      }
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      bgGradient="linear(to-br, gray.50, blue.50)"
      p={{ base: 2, md: 8 }}
      pt={{ base: 2, md: 4 }}
      overflowY="hidden"
    >
      <Toaster />
      <Box
        bg="white"
        _dark={{ bg: "gray.800" }}
        borderRadius="xl"
        boxShadow="lg"
        p={{ base: 6, md: 10 }}
        w="full"
        maxW="5xl"
      >
        <VStack>
          <Box textAlign="center" mb={2}>
            <Heading size="xl">Welcome back</Heading>
            <Text color="gray.600" _dark={{ color: "gray.300" }} mt={1}>
              Sign in to continue
            </Text>
          </Box>
          <Box
            display={{ base: "block", md: "grid" }}
            gap={4}
          >
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              width="300px"
              marginBottom="20px"
              borderColor="gray.300"
              _hover={{ borderColor: "gray.500" }}
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px blue.500",
              }}
            />
            <Input
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              width="300px"
              marginBottom="20px"
              borderColor="gray.300"
              _hover={{ borderColor: "gray.500" }}
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px blue.500",
              }}
            />
            <Button
              colorScheme="blue"
              width="100%"
              style={{ marginTop: 15 }}
              onClick={handleLogin}
              loading={loading}
            >
              <Text>Login</Text>
            </Button>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default Login;
