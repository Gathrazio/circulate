import Navbar from './Navbar.jsx'
import ProfileContent from './ProfileContent.jsx'
import ChatContent from './ChatContent.jsx'
import FriendContent from './FriendContent.jsx'
import SmallTitlebar from './SmallTitlebar.jsx'
import { useEffect, useState } from 'react'


export default function Navpage () {

    const [staticUserInfo, setStaticUserInfo] = useState(JSON.parse(localStorage.getItem('staticUserInfo')));
    const [displayContent, setDisplayContent] = useState(<ProfileContent />);

    console.log('navpage rendered')

    function updateToggle (update) {
        if (update === 0) {
            setDisplayContent(<ProfileContent staticUserInfo={staticUserInfo}/>)
        } else if (update === 1) {
            setDisplayContent(<ChatContent staticUserInfo={staticUserInfo}/>)
        } else if (update === 2) {
            setDisplayContent(<FriendContent staticUserInfo={staticUserInfo}/>)
        }
    }


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