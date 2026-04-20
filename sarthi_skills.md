# Sarthi Intelligence - Agentic Skill Set

This document outlines the core operational "Skills" and protocols that govern the **Yatra Sarthi** AI concierge.

## 🧠 Core Agentic Skills

### 1. Adaptive Intent Discovery
- **Trigger**: Direct interaction with the SARTHI bot button.
- **Protocol**: The agent pause its booking flow to ask: *"HOW_SHALL_WE_TRAVERSE?"*
- **Outcome**: It identifies the keyword "Flight" or "Train" from the user response and activates the corresponding sub-protocol.

### 2. Guided Interrogation (5-Step Protocol)
The agent is trained to collect data in a strict linear sequence to ensure high accuracy:
1. **Route Mapping**: Capture Source and Destination.
2. **Capacity Check**: Capture number of persons.
3. **Class Specification**: Capture travel class (Economy/Business or Rail Classes).
4. **Temporal Capture**: Capture Date of Travel.
5. **Dossier Finalization**: Capture and validate user Email ID.

### 3. High-Priority Validation
- **Email Regex**: The agent will not accept a dossier finalization without a valid `user@domain.com` format.
- **Rail Safety Logic**: The agent possesses specialized knowledge about high-speed trains. If 'Rajdhani' or 'Shatabdi' is identified alongside 'Sleeper Class', the agent triggers an `ERROR_CORRECTION` skill, requiring the user to select a valid AC or Chair Car class.

### 4. Persistence & Reporting
- **Skill**: Automated Dossier Generation.
- **Outcome**: The agent formats all collect data into a `Dossier Object` and commits it to the **Admin Repository** (LocalStorage) before issuing a final success notification.

### 5. Visual Data Translation (Graphify)
- **Skill**: Real-time Analytics conversion.
- **Outcome**: Maps the count of total dossiers into percentage-based visual bars within the `/graphify` portal.

---
*Operational Protocol Version: 2.1.0 (Luxe Edition)*
