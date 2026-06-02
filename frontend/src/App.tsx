import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './pages/Dashboard';
import './App.css';

interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  crowdLevel: number;
  temperature: number;
  timestamp: string;
}

const App: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLocations();
    const interval = setInterval(fetchLocations, 60000); // 每分鐘更新一次
    return () => clearInterval(interval);
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/locations`
      );
      setLocations(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching locations:', err);
      setError('無法取得位置數據');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-6 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold">🌡️ Smart Prediction</h1>
          <p className="text-blue-100 mt-2">逢甲大學 AI 熱區預測系統</p>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">加載中...</p>
          </div>
        ) : (
          <Dashboard locations={locations} onRefresh={fetchLocations} />
        )}
      </main>

      <footer className="bg-gray-100 text-gray-600 py-4 text-center mt-12">
        <p>© 2024 逢甲大學 Smart Prediction System</p>
      </footer>
    </div>
  );
};

export default App;