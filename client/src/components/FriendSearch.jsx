import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import SmartInterval from 'smartinterval';

const userAxios = axios.create();

userAxios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
})

export default function FriendSearch ({
    searchedUserDesignator,
    handleSearchChange,
    searchBody,
    fetchData
}) {

    useEffect(() => {
        const dataFetcher = new SmartInterval(fetchData, 5000);
        dataFetcher.start()
        return () => dataFetcher.stop();
    }, [searchBody])
    

    const [userFluidInfo, setUserFluidInfo] = useState()
    useEffect(() => {
        const fetchFluidData = async () => {
            try {
                const fluidUserRes = await userAxios.get('/api/protected/users');
                setUserFluidInfo(fluidUserRes.data)
            } catch (err) {
                console.log(err)
            }
        }
        fetchFluidData()
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