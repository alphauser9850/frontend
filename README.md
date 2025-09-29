# CCIE LAB

A web application for managing access to Cisco CML lab environments for network students.

## Features

- **User Authentication**: Secure login and registration system
- **Server Management**: Browse and request access to available lab servers
- **Admin Panel**: Approve/reject user requests and manage servers
- **Real-time Notifications**: Get notified when requests are made or approved
- **Secure Access**: All lab access is secured through token-based authentication
- **Iframe Integration**: Access Cisco CML labs directly within the application

## Tech Stack

- React with TypeScript
- Tailwind CSS for styling
- Supabase for authentication and database
- React Router for navigation
- Zustand for state management
- Lucide React for icons

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

### Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Copy `.env.example` to `.env` and add your Supabase credentials
4. Connect to Supabase by clicking the "Connect to Supabase" button in the top right
5. Run the development server:
   ```
   npm run dev
   ```

## Security Features

- **Token-based Authentication**: All lab access requires a valid authentication token
- **Authorization Checks**: Server-side verification that users have permission to access labs
- **Secure Parameters**: Access tokens are appended to URLs to prevent unauthorized access
- **Access Logging**: All lab access is logged for security and auditing purposes

## Database Schema

The application uses the following tables:

- **profiles**: User profiles with roles (admin/user)
- **servers**: Available CML lab servers
- **server_assignments**: Tracks which users have requested/been assigned to servers
- **notifications**: System notifications for users and admins

## User Roles

- **Admin**: Can manage servers, approve/reject requests, and view all users
- **User**: Can browse servers, request access, and use assigned servers

## License

MIT
