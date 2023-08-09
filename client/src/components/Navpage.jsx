import Navbar from './Navbar.jsx'
import ProfileContent from './ProfileContent.jsx'
import ChatContent from './ChatContent.jsx'
import FriendContent from './FriendContent.jsx'
import SmallTitlebar from './SmallTitlebar.jsx'
import { useEffect, useState } from 'react'


export default function Navpage () {
    
    const [displayToggle, setDisplayToggle] = useState(0);
    const [displayContent, setDisplayContent] = useState()

    function updateToggle (update) {
        setDisplayToggle(update)
    }

    useEffect(() => {
        if (displayToggle === 0) {
            setDisplayContent(<ProfileContent />)
        } else if (displayToggle === 1) {
            setDisplayContent(<ChatContent />)
        } else {
            setDisplayContent(<FriendContent />)
        }
    }, [displayToggle])


    return (
        <div className="navpage-wrapper">
            <SmallTitlebar />
            <Navbar updateToggle={updateToggle}/>
            <div className="conditional-content-wrapper">
                {displayContent}
            </div>
        </div>
    )
}