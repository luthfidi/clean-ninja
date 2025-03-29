# Clean Ninja

Clean Ninja is a blockchain-based waste reporting application built on the Internet Computer Protocol (ICP). It enables citizens to participate in keeping their city clean by reporting, verifying, and tracking the cleanup of abandoned waste.

![Clean Ninja Screenshot](https://via.placeholder.com/800x400?text=Clean+Ninja+App)

## Features

- **Waste Reporting**: Report abandoned waste with photos, location, and descriptions
- **Location Verification**: Uses HTTPS Outcalls to verify and validate report locations
- **Community Verification**: Allows users to verify reports from others
- **Cleanup Tracking**: Mark waste as cleaned up when resolved
- **Filtering & Statistics**: Filter reports by district and status, view cleanup statistics

## Technology Stack

- **Backend**: Motoko canister on Internet Computer Protocol
- **Frontend**: React + Vite + Tailwind CSS
- **Authentication**: Internet Identity
- **Data Storage**: On-chain storage for reports and images
- **Unique ICP Features**: HTTPS Outcalls, Internet Identity, On-chain Storage

## Application Workflow

1. **Authentication**: Users log in using Internet Identity
2. **Report Creation**:
   - Take a photo of waste
   - Detect location via GPS
   - Verify location using HTTPS Outcalls
   - Add description
   - Submit report
3. **Verification Process**:
   - Other users can verify report validity
   - Verification data stored on the blockchain
4. **Cleanup Tracking**:
   - Users can mark reports as cleaned
   - Status updates reflected on the blockchain

## Implementation Notes

- The application is optimized to stay under 2000 lines of code
- Responsive design for desktop and mobile devices
- Error handling with fallbacks for a seamless user experience
- District-based filtering for better organization of reports

## Project Structure

```
/
├── backend/                # Motoko code
│   ├── app.mo              # Main backend canister
│   └── Types.mo            # Type definitions
├── frontend/               # React frontend
│   ├── src/                # Source code
│   │   ├── App.jsx         # Main application component
│   │   ├── main.jsx        # Entry point
│   │   ├── utils_api.jsx   # API utilities for backend communication
│   │   ├── utils_auth.jsx  # Authentication utilities
│   │   └── ...             # Other components and utilities
│   ├── index.html          # HTML template
│   └── index.css           # Global CSS
├── dfx.json                # Project configuration
└── package.json            # NPM configuration
```

## Deployment

The application is deployed on the Internet Computer blockchain network:

- Backend Canister ID: `twkfl-haaaa-aaaab-qbnpa-cai`
- Frontend Canister ID: `63hef-eyaaa-aaaab-qblya-cai`

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+)
- [DFX](https://internetcomputer.org/docs/building-apps/getting-started/install) (Internet Computer SDK)

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/clean-ninja.git
   cd clean-ninja
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start local Internet Computer replica:
   ```
   dfx start --background
   ```

4. Deploy locally:
   ```
   dfx deploy
   ```

## Hackathon Notes

This project was created for ICP Hackathon 12 - Track: World Computer. It demonstrates the unique capabilities of ICP:

- **HTTPS Outcalls**: Used for location verification
- **Internet Identity**: For secure, decentralized authentication
- **On-chain Storage**: All data, including images, stored directly on the blockchain
- **Chain-based Frontend**: The entire application runs from the ICP blockchain

## License

MIT License

---

Created by **Brokechain** Team for ICP Ninja Hackathon 12 (codefest.id)
