# SmartSeek

A modern AI chat application built with React, TypeScript, and WebSocket for real-time conversational AI interactions.

## Features

- **Real-time AI Chat**: WebSocket-based communication for instant AI responses
- **Thinking Process Display**: Visualize AI reasoning with collapsible thinking sections
- **Chat History Management**: Save, browse, and manage conversation history
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Markdown Support**: Rich text rendering for AI responses
- **Image Support**: Upload and display images in conversations
- **Search Integration**: Built-in search functionality for enhanced queries
- **Dark/Light Theme**: Customizable UI themes
- **Sidebar Navigation**: Easy access to chat history and settings

## Tech Stack

- **Frontend Framework**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4 + Styled Components
- **UI Components**: Ant Design 5 + Ant Design X
- **State Management**: Zustand
- **WebSocket**: reconnecting-websocket
- **HTTP Client**: Axios
- **Markdown Rendering**: markdown-it
- **Icons**: Heroicons + Ant Design Icons

## Environment

Node.js `20.9.0` or higher

## Getting Started

### Install Dependencies

```bash
yarn install
```

### Development

```bash
yarn dev
```

The app will run on `http://localhost:3003`

### Build

```bash
yarn build
```

### Lint

```bash
yarn lint
```

## Project Structure

```
src/
├── api/              # API integration
├── assets/           # Images, styles, and static resources
├── components/       # React components
│   ├── header/       # Header component
│   ├── main/         # Main chat interface
│   ├── sideBar/      # Chat history sidebar
│   ├── rightSidebar/ # Settings and options
│   └── other/        # Utility components
├── hooks/            # Custom React hooks (WebSocket, etc.)
├── store/            # Zustand state management
├── types/            # TypeScript type definitions
└── utils/            # Utility functions and constants
```

## Deployment

### Vercel Deployment

This project is optimized for Vercel deployment. See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for WebSocket configuration details.

**Important**: Configure the `VITE_WS_URL` environment variable in Vercel:
```
VITE_WS_URL=wss://smartseek.ai-mchat.com/apis/magic-ws
```

## Configuration

### Environment Variables

- `.env.development` - Local development configuration
- `.env.production` - Production configuration

### WebSocket Connection

The app uses WebSocket for real-time communication with the AI backend. Connection settings can be configured via environment variables.

