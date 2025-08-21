import { VStack } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
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
    <VStack>
      <Toaster />
      <Input
        placeholder="Name"
        type="text"
        width="300px"
        marginBottom="20px"
        onChange={(e) => setName(e.target.value)}
        borderColor="gray.300"
        _hover={{ borderColor: "gray.500" }}
        _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
      />
      <Input
        placeholder="Email"
        type="email"
        width="300px"
        marginBottom="20px"
        onChange={(e) => setEmail(e.target.value)}
        borderColor="gray.300"
        _hover={{ borderColor: "gray.500" }}
        _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
      />
      <Input
        placeholder="Password"
        type="password"
        width="300px"
        marginBottom="20px"
        onChange={(e) => setPassword(e.target.value)}
        borderColor="gray.300"
        _hover={{ borderColor: "gray.500" }}
        _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
      />
      <Input
        placeholder="Confirm Password"
        type="password"
        width="300px"
        marginBottom="20px"
        onChange={(e) => setConfirmpassword(e.target.value)}
        borderColor="gray.300"
        _hover={{ borderColor: "gray.500" }}
        _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
      />
      <Input
        type="file"
        p={1.5}
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            postDetails(e.target.files[0]);
          }
        }}
      />
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        loading={picLoading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
