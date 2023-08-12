import { useState, useEffect } from 'react'
import Chat from './Chat.jsx'
import ChatUser from './ChatUser.jsx'
import axios from 'axios'

const userAxios = axios.create();

userAxios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
})

export default function ChatContent () {

    const [displayToggleUtility, setDisplayToggleUtility] = useState([0, {}])

    function updateToggleUtility (update, userInfo) {
        setDisplayToggleUtility([update, userInfo])
    }

    /* New Stuff */

    const [friends, setFriends] = useState(null);
    const [thinking, setThinking] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setThinking(true)
                const searchRes = await userAxios.get(`/api/protected/friends`)
                if (searchRes.data.length != 0) {
                    const profileIdCollection = searchRes.data.map(user => user.profileId);
                    const profilesRes = await userAxios.post('/api/protected/profiles/collection', {collection: profileIdCollection});
                    setFriends(searchRes.data.map(user => ({
                        ...user,
                        profileUrl: profilesRes.data.find(profile => profile._id === user.profileId).imgUrl
                    })))
                } else {
                    setFriends([])
                }
                setThinking(false)
            } catch (err) {
                console.log(err)
            }
        }
        fetchData()
    }, [])

    const friendDesignator = () => {
        if (friends === null || thinking) {
            return (
                <div className="loading-placeholder">
                    Loading...
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
                    {friends.map(user => <ChatUser key={user._id} user={user} updateToggleUtility={updateToggleUtility}/>)}
                    <div className="spacer-bar"></div>
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
            return <Chat key={displayToggleUtility[1]._id} updateToggleUtility={updateToggleUtility} userInfo={displayToggleUtility[1]} />
        }
    }

    return (
        <div className="chat-content-wrapper">
            {setDisplay(displayToggleUtility)}
        </div>
    )
}