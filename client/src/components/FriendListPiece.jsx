import defaultProfile from '../assets/default_profile.jpg'
import axios from 'axios'

const userAxios = axios.create();

userAxios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
})

export default function FriendListPiece ({friend, updateToggleUtility, userFriendArray, updateFriends}) {
    const updateToggleUtilityAction = () => () => updateToggleUtility(1, friend);

    const handleRemoval = async () => {
        try {
            const chatId = userFriendArray.find(friendObj => friendObj.friendId === friend._id).chat;
            const removalRes = await userAxios.delete('/api/protected/friends/delete', {data: {
                friendId: friend._id,
                chat: chatId
            }})
            updateFriends(friend._id)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="searched-user-wrapper">
            <div className="searched-user-text text-size">
                <div className="profile-search-img-container">
                    <img src={friend.profileUrl || defaultProfile} alt="" className="pic-blurb" />
                </div>
                @<span className="user-color text-size">{friend.username}</span>
            </div>
            <div className="searched-user-button-block text-size">
                <button className="view-profile-button text-size" onClick={updateToggleUtilityAction()}>View Profile</button>
                <button className="send-request-button text-size" onClick={handleRemoval}>Remove</button>
            </div>
        </div>
    )
}