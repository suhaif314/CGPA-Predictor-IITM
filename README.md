# 🎓 CGPA Predictor — IIT Madras BS Degree

A fully client-side CGPA Calculator and Future CGPA Prediction System built for the **Namdapha House Tech Challenge** at IIT Madras.

🔗 **Live Demo:** [cgpa-predictor-iitm.vercel.app](https://cgpa-predictor-iitm.vercel.app/)

---

## ✨ Features

### 📊 Current CGPA Calculator
- Add completed subjects with credits and grades
- Instantly calculates your current CGPA using the official IIT Madras weighted-average formula
- Supports the full grade scale: **S (10) → A (9) → B (8) → C (7) → D (6) → E (5) → U (0)**

### 🔮 CGPA Prediction
- Add ongoing subjects with expected grades
- See your predicted CGPA after including current semester subjects
- Visual comparison of current vs predicted CGPA

### 🎯 Future CGPA Planning
- Plan hypothetical future subjects and grades
- **Target analysis:** _"What minimum grade do I need in future subjects to reach my target CGPA?"_
- Experiment with different grade scenarios

### 📈 Analytics & Insights
- **Grade Distribution Chart** — visual breakdown of your grades (S, A, B, C, D, E, U)
- **Level-wise Breakdown** — CGPA per level (Foundation / Diploma / Degree) with progress tracking

### 💾 Data Persistence
- All data saved automatically to **localStorage** — no data loss on page refresh
- Completed subjects **sync across all tabs** (Current → Predict → Plan)

### 🎨 Design
- Theme aligned with the [Namdapha House website](https://namdapha.iitmbs.org/)
- Fully responsive — works on **mobile, tablet, and desktop**
- Clean, intuitive card-based UI

---

## 🏫 Supported Degree Programs

| Program | Subjects | Levels |
|---------|----------|--------|
| **BS in Data Science and Applications** | 33 subjects | Foundation, Diploma, Degree |
| **BS in Electronic Systems** | 27 subjects | Foundation, Diploma, Degree |

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | [Next.js](https://nextjs.org) 16 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | [Tailwind CSS](https://tailwindcss.com) v4 |
| UI Components | [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://www.radix-ui.com) |
| Icons | [Lucide React](https://lucide.dev) |
| State Management | React Context API |
| Persistence | localStorage |
| Hosting | [Vercel](https://vercel.com) |

> **Fully client-side** — No backend, no APIs, no databases.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+ installed

### Installation

```bash
# Clone the repository
git clone https://github.com/suhaif314/CGPA-Predictor-IITM.git
cd CGPA-Predictor-IITM

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

### Build for Production

```bash
npm run build
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Current CGPA Calculator
│   ├── predict/page.tsx      # CGPA Prediction
│   ├── plan/page.tsx         # Future CGPA Planning
│   ├── layout.tsx            # Root layout with providers
│   └── globals.css           # Theme variables & global styles
├── components/
│   ├── cgpa-display.tsx      # CGPA result card with grade color
│   ├── grade-chart.tsx       # Grade distribution bar chart
│   ├── level-breakdown.tsx   # Foundation/Diploma/Degree stats
│   ├── subject-entry-row.tsx # Individual subject input row
│   ├── domain-selector.tsx   # DS / ES program selector
│   ├── navbar.tsx            # Navigation bar
│   ├── footer.tsx            # Footer
│   └── ui/                   # shadcn/ui components
└── lib/
    ├── grading.ts            # CGPA formula, types, grade scale
    ├── subjects.ts           # Complete subject catalog (DS + ES)
    ├── store.tsx             # Shared state context + localStorage
    └── utils.ts              # Utility functions
```

---

## 📐 CGPA Formula

```
CGPA = Σ(Credits × Grade Points) / Σ(Credits)
```

Follows the official IIT Madras BS Degree grading system.

---

## 📝 License

This project was built for the **Namdapha House Tech Challenge** at IIT Madras.

---

<p align="center">Built with ❤️ for <strong>Namdapha House</strong> — IIT Madras BS Degree</p>
