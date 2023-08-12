import { useEffect, useState } from 'react'
import ChatMessage from './ChatMessage.jsx'
import ScrollToBottom from './ScrollToBottom.jsx'
import defaultProfile from '../assets/default_profile.jpg'
import axios from 'axios'

const userAxios = axios.create();

userAxios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
})


export default function Chat ({updateToggleUtility, userInfo, updateWithNewMessage, updateMessageStatus}) {
    const updateToggleUtilityAction = () => () => updateToggleUtility(0);

    const [currentText, setCurrentText] = useState('');

    const updateText = (e) => {
        const {value} = e.target;
        setCurrentText(value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        updateWithNewMessage(userInfo.chatId, userInfo._id, currentText)
    }

    useEffect(() => {
        const stampMessages = async () => {
            const stampedMessagesRes = await userAxios.put(`/api/protected/chats/updatetoread/${userInfo.chatId}`);
            updateMessageStatus(userInfo._id, stampedMessagesRes.data)
        }
        stampMessages()
    }, [])

    useEffect(() => {
        setCurrentText('')
    }, [userInfo])

    return (
        <div className="chat-wrapper">
            <div className="my-friends-bar chat-chat">
                <div className="show-hide-friends chat-chat" onClick={updateToggleUtilityAction()}>
                    Back
                </div>
                <div className="my-friends-text chat-chat">
                <div className="profile-search-img-container">
                    <img src={userInfo.profileUrl || defaultProfile} alt="" className="pic-blurb" />
                </div>
                @{userInfo.username}
                </div>
            </div>
            <div className="chat-space">
            {userInfo.chat.map(message => <ChatMessage key={message._id} body={message.body} status={message.status} direction={message.author === JSON.parse(localStorage.getItem('staticUserInfo'))._id ? "right" : "left"}/>)}
            <ScrollToBottom />
            </div>
            <form className="chat-bar" onSubmit={handleSubmit}>
                <textarea className="chat-textarea" placeholder="Say something..." onChange={updateText} value={currentText} required/>
                <button className="send-chat-button">
                    Send
                </button>
            </form>
        </div>
    )
}