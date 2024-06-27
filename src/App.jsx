import React from 'react'
import Navbar from './components/navbar/Navbar'
import Footer from './components/footer/Footer'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from "./components/home/Home"
import Contact from "./components/contact/Contact"
import About from "./components/about/About"

const App = () => {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/'  element={<Home/>} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='/about' element={<About/>} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}

export default App
