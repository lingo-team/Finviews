# Lingo FinView 🚀

An AI-powered financial analytics and trading platform that provides market sentiment analysis, automated trading capabilities, and intelligent portfolio management.

## Features ✨

- Smart Trading Decisions with AI-driven algorithms
- Real-time Market Sentiment Analysis using FinBert
- User-friendly Dashboard with customizable layouts
- AI-Generated Reports from specialized agents
- Intelligent Virtual Assistant With Unreal Engine
- Risk-Optimized Trading Strategies
- Automated Portfolio Management
- Educational Trading Resources

## Important Links 🔗

- [GitHub Repository](https://github.com/lingo-team/Finviews)
- [Prototype Video](https://drive.google.com/drive/folders/1oJo7fynFJjyhFBNySqZFdh4VgeD6i_3z)
- [Fine-tuning Colab Notebook](https://colab.research.google.com/drive/1MvxUFexEJx5kA4aX-W2if6v7HJFdL4Up?usp=sharing)
- [Unsloth Fine-tuned Model](https://huggingface.co/ansari02/finview/tree/main)
- [Podcasts Dataset](https://docs.google.com/spreadsheets/d/1z6DVJPU1DS4J0OhsPkauRPu_2-HfiPjHix1hpaKTBzE/edit?gid=0#gid=0)

## Tech Stack 🛠

- Frontend: Next.js, React
- Backend: Flask (Python)
- Database: Supabase
- AI/ML: FinBert, Custom Fine-tuned Models
- Authentication: Supabase Auth
- API Hosting: Replit
- Website Hosting: Firebase

## Getting Started 🚀

### Prerequisites

- Node.js (v16 or higher)
- Python 3.8+
- npm or yarn
- Supabase account
- Replit account (for API hosting)

### Environment Variables

Create a `.env.local` file in the root directory:

```plaintext
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lingo-team/Finview.git
   cd lingo-finview
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:5173] in your browser.

### Sign In Credentials (For Judging)

Use these placeholder credentials to test the application:
- Email: msec.devdynastyclub@gmail.com
- Password: WebAppDev

## API Endpoints 🔌

The following endpoints are available through our Flask server hosted on Replit:

- **POST** ([https://personal-9d0j.onrender.com/get_answer](https://personal-d5jn.onrender.com/get_answer)
  - Generate optimized portfolio recommendations

- **GET** [https://fincrew.onrender.com/analyze](https://fincrew.onrender.com/analyze)
  - Get AI-generated financial reports

## Project Structure 📁

```
FINVIEW/
├── crew/                # AI agent modules
├── personal/            # User-specific logic or settings
├── src/                 # Source code for the application
├── stock/               # Stock trading modules and data
├── Trade/               # Trading algorithms and logic
├── .env                 # Environment variables (API keys, secrets)
├── index.html           # Application entry point
├── tailwind.config.js   # Tailwind CSS configuration
├── vite.config.ts       # Vite build tool configuration
└── package.json         # Project metadata and scripts
```

## Team Members 👥

- Thameem Mul Ansari S
- Rithikaa S B
- Lakshana R

## Support 📧

For support, email thameemmulansaris@gmail.com
