'use client';

import { useState, useEffect } from 'react';
import { Client } from '@/app/lib/types';
import { getAllClients, createClient } from '@/app/lib/storage';

interface ClientSelectProps {
  value: string;
  onChange: (clientId: string) => void;
}

export const ClientSelect: React.FC<ClientSelectProps> = ({ value, onChange }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  useEffect(() => {
    setClients(getAllClients());
  }, []);

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Name and email are required');
      return;
    }

    const newClient = createClient(
      formData.name,
      formData.email,
      formData.phone,
      formData.address,
      formData.city,
      formData.state,
      formData.zipCode,
      formData.country
    );

    setClients([...clients, newClient]);
    onChange(newClient.id);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    });
    setIsCreating(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof formData
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Client
        </label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Choose a client...</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={() => setIsCreating(!isCreating)}
        className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
      >
        {isCreating ? '✕ Cancel' : '+ Create New Client'}
      </button>

      {isCreating && (
        <form onSubmit={handleCreateClient} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Client Name *"
              value={formData.name}
              onChange={(e) => handleInputChange(e, 'name')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              placeholder="Email *"
              value={formData.email}
              onChange={(e) => handleInputChange(e, 'email')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => handleInputChange(e, 'phone')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={(e) => handleInputChange(e, 'address')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="City"
              value={formData.city}
              onChange={(e) => handleInputChange(e, 'city')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="State"
              value={formData.state}
              onChange={(e) => handleInputChange(e, 'state')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Zip Code"
              value={formData.zipCode}
              onChange={(e) => handleInputChange(e, 'zipCode')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Country"
              value={formData.country}
              onChange={(e) => handleInputChange(e, 'country')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
          >
            Create Client
          </button>
        </form>
      )}
    </div>
  );
};
