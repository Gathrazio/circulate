

export default function InboundReq (props) {
    const {requestInfo: {sender, request}, removeRequest, acceptRequest} = props;
    const deleteAction = () => () => removeRequest(request, "inbound");
    const acceptAction = () => () => acceptRequest(request);
    return (
        <div className="inbound-req-wrapper">
            <div className="req-message text-size">
                From @<span className="user-color text-size">{sender.username}</span>
            </div>
            <div className="req-buttons-block-inbound">
                <button className="req-button-half text-size" onClick={deleteAction()}>Decline</button>
                <button className="req-button-half accept text-size" onClick={acceptAction()}>Accept</button>
            </div>
        </div>
    )
}