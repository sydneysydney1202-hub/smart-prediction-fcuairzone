import React from 'react';

interface Location {
  id: string;
  name: string;
  crowdLevel: number;
  temperature: number;
  timestamp: string;
}

const LocationCard: React.FC<{ location: Location }> = ({ location }) => {
  const getCrowdColor = (level: number) => {
    if (level < 30) return 'bg-green-100 text-green-800';
    if (level < 60) return 'bg-yellow-100 text-yellow-800';
    if (level < 80) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getCrowdLabel = (level: number) => {
    if (level < 30) return '低人潮 ✅';
    if (level < 60) return '中等人潮 ⚠️';
    if (level < 80) return '高人潮 🔴';
    return '超高人潮 🚨';
  };

  const getTemperatureStatus = (temp: number) => {
    if (temp < 20) return '🧊 冷';
    if (temp < 25) return '😊 舒適';
    if (temp < 30) return '🔥 熱';
    return '🌡️ 非常熱';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <h3 className="text-xl font-bold mb-4">{location.name}</h3>

      <div className="space-y-3">
        {/* 人潮指數 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 font-semibold">👥 人潮指數</span>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${getCrowdColor(location.crowdLevel)}`}>
              {location.crowdLevel}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-2 rounded-full transition-all"
              style={{ width: `${location.crowdLevel}%` }}
            ></div>
          </div>
          <p className={`text-sm mt-1 font-semibold ${getCrowdColor(location.crowdLevel)}`}>
            {getCrowdLabel(location.crowdLevel)}
          </p>
        </div>

        {/* 溫度 */}
        <div className="bg-blue-50 rounded p-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">🌡️ 溫度</span>
            <span className="text-2xl font-bold text-blue-600">
              {location.temperature}°C {getTemperatureStatus(location.temperature)}
            </span>
          </div>
        </div>

        {/* 更新時間 */}
        <p className="text-xs text-gray-500">
          最後更新: {new Date(location.timestamp).toLocaleTimeString('zh-TW')}
        </p>
      </div>
    </div>
  );
};

export default LocationCard;