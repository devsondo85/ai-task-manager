import { useState, useEffect, useMemo } from 'react';
import { tasksAPI } from '../services/api';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const AnalyticsDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tasksAPI.getAll();
      setTasks(response.tasks || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const statistics = useMemo(() => {
    const total = tasks.length;
    const byStatus = {
      todo: tasks.filter((t) => t.status === 'todo').length,
      in_progress: tasks.filter((t) => t.status === 'in_progress').length,
      done: tasks.filter((t) => t.status === 'done').length,
    };
    const byPriority = {
      high: tasks.filter((t) => t.priority === 'high').length,
      medium: tasks.filter((t) => t.priority === 'medium').length,
      low: tasks.filter((t) => t.priority === 'low').length,
    };
    const completionRate = total > 0 ? ((byStatus.done / total) * 100).toFixed(1) : 0;
    const overdue = tasks.filter((t) => {
      if (!t.due_date) return false;
      return new Date(t.due_date) < new Date() && t.status !== 'done';
    }).length;
    const totalEstimatedTime = tasks.reduce((sum, t) => sum + (t.estimated_time || 0), 0);
    const completedEstimatedTime = tasks
      .filter((t) => t.status === 'done')
      .reduce((sum, t) => sum + (t.estimated_time || 0), 0);

    return {
      total,
      byStatus,
      byPriority,
      completionRate,
      overdue,
      totalEstimatedTime,
      completedEstimatedTime,
    };
  }, [tasks]);

  // Prepare chart data
  const statusChartData = [
    { name: 'To Do', value: statistics.byStatus.todo, color: '#94a3b8' },
    { name: 'In Progress', value: statistics.byStatus.in_progress, color: '#3b82f6' },
    { name: 'Done', value: statistics.byStatus.done, color: '#10b981' },
  ];

  const priorityChartData = [
    { name: 'High', value: statistics.byPriority.high, color: '#ef4444' },
    { name: 'Medium', value: statistics.byPriority.medium, color: '#f59e0b' },
    { name: 'Low', value: statistics.byPriority.low, color: '#10b981' },
  ];

  const statusBarData = [
    { name: 'To Do', tasks: statistics.byStatus.todo },
    { name: 'In Progress', tasks: statistics.byStatus.in_progress },
    { name: 'Done', tasks: statistics.byStatus.done },
  ];

  const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <button onClick={fetchTasks} className="btn btn-primary mt-2">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Analytics Dashboard</h2>
        <button onClick={fetchTasks} className="btn btn-secondary text-sm">
          Refresh
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Total Tasks</div>
          <div className="text-3xl font-bold text-gray-900">{statistics.total}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Completion Rate</div>
          <div className="text-3xl font-bold text-primary-600">{statistics.completionRate}%</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Overdue Tasks</div>
          <div className="text-3xl font-bold text-red-600">{statistics.overdue}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600 mb-1">Total Estimated Time</div>
          <div className="text-3xl font-bold text-gray-900">
            {Math.floor(statistics.totalEstimatedTime / 60)}h {statistics.totalEstimatedTime % 60}m
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution - Pie Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tasks by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Distribution - Pie Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tasks by Priority</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {priorityChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Bar Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Task Status Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusBarData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="tasks" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Task Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">To Do</span>
              <span className="font-semibold text-gray-900">{statistics.byStatus.todo}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">In Progress</span>
              <span className="font-semibold text-gray-900">{statistics.byStatus.in_progress}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Done</span>
              <span className="font-semibold text-green-600">{statistics.byStatus.done}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Time Insights</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Estimated</span>
              <span className="font-semibold text-gray-900">
                {Math.floor(statistics.totalEstimatedTime / 60)}h {statistics.totalEstimatedTime % 60}m
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completed Time</span>
              <span className="font-semibold text-green-600">
                {Math.floor(statistics.completedEstimatedTime / 60)}h {statistics.completedEstimatedTime % 60}m
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Remaining Time</span>
              <span className="font-semibold text-gray-900">
                {Math.floor((statistics.totalEstimatedTime - statistics.completedEstimatedTime) / 60)}h{' '}
                {(statistics.totalEstimatedTime - statistics.completedEstimatedTime) % 60}m
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

