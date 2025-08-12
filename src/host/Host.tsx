import { useEffect, useState } from "react";
import { socket } from "../socket";
import type { ICard } from "../card/ICard";
import styles from "./Host.module.css";
import { Board } from "./board/Board";
import { Waiting } from "./waiting/Waiting";

interface IHostProps {
  currentRoom: string;
  maxPlayers: number;
}

type GameStatus = "waiting" | "started" | "finished";

export interface IGameUpdate {
  playerName: string;
  playedCards: ICard[];
  nextPlayer: string;
  round: number;
  status: GameStatus;
}

export const Host = (props: IHostProps) => {
  const [players, setPlayers] = useState<string[]>([]);
  const [cards, setCards] = useState<ICard[]>([]);
  const [discardPile, setDiscardPile] = useState<ICard[]>([]);
  const [playerTurn, setPlayerTurn] = useState<string>();
  const [status, setStatus] = useState<GameStatus>("waiting");
  const [round, setRound] = useState<number>(0);

  useEffect(() => {
    socket.on("gameUpdate", (data: IGameUpdate) => {
      console.log("Game update:", data);

      if (data.playedCards) {
        if (data.playedCards.length === 1) {
          setCards((prevCards) => {
            const updated = [...prevCards, data.playedCards[0]];
            return updated.slice(-3); // keep only the last 3
          });
        }
        if (data.playedCards.length === 2) {
          setDiscardPile((prevCards) => {
            const updated = [...prevCards, ...data.playedCards];
            return updated.slice(-3); // keep only the last 3
          });
        }
      }

      if (data.nextPlayer) {
        setPlayerTurn(data.nextPlayer);
      }

      if (data.status) setStatus(data.status);
      if (data.round && data.round !== round) {
        // new round started
        setCards([]);
        setDiscardPile([]);
        setRound(data.round);
      }
    });

    return () => {
      socket.off("gameUpdate");
    };
  }, []);

  if (status === "waiting") {
    return (
      <Waiting
        setPlayers={setPlayers}
        currentRoom={props.currentRoom}
        players={players}
        maxPlayers={props.maxPlayers}
      />
    );
  } else if (status === "started") {
    return (
      <Board
        round={round}
        playedCards={cards}
        discardPile={discardPile}
        playerTurn={playerTurn || "No players"}
      />
    );
  } else if (status === "finished") {
    return (
      <div className={styles.board}>
        <h1>Game Over</h1>
        <p>Current Room: {props.currentRoom}</p>
        <h2>Final Players:</h2>
        <ul>
          {players.map((player, index) => (
            <li key={index}>{player}</li>
          ))}
        </ul>
        <button
          onClick={() =>
            socket.emit("resetGame", { gameId: props.currentRoom })
          }
        >
          Reset Game
        </button>
      </div>
    );
  }
};
