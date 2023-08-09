import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Entry from './components/Entry.jsx'
import Protected from './components/Protected.jsx';
import Navpage from './components/Navpage.jsx';


export default function App() {

  return (
    <div className="app-wrapper">
      <Router>
        <Routes>
          <Route
            path="/"
            element={ <Entry /> }
          />
          <Route
            path="/"
            element={ 
              <Protected>
                <Navpage />
              </Protected>  
            }
          />
        </Routes>
      </Router>
      
    </div>
  )
}