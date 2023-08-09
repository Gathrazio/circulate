
export default function Navbar ({updateToggle}) {
    const action = (update) => () => updateToggle(update);
    return (
        <div className="navbar-wrapper">
            <div className="profile-select">
            <div className="select-text" onClick={action(0)}>
                    proifle-select
                </div>
            </div>
            <div className="chat-select" onClick={action(1)}>
                <div className="select-text">
                    chat-select
                </div>
            </div>
            <div className="friend-select" onClick={action(2)}>
            <div className="select-text">
                    friend-select
                </div>
            </div>
        </div>
    )
}