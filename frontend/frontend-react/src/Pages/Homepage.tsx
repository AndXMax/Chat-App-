import { SimpleGrid, Tabs } from "@chakra-ui/react";
import { Container } from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

const Homepage = () => {
  return (
    <Container style={{ textAlign: "center"}}>
      <SimpleGrid columns={1} gap="2" width="full" justifyItems="center">
        <Tabs.Root defaultValue="Login" variant="enclosed" style={{ marginTop: "20px" }}>
          <Tabs.List mb="1em">
            <Tabs.Trigger value="Login">Login</Tabs.Trigger>
            <Tabs.Trigger value="Signup">Signup</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content
            value="Login"
            mt="0"
            _open={{
              animationName: "fade-in, scale-in",
              animationDuration: "300ms",
            }}
            _closed={{
              animationName: "fade-out, scale-out",
              animationDuration: "120ms",
            }}
          >
            <Login />
          </Tabs.Content>
          <Tabs.Content
            value="Signup"
            mt="0"
            _open={{
              animationName: "fade-in, scale-in",
              animationDuration: "300ms",
            }}
            _closed={{
              animationName: "fade-out, scale-out",
              animationDuration: "120ms",
            }}
          >
            <Signup />
          </Tabs.Content>
        </Tabs.Root>
      </SimpleGrid>
    </Container>
  );
};

export default Homepage;
