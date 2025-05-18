# Clean Ninja

Clean Ninja is a blockchain-based waste reporting application built on the Internet Computer Protocol (ICP). It empowers citizens to actively participate in maintaining a cleaner city by reporting, verifying, and tracking the cleanup of abandoned waste.

## Demo

![image](https://github.com/user-attachments/assets/4cbaac36-077a-4454-8455-cf20a0596cce)

Demo Video: https://drive.google.com/file/d/1wvLrLeAcNKUFGrirmJvyZweihJO5Rmvu/view?usp=sharing 

*Video Notes: Some features are not included in the demo video, such as the location link on the report card (e.g., "East Jakarta"), which redirects directly to Google Maps.

## Features

- Waste Reporting: Users can report abandoned waste by submitting photos, location details, and descriptions.
- Location Verification: Uses HTTPS Outcalls to verify and validate report locations.
- Community Verification: Other users can verify reports to ensure authenticity.
- Cleanup Tracking: Once resolved, reports can be marked as cleaned.
- Filtering & Statistics: View reports by district and status, and track cleanup progress with statistics.

## Technology Stack

- Backend: Motoko canister on Internet Computer Protocol (ICP)
- Frontend: React + Vite + Tailwind CSS
- Authentication: Internet Identity
- Data Storage: On-chain storage for reports and images
- ICP-Specific Features: HTTPS Outcalls, Internet Identity, On-chain Storage

## Application Workflow

1. Authentication: Users log in using Internet Identity.
2. Report Creation:
   - Take a photo of waste.
   - Detect location via GPS.
   - Verify location using HTTPS Outcalls.
   - Add a description.
   - Submit the report.
3. Verification Process:
   - Other users can verify report validity.
   - Verification data is stored on the blockchain.
4. Cleanup Tracking:
   - Users can mark reports as cleaned.
   - Status updates are reflected on the blockchain.

## Project Structure

```
/
├── backend/                # Motoko backend canister
│   ├── app.mo              # Main application logic
│   ├── Types.mo            # Type definitions
├── frontend/               # React frontend
│   ├── src/                # Source code
│   │   ├── App.jsx         # Main application component
│   │   ├── main.jsx        # Entry point
│   │   ├── utils_api.jsx   # API utilities for backend communication
│   │   ├── utils_auth.jsx  # Authentication utilities
│   ├── index.html          # HTML template
│   ├── index.css           # Global CSS styles
├── dfx.json                # ICP project configuration
├── package.json            # NPM package configuration
└── README.md               # Project documentation
```

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14+)
- [DFX](https://internetcomputer.org/docs/building-apps/getting-started/install) (Internet Computer SDK)

### Setup Instructions

1. Clone the repository:
   ```sh
   git clone https://github.com/luthfidi/clean-ninja.git
   cd clean-ninja
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the local Internet Computer replica:
   ```sh
   dfx start --background
   ```
4. Deploy the application locally:
   ```sh
   dfx deploy
   ```

## Hackathon Notes

This project was developed for ICP Hackathon 12 under the World Computer track. It showcases the unique capabilities of the Internet Computer:

- HTTPS Outcalls: Enables secure location verification.
- Internet Identity: Provides decentralized authentication.
- On-chain Storage: Ensures all data, including images, is securely stored on the blockchain.
- Fully On-Chain Application: Both frontend and backend are deployed directly on ICP.

## Contributors

<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%">
        <a href="https://github.com/luthfidi">
           <img src="https://avatars.githubusercontent.com/u/114864625?v=4?s=100" width="100px" alt="Luthfi Hadi" />
          <br />
          <sub><b>LUTHFI HADI</b></sub>
        </a>
        <br />Developer
      </td>
      <td align="center" valign="top" width="14.28%">
        <a href="https://github.com/Phiy-O">
          <img src="https://avatars.githubusercontent.com/u/179428948?v=4?s=100" width="100px" alt="Andika Vio Pratama" />
          <br />
          <sub><b>ANDIKA VIO PRATAMA</b></sub>
        </a>
        <br />Developer
      </td>
      <td align="center" valign="top" width="14.28%">
        <a href="https://github.com/12ATIF">
          <img src="https://avatars.githubusercontent.com/u/104004537?v=4?s=100" width="100px" alt="Latif Ali Nurjaman" />
          <br />
          <sub><b>LATIF ALI NURJAMAN</b></sub>
        </a>
        <br />Developer
      </td>
      <td align="center" valign="top" width="14.28%">
        <a href="https://github.com/wmaulanaaishq">
          <img src="https://ui-avatars.com/api/?size=100&name=WAHYU+MAULANA+I" width="100px" alt="Wahyu Maulana Ishaq" />
          <br />
          <sub><b>WAHYU MAULANA I</b></sub>
        </a>
        <br />Developer
      </td>
      <td align="center" valign="top" width="14.28%">
        <a href="https://github.com/ardtys">
          <img src="https://avatars.githubusercontent.com/u/114295960?v=4?s=100" width="100px" alt="Daffa Rifki Arditya" />
          <br />
          <sub><b>DAFFA RIFKI ARDITYA</b></sub>
        </a>
        <br />Developer
      </td>
    </tr>
  </tbody>
</table>


Created by **Brokechain** Team for ICP Ninja Hackathon 12 (codefest.id)
