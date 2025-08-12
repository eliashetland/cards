import { Card } from "../../card/Card";
import type { ICard } from "../../card/ICard";
import styles from "./Board.module.css";

interface IBoardProps {
  playedCards: ICard[];
  discardPile: ICard[];
  playerTurn: string;
  round: number;
}

export const Board = (props: IBoardProps) => {
  return (
    <div className={styles.board}>
      <div className={styles.table}>
        <h2 className={styles.title}>Played Cards</h2>
        <div className={`${styles.cardPile} ${styles.playedCards}`}>
          <div className={styles.stack}>
            {props.playedCards.map((card, index) => (
              <div
                key={card.rank + card.suit + index}
                className={`${styles.card} ${
                  index === props.playedCards.length - 1 || index === 2
                    ? styles.topCard
                    : ""
                }`}
              >
                <Card card={card} />
              </div>
            ))}
          </div>
        </div>
        <h2 className={styles.title}>Discard Pile</h2>
        <div className={`${styles.cardPile} ${styles.discardPile}`}>
          <div className={styles.stack}>
            {props.discardPile.map((card, index) => (
              <div
                key={card.rank + card.suit + index}
                className={`
                  ${styles.card}
                  ${
                    index === props.discardPile.length - 1 ? styles.topCard : ""
                  }
                `}
              >
                <Card card={card} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <p>
        Current Player: {props.playerTurn}, Round: {props.round}
      </p>
    </div>
  );
};
