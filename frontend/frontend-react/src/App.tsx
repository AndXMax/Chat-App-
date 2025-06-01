import "./App.css";
import MessageLogger from "./components/MessageLogger";
import { Routes, Route } from "react-router-dom";
import Homepage from "./components/Pages/Homepage";

function App() {
  
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/logger" element={<MessageLogger />} />
      </Routes>
    </div>
  );
}

export default App;