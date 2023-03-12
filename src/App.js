import './App.css';
import { Startpage } from './pages/home';
import  {Schedule}  from './pages/schedule';
import { About } from './pages/about';
import {NavLink, Route, Routes} from "react-router-dom";
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayjs from 'dayjs'

function Navbar() {
  return (
    <div className="navbar">
      <ul className="outer-element">
        <li id="STC">
          <NavLink to = "/" className= "nav-hover" activeClassName = "active">
            <span className="currentLI">STC</span>
          </NavLink>
        </li>
        <li>
          <NavLink to = "/about" className= "nav-hover" activeClassName = "active">
            <span className="currentLI">About</span>
          </NavLink>
        </li>
        <li>
          <NavLink to = "/schedule" className = "nav-hover" activeClassName = "active">
            <span className="currentLI">Schedule</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path = "/" element = {<Startpage />}/>
        <Route path = "/about" element = {<About />}/>
        <Route path = "/schedule" element = {<><Schedule /></>}/>
      </Routes>
    </>
  );
}

export default App;