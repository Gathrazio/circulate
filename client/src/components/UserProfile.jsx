import { useState, useEffect, memo } from 'react'
import defaultProfile from '../assets/default_profile.jpg'


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
                        Go Back
                    </div>
                    <div className="friend-profile-title">
                        User's Profile
                    </div>
            </div>
            <div className="profile-block friend-area">
                <div className="username-block">
                    @{userInfo.username}
                </div>
                <img className="profile-pic" src={profileDesignation(userInfo.profileUrl)} alt="" />
            </div>
            <div className="bio-block bio-block-user-profile">
                <div className='bio-text'>{bioDesignation(userInfo.biography)}</div>
            </div>
        </> 
    )
})

export default UserProfile;