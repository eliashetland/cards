import { useEffect, useState } from "react";
import { Hand } from "./hand/Hand";
import styles from "./Client.module.css";
import type { ICard } from "../card/ICard";
import { socket } from "../socket";
import { Controls } from "./controls/Controls";
import type { IGameUpdate } from "../host/Host";

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

  useEffect(() => {
    socket.on(
      "client_newRound",
      (data: { cards: ICard[]; savedCards: ICard[] }) => {
        console.log("New round started with cards:", data.cards);
        setCards(data.cards || []);
        setSelectedCards([]);
        setSavedCards(data.savedCards || []);
        console.log("Saved cards:", data.savedCards);
      }
    );

    socket.on("gameUpdate", (data: IGameUpdate) => {
      console.log("Game update:", data);
      setPlayerTurn(data.nextPlayer);
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

    socket.on("client_gameFinished", () => {
      console.log("Game finished");
      alert("Game finished!");
    });

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
