import React, { useState } from 'react';
import * as AiIcons from "react-icons/ai";
import * as FaIcons from "react-icons/fa"; 
import { IconContext } from "react-icons";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { FaTreeCity } from "react-icons/fa6";
import { TiWeatherSunny } from "react-icons/ti";
import { GrFavorite } from "react-icons/gr";
import { Link,Routes,Route } from "react-router-dom";
import WeatherDashboard from '../Components/WeatherDashboard';
import SearchCity from '../Components/SearchCity';
import WeatherDisplay from '../Components/WeatherDisplay';
import Favorites from '../Components/Favorites';
import './Home.css'

const SidebarData = [
  {
    title: "Weather Dashboard",
    icon: <TiWeatherPartlySunny />,
    path: "/",
    cName: "nav-text",
  },
  {
    title: "Search City",
    icon: <FaTreeCity />,
    path: "/search_city",
    cName: "nav-text",
  },
  {
    title: "Weather Display",
    icon: <TiWeatherSunny />,
    path: "/weather_display",
    cName: "nav-text",
  },
  {
    title: "Favorites",
    icon: <GrFavorite />,
    path: "/favorites",
    cName: "nav-text",
  },
];

const Home = () => {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <div>
      <IconContext.Provider value={{ color: "#FFF" }}>
        <div className="navbar items-center">
          <div className="flex justify-center items-center space-x-2">
            <Link to="#" className="menu-bars">
              <FaIcons.FaBars onClick={showSidebar} />
            </Link>
            <h1 className="text-white z-10">Weather Dashboard</h1>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items">
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars" onClick={showSidebar}>
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {SidebarData.map((item, index) => (
              <li key={index} className={item.cName}>
                <Link to={item.path} onClick={showSidebar}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content Area */}
        <div
          className={`${sidebar ? "main-content shifted" : "main-content"} min-h-screen bg-gradient-to-br from-blue-400 to-purple-700`}
          
        >
         <Routes>
            <Route path="/" element={<WeatherDashboard /> }/>
            <Route path="/search_city" element={<SearchCity /> }/>
            <Route path="/weather_display" element={<WeatherDisplay /> }/>
            <Route path="/favorites" element={<Favorites /> }/>

            
         </Routes>
        </div>
      </IconContext.Provider>
    </div>
  );
};

export default Home;

