import React, { useState } from 'react';
import axios from 'axios';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const AddLocationForm: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/locations`,
        formData
      );
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || '新增失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">➕ 新增地點</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              地點名稱
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="例: 圖書館東側"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                緯度
              </label>
              <input
                type="number"
                step="0.00001"
                value={formData.latitude}
                onChange={(e) =>
                  setFormData({ ...formData, latitude: e.target.value })
                }
                placeholder="24.1801"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                經度
              </label>
              <input
                type="number"
                step="0.00001"
                value={formData.longitude}
                onChange={(e) =>
                  setFormData({ ...formData, longitude: e.target.value })
                }
                placeholder="120.6484"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
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
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded transition disabled:opacity-50"
            >
              {loading ? '新增中...' : '確認新增'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLocationForm;