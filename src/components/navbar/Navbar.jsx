import React, { useState } from 'react';
import './Navbar.css';
import { FaHouseUser } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoIosClose } from "react-icons/io";
import { MenuItems } from './MenuItems';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(!clicked);
  };

  return (
    <nav className='NavbarItems'>
      <h1 className='navbar-logo'>Video Downloader</h1>
      <div className='menu-icons' onClick={handleClick}>
        {clicked ? <IoIosClose /> : <RxHamburgerMenu />}
      </div>
      <ul className={clicked ? 'nav-menu active' : 'nav-menu'}>
        {MenuItems.map((item, index) => (
          <li key={index} className={item.cName}>
            <Link to={`${item.url}`}>
              {item.icon}
              <span>{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
