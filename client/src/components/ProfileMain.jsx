import axios from 'axios'

const userAxios = axios.create();

userAxios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
})

export default function ProfileMain ({
    toggleAction,
    editProfileToggleAction,
    bioChange,
    profileUrlChange,
    profileDesignation,
    bioDesignation,
    editBioToggle,
    editProfileToggle,
    bioBody,
    profileUrl,
    editBioToggleAction
}) {

    return (
        <>
            <div className="view-reqs" onClick={toggleAction()}>
                View active inbound/outbound requests
            </div>
            <div className="profile-block">
                <div className="username-block">
                    @<span className="user-color">{JSON.parse(localStorage.getItem('staticUserInfo')).username}</span>
                </div>
                {editProfileToggle ?
                <input type="text" className="profile-input" value={profileUrl || ''} onChange={profileUrlChange}/>
                :
                <img className="profile-pic" src={profileDesignation()} alt="" />
                }
                
                <button className="profile-change-button" onClick={editProfileToggleAction()}>{editProfileToggle ? 'Update profile picture' : 'Edit profile picture'}</button>
            </div>
            <div className="bio-block">
                { editBioToggle ? 
                <textarea type="text" onChange={bioChange} value={bioBody} className="bio-text bio-input"/>
                :
                <div className={bioBody === null ? 'bio-text loading-phase' : 'bio-text'}>{bioDesignation()}</div>
                }
            </div>
            <div className="edit-bio" onClick={editBioToggleAction()}>
                    {editBioToggle ? 'Save updates' : 'Edit bio'}
            </div>
        </> 
    )
}