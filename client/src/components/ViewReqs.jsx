export default function ViewReqs ({updateToggle}) {
    const action = () => () => updateToggle(0);
    console.log('profile view reqs rendered')
    return (
        <>
            <div className="go-back" onClick={action()}>
                Go back
            </div>
            <div className="inbound">
                Inbound Requests
            </div>
            <div className="outbound">
                Outbound Requests
            </div>
        </>
    )
}