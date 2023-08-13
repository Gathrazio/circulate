
export default function OutboundReq (props) {
    const {requestInfo: {receiver, request}, removeRequest} = props;

    const deleteAction = () => () => removeRequest(request, "outbound");
    return (
        <div className="outbound-req-wrapper">
            <div className="req-message text-size">
                To @<span className="user-color text-size">{receiver.username}</span>
            </div>
            <div className="req-buttons-block">
                <button className="req-button text-size" onClick={deleteAction()}>Delete</button>
            </div>
        </div>
    )
}