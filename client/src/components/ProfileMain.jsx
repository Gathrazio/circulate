import { useEffect, useState } from 'react'
import axios from 'axios'

const userAxios = axios.create();

userAxios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
})

export default function ProfileMain ({updateToggle, staticUserInfo}) {

    const toggleAction = () => () => updateToggle(1);
    const [editBioToggle, setEditBioToggle] = useState(false);
    const editBioToggleAction = () => () => setEditBioToggle(prev => !prev);

    console.log('profile main rendered')

    useEffect(() => {
        const fetchData = async () => {
            const bio = userAxios.get('/api/protected/')
        }
        fetchData()

    }, [])
    
    return (
        <>
            <div className="view-reqs" onClick={toggleAction()}>
                    View active inbound/outbound requests
            </div>
            <div className="profile-block">
                <div className="username-block">
                    @someone
                </div>
                <img className="profile-pic" src="https://image.petmd.com/files/styles/863x625/public/2023-04/kitten-development.jpeg" alt="" />
                <button className="profile-change-button">Change profile picture</button>
            </div>
            <div className="bio-block">
                { editBioToggle ? 
                <textarea type="text" className="bio-text bio-input"/>
                :
                <div className="bio-text">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s
                </div>
                }
            </div>
            <div className="edit-bio" onClick={editBioToggleAction()}>
                    {editBioToggle ? 'Update bio' : 'Edit bio'}
            </div>
        </> 
    )
}