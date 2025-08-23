import { useEffect, useState } from "react";
import { Hand } from "./hand/Hand";
import styles from "./Client.module.css";
import type { ICard } from "../card/ICard";
import { socket } from "../socket";
import { Controls } from "./controls/Controls";
import type { GameStatus, IGameUpdate } from "../host/Host";
import { LastRoundControls } from "./lastRoundControls/LastRoundControls";
import { GameOver } from "../host/gameOver/GameOver";

interface IClientProps {
  currentRoom: string;
  name: string;
  playerId: string;
}

export const Client = (props: IClientProps) => {
  const [cards, setCards] = useState<ICard[]>([]);
  const [savedCards, setSavedCards] = useState<ICard[]>([]);
  const [selectedCards, setSelectedCards] = useState<ICard[]>([]);
  const [playerTurn, setPlayerTurn] = useState<string>("");
  const [myTurn, setMyTurn] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [round, setRound] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [position, setPosition] = useState<number>(0);
  const [status, setStatus] = useState<GameStatus>("waiting");

  useEffect(() => {
    socket.on(
      "client_newRound",
      (data: { cards: ICard[]; savedCards: ICard[]; round: number }) => {
        console.log("New round started with cards:", data.cards);
        setCards(data.cards || []);
        setRound(data.round);
        setSelectedCards([]);
        setSavedCards(data.savedCards || []);
        console.log("Saved cards:", data.savedCards);
      }
    );

    socket.on("gameUpdate", (data: IGameUpdate) => {
      console.log("Game update:", data);
      if (data.status) setStatus(data.status);
      setPlayerTurn(data.nextPlayer);
    });

    socket.on("client_savedCards", (data: { savedCards: ICard[] }) => {
      console.log("Saved cards updated:", data.savedCards);
      setSavedCards(data.savedCards || []);
    });

    socket.on("client_validCardsPlayed", (data: { newCards: ICard[] }) => {
      console.log(data);
      setCards(data.newCards || []);
      setSelectedCards([]);
      setError("");
      setMyTurn(false);
    });

    socket.on("client_yourTurn", () => {
      setMyTurn(true);
    });

    socket.on(
      "client_gameFinished",
      (data: { savedCards: ICard[]; score: number; position: number }) => {
        console.log("Game finished", data);
        setStatus("finished");
        setSavedCards(data.savedCards || []);
        setScore(data.score);
        setPosition(data.position);
      }
    );

    socket.on("client_error", (data: { message: string }) => {
      setError(data.message);
      setSelectedCards([]);
      console.error("Error:", data.message);
    });

    return () => {
      socket.off("client_gameFinished");
      socket.off("client_error");
      socket.off("client_yourTurn");
      socket.off("client_newRound");
      socket.off("client_savedCards");
      socket.off("gameUpdate");
      socket.off("client_validCardsPlayed");
    };
  }, []);

  const handleCardClick = (card: ICard) => {
    setSelectedCards((prev) => {
      console.log("Card clicked:", card);
      return prev.includes(card)
        ? prev.filter((c) => c.rank !== card.rank || c.suit !== card.suit)
        : [...prev, card];
    });
  };

  const handleCardsPlayed = (cards: ICard[]) => {
    socket.emit("client_playCards", { gameId: props.currentRoom, cards });
  };

  const handleRevealNewCard = () => {
    socket.emit("client_lastRoundPick", {
      gameId: props.currentRoom,
      newCard: true,
    });
    setMyTurn(false);
  };

  const handleKeepCard = () => {
    socket.emit("client_lastRoundPick", {
      gameId: props.currentRoom,
      newCard: false,
    });
    setMyTurn(false);
  };

  if (status === "finished") {
    return (
      <GameOver players={[{ name: props.name, score, savedCards, position }]} />
    );
  }

  if (round === 1) {
    return (
      <LastRoundControls
        currentRoom={props.currentRoom}
        error={error}
        setError={setError}
        playerTurn={playerTurn}
        myTurn={myTurn}
        keepCard={handleKeepCard}
        revealNewCard={handleRevealNewCard}
        savedCards={savedCards}
        name={props.name}
      />
    );
  }

  return (
    <div className={styles.container}>
      <Controls
        error={error}
        setError={setError}
        playerTurn={playerTurn}
        myTurn={myTurn}
        handleCardsPlayed={handleCardsPlayed}
        savedCards={savedCards}
        selectedCards={selectedCards}
        currentRoom={props.currentRoom}
        name={props.name}
      />
      <Hand
        cards={cards}
        selectedCards={selectedCards}
        handleCardClick={handleCardClick}
      />
    </div>
  );
};
