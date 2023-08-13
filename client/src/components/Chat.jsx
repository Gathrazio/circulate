import { useEffect, useState, useRef } from 'react'
import ChatMessage from './ChatMessage.jsx'
import ScrollToBottom from './ScrollToBottom.jsx'
import defaultProfile from '../assets/default_profile.jpg'
import axios from 'axios'
import { IconContext } from 'react-icons'
import { AiOutlineRollback } from 'react-icons/ai'

const userAxios = axios.create();

userAxios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
})


export default function Chat ({updateToggleUtility, userInfo, updateWithNewMessage, updateMessageStatus, fetchData}) {
    const updateToggleUtilityAction = () => () => updateToggleUtility(0);

    const invincibleText = useRef('');
    const currentChatLength = useRef(userInfo.chat.length);
    const [currentText, setCurrentText] = useState(invincibleText.current);

    const updateText = (e) => {
        const {value} = e.target;
        invincibleText.current = value;
        setCurrentText(value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        updateWithNewMessage(userInfo.chatId, userInfo._id, currentText)
    }

    const handleChatClear = async () => {
        try {
            await userAxios.put(`/api/protected/chats/clearchat/${userInfo.chatId}`)
            fetchData()
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        const stampMessages = async () => {
            const stampedMessagesRes = await userAxios.put(`/api/protected/chats/updatetoread/${userInfo.chatId}`);
            updateMessageStatus(userInfo._id, stampedMessagesRes.data)
        }
        stampMessages()
    }, [])

    useEffect(() => {
        if (currentChatLength.current != userInfo.chat.length) {
            currentChatLength.current = userInfo.chat.length;
            invincibleText.current = '';
            setCurrentText('')
        }
    }, [userInfo])

    return (
        <div className="chat-wrapper">
            <div className="my-friends-bar chat-chat">
                <div className="show-hide-friends chat-chat" onClick={updateToggleUtilityAction()}>
                <IconContext.Provider value={{
                        className: `nav-icons`
                    }}>
                        <AiOutlineRollback />
                </IconContext.Provider>
                </div>
                <div className="my-friends-text chat-chat">
                <div className="profile-search-img-container">
                    <img src={userInfo.profileUrl || defaultProfile} alt="" className="pic-blurb" />
                </div>
                @<span className="user-color">{userInfo.username}</span>
                </div>
            </div>
            <div className="chat-space">
            {userInfo.chat.map(message => <ChatMessage key={message._id} body={message.body} status={message.status} direction={message.author === JSON.parse(localStorage.getItem('staticUserInfo'))._id ? "right" : "left"}/>)}
            <ScrollToBottom />
            </div>
            <div className="chat-bar-outer">
                <form className="chat-bar" onSubmit={handleSubmit}>
                <textarea className="chat-textarea" placeholder="Say something..." onChange={updateText} value={invincibleText.current} required/>
                <button className="send-chat-button">
                    Send
                </button>
            </form>
                <button className="clear-chat-button" onClick={handleChatClear}>
                    Clear Chat
                </button>
            </div>
            
        </div>
    )
}