import { useEffect, useState } from "react";
import { socket } from "../socket";
import type { ICard } from "../card/ICard";
import { Board } from "./board/Board";
import { Waiting } from "./waiting/Waiting";
import { GameOver } from "./gameOver/GameOver";

interface IHostProps {
  currentRoom: string;
  maxPlayers: number;
}

export type GameStatus = "waiting" | "started" | "finished";

export interface IGameUpdate {
  playerName: string;
  playedCards: ICard[];
  nextPlayer: string;
  round: number;
  status: GameStatus;
}

export interface IPlayer {
  name: string;
  score: number;
  savedCards: ICard[];
  position: number;
}

export const Host = (props: IHostProps) => {
  const [players, setPlayers] = useState<string[]>([]);
  const [cards, setCards] = useState<ICard[]>([]);
  const [discardPile, setDiscardPile] = useState<ICard[]>([]);
  const [playerTurn, setPlayerTurn] = useState<string>();
  const [status, setStatus] = useState<GameStatus>("waiting");
  const [round, setRound] = useState<number>(0);
  const [gameFinishedData, setGameFinishedData] = useState<IPlayer[] | null>(null);

  useEffect(() => {
    socket.on("gameUpdate", (data: IGameUpdate) => {
      console.log("Game update:", data);

      if (data.playedCards && data.round === 1) {
        setCards(data.playedCards);
        setRound(1);
      } else {
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
      }

      if (data.nextPlayer) {
        setPlayerTurn(data.nextPlayer);
      }

      if (data.status) setStatus(data.status);
      if (data.round && data.round !== round && data.round !== 1) {
        // new round started
        setCards([]);
        setDiscardPile([]);
        setRound(data.round);
      }
    });

    socket.on("host_round1", (data: { cards: ICard[] }) => {
      setCards(data.cards);
      setRound(1);
    });

    socket.on("host_gameFinished", (data) => {
      setStatus("finished");
      setPlayerTurn(undefined);
      setCards([]);
      setDiscardPile([]);
      setRound(0);
      setGameFinishedData(data.players);
    });

    return () => {
      socket.off("gameUpdate");
      socket.off("host_round1");
      socket.off("host_gameFinished");
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
    return <GameOver players={gameFinishedData || []} />;
  }
};
