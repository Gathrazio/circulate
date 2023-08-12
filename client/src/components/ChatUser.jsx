import defaultProfile from '../assets/default_profile.jpg'

export default function ChatUser ({user, friendIndex, updateToggleUtility}) {
    const updateToggleUtilityAction = () => () => updateToggleUtility(1, friendIndex);
    const totalUnread = user.chat;
    console.log('totalUnread', totalUnread)
    return (
        <div className="searched-user-wrapper" onClick={updateToggleUtilityAction()}>
            <div className="searched-user-text chat-user-text">
                <div className="profile-search-img-container">
                    <img src={user.profileUrl || defaultProfile} alt="" className="pic-blurb" />
                </div>
                Chat with @{user.username}
            </div>
            <div className="searched-user-button-block chat-user">
                blah
            </div>
        </div>
    )
}