import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { FaHouseUser } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoIosClose } from "react-icons/io";
import { MenuItems } from './MenuItems';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [clicked, setClicked] = useState(false);
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      if (isScrolled !== scrolling) {
        setScrolling(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolling]);

  const handleClick = () => {
    setClicked(!clicked);
  };

  return (
    <nav className={scrolling ? 'NavbarItems hidden' : 'NavbarItems'}>
      <h1 className='navbar-logo'>Video Downloader</h1>
      <div className='menu-icons' onClick={handleClick}>
        {clicked ? <IoIosClose /> : <RxHamburgerMenu />}
      </div>
      <ul className={clicked ? 'nav-menu active' : 'nav-menu'}>
        {MenuItems.map((item, index) => (
          <li key={index} className={item.cName}>
            <Link to={`${item.url}`} className='flex gap-2 items-center border-2 p-2 rounded'>
              <span>{item.icon}</span>
              <span className=''>{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
