import { Card } from "../../card/Card";
import type { IPlayer } from "../Host";
import styles from "./GameOver.module.css";

interface IGameOverProps {
  players: IPlayer[];
}

export const GameOver = (props: IGameOverProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2>Game Over</h2>
        <div className={styles.results}>
          <table className={styles.score}>
            <thead>
              <tr>
                <th>Position</th>
                <th>Name</th>
                <th>Score</th>
                <th>Cards</th>
              </tr>
            </thead>
            <tbody>
              {props.players
                .sort((a, b) => b.score - a.score)

                .map((player) => (
                  <tr
                    key={player.name + player.position}
                    className={styles.player}
                  >
                    <td className={styles.playerPosition}>{player.position}</td>
                    <td className={styles.playerName}>{player.name}</td>
                    <td className={styles.playerScore}>
                      {player.score} 
                    </td>
                    <td>
                      <ul className={styles.cardList}>
                        {player.savedCards.map((card) => (
                          <li key={card.id} className={styles.cardItem}>
                            <Card card={card} />
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
