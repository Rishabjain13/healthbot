# Healthcare AI Assistant

A professional, production-ready healthcare management platform with an AI chatbot assistant. Built with React, TypeScript, Redux, and Supabase.

## Features

### Patient Management
- Complete patient profile management
- Medical history tracking
- Allergy information
- Emergency contact details
- Personal information management

### Appointment Management
- Book new appointments
- View appointment history
- Edit and cancel appointments
- Filter by appointment status
- Department and doctor selection
- Appointment notes and reminders

### AI Healthcare Assistant
- Interactive chatbot interface
- Real-time messaging
- Healthcare guidance and information
- Appointment booking assistance
- Medical information queries
- Persistent chat history

### Medical File Management
- Upload medical documents
- Categorize files (Medical Records, Lab Results, Prescriptions, Imaging, Other)
- View and download files
- Delete files
- File size and type management
- Secure file storage

### Dashboard
- Overview of health metrics
- Upcoming appointments
- Quick actions
- Chat message count
- Medical files summary
- Health score tracking

## Technology Stack

- **Frontend**: React 18, TypeScript
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Build Tool**: Vite

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Application Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── Layout.tsx
│   ├── ProtectedRoute.tsx
│   └── ProfileLoader.tsx
├── pages/              # Main application pages
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── Dashboard.tsx
│   ├── Profile.tsx
│   ├── Appointments.tsx
│   ├── Chat.tsx
│   └── Files.tsx
├── store/              # Redux state management
│   ├── store.ts
│   └── slices/
│       ├── authSlice.ts
│       ├── profileSlice.ts
│       ├── appointmentSlice.ts
│       └── chatSlice.ts
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── hooks/              # Custom React hooks
│   └── useProfile.ts
├── lib/                # External service configs
│   └── supabase.ts
└── types/              # TypeScript type definitions
    └── index.ts
```

## Security Features

- Row Level Security (RLS) enabled on all tables
- Authenticated user access only
- User-specific data isolation
- Secure file storage with access controls
- Protected routes
- Session management

## Database Schema

### Profiles
- User information and medical history
- Emergency contacts
- Allergy information

### Appointments
- Appointment scheduling
- Doctor and department details
- Status tracking (scheduled, completed, cancelled)

### Chat Messages
- User-bot conversations
- Message history
- Timestamp tracking

### File Uploads
- Medical document storage
- File categorization
- Metadata tracking

## User Flow

1. **Sign Up/Login**: Users create an account or log in
2. **Profile Setup**: Complete profile with medical information
3. **Dashboard**: View health overview and quick actions
4. **Book Appointments**: Schedule medical appointments
5. **Chat with AI**: Get healthcare assistance
6. **Upload Files**: Store and manage medical documents
7. **Track Health**: Monitor appointments and health metrics

## Design Principles

- Clean, modern interface
- Professional healthcare aesthetic
- Responsive design for all devices
- Intuitive navigation
- Clear visual hierarchy
- Accessible UI components

## Production Ready

- TypeScript for type safety
- Error handling
- Loading states
- Form validation
- Responsive design
- Optimized build
- Security best practices
