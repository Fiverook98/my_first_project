# My First Project

A full-stack web application built as a learning project to understand modern web development practices and architecture.

## Overview

This project served as a training ground for full-stack web development. While the code base has a simple architecture, it proved invaluable in gaining practical understanding of how web applications work end-to-end. The project took approximately 2.5 weeks to complete and get working properly.

## Tech Stack

- **Frontend**: Angular (TypeScript)
- **Backend**: Node.js (Express)
- **Database**: SQL-based
- **Containerization**: Docker & Docker Compose

## Project Structure

```
.
├── frontend/          # Angular frontend application
│   └── src/
│       ├── app/       # Angular components and services
│       └── component/ # Reusable UI components
├── backend/           # Node.js backend server
│   ├── routes/        # API endpoints
│   ├── config/        # Database configuration
│   └── init-db/       # Database initialization scripts
├── docker-compose.yml # Container orchestration
└── package.json       # Root dependencies
```

## Getting Started

### Prerequisites

- Node.js
- Docker & Docker Compose

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application using Docker Compose:
   ```bash
   docker-compose up
   ```

## Features

- User authentication and management
- Post creation and management
- Comments system
- File upload functionality
- Responsive UI with Angular

## Known Limitations & Future Improvements

This project, while functional, has areas that could be enhanced:

- **Security**: Additional security hardening and best practices implementation
- **Styling**: Migration from CSS to Tailwind CSS or SCSS for better maintainability
- **API Design**: Improved API structure and consistency
- **Services**: Better service layer organization and separation of concerns
- **Code Architecture**: Enhanced scaffolding with clearer responsibility boundaries
- **Code Quality**: Implementation of comprehensive clean code principles

## Containerization

The project includes Docker configuration for both frontend and backend services, with Docker Compose for easy local development and deployment.

## Learning Outcomes

This project was instrumental in understanding:

- Full-stack web development workflow
- Frontend-backend communication
- Database integration
- Container-based development
- API design patterns
- Component-based architecture

## License

This is a personal learning project.

---

**Note**: This codebase represents the starting point of my development journey. It demonstrates core concepts but is intentionally kept as a reference point for learning progress.