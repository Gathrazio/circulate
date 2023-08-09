import { useState } from 'react'

export default function Entry () {
    const initialInfo = {
        username: '',
        password: ''
    }
    const [inputInfo, setInputInfo] = useState(initialInfo);
    const [formToggle, setFormToggle] = useState(true);

    function handleChange (e) {
        const {name, value} = e.target;
        setInputInfo(prev => ({
            ...prev,
            [name]: value
        }))
    }

    function handleSignInSubmit (e) {
        e.preventDefault()
            .then(
                function (res) {
    
                },
                function (err) {
                    
                }
            )
    }

    function handleCreateAccountSubmit (e) {
        e.preventDefault()
            .then(
                function (res) {
                    
                },
                function (err) {
                   
                }
            )
        
    }
    
    return (
        <div className="entry-wrapper">
            { formToggle ? 
            <>
            <form name="entry-form" className="entry-form" onSubmit={handleSignInSubmit}>
                <input
                    className="entry-input"
                    type="text"
                    name="username"
                    value={inputInfo.username}
                    placeholder="Username"
                    onChange={handleChange}
                    required
                />
                <input
                    className="entry-input"
                    type="password"
                    name="password"
                    value={inputInfo.password}
                    placeholder="Password"
                    onChange={handleChange}
                    required
                />
                <button className="entry-button">Sign In</button>
        </form>
        <button className="member" onClick={() => setFormToggle(prev => !prev)}>Not a member?</button>
        </>
        :
        <>
        <form name="entry-form" className="entry-form" onSubmit={handleCreateAccountSubmit}>
            <input
                className="entry-input"
                type="text"
                name="username"
                value={inputInfo.username}
                placeholder="Username"
                onChange={handleChange}
                required
            />
            <input
                className="entry-input"
                type="password"
                name="password"
                value={inputInfo.password}
                placeholder="Password"
                onChange={handleChange}
                required
            />
            <button className="entry-button">Create Account</button>
        </form>
        <button className="member" onClick={() => setFormToggle(prev => !prev)}>Already a member?</button>
        </>
        }
        </div>
        
    )
}