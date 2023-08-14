import { useState, useEffect } from 'react'
import Chat from './Chat.jsx'
import ChatUser from './ChatUser.jsx'
import loadingBalls from '../assets/loading_gif_cool.gif'
import axios from 'axios'
import SmartInterval from 'smartinterval'

const userAxios = axios.create();

userAxios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
})

export default function ChatContent ({friends, updateMessageStatus, updateWithNewMessage, fetchData}) {

    const [displayToggleUtility, setDisplayToggleUtility] = useState([0, 0])

    function updateToggleUtility (update, friendIndex) {
        setDisplayToggleUtility([update, friendIndex])
    }

    const friendDesignator = () => {
        if (friends === null) {
            return (
                <div className="loading-placeholder">
                    <img src={loadingBalls} className="loading-balls" />
                </div>
            )
        } else if (friends.length === 0) {
            return (
                <div className="loading-placeholder-text text-size">
                    No friends to chat with...
                </div>
            )
        } else {
            return(
                <>
                    <div className="chat-content-wrapper">{friends.map((user, i) => <ChatUser key={user._id} user={user} friendIndex={i} updateToggleUtility={updateToggleUtility}/>)}</div>
                    
                </>
                
            );
        }
    }

    /* End New Stuff */

    function setDisplay (displayToggleUtility) {
        if (displayToggleUtility[0] === 0) {
            return (
                <>
                    {friendDesignator()}
                </>
            )
        } else if (displayToggleUtility[0] === 1) {
            return <Chat key={friends[displayToggleUtility[1]]._id} updateToggleUtility={updateToggleUtility} userInfo={friends[displayToggleUtility[1]]} updateWithNewMessage={updateWithNewMessage} updateMessageStatus={updateMessageStatus} fetchData={fetchData}/>
        }
    }

    return (
        <>
            {setDisplay(displayToggleUtility)}
        </>
            
    )
}