import { useState, useEffect } from 'react'
import ProfileMain from './ProfileMain.jsx'
import ViewReqs from './ViewReqs.jsx'
import { useNavigate } from 'react-router-dom'
import loading from '../assets/loading.gif'
import defaultProfile from '../assets/default_profile.jpg'
import axios from 'axios'

const userAxios = axios.create();

userAxios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
})

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
            return <ProfileMain
                toggleAction={toggleAction}
                tryToNavigate={tryToNavigate}
                editProfileToggleAction={editProfileToggleAction}
                bioChange={bioChange}
                profileUrlChange={profileUrlChange}
                profileDesignation={profileDesignation}
                bioDesignation={bioDesignation}
                editBioToggle={editBioToggle}
                editProfileToggle={editProfileToggle}
                bioBody={bioBody}
                profileUrl={profileUrl}
                editBioToggleAction={editBioToggleAction}


            />
        } else if (displayToggle === 1) {
            return <ViewReqs updateToggle={updateToggle}/>
        }
    }

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
                const res = await userAxios.put('/api/protected/profiles/update', {
                    imgUrl: profileUrl
                })
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bioRes = await userAxios.get('/api/protected/biographies')
                const profileRes = await userAxios.get('/api/protected/profiles')
                setProfileUrl(profileRes.data.imgUrl)
                setBioBody(bioRes.data.body)
            } catch (err) {
                console.log(err.response.data.errMsg)
            }
            
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
        <div className="profile-content-wrapper content-wrapper">
            {setDisplay(displayToggle)}
        </div>
    )
}