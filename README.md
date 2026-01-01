<div align="center">

  <img src="static/assets/logo.png" alt="Contrary Logo" width="600"/>

  **An interactive visual novel experience exploring mathematical paradoxes through hand-drawn art, storytelling, and gameplay**

  [![GitHub](https://img.shields.io/badge/GitHub-Contrary-blue?logo=github)](https://github.com/Rexaintreal/Contrary)
  [![Flask](https://img.shields.io/badge/Flask-000000?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
  [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
  [![Hackatime](https://hackatime-badge.hackclub.com/U09B8FXUS78/Contrary)](https://hackatime.hackclub.com/)
  [![Axiom](https://img.shields.io/badge/Hack_Club-Axiom-EC3750?logo=hackclub&logoColor=red)](https://axiom.hackclub.com/)

</div>

---

## About

Ever wondered why math can feel so contrary to common sense? That's exactly what this project is about! Contrary is a cozy, hand-drawn web experience where mathematical paradoxes come alive through interactive storytelling. Think of it as a visual novel meets math class, but way more fun.
I built this with Flask and vanilla JavaScript, drawing every asset myself in MS Paint (or Canva with a MOUSE) to create that warm, sketchbook vibe. Each paradox is its own little adventure with custom artwork, curated music from Kirby and Zelda games (i love those), and sound effects that make every click feel satisfying. Whether you're choosing doors in the Monty Hall problem or watching traffic pile up in Braess's paradox, the goal is simple: make counterintuitive math concepts feel approachable and honestly kind of magical.
It's designed to feel like flipping through a friend's notebook full of doodles and discoveries, with handwritten fonts, soft peachy colors, and rounded corners everywhere. No intimidating textbooks here just curious exploration of why our intuition sometimes gets things wonderfully wrong.

---

## Live Demo

- Contrary is Live at [LINK](https://contrary.pythonanywhere.com/)
- Demo Video: [Google Drive Link](https://drive.google.com/file/d/1Xq-06uYkJTDiNINhjhWrxZEuQuTypZKv/view?usp=sharing)

---

## Features

- **Interactive Paradox Simulations** - Five fully playable mathematical paradoxes with visual novel storytelling
- **Hand-Drawn Art Style** - Custom MS Paint artwork for all UI elements, characters, and environments
- **Dynamic Background Music** - Curated soundtrack featuring Kirby and Zelda themes for each paradox
- **Sound Effects System** - Contextual audio feedback for all interactions (door opens, car drives, party horns, etc.)
- **Visual Statistics** - Real-time graphs and charts that illustrate paradox outcomes and probability distributions
- **Responsive Controls** - Intuitive button-based interactions with visual feedback
- **Audio Settings** - Global volume control for music and sound effects with persistent preferences
- **Mathematical Explanations** - Detailed breakdowns of the logic and math behind each paradox with external references
- **Warm Aesthetic Design** - Sketchbook-themed UI with lined paper textures and handwriting fonts

---

## Paradoxes Included

### 1. **Birthday Paradox**
Explore the counterintuitive probability that two people in a room share the same birthday. Invite guests to a party, watch as birthdays are revealed, and see the math unfold in real-time statistics.

**Features:**
- Interactive party room with animated guests
- Dynamic person spawning with birthday generation
- Real-time match detection with visual highlighting
- Statistical probability graphs and calculations
- Confetti celebration effects on matches

### 2. **Monty Hall Problem**
Step into the famous game show scenario where switching doors dramatically changes your odds of winning. Play multiple rounds, track your strategy performance, and discover why switching is always better.

**Features:**
- Animated game show host sprite
- Three-door selection interface with reveal mechanics
- Stay vs. Switch decision system
- Win/loss tracking with aggregate statistics
- Visual probability explanations

### 3. **Braess's Paradox**
Witness how adding a new road to a traffic network can paradoxically increase overall travel time. Simulate traffic flow, add/remove roads, and observe the emergence of Nash equilibrium.

**Features:**
- Grid-based traffic network visualization
- Animated car sprites with pathfinding
- Road construction/removal mechanics
- Traffic flow simulation with congestion modeling
- Before/after comparison statistics

### 4. **Prisoner's Dilemma**
Experience the classic game theory scenario where cooperation and betrayal lead to different outcomes. Make choices, see consequences, and understand why rational actors might choose suboptimal strategies.

**Features:**
- Animated prisoner characters with emotional states
- Cooperate vs. Betray decision interface
- Outcome matrix with payoff calculations
- Multi-round gameplay with strategy tracking
- Game theory explanation with Nash equilibrium analysis

### 5. **Simpson's Paradox**
Manage two hospitals treating patients with different medications and discover how aggregate statistics can reverse when data is combined. Assign patients, track success rates, and uncover the statistical illusion.

**Features:**
- Hospital management interface with patient queues
- Mild vs. Severe case classification system
- Treatment A vs. Treatment B comparison
- Auto-run simulation mode for rapid testing
- Detailed success rate breakdowns showing the reversal

---

## Tech Stack

**Frontend**
- **HTML5** - Semantic markup structure
- **CSS3** - Custom styling with gradient backgrounds and animations
- **Vanilla JavaScript** - ES6+ for game logic and DOM manipulation
- **Canvas API** - For dynamic visualizations and particle effects
- **Web Audio API** - For music and sound effect management

**Backend**
- **Flask** (Python 3.8+)
- **Jinja2** - Template rendering

**Design Assets**
- **MS Paint** - All custom artwork and UI elements
- **Hand-drawn Graphics** - Buttons, characters, backgrounds, and icons
- **JSON Data** - Paradox content and configuration storage

**Audio**
- **Music Credits:**
- Landing: Kirby Star Allies - Main Menu
- Paradoxes Menu: Kirby's Epic Yarn - Butter Building
- Monty Hall: Sonic Unleashed - Werehog Battle Theme
- Birthday: Kirby Dream Land - Theme Song
- Braess: Zelda - Saria's Song (Lost Woods)
- Prisoner: Zelda BOTW - Kass' Theme
- Simpson: Kirby's Dream Land 3 - Ripple Field 1
- Settings: Zelda OOT - Kaepora Gaebora's Theme
- **Sound Effects:** Pixabay.com (click, woosh, door-open, car-drive, etc.)

**Typography**
- **Cabin Sketch** - Primary handwriting font
- **Patrick Hand** - Secondary handwriting font
- **Architects Daughter** - Accent font for playful elements

## Color Palette

| Category | Color | Hex Code | Usage |
|----------|-------|----------|-------|
| **Backgrounds** | ![](https://img.shields.io/badge/-FFF8E7?style=flat&color=FFF8E7) | `#FFF8E7` | Floral White - Gradient Start |
| | ![](https://img.shields.io/badge/-FFE4B5?style=flat&color=FFE4B5) | `#FFE4B5` | Moccasin - Gradient Middle |
| | ![](https://img.shields.io/badge/-FFDAB9?style=flat&color=FFDAB9) | `#FFDAB9` | Peach Puff - Gradient End |
| | ![](https://img.shields.io/badge/-8B4513?style=flat&color=8B451314) | `rgba(139, 69, 19, 0.08)` | Lined paper texture overlay |
| **Text & UI** | ![](https://img.shields.io/badge/-8B4513?style=flat&color=8B4513) | `#8B4513` | Saddle Brown - Primary text, borders |
| | ![](https://img.shields.io/badge/-654321?style=flat&color=654321) | `#654321` | Dark Brown - Subtitles |
| | ![](https://img.shields.io/badge/-D2691E?style=flat&color=D2691E) | `#D2691E` | Chocolate - Accents, shadows |
| **Buttons** | ![](https://img.shields.io/badge/-FF6B6B?style=flat&color=FF6B6B) | `#FF6B6B` | Soft Red - Button background |
| | ![](https://img.shields.io/badge/-CC5555?style=flat&color=CC5555) | `#CC5555` | Dark Red - Button shadow/3D effect |
| | ![](https://img.shields.io/badge/-FFF8E7?style=flat&color=FFF8E7) | `#FFF8E7` | Floral White - Button text |
---

## How It Works

### Paradox Simulation Engine

1. **Scene Initialization**: Each paradox loads its specific HTML template with embedded Canvas elements
2. **Asset Loading**: Preload all images, audio files, and JSON configuration data
3. **Game Loop**: RequestAnimationFrame-based rendering at 60fps for smooth animations
4. **State Management**: JavaScript objects track game state, player decisions, and simulation parameters
5. **Event Handling**: Click/touch events trigger state transitions and visual updates
6. **Audio Management**: Web Audio API handles music playback, crossfading, and sound effect mixing

### Birthday Paradox Algorithm

1. **Person Generation**: Creates random birthdays (1-365) for each new guest
2. **Collision Detection**: Compares each new birthday against existing birthdays in O(n) time
3. **Probability Calculation**: Uses formula `1 - (365!/(365^n * (365-n)!))` for theoretical probability
4. **Visual Updates**: Renders person sprites on canvas with birthday labels
5. **Match Highlighting**: Applies glow effects to matching birthday pairs
6. **Statistics Display**: Updates real-time graphs showing probability curves

### Monty Hall Game Logic

1. **Setup Phase**: Randomly places car behind one of three doors, goats behind others
2. **Player Selection**: Records initial door choice
3. **Host Reveal**: Opens a door with a goat (never the car or player's choice)
4. **Decision Phase**: Presents Stay vs. Switch options
5. **Outcome Resolution**: Reveals chosen door contents, determines win/loss
6. **Statistics Tracking**: Maintains running tallies of Stay/Switch strategies and win rates
7. **Probability Visualization**: Shows 1/3 vs. 2/3 odds with visual diagrams

### Braess Traffic Simulation

1. **Network Initialization**: Creates node-based traffic graph with weighted edges
2. **Pathfinding**: Implements Dijkstra's algorithm for shortest path calculation
3. **Traffic Flow**: Spawns car entities with origin/destination pairs
4. **Congestion Modeling**: Increases edge weights based on car density using function `t = t₀(1 + 0.15 * (flow/capacity))`
5. **Road Management**: Allows dynamic addition/removal of edges, recalculates paths
6. **Equilibrium Detection**: Monitors until all cars settle into stable routes
7. **Comparison Analysis**: Displays average travel times before/after network changes

### Prisoner's Dilemma Matrix

1. **Choice Interface**: Presents Cooperate and Betray buttons
2. **Opponent AI**: Uses mixed strategy (random, tit-for-tat, or always defect)
3. **Payoff Calculation**: Applies standard game theory matrix:
- Both Cooperate: 3/3
- Both Betray: 1/1
- One Betrays: 5/0
4. **Animation System**: Shows prisoner emotional states (happy, sad, thinking)
5. **Round History**: Maintains log of choices and outcomes
6. **Strategy Analysis**: Calculates optimal strategies and Nash equilibrium

### Simpson's Paradox Hospital Simulation

1. **Patient Generation**: Creates patients with severity classification (mild 70%, severe 30%)
2. **Treatment Assignment**: Routes patients to Treatment A or B at selected hospital
3. **Success Calculation**: Applies differential success rates:
- Large Hospital: Higher volume, lower individual rates
- Small Hospital: Lower volume, higher individual rates
4. **Data Aggregation**: Computes both disaggregated and aggregated success rates
5. **Reversal Detection**: Identifies when aggregate contradicts subgroup trends
6. **Visual Presentation**: Tables and charts show the statistical reversal clearly

---

## Project Structure

```
Contrary/
├── static/
│ ├── assets/ # Images and visual elements
│ │ ├── birthday/ # Birthday paradox assets
│ │ │ ├── birthday-cake.png
│ │ │ ├── button-invite.png
│ │ │ ├── button-reset.png
│ │ │ ├── button-start-party.png
│ │ │ ├── confetti.png
│ │ │ ├── party-room-background.png
│ │ │ ├── person-1.png
│ │ │ ├── person-2.png
│ │ │ └── person-3.png
│ │ ├── braess/ # Braess paradox assets
│ │ │ ├── button-add-road.png
│ │ │ ├── button-remove-road.png
│ │ │ ├── button-reset.png
│ │ │ ├── button-simulate.png
│ │ │ ├── car-blue.png
│ │ │ ├── car-red.png
│ │ │ ├── car-yellow.png
│ │ │ ├── end-point.png
│ │ │ ├── intersection.png
│ │ │ ├── road-horizontal.png
│ │ │ ├── road-vertical.png
│ │ │ ├── start-point.png
│ │ │ └── traffic-light.png
│ │ ├── monty-hall/ # Monty Hall problem assets
│ │ │ ├── button-play.png
│ │ │ ├── button-stay.png
│ │ │ ├── button-switch.png
│ │ │ ├── car.png
│ │ │ ├── dialogue-box.png
│ │ │ ├── door-closed.png
│ │ │ ├── door-open.png
│ │ │ ├── goat.png
│ │ │ ├── host-sprite.png
│ │ │ └── stage-background.png
│ │ ├── prisoner/ # Prisoner's dilemma assets
│ │ │ ├── button-betray.png
│ │ │ ├── button-cooperate.png
│ │ │ ├── prisoner-happy.png
│ │ │ ├── prisoner-sad.png
│ │ │ └── prisoner-thinking.png
│ │ ├── simpson/ # Simpson's paradox assets
│ │ │ ├── button-assign-patient.png
│ │ │ ├── button-auto-run.png
│ │ │ ├── button-reset.png
│ │ │ ├── button-show-stats.png
│ │ │ ├── button-stop.png
│ │ │ ├── failure-x.png
│ │ │ ├── hospital-large.png
│ │ │ ├── hospital-small.png
│ │ │ ├── mild-case-badge.png
│ │ │ ├── patient-sick.png
│ │ │ ├── patient-treated.png
│ │ │ ├── patient-waiting.png
│ │ │ ├── pill-a-red.png
│ │ │ ├── pill-b-blue.png
│ │ │ ├── severe-case-badge.png
│ │ │ └── success-checkmark.png
│ │ ├── paradoxes/ # Paradox selection menu assets
│ │ │ ├── arrow-left.png
│ │ │ ├── arrow-right.png
│ │ │ ├── birthday-art.png
│ │ │ ├── braess-art.png
│ │ │ ├── monty-hall-art.png
│ │ │ ├── play-button.png
│ │ │ ├── prisoner-art.png
│ │ │ └── simpson-art.png
│ │ ├── landing/ # Landing page assets
│ │ │ ├── math-divide.png
│ │ │ ├── math-integral.png
│ │ │ ├── math-multiply.png
│ │ │ ├── math-pi.png
│ │ │ ├── math-plus.png
│ │ │ ├── math-sqrt.png
│ │ │ └── github-logo.png
│ │ ├── music/ # Background music tracks
│ │ │ ├── landingmusic.mp3
│ │ │ ├── birthday-music.mp3
│ │ │ ├── braess-music.mp3
│ │ │ ├── monty-hall-music.mp3
│ │ │ ├── prisoner-music.mp3
│ │ │ ├── simpson-music.mp3
│ │ │ ├── settings.mp3
│ │ │ └── journal-music.mp3
│ │ └── favicon.ico
│ ├── css/ # Stylesheets
│ │ ├── landing.css # Landing page styles
│ │ ├── paradoxes.css # Paradox selection menu styles
│ │ ├── birthday.css # Birthday paradox styles
│ │ ├── braess.css # Braess paradox styles
│ │ ├── monty-hall.css # Monty Hall styles
│ │ ├── prisoner.css # Prisoner's dilemma styles
│ │ ├── simpson.css # Simpson's paradox styles
│ │ ├── settings.css # Settings page styles
│ │ └── 404.css # 404 error page styles
│ ├── js/ # JavaScript modules
│ │ ├── landing.js # Landing page interactions
│ │ ├── paradoxes.js # Paradox selection logic
│ │ ├── birthday.js # Birthday paradox game logic
│ │ ├── braess.js # Braess traffic simulation
│ │ ├── monty-hall.js # Monty Hall game mechanics
│ │ ├── prisoner.js # Prisoner's dilemma AI
│ │ ├── simpson.js # Simpson's hospital simulation
│ │ ├── settings.js # Audio/settings management
│ │ └── 404.js # 404 page animations
│ ├── sfx/ # Sound effects
│ │ ├── car-drive.mp3
│ │ ├── car-start.mp3
│ │ ├── click.mp3
│ │ ├── confettipop.mp3
│ │ ├── construction.mp3
│ │ ├── door-open.mp3
│ │ ├── goat.mp3
│ │ ├── horn-short.mp3
│ │ ├── hospital-ding.mp3
│ │ ├── lose.mp3
│ │ ├── page-turn.mp3
│ │ ├── party-horn.mp3
│ │ ├── pop.mp3
│ │ ├── prison-door.mp3
│ │ ├── sweep.mp3
│ │ ├── win.mp3
│ │ └── woosh.mp3
│ └── paradoxes.json # Paradox data and descriptions
├── templates/ # HTML templates
│ ├── index.html # Landing page
│ ├── paradoxes.html # Paradox selection menu
│ ├── birthday.html # Birthday paradox page
│ ├── braess.html # Braess paradox page
│ ├── monty-hall.html # Monty Hall page
│ ├── prisoner.html # Prisoner's dilemma page
│ ├── simpson.html # Simpson's paradox page
│ ├── settings.html # Settings page
│ └── 404.html # 404 error page
├── app.py # Flask application
├── requirements.txt # Python dependencies
├── .gitignore # Git ignore rules
├── LICENSE # MIT License
└── README.md # This file
```

---

## Setup and Installation

### Prerequisites
- Python 3.8 or higher (i used 3.13.5)
- pip (Python package manager)
- A Browser
### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/Rexaintreal/Contrary.git
cd Contrary
```

2. **Create virtual environment** (not many packages tho still venv might be a good idea!)
```bash
python -m venv venv
source venv/bin/activate # for windows only
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Run the application**
```bash
python app.py
```

5. **Access the application**

Open your browser and navigate to:
```
http://localhost:5000
```

### Configuration

**Audio Settings** (adjustable in-app):
- Music Volume: 0% - 100% (default: 70%)
- Sound Effects Volume: 0% - 100% (default: 80%)
- Settings persist across sessions via localStorage

---

## Usage

### Navigation

**Landing Page:**
- Click "Explore Paradoxes" button to enter the paradox selection menu
- View GitHub repository link in footer

**Paradox Selection:**
- Use left/right arrow buttons to browse paradoxes
- Click "Play" button to start selected paradox
- Access settings via gear icon

**In-Game Controls:**
- All interactions are button-based with visual hover effects
- Click game-specific buttons to make choices and advance simulation
- Reset buttons return to initial state for replay
- Back button returns to paradox selection menu

### Paradox-Specific Instructions

**Birthday Paradox:**
1. Click "Start Party" to initialize the room
2. Click "Invite Guest" to add people one at a time
3. Watch for matching birthdays (highlighted with confetti)
4. Click "Reset" to start over with a new party

**Monty Hall:**
1. Click a door to make your initial choice
2. Host reveals a goat behind another door
3. Choose "Stay" or "Switch" strategy
4. View outcome and updated statistics
5. Click "Play Again" for another round

**Braess's Paradox:**
1. Click "Simulate" to start traffic flow
2. Observe travel times with current road network
3. Click "Add Road" to create the paradoxical shortcut
4. Run simulation again and compare results
5. Use "Remove Road" and "Reset" to experiment

**Prisoner's Dilemma:**
1. Choose "Cooperate" or "Betray" for your prisoner
2. AI opponent makes simultaneous choice
3. View outcome and payoff matrix
4. Play multiple rounds to explore strategies
5. Check statistics to see optimal behavior

**Simpson's Paradox:**
1. Click "Assign Patient" to manually add patients
2. Choose hospital (Large/Small) and treatment (A/B)
3. Or use "Auto-Run" to simulate many patients quickly
4. Click "Show Stats" to reveal the paradox
5. Reset and try different assignment patterns

---

## Credits

### Music
- **Landing Page** - [Kirby Star Allies - Main Menu](https://www.youtube.com/watch?v=OCmvnmppqWo)
- **Paradox Menu** - [Kirby's Epic Yarn - Butter Building](https://www.youtube.com/watch?v=VFha6fN_V7I)
- **Monty Hall** - [Sonic Unleashed - Werehog Battle Theme](https://www.youtube.com/watch?v=Bj_4Dr40_Zc)
- **Birthday** - [Kirby Dream Land - Theme Song](https://www.youtube.com/watch?v=3CS93CdMv_E)
- **Braess** - [Zelda - Saria's Song (Lost Woods)](https://www.youtube.com/watch?v=fER8zIAhRD0)
- **Prisoner** - [Zelda: Breath of the Wild - Kass' Theme](https://www.youtube.com/watch?v=1DAz_H4yzi0)
- **Simpson** - [Kirby's Dream Land 3 - Ripple Field 1](https://www.youtube.com/watch?v=mIAhvHSj1_I)
- **Settings** - [Zelda: Ocarina of Time - Kaepora Gaebora's Theme](https://www.youtube.com/watch?v=yEzAsJ4yc24)

### Sound Effects
- All sound effects sourced from [Pixabay.com](https://pixabay.com)

### Fonts
- **Cabin Sketch** - Google Fonts
- **Patrick Hand** - Google Fonts
- **Architects Daughter** - Google Fonts

### Art & Design
- All visual assets created by MEEEE using a mouse :>

---

## References

### Mathematical Resources

**Birthday Paradox:**
- [Vsauce2 - The Logically Impossible Birthday Problem](https://www.youtube.com/watch?v=ofTb57aZHZs)
- [Wikipedia - Birthday Problem](https://en.wikipedia.org/wiki/Birthday_problem)

**Monty Hall Problem:**
- [Vsauce - The Monty Hall Problem](https://www.youtube.com/watch?v=TVq2ivVpZgQ)
- [Wikipedia - Monty Hall Problem](https://en.wikipedia.org/wiki/Monty_Hall_problem)

**Braess's Paradox:**
- [Wikipedia - Braess's Paradox](https://en.wikipedia.org/wiki/Braess%27s_paradox)
- [Original Paper - Über ein Paradoxon aus der Verkehrsplanung](https://link.springer.com/article/10.1007/BF01898027)

**Prisoner's Dilemma:**
- [Wikipedia - Prisoner's Dilemma](https://en.wikipedia.org/wiki/Prisoner%27s_dilemma)
- [Stanford Encyclopedia - Game Theory](https://plato.stanford.edu/entries/game-theory/)

**Simpson's Paradox:**
- [Wikipedia - Simpson's Paradox](https://en.wikipedia.org/wiki/Simpson%27s_paradox)
- [UCLA Study on Statistical Reversals](https://ftp.cs.ucla.edu/pub/stat_ser/r414.pdf)

---

## Other Projects You Might Like...

- [Resonate](https://github.com/Rexaintreal/Resonate) - Real-time Audio Analysis Toolkit for Musicians
- [LeetCohort](https://github.com/Rexaintreal/LeetCohort) - Free Competitive Python DSA Practice Platform
- [Sorta](https://github.com/Rexaintreal/Sorta) - Sorting Algorithm Visualizer
- [Ziks](https://github.com/Rexaintreal/Ziks) - Physics Simulator with 21 Simulations
- [Eureka](https://github.com/Rexaintreal/Eureka) - Discover Local Hidden Spots
- [DawnDuck](https://github.com/Rexaintreal/DawnDuck) - USB HID Automation Tool
- [Lynx](https://github.com/Rexaintreal/lynx) - OpenCV Image Manipulation WebApp
- [Libro Voice](https://github.com/Rexaintreal/Libro-Voice) - PDF to Audio Converter
- [Snippet Vision](https://github.com/Rexaintreal/Snippet-Vision) - YouTube Video Summarizer
- [Syna](https://github.com/Rexaintreal/syna) - Social Music App with Spotify
- [Apollo](https://github.com/Rexaintreal/Apollo) - Minimal Music Player
- [Notez](https://github.com/Rexaintreal/Notez) - Clean Android Notes App

[View all projects →](https://github.com/Rexaintreal?tab=repositories)

---

## Contributing

Feel free to submit a pull request

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Author

**Saurabh Tiwari**

- Portfolio: [saurabhcodesawfully.pythonanywhere.com](https://saurabhcodesawfully.pythonanywhere.com/)
- Email: [saurabhtiwari7986@gmail.com](mailto:saurabhtiwari7986@gmail.com)
- Twitter: [@Saurabhcodes01](https://x.com/Saurabhcodes01)
- Instagram: [@saurabhcodesawfully](https://instagram.com/saurabhcodesawfully)
- GitHub: [@Rexaintreal](https://github.com/Rexaintreal)

---
