import React from 'react'
import './Footer.css'
import { FaFacebook, FaTwitter } from "react-icons/fa";
import { FaInstagram } from 'react-icons/fa6';

const Footer = () => {
  return (
    <div className='footer'>
      <div className='top'>
        <div>
          <h1>Video Downloader</h1>
          <p>Best downloader ever</p>
        </div>
        <div className='icons'>
        <FaFacebook />
        <FaInstagram/>
        <FaTwitter/>
        </div>

      </div>
    </div>
  )
}

export default Footer