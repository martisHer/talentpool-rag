# TalentLens

TalentLens is an AI-powered recruiting assistant that allows recruiters to upload multiple CVs and search candidates using natural language.

The project combines **semantic search, structured metadata filtering, embeddings, and LLMs** to retrieve relevant candidates and generate grounded answers.

## ✨ Features

* Upload multiple CVs at once
* Natural-language candidate search
* Hybrid retrieval using:

  * Semantic similarity
  * Structured filters such as role and location
* Candidate ranking
* AI-generated recruiter responses
* Interactive candidate results
* In-app CV preview
* Synthetic CV generation pipeline with 29 realistic candidate profiles

## 🧠 Backend & AI Workflow

TalentLens uses a Retrieval-Augmented Generation (RAG) pipeline:

```text
CVs
 ↓
Text extraction
 ↓
Chunking
 ↓
Embeddings
 ↓
Vector store
 ↓
Natural-language query
 ↓
Query parsing
 ↓
Metadata filtering + semantic search
 ↓
Candidate ranking
 ↓
LLM-generated grounded answer
```

The natural-language query is first converted into structured search criteria such as role and location, while the semantic part of the query is converted into an embedding.

The system then combines metadata filtering with vector similarity to retrieve the most relevant candidates.

Only the retrieved candidate information is provided to the final LLM, which generates the recruiter-facing answer.

## 🏗️ Project Structure

```text
src/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   ├── cv/
│   │   └── upload/
│   ├── page.tsx
│   └── page.module.css
│
├── components/
│   ├── CandidateChips.tsx
│   ├── CandidateList.tsx
│   ├── Chat.tsx
│   ├── CVDialog.tsx
│   ├── Navbar.tsx
│   └── UploadCVs.tsx
│
├── rag/
│   ├── answer.ts
│   ├── candidates.ts
│   ├── chunkText.ts
│   ├── embeddings.ts
│   ├── indexCV.ts
│   ├── queryParser.ts
│   └── vectorStore.ts
│
└── types.ts

scripts/
├── generateCandidates.ts
├── generateHeadshots.ts
├── renderPDFs.ts
├── indexCVs.ts
└── testRag.ts
```

## 🛠️ Tech Stack

* **Next.js**
* **React**
* **TypeScript**
* **OpenAI GPT-4.1**
* **OpenAI text embeddings**
* **Zod**
* **Local vector store**
* **PDF generation**

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd cv-generator
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the OpenAI API key

Create a `.env.local` file:

```env
OPENAI_API_KEY=your_api_key_here
```

### 4. Start the application

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## 📄 Generate the Demo CV Dataset

The generated CVs are intentionally **not included in the repository** because they are generated artifacts and can be recreated from the source code.

The project contains scripts for:

1. Generating synthetic candidate profiles
2. Generating candidate headshots
3. Rendering the profiles as PDFs
4. Indexing the CVs for semantic search

Run 
```bash
npx tsx scripts/generateCandidates.ts
npx tsx scripts/generateHeadshots.ts
npx tsx scripts/renderPDFs.ts
```

## 🔎 Testing the RAG Pipeline

The RAG pipeline can also be tested independently from the UI.

Example query:

```text
Find frontend developers in Berlin with React experience
```

The terminal output shows:

* Parsed search criteria
* Retrieved candidates
* Similarity scores
* Final grounded answer

Run 
```bash
npx tsx scripts/renderPDFs.ts
npx tsx scripts/indexCVs.ts
```

## 🔐 Data & Privacy

All candidate profiles used by the demo are **synthetically generated** and do not represent real people.

Generated files and local vector stores are excluded from version control.

## 🎯 Purpose

TalentLens was built as a technical prototype demonstrating how an AI-powered recruiting search experience can combine:

* Modern frontend development
* API design
* Natural-language interfaces
* Semantic search
* Structured filtering
* Embeddings
* Retrieval-Augmented Generation
* LLM-powered responses
