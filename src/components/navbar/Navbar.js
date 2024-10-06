import React, { useState } from 'react'
import '../navbar/Navbar.css'
import { Link, Outlet } from 'react-router-dom'


function Navbar() {
  const[scroll,setScroll]=useState(false)
  // to detect screen is scrolling or not
  const scrollHandler= ()=>{
      if(window.scrollY >= 50){
        setScroll(true)
      }
      else{
        setScroll(false)
      }
  }
  window.addEventListener('scroll',scrollHandler)

  return (
    <diV className="container-fluid navdiv">  
    <nav className={scroll?'navbar sticky-top navbar-expand-lg mynavbar-scroll':'navbar sticky-top navbar-expand-lg mynavbar-noscroll'} >
  <div className="container-fluid">
    <div className="navbar-brand">AI-GROW</div>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span><i class="fa-solid fa-bars-staggered"></i></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <Link className="nav-link" to="/" >HOME</Link>
        </li>
        <li className="nav-item">
        <Link className="nav-link" to="/tools">TOOLS & FEATURES</Link>
        </li>
        <li className="nav-item">
        <Link className="nav-link" to="/objectives">OUR OBJECTIVES</Link>
        </li>
        <li className="nav-item">
        <Link className="nav-link" to="/about">ABOUT</Link>
        </li>
        <Outlet/>
      </ul>
      
    </div>
  </div>
  <hr></hr>
</nav>
</diV>
  )
}

export default Navbar