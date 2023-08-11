import { useState, useEffect } from 'react'
import ProfileMain from './ProfileMain.jsx'
import ViewReqs from './ViewReqs.jsx'
import { useNavigate } from 'react-router-dom'

export default function ProfileContent () {

    const navigate = useNavigate()

    const tryToNavigate = route => {
        navigate(route)
    }

    const [displayToggle, setDisplayToggle] = useState(0)

    function updateToggle (update) {
        setDisplayToggle(update)
    }

    function setDisplay (displayToggle) {
        if (displayToggle === false || displayToggle === 0) {
            return <ProfileMain updateToggle={updateToggle} tryToNavigate={tryToNavigate}/>
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