import type { ICard } from "./ICard";
import styles from "./Card.module.css";

interface ICardProps {
  card: ICard;
}

export const Card = (props: ICardProps) => {
  const cardSvg = "/svg-cards/" + props.card.rank + "_" + props.card.suit + ".svg";

  return (
    <div className={styles.card}>
      <img src={cardSvg} alt="" />
    </div>
  );
};
