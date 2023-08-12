
export default function Chat ({updateToggleUtility, userInfo}) {
    const updateToggleUtilityAction = () => () => updateToggleUtility(0);
    return (
        <div className="chat-wrapper">
            <div className="my-friends-bar">
                <div className="show-hide-friends" onClick={updateToggleUtilityAction()}>
                    Back
                </div>
                <div className="my-friends-text">
                    @{userInfo.username}
                </div>
            </div>
            <div className="chat-space">

            </div>
            <div className="chat-bar">
                <textarea className="chat-textarea"></textarea>
                <button className="send-chat-button">
                    Send
                </button>
            </div>
        </div>
    )
}