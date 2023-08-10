

export default function InboundReq (props) {
    const {requestInfo: {sender, request}, removeRequest, acceptRequest} = props;
    const deleteAction = () => () => removeRequest(request, "inbound");
    const acceptAction = () => () => acceptRequest(request);
    return (
        <div className="inbound-req-wrapper">
            <div className="req-message">
                From {sender.username}
            </div>
            <div className="req-buttons-block-inbound">
                <button className="req-button-half" onClick={deleteAction()}>Decline</button>
                <button className="req-button-half accept" onClick={acceptAction()}>Accept</button>
            </div>
        </div>
    )
}