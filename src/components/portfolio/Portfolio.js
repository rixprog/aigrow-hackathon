import React, { useEffect } from 'react'
import PortfolioCards from './cards/PortfolioCards'
import '../portfolio/Portfolio.css'
import Aos from 'aos'
import 'aos/dist/aos.css'
import { Link, Outlet } from 'react-router-dom'


function Portfolio() {
  useEffect(()=>{
     Aos.init();
  },[])
  return (
   <div className='container'>
     <div className='row'>
         <div className="col-12 title">
            <h1>TOOLS & FEATURES</h1>
         </div>
      </div>
      <div className='row cards'>
        <div className='col-auto me-md-auto' ><div  data-aos="fade-right" data-aos-duration="800"><Link to="/croppredict"><PortfolioCards iconname="fa-solid fa-globe" title="CROP RECOMENDATION"/></Link></div></div>
        <div className='col-auto' ><div data-aos="fade-left" data-aos-duration="800"><a href='https://3fd7-2409-40f3-26-558-e8fa-d000-4d95-d122.ngrok-free.app/'><PortfolioCards iconname="fa-solid fa-robot" title="PLANT DISEASE DETECTION" /></a></div></div>
      </div>

      <div className='row cards'>
        <div className='col-auto me-md-auto' ><div data-aos="fade-right" data-aos-duration="800"><a href='https://cc9e-202-88-225-86.ngrok-free.app/'><PortfolioCards iconname="fa-solid fa-gears" title="CHATBOT" data-aos="fade-right" data-aos-duration="1500"/></a></div></div>
        <div className='col-auto ' ><div data-aos="fade-left" data-aos-duration="800"><Link to="/myfarm"><PortfolioCards iconname="fa-solid fa-code" title="MY FARM" /></Link></div></div>
      </div>
      <hr></hr>
     </div>
  )

}

export default Portfolio