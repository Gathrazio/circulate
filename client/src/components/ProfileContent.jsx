
export default function ProfileContent () {
    return (
        <div className="profile-content-wrapper content-wrapper">
            <div className="view-reqs">
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
                <div className="bio-text">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s
                </div>
            </div>
            <div className="edit-bio">
                    Edit bio
            </div>
        </div>
    )
}