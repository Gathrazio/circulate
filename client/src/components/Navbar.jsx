import { IconContext } from 'react-icons';
import { BsFillPersonFill, BsPeopleFill, BsFillChatLeftDotsFill, BsFillChatDotsFill } from 'react-icons/bs'
import { useState } from 'react'


export default function Navbar ({updateToggle}) {

    const [highlightToggle, setHighlightToggle] = useState([true, false, false]);

    const action = (update) => () => {
        if (update === 0) {
            setHighlightToggle([true, false, false])
        } else if (update === 1) {
            setHighlightToggle([false, true, false])
        } else {
            setHighlightToggle([false, false, true])
        }
        updateToggle(update)
    }
    return (
        <div className="navbar-wrapper">
            <div className="profile-select">
            <div className="select-text" onClick={action(0)}>
                    <IconContext.Provider value={{
                        className: `nav-icons${highlightToggle[0] ? ' highlighted' : ''}`
                    }}>
                        <BsFillPersonFill />
                    </IconContext.Provider>
                </div>
            </div>
            <div className="chat-select" onClick={action(1)}>
                <div className="select-text">
                    <IconContext.Provider value={{
                        className: `nav-icons${highlightToggle[1] ? ' highlighted' : ''}`
                    }}>
                        <BsFillChatDotsFill />
                    </IconContext.Provider>
                </div>
            </div>
            <div className="friend-select" onClick={action(2)}>
                <div className="select-text">
                    <IconContext.Provider value={{
                        className: `nav-icons${highlightToggle[2] ? ' highlighted' : ''}`
                    }}>
                        <BsPeopleFill />
                    </IconContext.Provider>
                </div>
            </div>
        </div>
    )
}