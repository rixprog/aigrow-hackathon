
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
//importing components
import Navbar from '../src/components/navbar/Navbar';
import Chatbot from './components/chatbot/Chatbot.js';
import Portfolio from './components/portfolio/Portfolio.js';
import About from './components/about/About.js';
import '../src/components/navbar/sidenav/Sidebar.js'
import Croppredict from './components/cropPredict/Croppredict.js';
import Home from './Home.js';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Timeline from './components/about/timeline/Timeline.js';
import Myfarm from './components/monitor/Myfarm.js';

//main code
function App() {

  return (
    <BrowserRouter>
    <div className='container-fluid'>
      <Navbar/>
      <div className='row'>
      <div className='d-none d-lg-block col-lg-auto'>
        </div>
        <div className='col'>
    <Routes>
      <Route index path="/" element={<Home/>}/>
      <Route  path="/tools" element={<Portfolio/>}/>
      <Route  path="/objectives" element={<Timeline/>}/>
      <Route  path="/about" element={<About/>}/>
      <Route  path="/croppredict" element={<Croppredict/>}/>
      <Route  path="/myfarm" element={<Myfarm/>}/>



    </Routes>
      </div>
      </div>
    </div>
    </BrowserRouter>
  );
}

export default App;
