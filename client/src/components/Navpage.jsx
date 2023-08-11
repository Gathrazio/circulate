import Navbar from './Navbar.jsx'
import ProfileContent from './ProfileContent.jsx'
import ChatContent from './ChatContent.jsx'
import FriendContent from './FriendContent.jsx'
import SmallTitlebar from './SmallTitlebar.jsx'
import { useState } from 'react'


export default function Navpage ({updateToken}) {

    const [displayContent, setDisplayContent] = useState(<ProfileContent />);

    function updateToggle (update) {
        if (update === 0) {
            setDisplayContent(<ProfileContent />)
        } else if (update === 1) {
            setDisplayContent(<ChatContent />)
        } else if (update === 2) {
            setDisplayContent(<FriendContent />)
        }
    }

    return (
        <div className="navpage-wrapper">
            <SmallTitlebar />
            <Navbar updateToggle={updateToggle} updateToken={updateToken}/>
            <div className="conditional-content-wrapper">
                {displayContent}
            </div>
        </div>
    )
}