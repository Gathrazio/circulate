import { useState, useEffect } from 'react'
import ProfileMain from './ProfileMain.jsx'
import ViewReqs from './ViewReqs.jsx'
export default function ProfileContent ({staticUserInfo}) {

    const [displayToggle, setDisplayToggle] = useState(0)

    function updateToggle (update) {
        setDisplayToggle(update)
    }

    console.log('profile content rendered')

    function setDisplay (displayToggle) {
        if (displayToggle === false || displayToggle === 0) {
            return <ProfileMain updateToggle={updateToggle} staticUserInfo={staticUserInfo}/>
        } else if (displayToggle === 1) {
            return <ViewReqs updateToggle={updateToggle}/>
        }
    }

    return (
        <div className="profile-content-wrapper content-wrapper">
            {setDisplay(displayToggle)}
        </div>
    )
}