import React from 'react'
import { TypeAnimation } from 'react-type-animation'

function Abouttyper() {
  return (
    <div>
         <TypeAnimation
    sequence={[
      // Same substring at the start will only be typed out once, initially
      'AI Grow is an innovative platform designed to assist farmers by harnessing the power of Earth Observation (EO) data. Our features include crop recommendations, plant disease prediction, a chatbot for agricultural awareness, precipitation monitoring, and a farm monitoring system. With AI Grow, we aim to empower farmers to make informed decisions, enhance productivity, and streamline their agricultural practices for a more efficient farming experience. ',
      5000,
    ]}
    wrapper="div"
    speed={50}
    style={{ display: 'inline-block'}}
    repeat={0}
  />
    </div>
  )
}

export default Abouttyper