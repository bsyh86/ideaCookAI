

```

# Product Requirements Document: IdeaCook.AI (MVP)

### 1. Project Overview & Goal

IdeaCook.AI is a local-first content analysis and synthesis tool. The Minimum Viable Product (MVP) will focus on a core user journey: a manually triggered, three-step pipeline that uses Large Language Models (LLMs) to process, evaluate, synthesize, and score ideas from local documents. The project's goal is to provide a simple, predictable interface for a complex backend process, making it feel intuitive and frictionless for the user.

### 2. Technology Stack

* **Frontend**: Next.js, React, CSS (or Tailwind CSS).
* **Backend**: Next.js API Routes.
* **File System**: Node.js `fs` module for local file I/O.
* **AI Model**: Gemini API.
* **State Management**: A temporary `_state.json` file on the server-side to manage state between steps.
* **Credentials**: Gemini API key stored in a `.env.local` file.

### 3. Core User Workflow (The 3-Step Pipeline)

The user interacts with a Next.js web application to process idea documents stored in a local folder.

1.  **Placement**: The user places multiple idea documents (e.g., `.txt`, `.md`) into a local `data/documents/` folder. Each document must contain an author's email in the header, formatted as `Author: name@company.com`.

2.  **Step 1: Get Ingredients**: The user clicks the "Get Ingredients" button.
    * The backend reads every document.
    * An LLM agent assesses each document.
    * **Vague** documents have constructive feedback appended to the bottom of the file.
    * **Irrelevant** documents are ignored.
    * **Relevant** documents are added to a temporary list (`_state.json`) for the next step.

3.  **Step 2: COOK**: After Step 1 completes, the user clicks the "COOK" button.
    * The backend consolidates all *relevant* documents into a single request for a second LLM agent.
    * This agent synthesizes the information, generating a new block of text with collaborative ideas and next steps.

4.  **Step 3: Serve**: The user clicks the "Serve" button.
    * The synthesized "cooked" ideas are appended to the bottom of *each* of the original relevant documents.
    * A third LLM agent assigns a "spicy" rating (1-5) to each relevant document.
    * The system updates a central `spice_points.txt` file, adding the points to the corresponding author's total score.

### 4. Detailed Feature Specifications

#### **Feature 1: Frontend - Manual Analysis Pipeline**

**Goal**: To provide a single-screen UI that guides the user through the three-step pipeline with clear, real-time feedback.

**API Endpoints to Call**:
* `POST /api/ingredients`
* `POST /api/cook`
* `POST /api/serve`

**UI States & Requirements**:

* **State Management**: Use a single state variable in the main page component (e.g., `useState('IDLE')`) to track the application's status (`IDLE`, `INGREDIENTS_PENDING`, `INGREDIENTS_DONE`, `COOK_PENDING`, `COOK_DONE`, `SERVE_PENDING`, `COMPLETE`, `ERROR`).
* **Initial State (`IDLE`)**:
    * Display the application title, "Vibe Code".
    * The "Get Ingredients" button is active and styled as the primary call to action.
    * "COOK" and "Serve" buttons are disabled.
    * Status display shows a message like "Ready to begin analysis."
* **In-Progress States (e.g., `INGREDIENTS_PENDING`)**:
    * When a step is initiated, all buttons must be disabled.
    * A loading spinner must appear.
    * The status text must update to reflect the action (e.g., "Gathering Ingredients: Scanning documents...").
* **Intermediate States (e.g., `INGREDIENTS_DONE`)**:
    * The button for the completed step must show a "completed" state (e.g., disabled with a checkmark).
    * The button for the *next* step becomes active.
    * The status display summarizes the result (e.g., "Success! 5 of 8 documents are relevant. Ready to COOK.").
* **Final State (`COMPLETE`)**:
    * All three buttons appear in the "completed" state.
    * The status display shows a final confirmation message.
    * An optional "Start Over" button appears to reset the UI to the `IDLE` state.
* **Error State (`ERROR`)**:
    * If any API call fails, all buttons are disabled.
    * An error icon and message ("An error occurred. Please check the server console for details.") are displayed.
    * A "Try Again" button must be provided to reset the application.

---

#### **Feature 2: Backend - Ingredients Agent**

**Goal**: To filter documents for quality, provide feedback on vague content, and prepare a list of relevant documents for the next step.

**API Endpoint**: `POST /api/ingredients`

**Requirements**:

1.  **File Input**: Read all `.txt` and `.md` files from the `data/documents/` directory.
2.  **Reset Logic**: If this endpoint is called, it must first clear any previous state and re-evaluate all documents from scratch.
3.  **Relevance Check**: For each document, call the Gemini API with the following system prompt to classify it:
    > "System: You are a document analyst. Determine if the following text is a 'relevant' idea, 'vague', or 'irrelevant'. A relevant idea is concrete and actionable. A vague one has potential but lacks detail. Your response should be a single word: RELEVANT, VAGUE, or IRRELEVANT. Document: [content]"
4.  **Feedback Generation**: If a document is `VAGUE`, make a second Gemini API call with this prompt and append the result to the file:
    > "System: You are a helpful coach. The following idea is too vague. Provide short, constructive feedback (2-3 sentences) on how to make it more concrete. Idea: [content]"
5.  **State Management**:
    * Create a list of file paths for all `RELEVANT` documents.
    * Write this list and processing stats into `tmp/_state.json`.
    * The API response to the frontend should include a success message with counts (e.g., "Success! 5 of 8 documents are relevant. Ready to COOK.").

---

#### **Feature 3: Backend - Cooking Agent**

**Goal**: To synthesize all relevant documents into a single, actionable block of collaborative ideas.

**API Endpoint**: `POST /api/cook`

**Requirements**:

1.  **Input**: Read the list of relevant document paths from `tmp/_state.json`. If the file doesn't exist, return an error.
2.  **Content Aggregation**: Read and concatenate the content of each relevant document into a single large text block.
3.  **Synthesis**: Send the consolidated text to the Gemini API with the following system prompt:
    > "System: You are a strategic facilitator. The following are several ideas from different team members. Synthesize them into a single, coherent block of text. Identify synergies, suggest collaborative next steps, and formulate overarching themes. Do not simply summarize. Create a new, actionable plan. Ideas: [consolidated_text]"
4.  **State Management**: Save the synthesized text output from the LLM back into `tmp/_state.json` under the key `cooked_ideas`.

---

#### **Feature 4: Backend - Serving Agent & Scorer**

**Goal**: To distribute the synthesized ideas and quantify each document's impact through author scoring.

**API Endpoint**: `POST /api/serve`

**Requirements**:

1.  **Input**: Read `cooked_ideas` and `relevant_docs` from `tmp/_state.json`. If data is missing, return an error.
2.  **Idea Distribution**: Append the `cooked_ideas` text block to the bottom of *each* file in the `relevant_docs` list.
3.  **Scoring**: For each relevant document, call the Gemini API with the following prompt to get a rating:
    > "System: You are a document scorer. Based on its potential impact and relevance, assign a 'spicy' rating from 1 (low impact) to 5 (high impact) to the following document. Your response must be a single number. Document: [content]"
4.  **Author Parsing**: Parse the author's email from the header line `Author: name@company.com`. If the tag is missing, skip scoring for that document.
5.  **Leaderboard Management**:
    * Read the `data/spice_points.txt` file, which must be structured as a JSON object (e.g., `{"name@company.com": 15}`).
    * For each document, add the assigned spicy rating to its author's total score.
    * If an author is new, add them to the JSON object.
    * Write the updated scores back to `spice_points.txt`, overwriting the file.
6.  **Cleanup**: Delete the `tmp/_state.json` file after all operations are complete.

### 5. File Structure


```

*/*

*├── pages/*

*│ ├── api/*

*│ │ ├── ingredients.js \# Feature 2*

*│ │ ├── cook.js \# Feature 3*

*│ │ └── serve.js \# Feature 4*

*│ └── index.js \# Feature 1 (Main UI Page)*

*├── components/*

*│ ├── ActionButton.js*

*│ ├── StatusDisplay.js*

*│ └── Layout.js*

*├── styles/*

*│ └── globals.css*

*├── public/*

*│ └── some-icon.svg*

*├── data/*

*│ ├── documents/*

*│ │ ├── idea1.md \# Example input file*

*│ │ └── idea2.txt \# Example input file*

*│ └── spice\_points.txt \# Leaderboard file*

*├── tmp/*

*│ └── \_state.json \# Temporary state file*

*└── .env.local \# API credentials*

