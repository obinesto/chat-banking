# ChatBanking-API

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**ChatBanking-API** is the backend service for a conversational banking application, designed to work over real-time messaging platforms like WhatsApp. It leverages `socket.io` to provide a seamless chat interface for users to perform banking operations.

Users can create a virtual bank account, check their balance, and will be able to perform other transactions like sending money and paying bills, all through a simple chat conversation.

## ✨ Features

- **User Onboarding**: A complete, state-driven registration flow for new users.
- **Virtual Account Creation**: Integrates with a (mock) partner banking service to create virtual bank accounts for users.
- **Real-time Interaction**: Built with Socket.IO for instant, real-time communication.
- **Secure PIN Handling**: User PINs are securely hashed using `bcryptjs`.
- **Stateful Conversations**: Manages user conversation state to guide them through different flows (e.g., registration, main menu).
- **Check Balance**: Allows existing users to check their wallet balance.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js (implied via `http` server) & Socket.IO
- **Database**: MongoDB with Mongoose
- **Security**: `bcryptjs` for hashing
- **Environment Management**: `dotenv`

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v16 or later recommended)
- MongoDB instance (local or cloud-based like MongoDB Atlas)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/ChatBanking-API.git
    cd ChatBanking-API
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the following variables:
    ```env
    # Server Configuration
    PORT=5000

    # MongoDB Connection
    MONGODB_URI=your_mongodb_connection_string

    # CORS Configuration
    CORS_ORIGIN=http://localhost:3000
    ```

4.  **Run the application:**
    ```bash
    npm start
    ```
    The server will start running on the port specified in your `.env` file.

## socket-io-events API Usage

The API communicates over Socket.IO. A client can connect to the server and interact by emitting and listening for events.

1.  **`join` (emit)**: The client should emit this event to start a session. This is how the server identifies the user.
    ```javascript
    socket.emit('join', 'your-whatsapp-id');
    ```

2.  **`message` (on)**: The server sends all its responses through this event. The client should listen to it to display messages to the user.
    ```javascript
    socket.on('message', (data) => {
      console.log('Message from server:', data);
    });
    ```

3.  **`message` (emit)**: The client sends all user inputs to the server using this event.
    ```javascript
    socket.emit('message', 'user-response-here');
    ```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
