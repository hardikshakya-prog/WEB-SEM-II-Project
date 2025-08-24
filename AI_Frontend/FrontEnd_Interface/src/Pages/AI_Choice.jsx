
import { useSelector, useDispatch } from "react-redux";
import { setModel } from "../store/aiSlice";
import Interface from "./Interface";
import styles from "../CSS/AI_Choice.module.css";

function Radio() {
  const dispatch = useDispatch();
  const choice = useSelector((state) => state.ai.selectedModel);

  return (
    <div className={styles.wrapper}>
      <div className={styles.ButtonContainer}>
        <button
          onClick={() => dispatch(setModel("phi"))}
          className={styles.ButtonG}
          disabled={choice === "phi"}
        >
          Use Phi
        </button>
        <button
          onClick={() => dispatch(setModel("gemma"))}
          className={styles.ButtonG}
          disabled={choice === "gemma"}
        >
          Use Gemma
        </button>
      </div>

      <div>

        <Interface />
      </div>
    </div>
  );
}

export default Radio;
