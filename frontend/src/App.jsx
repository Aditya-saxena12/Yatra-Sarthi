import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

/**
 * YATRA SARTHI - ADAPTIVE CONVERSATIONAL EDITION
 * New Feature: Adaptive Mode Discovery when clicking Bot directly.
 */

// --- GRAPHIFY PAGE ---
const GraphifyPage = ({ bookings }) => {
  const flightCount = bookings.filter(b => b.mode === 'Flight').length;
  const trainCount = bookings.filter(b => b.mode === 'Train').length;
  const total = bookings.length || 1;

  return (
    <div className="graph-container">
      <h2>SARTHI_GRAPHIFY_ANALYTICS</h2>
      <div className="stats-strip">
        <div className="stat-box"><strong>FLIGHTS:</strong> {flightCount}</div>
        <div className="stat-box"><strong>TRAINS:</strong> {trainCount}</div>
      </div>
      <div className="visualizer luxe-card">
        <div className="bar-wrapper">
          <div className="bar flight-bar" style={{ width: `${(flightCount / total) * 100}%` }}>
            {flightCount > 0 && `${Math.round((flightCount / total) * 100)}%`}
          </div>
          <div className="bar train-bar" style={{ width: `${(trainCount / total) * 100}%` }}>
            {trainCount > 0 && `${Math.round((trainCount / total) * 100)}%`}
          </div>
        </div>
        <div className="legend">
          <span className="dot flight"></span> SKY_VOYAGES
          <span className="dot train"></span> RAIL_VOYAGES
        </div>
      </div>
      <Link to="/" className="back-link">← RETURN_TO_HOME</Link>
    </div>
  );
};

