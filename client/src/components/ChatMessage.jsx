import { useState} from 'react'

export default function ChatMessage ({body, direction, status}) {

    const [showStatus, setShowStatus] = useState(false)

    return (
        <div className={`chat-message-wrapper ${direction}`}>
            <div
                className="chat-message-body"
                onMouseEnter={() => setShowStatus(true)}
                onMouseLeave={() => setShowStatus(false)}
            >
                {body}
            </div>
            { showStatus && <div className="show-status">{status}</div> }
        </div>
    )
}