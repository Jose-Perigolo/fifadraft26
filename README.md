# FIFA Draft 2026

A Next.js application for organizing a FIFA championship draft where 8 players build teams of 16 players each from the FC25 database.

## Features

### 🔐 Authentication System
- **8 Pre-configured Users**: Jamir, José, Jean, Foguin, Pituca, João, Leo, Jamal
- **Initial Password**: All users start with password "senha"
- **Password Change**: Users must change their password after first login
- **Secure Login**: Click-to-select user interface with password verification

### 🏆 Draft Management
- **Turn-based System**: Players pick in order, one at a time
- **16 Rounds**: Each user builds a team of 16 players
- **Real-time Progress**: Visual progress bar and round tracking
- **Team Building**: Each user can see their team and other teams

### ⚽ Player Database
- **FC25 Database**: Complete player database from FIFA Career Mode
- **Advanced Search**: Search by name, team, or nation
- **Position Filtering**: Filter by specific positions (GK, CB, ST, etc.)
- **Overall Rating Filter**: Filter by minimum/maximum overall rating
- **Multiple Sort Options**: Sort by overall, name, age, etc.

### 🎨 User Interface
- **Modern Design**: Beautiful green gradient theme
- **Responsive Layout**: Works on desktop and mobile devices
- **Player Cards**: Detailed player information with stats
- **Draft Board**: Real-time view of all teams and current turn
- **Visual Indicators**: Color-coded positions and turn indicators

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Processing**: PapaParse for CSV parsing
- **State Management**: React useState hooks
- **Build Tool**: Turbopack

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fifadraft26
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Usage

### First Time Setup
1. **Select Your User**: Click on your name from the 8 available users
2. **Enter Initial Password**: Use "senha" as the initial password
3. **Change Password**: Create a new password (minimum 4 characters)
4. **Start Drafting**: Begin selecting players for your team

### During the Draft
1. **Wait for Your Turn**: The system shows whose turn it is
2. **Search and Filter**: Use the search and filter options to find players
3. **Select a Player**: Click on a player card to add them to your team
4. **Monitor Progress**: Watch the draft board to see all teams
5. **Complete Your Team**: Build a team of 16 players

### Player Selection Features
- **Search**: Type player names, teams, or nations
- **Position Filter**: Select specific positions (GK, CB, ST, etc.)
- **Overall Range**: Set minimum and maximum overall ratings
- **Sort Options**: Sort by overall rating, name, or age
- **Player Details**: View complete stats and information

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── players/       # Player data endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── DraftBoard.tsx     # Draft progress display
│   ├── Login.tsx          # Authentication component
│   ├── PasswordChange.tsx # Password change form
│   ├── PlayerCard.tsx     # Individual player display
│   ├── PlayerSelection.tsx # Player search and selection
│   └── DraftPage.tsx      # Main draft interface
├── types/                 # TypeScript type definitions
│   └── index.ts           # Player, User, Draft interfaces
├── utils/                 # Utility functions
│   ├── draft.ts           # Draft logic and user management
│   └── players.ts         # Player data processing
└── playerbase/            # Player database
    └── male_players.csv   # FC25 player data
```

## API Endpoints

### GET /api/players
Returns the complete player database from the CSV file.

**Response:**
```json
{
  "players": [
    {
      "id": 0,
      "name": "Kylian Mbappé",
      "overall": 91,
      "position": "ST",
      "age": 25,
      "nation": "France",
      "league": "LALIGA EA SPORTS",
      "team": "Real Madrid",
      "pace": 97,
      "shooting": 90,
      "passing": 80,
      "dribbling": 92,
      "defending": 36,
      "physical": 78,
      // ... additional stats
    }
  ],
  "total": 15000
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- EA Sports for the FC25 player database
- Next.js team for the amazing framework
- Tailwind CSS for the beautiful styling system
