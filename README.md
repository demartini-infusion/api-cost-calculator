# API Cost Calculator

Premium calculator designed to estimate the infrastructure costs of AI agents using Gemini models, tailored for the AIOS Squad.

## Features
- **Pricing Models**: 
    - **Gemini 3.0 Flash**: $0.50 input / $3.00 output (per 1M tokens).
    - **Gemini 2.0 Flash**: $0.10 input / $0.40 output.
    - **Gemini 1.5 Flash**: $0.075 input / $0.30 output.
- **Cost Estimation**: Calculates cost per interaction, per lead, and total monthly cost.
- **Larissa Preset**: Pre-configured scenario for the AI SDR agent (1500 input / 300 output tokens).
- **Visuals**: Real-time cost updates and breakdown charts.

## Tech Stack
- React + Vite
- Tailwind CSS
- Lucide React (Icons)
- Recharts (Charts)

## Usage
1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Run development server: `npm run dev`
4.  Build for production: `npm run build`

## Project Structure
- `src/components/Calculator.jsx`: Main logic and UI.
- `src/utils/pricing.js`: Pricing data (embedded in component for simplicity).
