import { Routes, Route, Link, useLocation } from 'react-router-dom';
import TaskList from './components/TaskList';
import KanbanBoard from './components/KanbanBoard';
import AnalyticsDashboard from './components/AnalyticsDashboard';

function App() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              AI Task Manager
            </h1>
            <nav className="flex gap-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Kanban
              </Link>
              <Link
                to="/list"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/list')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                List
              </Link>
              <Link
                to="/analytics"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/analytics')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Analytics
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route 
            path="/" 
            element={<KanbanBoard />} 
          />
          <Route 
            path="/list" 
            element={<TaskList />} 
          />
          <Route 
            path="/analytics" 
            element={<AnalyticsDashboard />} 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;

