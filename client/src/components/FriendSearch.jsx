import { useState, useEffect } from 'react'
import SearchedUser from './SearchedUser.jsx'
import axios from 'axios'

const userAxios = axios.create();

userAxios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
})

export default function FriendSearch ({updateToggleUtility}) {

    const [searchBody, setSearchBody] = useState('');
    const [searchedUsers, setSearchedUsers] = useState(null);
    const [thinking, setThinking] = useState(false);
    const [userFluidInfo, setUserFluidInfo] = useState()

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
                const fluidUserRes = await userAxios.get('/api/protected/users')
                setUserFluidInfo(fluidUserRes.data)
            } catch (err) {
                console.log(err)
            }
            
        }
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                setThinking(true)
                const searchRes = await userAxios.get(`/api/protected/users/friendsearchusers/?username=${searchBody}`)
                if (searchRes.data.length != 0) {
                    const fluidUserRes = await userAxios.get('/api/protected/users')
                    const bioIdCollection = searchRes.data.map(user => user.bioId);
                    const profileIdCollection = searchRes.data.map(user => user.profileId);
                    const biosRes = await userAxios.post('/api/protected/biographies/collection', {collection: bioIdCollection});
                    const profilesRes = await userAxios.post('/api/protected/profiles/collection', {collection: profileIdCollection});
                    setUserFluidInfo(fluidUserRes.data)
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

    const searchedUserDesignator = () => {
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
            console.log("searchedUsers", searchedUsers)
            return(
                <>
                {searchedUsers.map(user => <SearchedUser key={user._id} user={user} updateToggleUtility={updateToggleUtility} userFluidInfo={userFluidInfo}/>)}
                <div className="spacer-bar"></div>
                </>
                
            );
        }
    }

    return (
        <div className="friend-search-block">
            <div className="searchbar">
                <input type="text" onChange={handleSearchChange} value={searchBody} className="search-input" placeholder="Search users"/>
            </div>
            {searchedUserDesignator()}
            
        </div>
    )
}