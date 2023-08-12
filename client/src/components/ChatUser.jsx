import defaultProfile from '../assets/default_profile.jpg'

export default function ChatUser ({user, friendIndex, updateToggleUtility}) {
    const updateToggleUtilityAction = () => () => updateToggleUtility(1, friendIndex);
    const totalUnread = user.chat.filter(message => message.author != JSON.parse(localStorage.getItem('staticUserInfo'))._id).filter(message => message.status === "Sent").length;
    return (
        <div className="chat-user-wrapper" onClick={updateToggleUtilityAction()}>
                <div className="image-name-wrapper">
                    <div className="profile-search-img-container">
                    <img src={user.profileUrl || defaultProfile} alt="" className="pic-blurb" />
                    </div>
                    @{user.username}
                </div>
                <div className="notif-block">
                    {totalUnread === 0 ? 'Nothing new...' : `(${totalUnread}) unread message${totalUnread === 1 ? '' : 's'}!`}
                </div>
        </div>
    )
}