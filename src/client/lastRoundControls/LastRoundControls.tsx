import { Card } from "../../card/Card";
import type { ICard } from "../../card/ICard";
import styles from "./LastRoundControls.module.css";
interface ILastRoundControlsProps {
  playerTurn: string;
  myTurn: boolean;
  name: string;
  revealNewCard: () => void;
  keepCard: () => void;
  currentRoom: string;
  error?: string;
  savedCards?: ICard[];

  setError: (error: string) => void;
}

export const LastRoundControls = (props: ILastRoundControlsProps) => {
  return (
    <div className={styles.container}>
      <p className={`${styles.gameInfo} ${styles.infoRow1}`}>
        Game: {props.currentRoom}
      </p>
      <p className={`${styles.playerTurn} ${styles.infoRow1}`}>{props.error}</p>
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
        disabled={!props.myTurn}
        onClick={props.keepCard}
        className={styles.singleCardButton}
      >
        Take this
      </button>

      <button
        disabled={!props.myTurn}
        onClick={props.revealNewCard}
        className={styles.doubleCardButton}
      >
        Reveal new card
      </button>
    </div>
  );
};
