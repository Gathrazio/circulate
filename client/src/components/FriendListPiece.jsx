

export default function FriendListPiece ({friend, updateToggleUtility}) {
    const updateToggleUtilityAction = () => () => updateToggleUtility(1, friend);
    return (
        <div className="inbound-req-wrapper">
            <div className="req-message">
                @{friend.username}
            </div>
            <div className="req-buttons-block-inbound">
                <button className="req-button-half friend-button-left" onClick={updateToggleUtilityAction()}>View Profile</button>
                <button className="req-button-half friend-button-right accept" >Remove</button>
            </div>
        </div>
    )
}