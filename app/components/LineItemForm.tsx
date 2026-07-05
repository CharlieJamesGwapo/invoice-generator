'use client';

import { useState } from 'react';
import { LineItem } from '@/app/lib/types';

interface LineItemFormProps {
  onAdd: (item: LineItem) => void;
}

export const LineItemForm: React.FC<LineItemFormProps> = ({ onAdd }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [rate, setRate] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Description is required');
      return;
    }

    const item: LineItem = {
      id: Date.now().toString(),
      description,
      quantity,
      rate,
    };

    onAdd(item);
    setDescription('');
    setQuantity(1);
    setRate(0);
    setIsExpanded(false);
  };

  return (
    <div className="space-y-3">
      {!isExpanded ? (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
        >
          + Add Line Item
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
          <input
            type="text"
            placeholder="Description *"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            required
          />
          <div className="grid grid-cols-3 gap-3">
            <input
              type="number"
              placeholder="Quantity"
              min="0"
              step="0.01"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Rate"
              min="0"
              step="0.01"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                = ${(quantity * rate).toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors"
            >
              Add Item
            </button>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
