import React, { useState } from "react";
import TextField from "@mui/material/TextField";

const MessageLogger = () => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      console.log("Input value:", inputValue);
      // Perform any action with the input value here
      // send message to the server
      if (inputValue.trim() !== "") {
        fetch(`http://localhost:3000/log-message`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: inputValue }),
        })
            .then((res) => {
            if (res.ok) {
                console.log("Message sent successfully");
                setInputValue(""); // Clear the input field
            } else {
                console.error("Failed to send message");
            }
            })
            .catch((error) => {
            console.error("Error:", error);
            });
          }
        }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <TextField
        id="outlined-basic"
        label="Input Text Here"
        variant="outlined"
        style={{ marginTop: "20px" }}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default MessageLogger;