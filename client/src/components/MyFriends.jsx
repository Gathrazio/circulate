import { useState, useEffect } from 'react'
import FriendListPiece from './FriendListPiece.jsx'
import loadingBalls from '../assets/loading_gif_cool.gif'
import axios from 'axios'
import SmartInterval from 'smartinterval';

const userAxios = axios.create();

userAxios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
})

export default function MyFriends ({updateToggleUtility}) {

    const [friendListToggle, setFriendListToggle] = useState(false);
    const friendListAction = () => () => setFriendListToggle(prev => !prev);
    const [friends, setFriends] = useState(null);
    const [userFriendArray, setUserFriendArray] =  useState([]);

    const updateFriends = (friendId) => {
        const deleteIndex = friends.findIndex(friend => friend._id === friendId);
        setFriends(prev => prev.toSpliced(deleteIndex, 1))
    }

    const friendListDesignator = () => {
        if (friends === null) {
            return (
                <div className="loading-placeholder">
                    <img src={loadingBalls} className="loading-balls" />
                </div>
            )
        } else if (friends.length === 0) {
            return (
                <div className="loading-placeholder">
                    You have no friends yet. Try searching through the userbase!
                </div>
            )
        } else {
            return (
                friends.map(friend => <FriendListPiece key={friend._id} friend={friend} updateToggleUtility={updateToggleUtility} userFriendArray={userFriendArray} updateFriends={updateFriends}/>)
            )
        }
    } 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const friendsRes = await userAxios.get('/api/protected/friends');
                const bioIdCollection = friendsRes.data.map(friend => friend.bioId);
                const profileIdCollection = friendsRes.data.map(friend => friend.profileId);
                const biosRes = await userAxios.post('/api/protected/biographies/collection', {collection: bioIdCollection});
                const profilesRes = await userAxios.post('/api/protected/profiles/collection', {collection: profileIdCollection});
                const fluidUserInfoRes = await userAxios.get('/api/protected/users')
                setUserFriendArray(fluidUserInfoRes.data.friends)
                setFriends(friendsRes.data.map(friend => ({
                    ...friend,
                    biography: biosRes.data.find(bio => bio._id === friend.bioId).body,
                    profileUrl: profilesRes.data.find(profile => profile._id === friend.profileId).imgUrl
                })))
            } catch (err) {
                console.log(err)
            }
        }
        const dataFetcher = new SmartInterval(fetchData, 5000)
        dataFetcher.start()
        fetchData()
        return () => {
            dataFetcher.stop()
        }
    }, [])

    return (
        <div className="my-friends-block">
            <div className="my-friends-bar">
                <div className="show-hide-friends" onClick={friendListAction()}>
                    {friendListToggle ? "Hide" : "Show"}
                </div>
                <div className="my-friends-text">
                    My Friends
                </div>
            </div>
            { friendListToggle && 
            <div className="friend-list">
                {friendListDesignator()}
            </div>}
            
        </div>
    )
}