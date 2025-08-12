import { useEffect, useState } from "react";
import "./App.css";
import { socket } from "./socket";
import { StartPage } from "./startPage/StartPage";
import { Host } from "./host/Host";
import type { userType } from "./startPage/StartPage";
import { Client } from "./client/Client";

function App() {
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [userType, setUserType] = useState<userType>("client");
  const [playerId, setPlayerId] = useState<string>("");
  const [playerName, setPlayerName] = useState<string>("");
  const [maxPlayers, setMaxPlayers] = useState<number>(4);

  useEffect(() => {
    // Example of using the socket connection
    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <>
      {!currentRoom && (
        <StartPage
          name={playerName}
          setPlayerId={setPlayerId}
          setPlayerName={setPlayerName}
          setCurrentRoom={setCurrentRoom}
          setUserType={setUserType}
          setMaxPlayers={setMaxPlayers}
        />
      )}
      {currentRoom && userType === "host" && <Host currentRoom={currentRoom} maxPlayers={maxPlayers} />}
      {currentRoom && userType === "client" && (
        <Client currentRoom={currentRoom} name={playerName} playerId={playerId} />
      )}
    </>
  );
}

export default App;
