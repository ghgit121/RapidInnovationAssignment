# 🚀 AI-Powered Content & Image Explorer

<div align="center">

![Project Banner](<!-- INSERT BANNER IMAGE LINK HERE -->)

**A comprehensive full-stack application that combines the power of AI-driven web search and image generation**

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://ai-content-image-explorer-frontend.vercel.app/)
[![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-orange?style=for-the-badge)](#contributing)

[🌐 Live Demo](https://ai-content-image-explorer-frontend.vercel.app/) • [📖 Documentation](#api-documentation) • [🐛 Report Bug](#contact) • [💡 Request Feature](#contact)

</div>

---

## 📋 Table of Contents

- [🎯 Overview](#overview)
- [✨ Features](#features)
- [🖼️ Screenshots](#screenshots)
- [🛠️ Tech Stack](#tech-stack)
- [🚀 Getting Started](#getting-started)
- [⚙️ Configuration](#configuration)
- [🏃‍♂️ Running the Application](#running-the-application)
- [📚 API Documentation](#api-documentation)
- [🧪 Testing](#testing)
- [🤝 Contributing](#contributing)
- [📄 License](#license)
- [📞 Contact](#contact)

---

## 🎯 Overview

The **AI-Powered Content & Image Explorer** is a cutting-edge full-stack application that revolutionizes how users interact with web content and AI-generated imagery. By seamlessly integrating advanced search capabilities through the Tavily MCP server and state-of-the-art image generation via the Flux ImageGen MCP server, this platform offers an intuitive and powerful solution for content discovery and creative visual generation.

Whether you're a researcher looking for comprehensive web insights, a content creator needing AI-generated visuals, or simply someone exploring the possibilities of AI-powered tools, this application provides a secure, user-friendly interface to harness these technologies effectively.

### 🎯 Key Highlights

- **🔍 Intelligent Web Search**: Leverage advanced AI algorithms to retrieve and summarize web content
- **🎨 AI Image Generation**: Transform text prompts into stunning visual content
- **📊 Comprehensive Dashboard**: Manage, filter, and organize all your searches and creations
- **🔐 Secure Authentication**: JWT-based authentication with role-based access control
- **📱 Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **🌙 Theme Flexibility**: Toggle between light and dark modes for optimal viewing

---

## ✨ Features

### 🔍 **Advanced Web Search**
- Enter natural language queries and receive comprehensive web summaries
- Powered by the robust Tavily MCP search server
- Smart content filtering and relevance ranking
- Save and categorize search results for future reference

### 🎨 **AI Image Generation**
- Transform creative text prompts into high-quality images
- Utilizes the powerful Flux ImageGen MCP server
- Support for various artistic styles and concepts
- Download and organize generated images

### 📊 **Intelligent Dashboard**
- **Unified View**: Access all your saved searches and generated images in one place
- **Smart Filtering**: Filter content by type (search/image), date range, or keywords
- **Easy Management**: Edit descriptions, add tags, or delete unwanted entries
- **Quick Actions**: Bulk operations for efficient content management

### 🔐 **Robust Authentication System**
- **Secure Registration/Login**: Email-based authentication with password hashing
- **JWT Token Management**: Secure API access with automatic token refresh
- **Role-Based Access**: Differentiate between basic users and administrators
- **Session Management**: Automatic logout and session timeout handling

### 📱 **User Experience Excellence**
- **Responsive Design**: Optimized for all screen sizes and devices
- **Accessibility**: WCAG compliant with keyboard navigation support
- **Performance**: Fast loading times with optimized API calls
- **Intuitive Interface**: Clean, modern UI/UX design principles

### 🎁 **Bonus Features**
- **Data Export**: Export your saved data to CSV or PDF formats
- **Search History**: Track and revisit your previous queries
- **Favorites System**: Mark and quickly access your preferred content
- **Sharing Options**: Share generated images and search results

---

## 🖼️ Screenshots

### 🏠 **Welcome & Authentication**

<div align="center">

![Login Page](<https://drive.google.com/file/d/1qYlLZ0fPhG9gLB1VIo0IKow1WgWSdGK_/view?usp=sharing>)
*Secure and intuitive login interface with modern design aesthetics*

</div>

### 🔍 **Web Search Experience**

<div align="center">

![Search Interface](<https://drive.google.com/file/d/1vceOcWR43SvrrO-Ui1pl7ogtGbHo0ZEQ/view?usp=sharing>)
*Comprehensive search results with AI-powered summaries and source links*


</div>

### 🎨 **Image Generation Studio**

<div align="center">

![Image Generation Interface](<https://drive.google.com/file/d/1rEnhk6txu7sTKYFot9V04OKHnYPjGVXT/view?usp=sharing>)
*Gallery view of AI-generated images

</div>

### 📊 **Dashboard & Management**

<div align="center">

![Dashboard Overview](<https://drive.google.com/file/d/1twPsB3BXFUeJP6PQwCi6PfaQbFUFO22O/view?usp=sharing>)
*Comprehensive dashboard with analytics and quick access to all features*

</div>

### 🌙 **Theme Options**

<div align="center">

![Dark Mode](<https://drive.google.com/file/d/1qYlLZ0fPhG9gLB1VIo0IKow1WgWSdGK_/view?usp=drive_link>)
*Elegant dark mode interface for comfortable nighttime usage*

![Light Mode](<https://drive.google.com/file/d/121p5BiaxDXI-znMMJwBEDHOJnwfzrG4u/view?usp=drive_link>)
*Clean light mode interface for bright environment usage*

</div>

---

## 🛠️ Tech Stack

### **Frontend Technologies**
- **⚛️ React 18**: Modern React with hooks and functional components
- **🎨 Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **📱 Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **🔄 State Management**: Context API and React hooks for efficient state handling
- **🌐 HTTP Client**: Axios for robust API communication

### **Backend Technologies**
- **🐍 Python 3.8+**: Modern Python with type hints and async support
- **⚡ FastAPI**: High-performance web framework with automatic API documentation
- **🔐 JWT Authentication**: Secure token-based authentication system
- **📊 Pydantic**: Data validation and serialization with Python type annotations
- **🔄 Async Programming**: Non-blocking I/O operations for better performance

### **Database & Storage**
- **🐘 PostgreSQL**: Robust relational database with advanced features
- **📋 SQLAlchemy**: Python SQL toolkit and Object-Relational Mapping
- **🔄 Alembic**: Database migration tool for schema management

### **AI & MCP Integration**
- **🔍 Tavily MCP**: Advanced web search and content summarization
- **🎨 Flux ImageGen MCP**: State-of-the-art AI image generation
- **🤖 MCP Protocol**: Model Context Protocol for seamless AI integration

### **Development & Deployment**
- **🚀 Vercel**: Frontend deployment with global CDN
- **☁️ Cloud Infrastructure**: Scalable backend deployment
- **🔧 Development Tools**: Hot reload, debugging, and testing utilities

---

## 🚀 Getting Started

### 📋 Prerequisites

Before diving into the setup, ensure your development environment includes:

- **🐍 Python 3.8+**: [Download Python](https://www.python.org/downloads/)
- **📦 Node.js & npm**: [Download Node.js](https://nodejs.org/)
- **🐘 PostgreSQL**: [Download PostgreSQL](https://www.postgresql.org/)
- **🔧 Git**: [Download Git](https://git-scm.com/)

### 📥 Installation

1. **Clone the Repository**
   ```bash
   git clone <repository_url>
   cd ai-content-image-explorer
   ```

2. **Backend Setup**
   ```bash
   cd backend
   
   # Create and activate virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Return to project root
   cd ..
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   
   # Install Node.js dependencies
   npm install
   
   # Return to project root
   cd ..
   ```

4. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb ai_content_explorer
   
   # Run database migrations (from backend directory)
   cd backend
   alembic upgrade head
   cd ..
   ```

---

## ⚙️ Configuration

### 🔧 Backend Configuration

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/ai_content_explorer

# JWT Configuration
SECRET_KEY=your_super_secure_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# MCP Server Configuration
TAVILY_API_KEY=your_tavily_api_key_here
FLUX_IMAGEGEN_API_URL=http://localhost:8001

# Application Settings
DEBUG=True
CORS_ORIGINS=["http://localhost:3000"]
```

### 🎨 Frontend Configuration

Create a `.env` file in the `frontend` directory:

```env
# API Configuration
REACT_APP_BACKEND_API_URL=http://localhost:8000
REACT_APP_API_VERSION=v1

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_EXPORT=true

# Environment
REACT_APP_ENVIRONMENT=development
```

### 🔑 Environment Variables Explained

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `SECRET_KEY` | JWT token encryption key | ✅ |
| `TAVILY_API_KEY` | API key for Tavily MCP server | ✅ |
| `FLUX_IMAGEGEN_API_URL` | URL for Flux ImageGen MCP server | ✅ |
| `REACT_APP_BACKEND_API_URL` | Backend API endpoint | ✅ |

---

## 🏃‍♂️ Running the Application

### 🖥️ Development Mode

1. **Start the Backend Server**
   ```bash
   cd backend
   uvicorn main:app --reload --port 8000
   ```

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```

3. **Access the Application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8000
   - **API Documentation**: http://localhost:8000/docs

### 🚀 Production Deployment

The application is configured for easy deployment on modern cloud platforms:

- **Frontend**: Deployed on Vercel with automatic builds
- **Backend**: Compatible with Docker, Heroku, AWS, or any Python hosting service
- **Database**: Works with managed PostgreSQL services (AWS RDS, Google Cloud SQL, etc.)

---

## 📚 API Documentation

The backend API is fully documented using **Swagger/OpenAPI** specification. Access the interactive documentation at `/docs` endpoint.

### 🔗 Core Endpoints

#### 🔐 Authentication Endpoints
```
POST   /auth/register     - Register a new user account
POST   /auth/login        - Authenticate and receive JWT token
POST   /auth/refresh      - Refresh expired JWT token
GET    /auth/me           - Get current user information
```

#### 🔍 Search Endpoints
```
POST   /search/           - Perform web search via Tavily MCP
GET    /search/history    - Retrieve user's search history
DELETE /search/{id}       - Delete a saved search result
```

#### 🎨 Image Generation Endpoints
```
POST   /image/generate    - Generate image from text prompt
GET    /image/history     - Get user's generated images
DELETE /image/{id}        - Delete a generated image
```

#### 📊 Dashboard Endpoints
```
GET    /dashboard/        - Retrieve user's saved content
POST   /dashboard/        - Create new dashboard entry
PUT    /dashboard/{id}    - Update existing entry
DELETE /dashboard/{id}    - Delete dashboard entry
GET    /dashboard/export  - Export data to CSV/PDF
```

#### 👤 User Management
```
GET    /users/profile     - Get user profile information
PUT    /users/profile     - Update user profile
POST   /users/avatar      - Upload profile avatar
```

### 📋 Request/Response Examples

<details>
<summary>🔍 Search Request Example</summary>

```json
{
  "query": "artificial intelligence trends 2024",
  "max_results": 10,
  "include_images": true,
  "filter_domains": ["tech.com", "ai-news.com"]
}
```
</details>

<details>
<summary>🎨 Image Generation Request Example</summary>

```json
{
  "prompt": "A futuristic cityscape with flying cars at sunset",
  "style": "digital art",
  "size": "1024x1024",
  "quality": "high"
}
```
</details>

---

## 🧪 Testing

### 🔬 Test Suite Overview

Our comprehensive testing strategy ensures reliability and maintainability:

```bash
# Run all tests
npm run test:all

# Backend tests only
cd backend && python -m pytest

# Frontend tests only
cd frontend && npm test

# End-to-end tests
npm run test:e2e
```

### 📊 Test Coverage

| Component | Coverage | Test Types |
|-----------|----------|------------|
| Backend API | 95%+ | Unit, Integration |
| Frontend Components | 90%+ | Unit, Component |
| User Flows | 85%+ | End-to-End |
| MCP Integration | 90%+ | Integration |

### 🧪 Test Categories

- **Unit Tests**: Individual function and component testing
- **Integration Tests**: API endpoint and MCP server integration
- **Component Tests**: React component behavior and rendering
- **E2E Tests**: Complete user workflow validation using Playwright
- **Performance Tests**: Load testing and performance benchmarks

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can get involved:

### 🌟 Ways to Contribute

- 🐛 **Bug Reports**: Find and report issues
- 💡 **Feature Requests**: Suggest new functionality
- 🔧 **Code Contributions**: Submit pull requests
- 📖 **Documentation**: Improve guides and examples
- 🎨 **Design**: Enhance UI/UX elements

### 📝 Contribution Process

1. **Fork the Repository**
   ```bash
   git fork https://github.com/your-username/ai-content-image-explorer
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-new-feature
   ```

3. **Make Your Changes**
   - Follow our coding standards
   - Add tests for new functionality
   - Update documentation as needed

4. **Commit Your Changes**
   ```bash
   git commit -m "Add amazing new feature"
   ```

5. **Submit Pull Request**
   - Provide clear description of changes
   - Reference any related issues
   - Ensure all tests pass

### 📋 Development Guidelines

- Follow **PEP 8** for Python code
- Use **Prettier** and **ESLint** for JavaScript/React
- Write meaningful commit messages
- Add appropriate tests for new features
- Update documentation for API changes


```
MIT License

Copyright (c) 2024 AI Content & Image Explorer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 📞 Contact

<div align="center">

### **Sanket Singh**

[![Email](https://img.shields.io/badge/Email-1111sanketsingh@gmail.com-red?style=for-the-badge&logo=gmail)](mailto:1111sanketsingh@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/sanket-singh-8a8b8122a/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=for-the-badge&logo=github)](https://github.com/ghgit121)


</div>

---

## 🙏 Acknowledgments

Special thanks to:

- **Tavily Team** for their excellent MCP search server
- **Flux ImageGen** for the powerful AI image generation capabilities
- **Open Source Community** for the amazing tools and libraries
- **Beta Testers** who provided valuable feedback and suggestions

---

<div align="center">

**⭐ If you found this project helpful, please give it a star! ⭐**

![Footer Banner](<!-- INSERT FOOTER BANNER LINK HERE -->)

*Built with ❤️ and ☕ by Sanket Singh*

</div>
