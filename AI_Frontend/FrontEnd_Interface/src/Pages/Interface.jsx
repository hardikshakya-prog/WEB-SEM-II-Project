
import TextBox from "../Components/UserTextbox";
import AiTextBox from "../Components/AiTextbox";
import styles from "../CSS/Interface.module.css";

import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUserMessage, sendMessageThunk } from "../store/chatSlice";

function Interface() {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);
  const chatAreaRef = useRef(null);

  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const selectedModel = useSelector((state) => state.ai.selectedModel);

  const TriggerUserTextbox = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;


    dispatch(addUserMessage(trimmed));

  
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      void textareaRef.current.offsetHeight;
      textareaRef.current.style.height = "2.5rem";
    }


    dispatch(sendMessageThunk(trimmed));
  };


  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
<div
  className={styles.ModelInfo}
  style={{ fontFamily: "Arial, sans-serif", marginTop: "5vh", marginLeft:"2vw",position: "fixed"}}
>
  Current Model: {selectedModel}
</div>
      <main>
        <div className={styles.Wrapper}>
          <div className={styles.ChatArea} ref={chatAreaRef}>

            {messages.map((msg) =>
              msg.sender === "user" ? (
                <TextBox key={msg.id} text={msg.text} />
              ) : (
                <AiTextBox key={msg.id} text={msg.text} />
              )
            )}
          </div>

          <div className={styles.container}>
            <textarea
              ref={textareaRef}
              value={text}
              className={styles.Textarea}
              placeholder="hello!"
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              className={styles.UpButton}
              onClick={TriggerUserTextbox}
              disabled={!text.trim()

              }
            >
              &#8593;
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

export default Interface;
