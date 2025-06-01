import { SimpleGrid, Tabs } from "@chakra-ui/react";
import { Container } from "@chakra-ui/react";

const Homepage = () => {
  return (
    <Container maxWidth="xl" style={{ textAlign: "center", marginTop: "50px" }}>
      <SimpleGrid columns={2} gap="14" width="full">
        <Tabs.Root defaultValue="Login" variant="enclosed">
          <Tabs.List>
            <Tabs.Trigger value="Login">Login</Tabs.Trigger>
            <Tabs.Trigger value="Signup">Signup</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content
            value="Login"
            _open={{
              animationName: "fade-in, scale-in",
              animationDuration: "300ms",
            }}
            _closed={{
              animationName: "fade-out, scale-out",
              animationDuration: "120ms",
            }}
          >
            Login
          </Tabs.Content>
          <Tabs.Content
            value="Signup"
            _open={{
              animationName: "fade-in, scale-in",
              animationDuration: "300ms",
            }}
            _closed={{
              animationName: "fade-out, scale-out",
              animationDuration: "120ms",
            }}
          >
            Signup
          </Tabs.Content>
        </Tabs.Root>
      </SimpleGrid>
    </Container>
  );
};

export default Homepage;
