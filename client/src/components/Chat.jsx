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


    const [chat, setChat] = useState(userInfo.chat)
    const invincibleText = useRef('');
    const [initialRender, setInitialRender] = useState(true);
    const currentChatLength = useRef(userInfo.chat.length);
    const [textHelper, setTextHelper] = useState('');
    const [chatClearToggle, setChatClearToggle] = useState(true);
    const [scrollSignal, setScrollSignal] = useState(true)

    const updateInititalRenderFalse = () => {
        setInitialRender(false)
    }

    useEffect(() => {
        setChat(userInfo.chat)
    }, [userInfo.chat.length])

    const updateText = (e) => {
        const {value} = e.target;
        setTextHelper(value)
        invincibleText.current = value;
    }

    useEffect(() => {
        setScrollSignal(true)
        const handleChatLengthChange = async () => {
            if (userInfo.chat[userInfo.chat.length - 1].author === userInfo._id) {
                setChat(prev => prev.toSpliced(prev.length - 1, 1, {...prev[prev.length - 1], status: "Read"}))
                await userAxios.put(`/api/protected/chats/updatemessagetoread/${userInfo.chatId}`)
            }
        }
        const timeoutId = setTimeout(handleChatLengthChange, 2000)
        return () => {
            clearTimeout(timeoutId)
        }
    }, [userInfo.chat.length])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setTextHelper('')
        await updateWithNewMessage(userInfo.chatId, userInfo._id, invincibleText.current)
        currentChatLength.current = userInfo.chat.length;
        invincibleText.current = '';
    }

    function updateScrollSignalFalse () {
        setScrollSignal(false)
    }

    const handleChatClear = async () => {
        try {
            setChatClearToggle(false)
            await userAxios.put(`/api/protected/chats/clearchat/${userInfo.chatId}`)
            await fetchData()
            setChatClearToggle(true)
        } catch (err) {
            console.log(err)
        }
    }

    console.log('scrolLSignal', scrollSignal)

    useEffect(() => {
        const stampMessages = async () => {
            setChat(prev => prev.map(message => ({...message, status: "Read"})))
            const stampedMessagesRes = await userAxios.put(`/api/protected/chats/updatetoread/${userInfo.chatId}`);
            updateMessageStatus(userInfo._id, stampedMessagesRes.data)
        }
        const timeoutId = setTimeout(stampMessages, 2000);
        return () => {
            clearTimeout(timeoutId)
        }
    }, [])

    return (
        <div className="chat-wrapper">
            <div className="my-friends-bar chat-chat">
                <div className="show-hide-friends text-size chat-chat" onClick={updateToggleUtilityAction()}>
                <IconContext.Provider value={{
                        className: `nav-icons`
                    }}>
                        <AiOutlineRollback />
                </IconContext.Provider>
                </div>
                <div className="my-friends-text text-size-larger chat-chat">
                <div className="profile-search-img-container">
                    <img src={userInfo.profileUrl || defaultProfile} alt="" className="pic-blurb" />
                </div>
                @<span className="user-color text-size">{userInfo.username}</span>
                </div>
            </div>
            <div className="chat-space">
            {chat && chat.map(message => <ChatMessage key={message._id} body={message.body} status={message.status} direction={message.author === JSON.parse(localStorage.getItem('staticUserInfo'))._id ? "right" : "left"}/>)}
            {scrollSignal && <ScrollToBottom  initialRender={initialRender} updateInititalRenderFalse={updateInititalRenderFalse} updateScrollSignalFalse={updateScrollSignalFalse}/>}
            </div>
            <div className="chat-bar-outer">
                <form className="chat-bar" onSubmit={handleSubmit}>
                    <textarea className="chat-textarea text-size" placeholder="Say something..." onChange={updateText} value={invincibleText.current} required/>
                    <div className={`send-chat-button-wrapper${textHelper ? '' : ' disabled-wrapper'}`}>
                        <button className={`send-chat-button text-size${textHelper ? '' : ' disabled'}`}>
                            Send
                        </button>
                    </div>
                    
                </form>
                <div className={`clear-chat-button-wrapper${chatClearToggle ? '' : ' disabled-wrapper'}`}>
                    <button className={`clear-chat-button text-size${chatClearToggle ? '' : ' disabled'}`} onClick={handleChatClear}>
                        Clear Chat
                    </button>
                </div>
            </div>
        </div>
    )
}