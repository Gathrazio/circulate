import { useState, useEffect, memo } from 'react'
import defaultProfile from '../assets/default_profile.jpg'
import { IconContext } from 'react-icons'
import { AiOutlineRollback } from 'react-icons/ai'


const UserProfile = memo(function UserProfile ({userInfo, updateToggleUtility}) {
    const toggleAction = () => () => updateToggleUtility(0);

    const profileDesignation = (profileUrl) => {
        if (!profileUrl) {
            return defaultProfile;
        } else {
            return profileUrl
        }
    }

    const bioDesignation = (biography) => {
        if (!biography) {
            return "This user does not have a bio.";
        } else {
            return biography;
        }
    }

    
    return (
        <>
        <div className="view-reqs friend-bar">
                    <div className="go-back-friend" onClick={toggleAction()}>
                        <IconContext.Provider value={{
                            className: `nav-icons`
                        }}>
                            <AiOutlineRollback />
                        </IconContext.Provider>
                    </div>
                    <div className="friend-profile-title text-size-larger">
                        User's Profile
                    </div>
            </div>
            <div className="profile-block friend-area">
                <div className="username-button-block">
                    <div className="username-block-margin username-block text-size">
                    @<span className="user-color text-size">{userInfo.username}</span>
                    </div>
                </div>
                
                <img className="profile-pic" src={profileDesignation(userInfo.profileUrl)} alt="" />
            </div>
            <div className="bio-block bio-block-user-profile">
                <div className='bio-text text-size'>{bioDesignation(userInfo.biography)}</div>
            </div>
        </> 
    )
})

export default UserProfile;