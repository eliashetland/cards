import type { ICard } from "../../card/ICard";
import styles from "./Board.module.css";
import { DiscardPlayed } from "./discardPlayed/DiscardPlayed";
import { TreeCards } from "./treeCards/TreeCards";

interface IBoardProps {
  playedCards: ICard[];
  discardPile: ICard[];
  playerTurn: string;
  round: number;
}

export const Board = (props: IBoardProps) => {
  console.log(props.playedCards);
  
  return (
    <div className={styles.board}>
      <div className={styles.table}>
        {props.round > 1 && (
          <DiscardPlayed
            playedCards={props.playedCards}
            discardPile={props.discardPile}
          />
        )}
        {props.round === 1 && <TreeCards cards={props.playedCards} />}
      </div>
      <p>
        Current Player: {props.playerTurn}, Round: {props.round}
      </p>
    </div>
  );
};
