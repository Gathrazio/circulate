import { useState, useEffect } from 'react'
import SearchedUser from './SearchedUser.jsx'
import axios from 'axios'

const userAxios = axios.create();

userAxios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
})

export default function FriendSearch ({
    searchedUserDesignator,
    handleSearchChange,
    searchBody
}) {

    const [userFluidInfo, setUserFluidInfo] = useState()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const fluidUserRes = await userAxios.get('/api/protected/users');
                setUserFluidInfo(fluidUserRes.data)
            } catch (err) {
                console.log(err)
            }
        }
        fetchData()
    }, [])

    return (
        <div className="friend-search-block">
            <div className="searchbar">
                <input type="text" onChange={handleSearchChange} value={searchBody} className="search-input" placeholder="Search users"/>
            </div>
            {searchedUserDesignator(userFluidInfo)}
            
        </div>
    )
}