# ALX-ProjectPrime

Welcome to **ALX-ProjectPrime**, a comprehensive chat application built as part of my portfolio projects. This project leverages modern web technologies to deliver a real-time chat experience. Below are the details about the structure, setup, and usage of this repository.

## Project Structure

The project is organized into two main parts:

```markdown
chatter/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   ├── sockets/
│   └── ...
│
└── frontend/
    ├── components/
    ├── pages/
    ├── context/
    ├── hooks/
    ├── styles/
    └── ...
```

### Backend

The `backend/` directory contains the server-side logic of the application. It's built using:

- **Node.js with Express** for the server and API handling
- **MongoDB** as the primary database for storing user data and chat history
- **Redis** for caching and session management
- **JWT** for secure user authentication
- **Socket.io** for real-time communication between users

### Frontend

The `frontend/` directory contains the client-side of the application. It's built using:

- **React** for building the user interface
- **Tailwind CSS** for styling and UI design
- **Context API & Hooks** for state management and handling logic

## Getting Started

To get a local copy up and running, follow these steps:

### Prerequisites

- **Node.js** installed
- **MongoDB** installed and running
- **Redis** installed and running

### Installation

1. Clone the repository to your local machine:

   ```sh
   git clone https://github.com/majidied/alx-ProjectPrime.git
   ```

2. Navigate to the project directory:

   ```sh
   cd alx-ProjectPrime/chatter
   ```

3. Install dependencies for both backend and frontend:

   ```sh
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

### Running the Application

1. Start the backend server:

   ```sh
   cd backend
   npm start
   ```

2. Start the frontend development server:

   ```sh
   cd ../frontend
   npm start
   ```

The application will be running on `http://localhost:3000` for the frontend, and the backend API will be available at `http://localhost:5000`.

## Contact

- **Name**: Mohammed Majidi
- **GitHub**: [majidied](https://github.com/majidied)
- **Email**: <mohammedmajidi321@gmail.com>
- **Phone**: +212 652508638

Feel free to reach out if you have any questions or feedback!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
