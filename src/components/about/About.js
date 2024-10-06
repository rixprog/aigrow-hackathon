import React, { useEffect } from 'react'
import '../about/About.css'
import Timeline from './timeline/Timeline'
import CircleProgress from './circleProgress/CircleProgress'
import Abouttyper from './Abouttyper'
import Aos from 'aos'
import 'aos/dist/aos.css'


function About() {
  useEffect(()=>{
    Aos.init();
  },[])
  return (
    <div className='container-fluid'>  
       
       <section className="section about">
        <div className='row' >
             <div className='col-12 title'>
               <h1>ABOUT US</h1>
             </div>
        </div>
        <div className='row about'>
         <div className='col-auto aboutimgcol'> <div className='aboutimgdiv'><img src="https://st3.depositphotos.com/9998432/13335/v/450/depositphotos_133352010-stock-illustration-default-placeholder-man-and-woman.jpg" alt="" className='aboutimg'/></div></div>
         <div className='col-lg-5'><div className='aboutme'><Abouttyper/> </div></div>
        </div>
        <hr></hr>
        </section>

    </div>
  )
}

export default About