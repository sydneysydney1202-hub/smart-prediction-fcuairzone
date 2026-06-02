import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Prediction {
  time: string;
  crowdPrediction: number;
  temperaturePrediction: number;
  alert?: string;
}

interface Props {
  locationName: string;
  predictions: Prediction[];
}

const PredictionChart: React.FC<Props> = ({ locationName, predictions }) => {
  if (predictions.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800">暫無預測數據，請稍候...</p>
      </div>
    );
  }

  // 檢測警報
  const alerts = predictions.filter((p) => p.alert);

  return (
    <div className="space-y-6">
      {/* 警報區 */}
      {alerts.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <h4 className="font-bold text-red-700 mb-2">🚨 預測提示</h4>
          <ul className="space-y-1">
            {alerts.map((alert, idx) => (
              <li key={idx} className="text-red-600 text-sm">
                • {alert.alert}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 圖表 */}
      <div className="bg-white rounded-lg shadow p-4">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={predictions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis yAxisId="left" label={{ value: '人潮指數 (%)', angle: -90, position: 'insideLeft' }} />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: '溫度 (°C)', angle: 90, position: 'insideRight' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="crowdPrediction"
              stroke="#3b82f6"
              name="人潮預測"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="temperaturePrediction"
              stroke="#ef4444"
              name="溫度預測"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 數據表 */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">時間</th>
              <th className="border p-2 text-right">人潮預測</th>
              <th className="border p-2 text-right">溫度預測</th>
            </tr>
          </thead>
          <tbody>
            {predictions.map((pred, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border p-2">{pred.time}</td>
                <td className="border p-2 text-right font-semibold">{pred.crowdPrediction}%</td>
                <td className="border p-2 text-right font-semibold">{pred.temperaturePrediction}°C</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PredictionChart;