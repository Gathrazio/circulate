import Navbar from './Navbar.jsx'
import ProfileContent from './ProfileContent.jsx'
import ChatContent from './ChatContent.jsx'
import FriendContent from './FriendContent.jsx'
import SmallTitlebar from './SmallTitlebar.jsx'
import { useState, useEffect } from 'react'
import SmartInterval from 'smartinterval'
import axios from 'axios'

const userAxios = axios.create();

userAxios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
})


export default function Navpage ({updateToken}) {

    const [toggle, setToggle] = useState(0);

    function updateToggle (update) {
        if (update === 0 && toggle != 0) {
            setToggle(0)
        } else if (update === 1 && toggle != 1) {
            setToggle(1)
        } else if (update === 2 && toggle != 2) {
            setToggle(2)
        }
    }

    function updateDisplay () {
        if (toggle === 0) {
            return <ProfileContent />
        } else if (toggle === 1) {
            return <ChatContent friends={friends} updateMessageStatus={updateMessageStatus} updateWithNewMessage={updateWithNewMessage} fetchData={fetchData}/>
        } else if (toggle === 2) {
            return <FriendContent />
        }
    }

    const displayDesignator = () => updateDisplay();

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
            return;
        }
        updateAPI()
        return;
    }

    const [friends, setFriends] = useState(null);

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
        return;
    }

    let totalUnread = 0;

    if (friends) {
        totalUnread = friends.reduce((accumulator, friend) => accumulator + friend.chat.filter(message => message.author != JSON.parse(localStorage.getItem('staticUserInfo'))._id).filter(message => message.status === "Sent").length, 0);
    }
    

    useEffect(() => {
        const dataFetcher = new SmartInterval(fetchData, 5000);
        dataFetcher.start()
        fetchData()
        return () => {
            dataFetcher.stop()
        }
    }, [])


    return (
        <div className="navpage-wrapper">
            <SmallTitlebar />
            <Navbar updateToggle={updateToggle} updateToken={updateToken} totalUnread={totalUnread}/>
            <div className="conditional-content-wrapper">
                {displayDesignator()}
            </div>
        </div>
    )
}