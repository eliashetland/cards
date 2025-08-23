import { Card } from "../../../card/Card";
import type { ICard } from "../../../card/ICard";
import styles from "./TreeCards.module.css";

interface ITreeCardsProps {
  cards: ICard[];
}

export const TreeCards = (props: ITreeCardsProps) => {
  console.log(props.cards);
  
  return (
    <div className={styles.container}>
      <div className={` ${styles.playedCards}`}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div className={styles.cardPile}>
            <div
              key={props.cards[i]?.id ?? `empty-${i}`}
              className={`${styles.card} ${styles.stack} `}
            >
              <Card card={props.cards[i]} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
