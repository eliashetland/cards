import { Card } from "../../card/Card";
import type { ICard } from "../../card/ICard";
import styles from "./Hand.module.css";

interface IHandProps {
  cards: ICard[];
  selectedCards: ICard[];
  handleCardClick: (card: ICard) => void;
}

export const Hand = (props: IHandProps) => {
  const cardCount = props.cards.length;

  return (
    <div className={styles.container}>
      <div className={styles.hand}>
        {props.cards.map((card, index) => (
          <div
            onClick={() => props.handleCardClick(card)}
            key={`${card.rank}-${card.suit}`}
            className={`${styles.card} ${
              props.selectedCards.includes(card) ? styles.selectedCard : ""
            }`}
            style={{
              left:
                cardCount > 1
                  ? `max(min(calc(${index} * ((100% - 32dvh) / ${cardCount - 1})), calc(${index} * 22dvh)), calc(${index} * 3dvh))`
                  : "calc((100% - 30dvh) / 2)", 
            }}
          >
            <Card card={card} />
          </div>
        ))}
      </div>
    </div>
  );
};
