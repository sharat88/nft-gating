import './App.css';
import Home from './pages/Home';
import Success from './pages/Success';
import { Routes, Route } from "react-router-dom"

const App = () => { 
  return (
    <div className='main-app'>
      <Routes>
        <Route path="/" element={ <Home/> } />
        <Route path="Success" element={ <Success/> } />
      </Routes>
    </div>
  );
}

export default App;
