import React, { useEffect } from 'react'
import'../banner/Banner.css'
import Typer from './Typer'
import Aos from 'aos'
import 'aos/dist/aos.css'
import { Link } from 'react-router-dom'
function Banner() {

  useEffect(()=>{
    Aos.init();
  },[])

  const explore = () => {
    window.scrollBy({
      top: 600,
      behavior: 'smooth' 
    });
  };
 
  return (
    <div className='container'>
      <div className='row banner'>
      <hr></hr>
        <div className='col-md-6'>
          <div className='namediv' data-aos="fade-right" data-aos-duration="1500">
               <h1>AI-GROW</h1>
                <div className='title'><h3>Agriculture Made <Typer/></h3></div>
               <Link className='btn connectme' onClick={explore}>Explore more</Link>
               <Link className='btn connectme' to="/myfarm">My Farm</Link>
          </div>
        </div>
        <div className='col-md-6'  >
          <div className='picdiv' data-aos="zoom-in-left" data-aos-duration="1500">
          <img src="0_nKyrNkaAY9uF0Ljj.jpg" alt="My Image" style={{ width: '300px', height: '500px' }} />
          </div>
        </div>
      </div>
      <hr/>
    </div>
  )
}

export default Banner