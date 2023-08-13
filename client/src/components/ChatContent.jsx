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

export default function ChatContent () {

    const [displayToggleUtility, setDisplayToggleUtility] = useState([0, 0])

    function updateToggleUtility (update, friendIndex) {
        setDisplayToggleUtility([update, friendIndex])
    }

    useEffect(() => {
        const dataFetcher = new SmartInterval(fetchData, 10000);
        dataFetcher.start()
        return () => {
            dataFetcher.stop()
        }
    }, [])

    // useEffect(() => {
    //     const intervalID = setInterval(() => fetchData(), 5000)
    // }, [])

    /* New Stuff */

    const updateMessageStatus = (friendId, stampedMessages) => {
        const spliceIndex = friends.findIndex(friend => friend._id === friendId);
        setFriends(prev => prev.toSpliced(spliceIndex, 1, {
            ...prev[spliceIndex],
            chat: stampedMessages
        }))
    }

    const updateWithNewMessage = (chatId, friendId, message) => {
        const updateAPI = async () => {
            try {
                const updateRes = await userAxios.put(`/api/protected/chats/addmessage/${chatId}`, {body: message});
                const spliceIndex = friends.findIndex(friend => friend._id === friendId);
                setFriends(prev => prev.toSpliced(spliceIndex, 1, {
                    ...prev[spliceIndex],
                    chat: prev[spliceIndex].chat.concat(updateRes.data)
                }))
            } catch (err) {
                console.log(err)
            }
        }
        updateAPI()
    }

    const [friends, setFriends] = useState(null);
    const [thinking, setThinking] = useState(false);

    const fetchData = async () => {
        try {
            const searchRes = await userAxios.get(`/api/protected/friends/chatrelated`)
            if (searchRes.data.length != 0) {
                const profileIdCollection = searchRes.data.map(user => user.profileId);
                const profilesRes = await userAxios.post('/api/protected/profiles/collection', {collection: profileIdCollection});
                const chatIds = searchRes.data.map(friend => friend.friends.find(friendObj => friendObj.friendId === JSON.parse(localStorage.getItem('staticUserInfo'))._id).chat)
                const chats = await userAxios.get('/api/protected/chats');
                const orderedChats = chatIds.map(id => chats.data.find(chat => chat._id === id).messages);
                setFriends(searchRes.data.map((user, i) => {
                    delete user.friends
                    return {
                    ...user,
                    profileUrl: profilesRes.data.find(profile => profile._id === user.profileId).imgUrl,
                    chat: orderedChats[i],
                    chatId: chatIds[i]
                    }
                }))
            } else {
                setFriends([])
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const friendDesignator = () => {
        if (friends === null || thinking) {
            return (
                <div className="loading-placeholder">
                    <img src={loadingBalls} className="loading-balls" />
                </div>
            )
        } else if (friends.length === 0) {
            return (
                <div className="loading-placeholder">
                    No friends to chat with...
                </div>
            )
        } else {
            return(
                <>
                    {friends.map((user, i) => <ChatUser key={user._id} user={user} friendIndex={i} updateToggleUtility={updateToggleUtility}/>)}
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
            return <Chat key={friends[displayToggleUtility[1]]._id} updateToggleUtility={updateToggleUtility} userInfo={friends[displayToggleUtility[1]]} updateWithNewMessage={updateWithNewMessage} updateMessageStatus={updateMessageStatus} />
        }
    }

    return (
        <div className="chat-content-wrapper">
            {setDisplay(displayToggleUtility)}
        </div>
    )
}