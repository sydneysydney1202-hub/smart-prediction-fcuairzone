import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LocationCard from '../components/LocationCard';
import PredictionChart from '../components/PredictionChart';
import AddLocationForm from '../components/AddLocationForm';
import SubmitStatusForm from '../components/SubmitStatusForm';

interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  crowdLevel: number;
  temperature: number;
  timestamp: string;
}

interface Props {
  locations: Location[];
  onRefresh: () => void;
}

const Dashboard: React.FC<Props> = ({ locations, onRefresh }) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    locations[0] || null
  );
  const [predictions, setPredictions] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  useEffect(() => {
    if (selectedLocation) {
      fetchPredictions(selectedLocation.id);
    }
  }, [selectedLocation]);

  const fetchPredictions = async (locationId: string) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/predictions/${locationId}`
      );
      setPredictions(response.data);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* 控制面板 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
        >
          ➕ 新增地點
        </button>
        <button
          onClick={() => setShowSubmitForm(!showSubmitForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          📝 提交狀態
        </button>
        <button
          onClick={onRefresh}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
        >
          🔄 刷新數據
        </button>
      </div>

      {/* 新增地點表單 */}
      {showAddForm && (
        <AddLocationForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            onRefresh();
          }}
        />
      )}

      {/* 提交狀態表單 */}
      {showSubmitForm && (
        <SubmitStatusForm
          locations={locations}
          onClose={() => setShowSubmitForm(false)}
          onSuccess={() => {
            setShowSubmitForm(false);
            onRefresh();
          }}
        />
      )}

      {/* 地點卡片網格 */}
      <div>
        <h2 className="text-2xl font-bold mb-4">📍 校園熱區實況</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((location) => (
            <div
              key={location.id}
              onClick={() => setSelectedLocation(location)}
              className={`cursor-pointer transition transform hover:scale-105 ${
                selectedLocation?.id === location.id ? 'ring-2 ring-blue-600' : ''
              }`}
            >
              <LocationCard location={location} />
            </div>
          ))}
        </div>
      </div>

      {/* 預測圖表 */}
      {selectedLocation && (
        <div>
          <h2 className="text-2xl font-bold mb-4">
            📊 {selectedLocation.name} 未來1小時預測
          </h2>
          <PredictionChart
            locationName={selectedLocation.name}
            predictions={predictions}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;