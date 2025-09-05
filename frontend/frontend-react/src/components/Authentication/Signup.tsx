import { VStack } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import { Text as CText } from "@chakra-ui/react";
import { useState } from "react";
import { Toaster, toaster } from "@/components/ui/toaster";
import axios, { AxiosError } from "axios";
import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async () => {
    setPicLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toaster.create({
        title: "Please Fill all the Feilds",
        type: "warning",
        duration: 5000,
      });
      setPicLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toaster.create({
        title: "Passwords Do Not Match",
        type: "warning",
        duration: 5000,
      });
      return;
    }
    console.log(name, email, password, pic);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "http://localhost:3000/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      console.log(data);
      toaster.create({
        title: "Registration Successful",
        type: "success",
        duration: 5000,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
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
        setPicLoading(false);
      }
    }
  };

  const postDetails = (pics: File) => {
    setPicLoading(true);
    if (pics === undefined) {
      toaster.create({
        title: "Please Select an Image!",
        type: "warning",
        duration: 5000,
      });
      return;
    }
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "piyushproj");
      fetch("https://api.cloudinary.com/v1_1/piyushproj/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toaster.create({
        title: "Please Select an Image!",
        type: "warning",
        duration: 5000,
      });
      setPicLoading(false);
      return;
    }
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="flex-start" bgGradient="linear(to-br, gray.50, blue.50)" p={{ base: 2, md: 8 }} pt={{ base: 2, md: 4 }} overflowY="hidden">
      <Toaster />
      <Box bg="white" _dark={{ bg: 'gray.800' }} borderRadius="xl" boxShadow="lg" p={{ base: 6, md: 10 }} w="full" maxW="5xl">
        <VStack gap={6} align="stretch">
          <Box textAlign="center" mb={2}>
            <Heading size="xl">Create your account</Heading>
            <CText color="gray.600" _dark={{ color: 'gray.300' }} mt={1}>Join us to get started</CText>
          </Box>
          <Box display={{ base: 'block', md: 'grid' }} gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
            <Input w="full" size="xl" fontSize="xl"
              placeholder="Name"
              type="text"
              onChange={(e) => setName(e.target.value)}
              height="68px"
              borderColor="gray.300"
              _hover={{ borderColor: 'gray.400' }}
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
            />
            <Input w="full" size="xl" fontSize="xl"
              placeholder="Email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              height="68px"
              borderColor="gray.300"
              _hover={{ borderColor: 'gray.400' }}
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
            />
            <Input w="full" size="xl" fontSize="xl"
              placeholder="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              height="68px"
              borderColor="gray.300"
              _hover={{ borderColor: 'gray.400' }}
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
            />
            <Input w="full" size="xl" fontSize="xl"
              placeholder="Confirm Password"
              type="password"
              onChange={(e) => setConfirmpassword(e.target.value)}
              height="68px"
              borderColor="gray.300"
              _hover={{ borderColor: 'gray.400' }}
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
            />
          </Box>
          <Input w="full" size="xl" fontSize="xl"
            type="file"
            p={1.5}
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                postDetails(e.target.files[0]);
              }
            }}
          />
          <Button w="full"
            colorScheme="blue"
            size="lg"
            borderRadius="md"
            onClick={submitHandler}
            loading={picLoading}
          >
            Sign Up
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default Signup;
