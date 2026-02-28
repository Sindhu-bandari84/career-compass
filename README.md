
# Career Compass - Local Setup

Follow these steps to run Career Compass on your local machine using VS Code.

## Prerequisites
- **Node.js**: Ensure you have Node.js (v18+) installed.
- **VS Code**: Recommended editor.

## Installation Steps

1. **Extract/Download Files**: Place all files in a folder named `career-compass`.
2. **Open in VS Code**: Open the folder in VS Code.

2. **Install MongoDB**: Ensure MongoDB Community Server is installed and running.
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Set Up API Key**:
   - Create a file named `.env` in the root folder.
   - Add your Gemini API key:
     ```env
     API_KEY=your_google_gemini_api_key_here
     MONGO_URI=mongodb://localhost:27017/career_compass
     ```
5. **Start Application (Frontend + Backend)**:
   This command runs both the React Frontend and Python Backend simultaneously.
   ```bash
   npm start
   ```
6. **View App**: The terminal will provide a link (usually `http://localhost:5173`). Open it in your browser.

## Project Structure
- `index.tsx`: The React entry point.
- `App.tsx`: Main application component and routing.
- `services/gemini.ts`: AI logic for generating roadmaps.
- `components/`: UI sections like Assessment, Results, and Analytics.
