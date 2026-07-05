'use client';

import { useState, useEffect } from 'react';
import { Invoice, LineItem } from '@/app/lib/types';
import { ClientSelect } from './ClientSelect';
import { LineItemForm } from './LineItemForm';
import { updateInvoice, deleteLineItem, addLineItem } from '@/app/lib/storage';

interface InvoiceFormProps {
  invoice: Invoice;
  onSave: (invoice: Invoice) => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice, onSave }) => {
  const [formData, setFormData] = useState(invoice);
  const [items, setItems] = useState(invoice.items);

  useEffect(() => {
    setFormData(invoice);
    setItems(invoice.items);
  }, [invoice]);

  const handleBasicChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddItem = (item: LineItem) => {
    setItems((prev) => [...prev, item]);
    addLineItem(invoice.id, item);
  };

  const handleDeleteItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    deleteLineItem(invoice.id, itemId);
  };

  const handleSave = () => {
    const updated = {
      ...formData,
      items,
    };
    updateInvoice(updated);
    onSave(updated);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
      {/* Client Selection */}
      <ClientSelect value={formData.clientId} onChange={(clientId) => handleBasicChange('clientId', clientId)} />

      {/* Invoice Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Invoice Number
          </label>
          <input
            type="text"
            value={formData.invoiceNumber}
            disabled
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => handleBasicChange('status', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Invoice Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleBasicChange('date', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Due Date</label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleBasicChange('dueDate', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tax and Discount */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tax Rate (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={formData.taxRate}
            onChange={(e) => handleBasicChange('taxRate', parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Discount (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={formData.discountRate}
            onChange={(e) => handleBasicChange('discountRate', parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleBasicChange('notes', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 h-24 resize-none"
          placeholder="Add any additional notes or payment instructions..."
        />
      </div>

      {/* Line Items */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Line Items</h3>

        {items.length > 0 && (
          <div className="mb-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-600">
                  <th className="text-left py-2 px-3 text-gray-700 dark:text-gray-300 font-semibold">Description</th>
                  <th className="text-right py-2 px-3 text-gray-700 dark:text-gray-300 font-semibold w-20">Qty</th>
                  <th className="text-right py-2 px-3 text-gray-700 dark:text-gray-300 font-semibold w-24">Rate</th>
                  <th className="text-right py-2 px-3 text-gray-700 dark:text-gray-300 font-semibold w-24">Amount</th>
                  <th className="text-center py-2 px-3 text-gray-700 dark:text-gray-300 font-semibold w-16">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-2 px-3 text-gray-900 dark:text-gray-200">{item.description}</td>
                    <td className="text-right py-2 px-3 text-gray-900 dark:text-gray-200">{item.quantity}</td>
                    <td className="text-right py-2 px-3 text-gray-900 dark:text-gray-200">${item.rate.toFixed(2)}</td>
                    <td className="text-right py-2 px-3 text-gray-900 dark:text-gray-200">
                      ${(item.quantity * item.rate).toFixed(2)}
                    </td>
                    <td className="text-center py-2 px-3">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <LineItemForm onAdd={handleAddItem} />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
      >
        Save Invoice
      </button>
    </div>
  );
};
