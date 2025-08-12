import styles from "./AspectBox.module.css";

interface IAspectBoxProps {
  aspect: string;
  children: React.ReactNode;
}
export const AspectBox = (props: IAspectBoxProps) => {
const aspectRatioStyle = {
  '--aspect-ratio': props.aspect,
} as React.CSSProperties;


  return (
    <div className={styles.container} style={aspectRatioStyle}>
      <div className={styles.aspectBox}>{props.children}</div>
    </div>
  );
};