// --- ADMIN PAGE ---
const AdminPage = ({ bookings, onClear }) => {
  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>SARTHI_DOSSIER_RECORDS</h2>
        <button className="clear-btn" onClick={onClear}>WIPE_LOGS</button>
      </div>
      <div className="bookings-grid">
        {bookings.length === 0 ? (
          <p className="no-data">EMPTY_ARCHIVE.</p>
        ) : (
          bookings.map((b, i) => (
            <div key={i} className="booking-card luxe-card">
              <div className="card-header">
                <strong>{b.mode.toUpperCase()}</strong>
                <span>{b.mode === 'Flight' ? '✈️' : '🚆'}</span>
              </div>
              <div className="card-body">
                <p><strong>ROUTE:</strong> {b.source} > {b.destination}</p>
                <p><strong>PAX:</strong> {b.persons}</p>
                <p><strong>CLASS:</strong> {b.travelClass}</p>
                <p className="email-meta">{b.email}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <Link to="/" className="back-link">← RETURN_TO_HOME</Link>
    </div>
  );
};

// --- HOME PAGE COMPONENT ---
const HomePage = ({ initiateMode, triggerBot, isOpen, setIsOpen, messages, isTyping, inputValue, setInputValue, handleSend, messagesEndRef }) => (
  <div className="home-view">
    <div className="hero-text">
      <h1>Yatra Sarthi</h1>
      <p>BEYOND_EVERY_HORIZON</p>
    </div>

    <div className="nav-center">
      <div className="nav-item" onClick={() => initiateMode('Flight')}>
        <span>✈️</span>
        <h2>FLIGHTS</h2>
      </div>
      <div className="nav-item" onClick={() => initiateMode('Train')}>
        <span>🚆</span>
        <h2>TRAINS</h2>
      </div>
    </div>

    {/* Dedicated Saarthi Bot Button - Now with Discovery Logic */}
    <div className="bot-trigger" onClick={triggerBot}>
      <span>SARTHI</span>
    </div>

    <div className={`chat-panel ${isOpen ? 'open' : ''}`}>
      <div className="chat-header">
        <h3>Sarthi Intelligence</h3>
        <span onClick={() => setIsOpen(false)} style={{ cursor: 'pointer' }}>✕</span>
      </div>
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="message bot">GREETINGS_USER. How shall we traverse today?</div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.role}`}>{m.content}</div>
        ))}
        {isTyping && <div className="message bot" style={{ opacity: 0.5 }}>SYNCHRONIZING...</div>}
        <div ref={messagesEndRef} />
      </div>
      <form className="chat-input-area" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
        <input
          placeholder="TYPE_YOUR_REQUEST..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          autoComplete="off"
        />
        <button type="submit">SEND</button>
      </form>
    </div>
  </div>
);

// --- MAIN ROUTER APP ---
function App() {
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Intelligence State
  const [bookingStep, setBookingStep] = useState(0); // -1 = Mode Choice, 1-5 = Details
  const [currentMode, setCurrentMode] = useState(null);
  const [tempData, setTempData] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('yatra_sarthi_bookings') || '[]');
    setBookings(saved);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const processLogic = (input) => {
    const raw = input.trim();
    const userInput = raw.toLowerCase();
    let response = "";
    let nextStep = bookingStep;
    let updatedData = { ...tempData };
    let finalMode = currentMode;

    // STEP -1: Discover Mode
    if (bookingStep === -1) {
      if (userInput.includes('flight')) {
        finalMode = 'Flight';
        response = "SKY_SARTHI_ACTIVE. ✈️ Please enter your SOURCE and DESTINATION.";
        nextStep = 1;
      } else if (userInput.includes('train')) {
        finalMode = 'Train';
        response = "RAIL_SARTHI_ACTIVE. 🚆 Please enter your SOURCE and DESTINATION.";
        nextStep = 1;
      } else {
        response = "INVALID_CHOICE. Please specify: FLIGHT or TRAIN.";
        nextStep = -1;
      }
    }
    // STEP 1: Source & Destination
    else if (bookingStep === 1) {
      updatedData.route = raw;
      const parts = raw.split(/ to | - |,/);
      updatedData.source = parts[0] || 'Unknown';
      updatedData.destination = parts[1] || 'Unknown';
      response = "EXCELLENT. Specify NUMBER OF PERSONS.";
      nextStep = 2;
    }
    // STEP 2: Persons
    else if (bookingStep === 2) {
      updatedData.persons = raw;
      response = finalMode === 'Flight' ? "Class: Economy or Business?" : "Class: Sleeper, 3AC, 2AC, 1AC, CC, or EC.";
      nextStep = 3;
    }
    // STEP 3: Class & Validation
    else if (bookingStep === 3) {
      const isSpec = tempData.route?.toLowerCase().includes('rajdhani') || tempData.route?.toLowerCase().includes('shatabdi');
      if (finalMode === 'Train' && isSpec && userInput.includes('sleeper')) {
        response = "ERROR: Rajdhani/Shatabdi trains do not have Sleeper class. Re-enter valid class.";
        nextStep = 3;
      } else {
        updatedData.travelClass = raw;
        response = "Preferred travel DATE?";
        nextStep = 4;
      }
    }
    // STEP 4: Date
    else if (bookingStep === 4) {
      updatedData.date = raw;
      response = "Final Step: Enter your EMAIL ID.";
      nextStep = 5;
    }
    // STEP 5: Email & Finalize
    else if (bookingStep === 5) {
      if (userInput.includes('@')) {
        updatedData.email = raw;
        updatedData.id = Date.now();
        updatedData.mode = finalMode;
        const newList = [...bookings, updatedData];
        setBookings(newList);
        localStorage.setItem('yatra_sarthi_bookings', JSON.stringify(newList));
        response = `SUCCESS. Details sent to dossier: ${raw}. Bon Voyage!`;
        nextStep = 0;
        setTimeout(() => alert(`Dossier sent to: ${raw}`), 500);
      } else {
        response = "INVALID_EMAIL. Please re-enter."; nextStep = 5;
      }
    }

    setCurrentMode(finalMode);
    setBookingStep(nextStep);
    setTempData(updatedData);
    return response;
  }

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const text = inputValue;
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInputValue('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', content: processLogic(text) }]);
    }, 600);
  };

  /**
   * Direct Mode Initiation (from Boxes)
   */
  const initiateMode = (mode) => {
    setCurrentMode(mode);
    setIsOpen(true);
    setBookingStep(1);
    setMessages([{ role: 'bot', content: `GREETINGS. ${mode.toUpperCase()} gateway active. Enter Source/Destination.` }]);
  };

  /**
   * Adaptive Initiation (from Bot Button)
   */
  const triggerBot = () => {
    if (!isOpen) {
      setIsOpen(true);
      setBookingStep(-1);
      setMessages([{ role: 'bot', content: "HOW_SHALL_WE_TRAVERSE? Please specify your mode: FLIGHT or TRAIN." }]);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <Router>
      <div className="landing-container">
        <Routes>
          <Route path="/" element={<HomePage
            initiateMode={initiateMode}
            triggerBot={triggerBot}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            messages={messages}
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSend={handleSend}
            messagesEndRef={messagesEndRef}
          />} />
          <Route path="/graphify" element={<GraphifyPage bookings={bookings} />} />
          <Route path="/admin" element={<AdminPage bookings={bookings} onClear={() => { localStorage.clear(); setBookings([]); }} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
