import { useState } from 'react'
import axios from 'axios'
import Titlebar from './Titlebar.jsx'

export default function Entry ({updateToken}) {
    const initialInfo = {
        username: '',
        password: ''
    }
    const [inputInfo, setInputInfo] = useState(initialInfo);
    const [formToggle, setFormToggle] = useState(true);
    const [loginErr, setLoginErr] = useState('');
    const [signupErr, setSignupErr] = useState('');

    function handleChange (e) {
        const {name, value} = e.target;
        setInputInfo(prev => ({
            ...prev,
            [name]: value
        }))
    }

    function setLocalData (data) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("staticUserInfo", JSON.stringify(data.user))
    }

    async function handleSignInSubmit (e) {
        e.preventDefault()
        try {
            const res = await axios.post('/api/auth/login', inputInfo);
            setLocalData(res.data)
            updateToken(res.data.token)
        } catch (err) {
            setLoginErr(err.response.data.errMsg)
            console.log(err.response.data.errMsg)
        }
        
    }

    async function handleCreateAccountSubmit (e) {
        e.preventDefault()
        try {
            const res = await axios.post('/api/auth/signup', inputInfo);
            setLocalData(res.data)
            updateToken(res.data.token)
        } catch (err) {
            setSignupErr(err.response.data.errMsg)
            console.log(err.response.data.errMsg)
        }
        
    }
    
    return (
        <div className="entry-wrapper">
            <Titlebar />
            <div className="form-content-wrapper">
            { formToggle ? 
            <>
            <form name="entry-form" className="entry-form" onSubmit={handleSignInSubmit}>
                <input
                    className="entry-input text-size"
                    type="text"
                    name="username"
                    value={inputInfo.username}
                    placeholder="Username"
                    onChange={handleChange}
                    required
                />
                <input
                    className="entry-input text-size"
                    type="password"
                    name="password"
                    value={inputInfo.password}
                    placeholder="Password"
                    onChange={handleChange}
                    required
                />
                <button className="entry-button text-size">Sign In</button>
        </form>
        {loginErr && <div className="login-err">{loginErr} Please try again.</div>}
        
        <button className="member slogan-size" onClick={() => setFormToggle(prev => !prev)}>Not a member?</button>
        </>
        :
        <>
        <form name="entry-form" className="entry-form" onSubmit={handleCreateAccountSubmit}>
            <input
                className="entry-input text-size"
                type="text"
                name="username"
                value={inputInfo.username}
                placeholder="Username"
                onChange={handleChange}
                required
            />
            <input
                className="entry-input text-size"
                type="password"
                name="password"
                value={inputInfo.password}
                placeholder="Password"
                onChange={handleChange}
                required
            />
            <button className="entry-button text-size">Create Account</button>
        </form>
        {signupErr && <div className="login-err">{signupErr} Please try again.</div>}
        <button className="member slogan-size" onClick={() => setFormToggle(prev => !prev)}>Already a member?</button>
        </>
        }
        </div>
        </div> 
    )
}