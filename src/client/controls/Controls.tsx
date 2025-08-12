import type { ICard } from "../../card/ICard";
import styles from "./Controls.module.css";
import { Card } from "../../card/Card";

interface IControlsProps {
  playerTurn: string;
  myTurn: boolean;
  name: string;
  handleCardsPlayed: (cards: ICard[]) => void;
  selectedCards: ICard[];
  currentRoom: string;
  error?: string;
  savedCards?: ICard[];

  setError: (error: string) => void;
}

export const Controls = (props: IControlsProps) => {
  return (
    <div className={styles.container}>
      <p className={`${styles.gameInfo} ${styles.infoRow1}`}>
        Game: {props.currentRoom}
      </p>
      <p className={`${styles.playerTurn} ${styles.infoRow1}`}>
        {props.error}
      </p>
      <p className={`${styles.name} ${styles.infoRow1}`}>{props.name}</p>

      <div className={styles.info}>
        {props.myTurn ? (
          <p>Your turn! Select a card to play.</p>
        ) : (
          <p>Waiting for your turn...</p>
        )}
        <h2> {props.playerTurn} to play</h2>
      </div>

      <div className={styles.error}>
        {props.savedCards?.map((card) => (
          <Card card={card} key={`${card.rank}-${card.suit}`} />
        ))}
      </div>

      <button
        disabled={!props.myTurn || props.selectedCards.length !== 1}
        onClick={() => {
          props.handleCardsPlayed([props.selectedCards[0]]);
        }}
        className={styles.singleCardButton}
      >
        Play Card
      </button>

      <button
        disabled={
          !props.myTurn ||
          props.selectedCards.length !== 2 ||
          props.selectedCards[0].rank !== props.selectedCards[1].rank
        }
        onClick={() => {
          props.handleCardsPlayed(props.selectedCards);
        }}
        className={styles.doubleCardButton}
      >
        Change 2 for 1
      </button>
    </div>
  );
};
