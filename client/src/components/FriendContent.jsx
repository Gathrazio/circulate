import MyFriends from './MyFriends.jsx'
import FriendSearch from './FriendSearch.jsx'
import UserProfile from './UserProfile.jsx'
import {useState, useEffect } from 'react'

export default function FriendContent () {

    const [displayToggleUtility, setDisplayToggleUtility] = useState([0, {}])

    function updateToggleUtility (update, userInfo) {
        setDisplayToggleUtility([update, userInfo])
    }

    console.log('profile content rendered')

    function setDisplay (displayToggleUtility) {
        if (displayToggleUtility[0] === 0) {
            return (
                <>
                    <MyFriends updateToggleUtility={updateToggleUtility}/>
                    <FriendSearch updateToggleUtility={updateToggleUtility}/>
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