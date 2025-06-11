# IdeaCook.AI

A local-first content analysis and synthesis tool that processes, evaluates, and synthesizes ideas from local documents using the Gemini API.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file in the root directory and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. Create the required directories:
   ```bash
   mkdir -p data/documents tmp
   ```

## Usage

1. Place your idea documents (`.txt` or `.md` files) in the `data/documents/` directory. Each document should have an author email in the header:
   ```
   Author: name@company.com
   
   Your idea content here...
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. The application will be available at `http://localhost:3000`

## API Endpoints

The application provides three main API endpoints:

1. `POST /api/ingredients`
   - Analyzes all documents in the `data/documents/` directory
   - Classifies them as relevant, vague, or irrelevant
   - Provides feedback for vague documents
   - Returns statistics about the analysis

2. `POST /api/cook`
   - Synthesizes all relevant documents into a single coherent block
   - Identifies synergies and suggests next steps
   - Returns the synthesized ideas

3. `POST /api/serve`
   - Appends the synthesized ideas to each relevant document
   - Scores each document and updates author points
   - Returns scoring results and updated spice points

## File Structure

- `data/documents/`: Directory for input documents
- `data/spice_points.txt`: Leaderboard file storing author scores
- `tmp/_state.json`: Temporary state file for the processing pipeline
- `pages/api/`: API endpoint implementations
- `utils/helpers.js`: Utility functions for file operations and API interactions

## Development

The application is built with:
- Next.js for the API routes
- Gemini API for AI-powered analysis
- Node.js file system operations for local file handling 