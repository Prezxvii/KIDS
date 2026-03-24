import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. Context import - Since you are in 'src', go into 'context' folder
import { AuthProvider } from './context/AuthContext';

// 2. Component imports - Since they are all inside 'src/components'
import ProtectedRoute from './components/ProtectedRoute';
import Navbar      from './components/Navbar';
import Hero        from './components/Hero';
import About       from './components/About';
import HowItWorks  from './components/HowItWorks';
import WhoCanUse   from './components/WhoCanUse';
import WhyJoin     from './components/WhyJoin';
import FAQ         from './components/FAQ';
import Footer      from './components/Footer';
import Login       from './components/Login';
import SignUp      from './components/SignUp';
import Resources   from './components/Resources';
import UserProfile from './components/UserProfile';

// 3. CSS imports - Don't forget to import the App styling if it moved
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Home */}
            <Route path="/" element={
              <>
                <Hero />
                <div id="about"><About /></div>
                <HowItWorks />
                <WhoCanUse />
                <WhyJoin />
                <div id="faq"><FAQ /></div>
                <Footer />
              </>
            } />

            {/* Resources */}
            <Route path="/resources" element={
              <>
                <Resources />
                <Footer />
              </>
            } />

            {/* Auth */}
            <Route path="/login"  element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Profile — protected */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;