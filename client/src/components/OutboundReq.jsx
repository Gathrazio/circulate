
export default function OutboundReq (props) {
    const {requestInfo: {receiver, request}, removeRequest} = props;

    const deleteAction = () => () => removeRequest(request, "outbound");
    return (
        <div className="outbound-req-wrapper">
            <div className="req-message">
                To {receiver.username}
            </div>
            <div className="req-buttons-block">
                <button className="req-button" onClick={deleteAction()}>Delete</button>
            </div>
        </div>
    )
}