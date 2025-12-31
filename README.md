# SelfOS

**The Operating System for Your Life.**

SelfOS is an intelligent, AI-powered personal dashboard designed to align your digital life with your biology. It helps you understand yourself, predict your energy levels, and optimize your schedule using advanced analytics and circadian rhythm tracking.

![SelfOS Banner](https://via.placeholder.com/1200x600?text=SelfOS+Dashboard+Preview)

## 🚀 Mission

To create a "Life Kernel" that learns your habits and predicts your next best move, enabling you to operate at peak performance by harmonizing your tasks with your natural energy cycles.

## ✨ Key Features

- **🧠 Life Kernel AI**: An intelligent engine that learns from your behavior to offer personalized recommendations.
- **🔋 Energy Prediction**: Visualizes your circadian rhythm to help you schedule high-focus tasks when you're most capable.
- **🗺️ Holistic Life Map**: A force-directed graph (Life Map) that visualizes connections between your goals, habits, and daily tasks.
- **📊 Extended Insights**: Deep analytics into your productivity, habits, and goal progress.
- **📅 Smart Schedule**: An optimized calendar interface that integrates with your energy predictions.
- **🎯 Goals & Outcomes**: Track long-term objectives and break them down into actionable steps.

## 🛠️ Technology Stack

Built with a modern, high-performance tech stack:

- **Framework**: [Next.js 16](https://nextjs.org/) (App Directory)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide React](https://lucide.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Backend/Auth**: [Firebase](https://firebase.google.com/)

## 📂 Project Structure

```bash
src/
├── app/                  # Next.js App Router pages
│   ├── dashboard/        # Main authenticated interface
│   │   ├── insights/     # Analytics views
│   │   ├── life-kernel/  # AI & Core logic views
│   │   └── schedule/     # Calendar & Planning
│   ├── goals/            # Goal setting & tracking
│   ├── map/              # Life Map visualization
│   └── settings/         # User configuration
├── components/           # Reusable UI components
│   ├── ui/               # Design system primitives
│   └── ...
├── lib/                  # Utilities and helper functions
└── store/                # Zustand state stores
```

## 🏁 Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/self-os.git
   cd self-os
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add your Firebase and other API keys.
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
