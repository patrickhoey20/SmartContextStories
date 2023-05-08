import HomePage from './components/HomePage/HomePage';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './components/Login/Login';

// function App() {
//   return (
//     <div className="App">
//       <HomePage />
//     </div>
//   )
// }

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App
