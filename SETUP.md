# AI Task Manager - Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- OpenAI API key

## Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the `backend` directory:
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

4. Set up Supabase database:
   - Create a new Supabase project
   - Run the SQL schema from `backend/database/schema.sql` in your Supabase SQL editor

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

## Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### AI Features
- `POST /api/ai/breakdown` - Generate task breakdown
- `POST /api/ai/priority` - Get priority suggestion
- `POST /api/ai/time-estimate` - Get time estimation
- `POST /api/ai/suggestions` - Get all AI suggestions

## Troubleshooting

1. **Backend won't start**: Check that all environment variables are set in `.env`
2. **Database connection error**: Verify Supabase URL and keys are correct
3. **Frontend can't connect to backend**: Ensure backend is running on port 5000
4. **AI features not working**: Check that OPENAI_API_KEY is set correctly

