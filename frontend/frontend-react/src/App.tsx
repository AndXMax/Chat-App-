import "./App.css";
import Message from "./components/Message";
import MessageLogger from "./components/MessageLogger";

function App() {
  const message = [
    {sender : "User", text: "Hello!"},
    {sender : "Bot", text: "Hi there! How can I help you today?"},
    {sender : "User", text: "I need some information."},
    {sender : "Bot", text: "Sure! What information do you need?"},
  ];
  return (
    <div>
      <h1 style={{ textAlign: "center", marginTop: "50px" }}>
        Welcome to the React App!
      </h1>
      <MessageLogger />
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        {message.map((msg) => (
          <Message sender={msg.sender} text={msg.text} />
        ))}
        
      </div>
    </div>
  );
}

export default App;