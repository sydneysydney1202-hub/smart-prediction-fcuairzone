import React, { useState } from 'react';
import axios from 'axios';

interface Location {
  id: string;
  name: string;
}

interface Props {
  locations: Location[];
  onClose: () => void;
  onSuccess: () => void;
}

const SubmitStatusForm: React.FC<Props> = ({ locations, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    locationId: locations[0]?.id || '',
    crowdLevel: 50,
    temperature: 25,
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/submissions`,
        formData
      );
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || '提交失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">📝 提交地點狀態</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              選擇地點
            </label>
            <select
              value={formData.locationId}
              onChange={(e) =>
                setFormData({ ...formData, locationId: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              required
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              人潮指數: {formData.crowdLevel}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.crowdLevel}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  crowdLevel: parseInt(e.target.value),
                })
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>低 (0)</span>
              <span>中 (50)</span>
              <span>高 (100)</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              溫度: {formData.temperature}°C
            </label>
            <input
              type="range"
              min="15"
              max="40"
              step="0.5"
              value={formData.temperature}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  temperature: parseFloat(e.target.value),
                })
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              備註 (可選)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="例: 樓梯擁擠，空調故障..."
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 resize-none"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 rounded transition"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition disabled:opacity-50"
            >
              {loading ? '提交中...' : '確認提交'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitStatusForm;