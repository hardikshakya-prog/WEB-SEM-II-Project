import "./UserTextbox.css"
function TextBox({text}){
    return(
        <>
        <div className="UserChatbox">
        <div>{text}</div>
        </div>
        </>
    )

}
export default TextBox