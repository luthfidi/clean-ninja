# Clean Ninja

Clean Ninja is a blockchain-based waste reporting application built on the Internet Computer Protocol (ICP). It empowers citizens to actively participate in maintaining a cleaner city by reporting, verifying, and tracking the cleanup of abandoned waste.

## Demo

![image](https://github.com/user-attachments/assets/4cbaac36-077a-4454-8455-cf20a0596cce)

Demo Video: [https://drive.google.com/file/d/1wvLrLeAcNKUFGrirmJvyZweihJO5Rmvu/view?usp=sharing](https://drive.google.com/file/d/1UeEMVr-lXOEH1SpWs3jVOWCzscAHwpiX/view?usp=sharing)

\*Video Notes: Some features are not included in the demo video, such as the location link on the report card (e.g., "East Jakarta"), which redirects directly to Google Maps.

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

## Next MVP Development

The following features are planned for the next version of Clean Ninja:

### A. Enhanced User Experience

**1. Interactive Map for Reporting**

- Gojek-style map implementation
- Interactive map using Leaflet.js or Mapbox
- GPS-based user location display
- Draggable markers for precise waste location
- Automatic address updates when marker is moved
- Map UI components:
  - "Use current location" button
  - Zoom in/out buttons
  - Dynamic address labels
  - Loading indicator during address search

**2. Improved Report Cards**

- Before-After display format
- Side-by-side photo display before and after cleanup
- Slider option for photo comparison
- Clear status labels (reported, booked, cleaned)
- Enhanced location buttons:
  - Clear map/pin icon design
  - "View on Map" label for function clarity
  - Visual hover effects for interactive elements
- Role-based display:
  - Regular users: focus on verification and reporting
  - TPA Officers: additional booking and marking cleaned buttons
  - TPA Admin: additional approval options
- Clear status indicators:
  - Different colors for each status
  - Icons representing status
  - Badges for booked reports

### B. Waste Category System by Size

**Category System with Descriptions:**

- Small: Waste that can be cleaned by 1-2 people (e.g., plastic bags, bottles)
- Medium: Requires 3-5 people (e.g., household waste piles)
- Large: Requires 6-10 people (e.g., construction waste piles)
- Very Large: Requires >10 people (e.g., small illegal dumpsites)

**UI Implementation:**

- Size standards displayed on homepage with visuals and examples
- Category selection with radio buttons and illustration images in reporting form
- Category size labels displayed on report cards with appropriate icons
- Filtering features:
  - Filter "Waste Reports" by size category
  - Statistics of reports per category
  - Combined filter with report status

### C. Notification System

**Specifically for TPA Officers:**

- Notifications only implemented in TPA TEAM feature
- No notifications for regular users

**Notification Types in TPA Team:**

- New member joining notifications
- Group selection for cleanup task notifications
- Upcoming cleanup schedule reminders
- Cleanup completion confirmation
- Point distribution notifications

**Technical Implementation:**

- Notification menu in TPA Team page
- New notification indicators
- Notification history

### D. TPA Officer Integration & Cleanup Process

**1. New Role: TPA Officer**

**TPA Officer Access Rights:**

- All regular user features (report, verify)
- Ability to book reports for cleanup
- Access to TPA TEAM page
- Ability to create groups (become leader)
- Ability to join groups (become member)

**Cleanup Verification Process:**

- Upload "after" cleanup photos
- Must be taken from the same angle as original photo
- Comment form about cleanup process
- Confirm number of team members involved
- Admin approval

**Admin Approval:**

- Approval system before status changes to "cleaned"
- Before-after photo review
- Point distribution confirmation

**2. "Book Clean" Feature**

**Booking Process:**

- TPA Officers can book reports for cleanup
- Group selection for assignment
- Cleanup time scheduling (date and time)
- Brief cleanup plan form

**Booking Status Indicators:**

- "Booked" label on report cards
- Information about assigned cleanup group
- Countdown timer to cleanup schedule
- Cancel booking option (with time limit)

**Booking Logic:**

- Reports with "reported" status and verified can be booked
- Already booked reports cannot be booked by other groups
- Booking expires if not completed within 48 hours

**3. TPA Team System (Separate Menu)**

**Group Creation and Management:**

- Group creation form (group name, description, maximum members)
- Shareable invitation link generation
- Member management (list, active status)
- Group leader abilities:
  - Change maximum member count
  - Remove (kick) members
  - Edit group name/description

**Membership Structure:**

- One TPA Officer can be member of multiple groups
- Each group has one leader (creator)
- Active/inactive status for members

**Coordination and Task Management:**

- Group representative (leader) can book reports for team
- Cleanup status currently being worked on by team
- Team activity history (completed cleanups)

**Team Notification System:**

- Notifications for group members (without chat feature)
- New task notifications
- Cleanup completion confirmations
- Point distribution notifications

### E. Gamification and Reward System

**1. Point System**

**Points for Regular Users:**

- New verified report: 20 points
- Report verification: 5 points
- Cleaned report: 10 bonus points

**Points for Cleanup:**

- Small waste: 50 points/person
- Medium waste: 100 points/person
- Large waste: 200 points/person
- Very Large waste: 300 points/person

**Point Distribution:**

- Points distributed evenly to all involved team members
- Distribution after admin approves cleanup
- Notification when points are added

**2. Point Withdrawal to ICP Feature**

**Conversion Mechanism:**

- Convert points to ICP tokens with determined ratio
- Minimum withdrawal: 1000 points
- Transaction fee (if applicable)

**Withdrawal UI:**

- Withdrawal form:
  - Number of points to exchange
  - Destination ICP wallet address
  - Preview of ICP amount to be received
  - Transaction confirmation
- Withdrawal verification steps
- Transaction status display

**Transaction Management:**

- Transaction history with status
- Estimated completion time
- Details per transaction
- Current point-ICP exchange rate information

### F. Profile Page

**1. Regular User Profile**

**Activity Statistics:**

- Total reports created
- Number of verifications performed
- Amount of waste cleaned
- Verified report ratio

**Point System:**

- Current total points
- Point earning chart (daily/weekly/monthly)
- Quick withdraw to ICP option

**Activity Timeline:**

- Recent user activity history
- Filter by activity type
- Activity details (reports, verifications, cleanups)

**ICP Transaction Management:**

- Point-ICP transaction history list
- Status of each transaction
- Total ICP received

**2. Additional for TPA Officer Profile**

**Cleanup Schedule:**

- List of upcoming bookings
- Preparation status
- Option to mark as completed

**Cleanup History:**

- List of completed cleanups
- Details per cleanup (size, location, points)
- Efficiency statistics (optional)

**Responsibility Area:**

- Sub-district/area as main region
- Activity history per area

### G. Additional Features (For Final Development)

**Location-Based Verification:**

- Geo-fencing implementation for Jakarta area
- Location check during verification (only users in Jakarta)
- Clear error message if verification from outside Jakarta
- Dev mode for testing (optional)
