import { useEffect, useState } from 'react'
import axios from 'axios'
import loading from '../assets/loading.gif'
import defaultProfile from '../assets/default_profile.jpg'

const userAxios = axios.create();

userAxios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
})

export default function ProfileMain ({updateToggle, staticUserInfo}) {

    const toggleAction = () => () => updateToggle(1);
    const [editBioToggle, setEditBioToggle] = useState(false);
    const [editProfileToggle, setEditProfileToggle] = useState(false);
    const [bioBody, setBioBody] = useState(null);
    const [profileUrl, setProfileUrl] = useState(null);

    const editBioToggleAction = () => async () => {
        if (editBioToggle) {
            try {
                const res = await userAxios.put('/api/protected/biographies/update', {
                body: bioBody
                })
                console.log(res.data)
                setEditBioToggle(false)
                return;
            } catch (err) {
                console.log(err.response.data.errMsg)
                return;
            } 
        }
        setEditBioToggle(true)
    }

    const editProfileToggleAction = () => async () => {
        if (editProfileToggle) {
            try {
                const res = await userAxios.put('/api/protected/profiles/update', profileUrl)
                console.log(res.data)
                setEditProfileToggle(false)
                return;
            } catch (err) {
                console.log(err.response.data.errMsg)
                return;
            }
        }
        setEditProfileToggle(true)
    }

    function bioChange (e) {
        const {value} = e.target;
        setBioBody(value)
    }

    function profileUrlChange (e) {
        const {value} = e.target;
        setProfileUrl(value)
    }

    console.log('profile main rendered')

    useEffect(() => {
        const fetchData = async () => {
            const bioRes = await userAxios.get('/api/protected/biographies')
            const profileRes = await userAxios.get('/api/protected/profiles')
            setProfileUrl(profileRes.data.imgUrl)
            setBioBody(bioRes.data.body)
        }
        fetchData()
    }, [])

    function profileDesignation () {
        if (!profileUrl && profileUrl != '') {
            return loading;
        } else if (!profileUrl) {
            return defaultProfile;
        } else {
            return profileUrl;
        }
    }

    function bioDesignation () {
        if (!bioBody && bioBody != '') {
            return "Loading..."
        } else if (!bioBody) {
            return "Click 'edit bio' to update your biography!"
        } else {
            return bioBody;
        }
    }
    
    return (
        <>
            <div className="view-reqs" onClick={toggleAction()}>
                    View active inbound/outbound requests
            </div>
            <div className="profile-block">
                <div className="username-block">
                    @{JSON.parse(localStorage.getItem('staticUserInfo')).username}
                </div>
                {editProfileToggle ?
                <input type="text" value={profileUrl || ''} onChange={profileUrlChange}/>
                :
                <img className="profile-pic" src={profileDesignation()} alt="" />
                }
                
                <button className="profile-change-button" onClick={editProfileToggleAction()}>Change profile picture</button>
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