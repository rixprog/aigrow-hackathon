import React, { useEffect } from 'react'
import '../timeline/Timeline.css'
import '../About.css'
import Aos from 'aos'
import 'aos/dist/aos.css'

function Timeline() {
  useEffect(()=>{
    Aos.init();
  })
  return (
    <div class="container py-5">
       <section className='timeline'>
            <div className='row'>
                <div className='col-12 title'>
                <h1>OUR OBJECTIVES</h1>
                </div>
            </div>
            <div className='timelinediv'>
            <div class="main-timeline-4 text-white">
    <div class="timeline-4 left-4" >
      <div class="card gradient-custom" data-aos="fade-right" data-aos-duration="900">
        <div class="card-body p-4 timelinecontent">
          <h4>Optimize Crop Selection: </h4>
          <p class="small text-white-50 mb-4"></p>
          <p>Develop an advanced crop recommendation system using satellite and environmental data to suggest the best crops for farmers based on local climate and soil conditions.
          </p>
        </div>
      </div>
    </div>
    <div class="timeline-4 right-4" >
      <div class="card gradient-custom-4"  data-aos="fade-left" data-aos-duration="900">
        <div class="card-body p-4 timelinecontent">
          <h4>Enhance Plant Health:</h4>
          <p class="small text-white-50 mb-4"></p>
          <p> Implement a plant disease prediction tool leveraging remote sensing and machine learning models to detect early signs of diseases and reduce crop losses.


          </p>
        </div>
      </div>
    </div>
    <div class="timeline-4 left-4">
      <div class="card gradient-custom" data-aos="fade-right" data-aos-duration="900">
        <div class="card-body p-4 timelinecontent">
          <h4>Promote Agricultural Awareness:</h4>
          <p class="small text-white-50 mb-4"></p>
          <p> Integrate an AI-powered chatbot to provide farmers with real-time guidance and knowledge on sustainable farming practices and government policies.
          </p>
        </div>
      </div>
    </div>
    <div class="timeline-4 right-4">
      <div class="card gradient-custom-4" data-aos="fade-left" data-aos-duration="900">
        <div class="card-body p-4 timelinecontent">
          <h4>Monitor Precipitation Patterns:</h4>
          <p class="small text-white-50 mb-4"></p>
          <p> Develop a precipitation monitoring system that tracks rainfall patterns, helping farmers plan irrigation and other water management activities more effectively.
          </p>
        </div>
      </div>
    </div>
    <div class="timeline-4 left-4">
      <div class="card gradient-custom" data-aos="fade-right" data-aos-duration="900">
        <div class="card-body p-4 timelinecontent">
          <h4>Facilitate Farm Monitoring: </h4>
          <p class="small text-white-50 mb-4"></p>
          <p>Create a farm monitoring system that combines satellite imagery and IoT sensors to provide continuous updates on crop health, soil moisture, and weather conditions
          </p>
        </div>
      </div>
    </div>
    <div class="timeline-4 right-4">
      <div class="card gradient-custom-4" data-aos="fade-left" data-aos-duration="900">
        <div class="card-body p-4 timelinecontent">
          <h4>Increase Farm Productivity: </h4>
          <p class="small text-white-50 mb-4"></p>
          <p>Provide tools and insights based on EO data to optimize farm operations, improve decision-making, and boost overall productivity and profitability for farmers.
          </p>
        </div>
      </div>
    </div>
    <div class="timeline-4 left-4">
      <div class="card gradient-custom" data-aos="fade-right" data-aos-duration="900">
        <div class="card-body p-4 timelinecontent">
          <h4>Facilitate Farm Monitoring: </h4>
          <p class="small text-white-50 mb-4"></p>
          <p>Create a farm monitoring system that combines satellite imagery and IoT sensors to provide continuous updates on crop health, soil moisture, and weather conditions.
          </p>
        </div>
      </div>
    </div>
  </div>
            </div>
            <hr></hr>
        </section>

  
</div>
  )
}

export default Timeline