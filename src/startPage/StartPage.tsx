import { useEffect, useState } from "react";
import { socket } from "../socket";
import styles from "./StartPage.module.css";

interface IStartPageProps {
  setCurrentRoom: (room: string | null) => void;
  setUserType: (userType: userType) => void;
  setPlayerName: (name: string) => void;
  setPlayerId: (id: string) => void;
  setMaxPlayers: (maxPlayers: number) => void;
  name: string;
}

export type userType = "host" | "client";

export const StartPage = (props: IStartPageProps) => {
  const [gameId, setGameId] = useState<string>("");
  const [maxPlayers, setMaxPlayers] = useState<number>(4);
  const [userType, setUserType] = useState<userType>("client");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Listen for errors as a host
    socket.on("host_error", (data: { message: string }) => {
      setError(data.message);
    });

    // Listen for errors as a client
    socket.on("client_error", (data: { message: string }) => {
      setError(data.message);
    });

    // valid created game
    socket.on(
      "host_gameCreated",
      (data: {
        gameId: string;
        maxPlayers: number;
        numberOfRounds: number;
      }) => {
        const { gameId, maxPlayers } = data;
        props.setMaxPlayers(maxPlayers);
        props.setCurrentRoom(gameId);
        props.setUserType("host");
      }
    );

    // valid joined game
    socket.on(
      "client_joinedGame",
      (data: { gameId: string; playerName: string; playerId: string }) => {
        const { gameId, playerName, playerId } = data;
        props.setCurrentRoom(gameId);
        props.setPlayerName(playerName);
        props.setPlayerId(playerId);
        props.setUserType("client");
      }
    );
  }, []);

  // Emit an event to create a game
  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault();
    socket.emit("host_createGame", { gameId, maxPlayers, numberOfRounds: 10 });
  };

  // Emit an event to join a game with the provided game ID
  const handleJoinGame = (e: React.FormEvent, gameId: string) => {
    e.preventDefault();
    socket.emit("client_joinGame", { gameId, playerName: props.name });
  };

  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <div className={styles.radioGroup}>
          <input
            className={styles.radio}
            id="createGame"
            type="radio"
            name="gameOption"
            checked={userType === "host"}
            onChange={() => {
              setUserType("host");
              setError("");
            }}
          />
          <label htmlFor="createGame" className={styles.label}>
            Board
          </label>
          <input
            className={styles.radio}
            id="joinGame"
            type="radio"
            name="gameOption"
            checked={userType === "client"}
            onChange={() => {
              setUserType("client");
              setError("");
            }}
          />
          <label htmlFor="joinGame" className={styles.label}>
            Hand
          </label>
        </div>

        <div className={styles.inputGroup}>
          <input
            className={styles.input}
            type="text"
            placeholder="Enter game ID"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
          />
          {userType === "client" && (
            <input
              className={styles.input}
              type="text"
              placeholder="Enter your name"
              value={props.name}
              onChange={(e) => props.setPlayerName(e.target.value)}
            />
          )}
          {userType === "host" && (
            <input
              className={styles.input}
              type="number"
              placeholder="Max Players"
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(Number(e.target.value))}
            />
          )}

          {userType === "client" ? (
            <button
              className={styles.button}
              onClick={(e) => handleJoinGame(e, gameId)}
            >
              Join
            </button>
          ) : (
            <button className={styles.button} onClick={handleCreateGame}>
              Create
            </button>
          )}
        </div>
      </form>
      <p className={styles.error}>{error && <span>{error}</span>}</p>
    </div>
  );
};
