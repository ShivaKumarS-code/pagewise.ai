# <img src="https://img.icons8.com/fluency/48/artificial-intelligence.png" alt="AI Icon" width="40" height="40"> PageWise.ai: Intelligent PDF Chat

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/tRPC-398CCB?style=for-the-badge&logo=trpc&logoColor=white" alt="tRPC">
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Pinecone-000000?style=for-the-badge&logo=pinecone&logoColor=white" alt="Pinecone">
</p>

**PageWise.ai** is a sophisticated full-stack Next.js application that transforms your PDF documents into intelligent conversations. Upload any PDF and chat with its content using advanced AI models powered by **Qwen-3** and **LangChain**.

---

## 🛠️ Tech Stack

<table>
  <tr>
    <td><b>🎨 Frontend</b></td>
    <td>Next.js, TypeScript, Tailwind CSS, shadcn/ui</td>
  </tr>
  <tr>
    <td><b>⚡ Backend</b></td>
    <td>Next.js API Routes, tRPC, Prisma ORM</td>
  </tr>
  <tr>
    <td><b>🤖 AI Models</b></td>
    <td>Qwen-3, Google Generative AI</td>
  </tr>
  <tr>
    <td><b>🗄️ Database</b></td>
    <td>PostgreSQL, Pinecone Vector DB</td>
  </tr>
  <tr>
    <td><b>🔐 Auth & Storage</b></td>
    <td>Kinde, UploadThing</td>
  </tr>
</table>

---

## ✨ Features

<ul>
  <li>🔐 <b>Secure Authentication</b> - Robust user management with Kinde</li>
  <li>📄 <b>Smart PDF Processing</b> - Upload and instantly interact with documents</li>
  <li>🤖 <b>AI-Powered Chat</b> - Get intelligent answers based on PDF content</li>
  <li>💬 <b>Conversation Memory</b> - Maintains context across multiple questions</li>
  <li>🎨 <b>Modern UI</b> - Beautiful, responsive interface with Tailwind CSS</li>
  <li>⚡ <b>Type-Safe APIs</b> - End-to-end type safety with tRPC</li>
  <li>🔍 <b>Vector Search</b> - Semantic search powered by Pinecone</li>
  <li>📱 <b>Responsive Design</b> - Works seamlessly on all devices</li>
</ul>

---

## 🏗️ Architecture

### Core Framework
```xml
<frontend-stack>
  <framework>Next.js</framework>
  <language>TypeScript</language>
  <api>tRPC</api>
  <styling>Tailwind CSS + shadcn/ui</styling>
  <auth>Kinde</auth>
  <uploads>UploadThing</uploads>
</frontend-stack>
```

### AI Pipeline
```xml
<ai-pipeline>
  <llm>
    <model>Qwen-3 (qwen-3-235b-a22b-instruct-2507)</model>
  </llm>
  <embeddings>
    <provider>Google Generative AI</provider>
    <purpose>PDF text vectorization</purpose>
  </embeddings>
  <vector-db>
    <service>Pinecone</service>
    <function>Similarity search & storage</function>
  </vector-db>
  <orchestration>
    <framework>LangChain</framework>
    <role>AI component coordination</role>
  </orchestration>
</ai-pipeline>
```

---

## 🎯 How It Works

<ol>
  <li>📤 <b>Upload PDF</b> - Drag and drop or select your document</li>
  <li>🔍 <b>Processing</b> - AI extracts text and creates vector embeddings</li>
  <li>💾 <b>Storage</b> - Vectors stored in Pinecone for fast retrieval</li>
  <li>💬 <b>Chat</b> - Ask questions in natural language</li>
  <li>🎯 <b>Context Search</b> - Find relevant document sections</li>
  <li>🤖 <b>AI Response</b> - Get intelligent answers with source citations</li>
</ol>

---

## 📁 Project Structure

```
📦 pagewise-ai
├── 📂 src/
│   ├── 📂 app/                 # Next.js app router pages
│   ├── 📂 components/          # Reusable UI components
│   ├── 📂 config/              # Configuration files
│   ├── 📂 db/                  # Database connection & queries
│   ├── 📂 lib/                 # Utility functions & helpers
│   ├── 📂 trpc/                # tRPC API setup & routes
│   └── 📂 types/               # TypeScript type definitions
├── 📂 prisma/                  # Database schema & migrations
├── 📂 public/                  # Static assets & images
└── 📄 README.md
```

---

## 🚀 Live Demo

<blockquote>
🌐 Experience PageWise.ai in action: <a href="https://pagewise-ai-steel.vercel.app"><b>Live Demo</b></a>
</blockquote>

Try uploading a PDF and start chatting with your documents instantly!

---

## 🔧 Key Technologies

### 🤖 **AI & Machine Learning**
- **Qwen-3** - Advanced language model for natural conversations
- **Google Generative AI** - High-quality text embeddings
- **LangChain** - Orchestrates AI components seamlessly
- **Pinecone** - Vector database for lightning-fast semantic search

### 🎨 **Frontend Excellence**
- **Next.js 14** - React framework with server components
- **TypeScript** - Type-safe development experience
- **Tailwind CSS** - Modern, responsive styling
- **shadcn/ui** - Beautiful, accessible components

### 🔒 **Security & Performance**
- **Kinde Auth** - Enterprise-grade authentication
- **tRPC** - End-to-end type safety
- **Prisma** - Type-safe database operations
- **PostgreSQL** - Reliable, scalable database

---

## 🌟 What Makes PageWise.ai Special

<table>
  <tr>
    <td><b>🧠 Intelligent Context</b></td>
    <td>Maintains conversation flow for natural interactions</td>
  </tr>
  <tr>
    <td><b>⚡ Lightning Fast</b></td>
    <td>Optimized vector search delivers instant responses</td>
  </tr>
  <tr>
    <td><b>🔒 Privacy First</b></td>
    <td>Your documents and conversations stay secure</td>
  </tr>
  <tr>
    <td><b>📱 Universal Access</b></td>
    <td>Works perfectly on desktop, tablet, and mobile</td>
  </tr>
</table>

---

## 🎮 Getting Started

Ready to chat with your PDFs? It's simple:

1. **🔗 Visit** the live demo or deploy your own instance
2. **📝 Sign up** with your preferred authentication method
3. **📤 Upload** your first PDF document
4. **💬 Start chatting** and unlock the knowledge in your documents!

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

<ul>
  <li>🐛 <b>Report bugs</b> - Found an issue? Let us know!</li>
  <li>💡 <b>Suggest features</b> - Have ideas for improvements?</li>
  <li>🔧 <b>Submit PRs</b> - Code contributions are always welcome</li>
  <li>⭐ <b>Star the repo</b> - Show your support!</li>
</ul>

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ using Next.js & AI
</p>
