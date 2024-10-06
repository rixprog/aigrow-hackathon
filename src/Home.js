import React from 'react'
import Portfolio from './components/portfolio/Portfolio'
import About from './components/about/About'
import Banner from './components/banner/Banner'
import Timeline from './components/about/timeline/Timeline'

function Home() {
  return (
    <>
       <Banner/>
       <Portfolio/>
       <Timeline/>
       <About/>
    </>
  )
}

export default Home