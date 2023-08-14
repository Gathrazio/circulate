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
            <div className="view-reqs text-size-larger" onClick={toggleAction()}>
                View Active Friend Requests
            </div>
            <div className="profile-block">
                <div className="username-button-block">
                    <div className="username-block text-size">
                    @<span className="user-color text-size larger">{JSON.parse(localStorage.getItem('staticUserInfo')).username}</span>
                    </div>
                    <button className="profile-change-button text-size" onClick={editProfileToggleAction()}>
                        {editProfileToggle ? 'Update profile picture' : 'Edit profile picture'}
                    </button>
                </div>
                
                {editProfileToggle ?
                <input type="text" className="profile-input text-size" value={profileUrl || ''} onChange={profileUrlChange} placeholder="Image URL"/>
                :
                <img className="profile-pic" src={profileDesignation()} alt="" />
                }
                
                
            </div>
            <div className="bio-block">
                { editBioToggle ? 
                <textarea type="text" onChange={bioChange} value={bioBody} className="bio-text text-size bio-input"/>
                :
                <div className={bioBody === null ? 'bio-text text-size loading-phase' : 'bio-text text-size'}>{bioDesignation()}</div>
                }
            </div>
            <div className="edit-bio text-size" onClick={editBioToggleAction()}>
                    {editBioToggle ? 'Save updates' : 'Edit bio'}
            </div>
        </> 
    )
}