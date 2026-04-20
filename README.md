# Yatra Sarthi - Premium Agentic Travel Concierge

Yatra Sarthi is a high-end, self-contained travel management ecosystem designed to provide a "God's Own Country" experience for travelers. It features an adaptive AI concierge, a real-time analytics engine, and a centralized administrative dashboard.

## 🌟 Premium Features

- **Adaptive Sarthi AI**: A conversational agent that discovers traveler intent (Flight/Train) and guides them through a refined 5-step interrogation protocol.
- **Luxe Design Philosophy**: A cinematic "Beige, Royal Blue, and Black" theme featuring a serene Kerala beach backdrop and elegant white italic typography.
- **Graphify Analytics**: A dedicated analytics suite (`/graphify`) that visualizes travel dossier distributions in real-time.
- **Admin Command Center**: A management portal (`/admin`) to view, manage, and audit all stored travel dossiers.
- **Zero-Latency Architecture**: A full-frontend implementation that uses LocalStorage for data persistence, ensuring an instant and offline-capable user experience.

## 🛠️ Technology Stack

- **Frontend**: React (Vite)
- **Routing**: React Router DOM (v7)
- **Styling**: Premium CSS3 with Glassmorphism & Adaptive Layouts
- **Intelligence**: Rule-based Agentic Logic (State Machine)
- **Data**: Browser LocalStorage

## 🚀 Getting Started

To launch the Yatra Sarthi ecosystem locally:

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Launch the platform**:
   ```bash
   npm run dev
   ```

## 🚆 Special Protocols
- **Train Validation**: The bot includes hardcoded safety checks. For instance, it will reject requests for "Sleeper Class" on premium trains like **Rajdhani** or **Shatabdi**, providing corrective feedback to the user.
- **Dossier Dispatch**: Upon entering a valid email, the system simulates a secure dossier dispatch with a high-priority notification popup.

---
*Created by Antigravity for the YATRA_SYSTEM.*
