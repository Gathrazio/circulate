
export default function OutboundReq (props) {
    const {requestInfo: {receiver, request}, removeRequest} = props;

    const deleteAction = () => () => removeRequest(request, "outbound");
    return (
        <div className="outbound-req-wrapper">
            <div className="req-message">
                To @<span className="user-color">{receiver.username}</span>
            </div>
            <div className="req-buttons-block">
                <button className="req-button" onClick={deleteAction()}>Delete</button>
            </div>
        </div>
    )
}