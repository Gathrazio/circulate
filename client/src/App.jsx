import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import Entry from './components/Entry.jsx'
import Protected from './components/Protected.jsx';
import Navpage from './components/Navpage.jsx';


export default function App() {

  const [token, setToken] = useState('');

  function updateToken (token) {
    setToken(token)
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"))
    }
  }, [])

  return (
    <div className="app-wrapper">
      <Router>
        <Routes>
          <Route
            path="/"
            element={ token ? <Navigate to="/navpage" /> : <Entry updateToken={updateToken}/> }
          />
          <Route
            path="/navpage"
            element={ 
              <Protected token={token} redirectTo="/">
                <Navpage updateToken={updateToken}/>
              </Protected>  
            }
          />
        </Routes>
      </Router>
      
    </div>
  )
}