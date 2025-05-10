# Transcendence Project

A full-stack web application featuring a Next.js frontend and Django backend with real-time gaming and chat capabilities.

## Overview

This project is a modern web platform that combines:
- A Next.js 15 frontend with React 19, TypeScript, and Tailwind CSS
- A Django backend with Django REST Framework and Django Channels
- Real-time features via WebSockets for games and chat
- Authentication system with multiple options including OAuth and 2FA

## Features

### Authentication System
- Traditional email/password login
- OAuth authentication with 42
- Two-factor authentication with QR code
- Email verification system
- JWT-based authentication with httpOnly cookies

### Game Platform
- Multiple game modes including TicTacToe
- Real-time multiplayer via WebSockets
- Local and online gameplay options
- Player statistics and rankings

### Chat System
- Real-time messaging with WebSockets
- User presence detection
- Direct messaging and group chats

### User Profiles
- Customizable user profiles
- Friend management system
- Activity tracking
- Statistics visualization with charts

## Technology Stack

### Frontend
- **Framework**: Next.js 15.1.3 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Authentication**: JWT with httpOnly cookies
- **Real-time**: WebSocket connections
- **Charts**: Chart.js and Recharts

### Backend
- **Framework**: Django 4.2.16 with Django REST Framework
- **WebSockets**: Django Channels with Redis
- **Authentication**: JWT tokens, OAuth, 2FA with TOTP
- **Database**: PostgreSQL
- **Caching**: Redis

### Infrastructure
- **Containerization**: Docker and Docker Compose
- **Reverse Proxy**: Nginx with SSL
- **CI/CD**: Makefile for easy development and deployment commands

## Project Structure

```
42-trancendance/
├── docker-compose.yml    # Docker composition configuration
├── Makefile              # Development and deployment commands
├── backend/              # Django backend application
│   ├── authentication/   # Authentication app
│   ├── chat/             # Chat functionality
│   ├── core/             # Project settings and main URLs
│   ├── game/             # Game engine and API
│   ├── TicTacToe/        # TicTacToe game implementation
│   └── users/            # User profiles and management
├── frontend/             # Next.js frontend application
│   ├── app/              # Next.js app router pages
│   ├── components/       # Reusable React components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   └── public/           # Static assets
└── nginx/                # Nginx configuration for routing
```

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Make (optional, for using Makefile commands)

### Setup and Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd 42-trancendance
   ```

2. **Create environment files**

   Create a `secrets` directory with the necessary configuration files:
   ```
   secrets/
   ├── backend.env      # Django environment variables
   ├── postgres.env     # PostgreSQL configuration
   └── ssl/             # SSL certificates
       ├── selfsigned.crt
       └── selfsigned.key
   ```

3. **Start the application**
   ```bash
   make up
   ```
   Or using Docker Compose directly:
   ```bash
   docker compose up -d
   ```

4. **Access the application**
   - Web application: https://localhost
   - Django admin: https://localhost/admin/

## Development

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Backend Development

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py runserver
```

## Deployment

The application is designed to be deployed using Docker Compose:

```bash
# Build containers
make build

# Start services
make up
```

## Available Commands

The project includes a Makefile with several useful commands:

- `make help` - Show available commands
- `make up` - Start containers in detached mode
- `make down` - Stop and remove containers
- `make build` - Build containers without cache
- `make logs` - Show logs of all running containers
- `make restart` - Restart all containers
- `make ps` - List running containers
- `make clean` - Remove stopped containers, networks, and images
- `make bash` - Open a bash shell in a running container

## Security

- HTTPS with SSL certificates
- httpOnly cookies for JWT
- Two-factor authentication
- Email verification
- Input validation and sanitization

## Contributors

- [Your Team Members]

## License

[Your License Information]
