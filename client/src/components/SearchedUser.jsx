import defaultProfile from '../assets/default_profile.jpg'
import { useState, useEffect }  from 'react'
import axios from 'axios'

const userAxios = axios.create();

userAxios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
})

export default function SearchedUser ({user, updateToggleUtility, userFluidInfo}) {

    
    
    let initStateText = "...";
    
    const [reqButtonText, setReqButtonText] = useState(initStateText);

    const determineButtonText = () => {
        if (userFluidInfo) {
            if (userFluidInfo.requests.find(request => request.sender === user._id)) {
            setReqButtonText("Pending Your Response")
            } else if (userFluidInfo.requests.find(request => request.receiver == user._id)) {
                setReqButtonText("Request Sent")
            } else {
                setReqButtonText("Send Request")
            }
        }
    }
        
    useEffect(() => {
        determineButtonText()
    }, [userFluidInfo])

    const handleRequestClick = async () => {
        try {
            const requestRes = await userAxios.post('/api/protected/friends/request', { userId: user._id });
            setReqButtonText("Request Sent")
        } catch (err) {
            console.log(err)
        }
    }

    const updateToggleUtilityAction = () => () => updateToggleUtility(1, user);
    
    return (
        <div className="searched-user-wrapper">
            <div className="searched-user-text">
                <div className="profile-search-img-container">
                    <img src={user.profileUrl || defaultProfile} alt="" className="pic-blurb" />
                </div>
                @{user.username}
            </div>
            <div className="searched-user-button-block">
                <button className="view-profile-button" onClick={updateToggleUtilityAction()}>
                    View Profile
                </button>
                <button className={`send-request-button${reqButtonText === "Request Sent" || reqButtonText === "Pending Your Response" ? ' no-click' : '' }`} onClick={handleRequestClick}>
                    {reqButtonText}
                </button>
            </div>
        </div>
    )
}