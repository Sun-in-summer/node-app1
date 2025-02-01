import { Routes, Route, BrowserRouter } from "react-router-dom";
import './App.css';
import RegisterPage from './pages/register-page';
import LoginPage from './pages/login-page';
import MainPage from './pages/main-page';



function App() {


  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />}></Route>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
