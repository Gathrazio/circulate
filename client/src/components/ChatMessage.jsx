import { useState} from 'react'

export default function ChatMessage ({body, direction, status}) {

    const [showStatus, setShowStatus] = useState(false)

    return (
        <div className={`chat-message-wrapper ${direction}`}>
            <div
                className="chat-message-body text-size"
                onMouseEnter={() => setShowStatus(true)}
                onMouseLeave={() => setShowStatus(false)}
            >
                {body}
            </div>
            { showStatus && <div className="show-status slogan-size">{status}</div> }
        </div>
    )
}