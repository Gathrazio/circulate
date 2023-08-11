import { useState, useEffect } from 'react'

export default function FriendSearch () {

    const [searchBody, setSearchBody] = useState('');

    const handleSearchChange = (e) => {
        const {value} = e.target;
        setSearchBody(value)
    }
    
    const handleSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <div className="friend-search-block">
            <form onSubmit={handleSubmit} className="searchbar">
                <input type="text" onChange={handleSearchChange} value={searchBody} className="search-input" placeholder="Search users"/>
                <button className="fire-search">Search</button>
            </form>
        </div>
    )
}