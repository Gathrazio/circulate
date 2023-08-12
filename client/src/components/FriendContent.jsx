import MyFriends from './MyFriends.jsx'
import FriendSearch from './FriendSearch.jsx'
import UserProfile from './UserProfile.jsx'
import SearchedUser from './SearchedUser.jsx'
import {useState, useEffect } from 'react'
import axios from 'axios'

const userAxios = axios.create();

userAxios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
})

export default function FriendContent () {

    const [displayToggleUtility, setDisplayToggleUtility] = useState([0, {}])

    function updateToggleUtility (update, userInfo) {
        setDisplayToggleUtility([update, userInfo])
    }

    /* New Stuff */

    const [searchBody, setSearchBody] = useState('');
    const [searchedUsers, setSearchedUsers] = useState(null);
    const [thinking, setThinking] = useState(false);

    const handleSearchChange = (e) => {
        const {value} = e.target;
        setSearchBody(value)
    }
    
    const handleSubmit = (e) => {
        e.preventDefault()
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setThinking(true)
                const searchRes = await userAxios.get(`/api/protected/users/friendsearchusers/?username=${searchBody}`)
                if (searchRes.data.length != 0) {
                    const bioIdCollection = searchRes.data.map(user => user.bioId);
                    const profileIdCollection = searchRes.data.map(user => user.profileId);
                    const biosRes = await userAxios.post('/api/protected/biographies/collection', {collection: bioIdCollection});
                    const profilesRes = await userAxios.post('/api/protected/profiles/collection', {collection: profileIdCollection});
                    setSearchedUsers(searchRes.data.map(user => ({
                        ...user,
                        biography: biosRes.data.find(bio => bio._id === user.bioId).body,
                        profileUrl: profilesRes.data.find(profile => profile._id === user.profileId).imgUrl
                    })))
                } else {
                    setSearchedUsers([])
                }
                setThinking(false)
            } catch (err) {
                console.log(err)
            }
        }
        fetchData()
    }, [searchBody])

    const searchedUserDesignator = (userFluidInfo) => {
        if (searchedUsers === null || thinking) {
            return (
                <div className="loading-placeholder">
                    Loading...
                </div>
            )
        } else if (searchedUsers.length === 0) {
            return (
                <div className="loading-placeholder">
                    No Results...
                </div>
            )
        } else {

            return(
                <>
                {searchedUsers.map(user => <SearchedUser key={user._id} user={user} updateToggleUtility={updateToggleUtility} userFluidInfo={userFluidInfo}/>)}
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
                    <MyFriends updateToggleUtility={updateToggleUtility}/>
                    <FriendSearch
                        updateToggleUtility={updateToggleUtility}
                        searchedUserDesignator={searchedUserDesignator}
                        handleSubmit={handleSubmit}
                        handleSearchChange={handleSearchChange}
                        searchBody={searchBody}
                        searchedUsers={searchedUsers}
                        thinking={thinking}
                    />
                </>
                
            )
        } else if (displayToggleUtility[0] === 1) {
            return <UserProfile key={displayToggleUtility[1]._id} updateToggleUtility={updateToggleUtility} userInfo={displayToggleUtility[1]} />
        }
    }

    return (
        <div className="friend-content-wrapper content-wrapper">
            {setDisplay(displayToggleUtility)}
        </div>
    )
}