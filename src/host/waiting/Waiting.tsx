import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { socket } from "../../socket";
import styles from "./Waiting.module.css";

interface IWaitingProps {
  currentRoom: string;
  players: string[];
  setPlayers: Dispatch<SetStateAction<string[]>>;
  maxPlayers: number;
}

export const Waiting = (props: IWaitingProps) => {
  const [error, setError] = useState<string>("");

  useEffect(() => {
    socket.on("host_error", (data: { message: string }) => {
      console.error("Error:", data.message);
      setError(data.message);
    });

    socket.on(
      "host_playerJoined",
      (data: { playerName: string; playerId: string }) => {
        console.log("Player joined:", data);
        setError("");
        props.setPlayers((prevPlayers: string[]) => [
          ...prevPlayers,
          data.playerName,
        ]);
      }
    );

    return () => {
      socket.off("host_error");
      socket.off("host_playerJoined");
    };
  }, []);

  const startGame = () => {
    setError("");
    socket.emit("host_startGame", { gameId: props.currentRoom });
  };

  return (
    <div className={styles.container}>
      <h1>Game Board</h1>
      <p>Current Room: {props.currentRoom}</p>

      <h2>Players:</h2>
      <ul className={styles.playerList}>
        {Array.from({ length: props.maxPlayers }, (_, i) =>
          props.players[i] ? (
            <li key={i} className={styles.player}>
              {props.players[i]}
            </li>
          ) : (
            <li key={i} className={`${styles.player} ${styles.waiting}`}>
              Waiting for player {i + 1}
            </li>
          )
        )}
      </ul>

      <button className={styles.startButton} onClick={startGame}>
        Start Game
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};
