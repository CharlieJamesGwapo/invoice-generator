'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createInvoice } from '@/app/lib/storage';
import { InvoiceForm } from '@/app/components/InvoiceForm';
import { DarkModeToggle } from '@/app/components/DarkModeToggle';
import { Invoice } from '@/app/lib/types';

export default function CreatePage() {
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];
  const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const handleCreateInvoice = () => {
    const invoice = createInvoice('', today, dueDate);
    router.push(`/invoices/${invoice.id}`);
  };

  const invoice = createInvoice('', today, dueDate);

  const handleSave = (updatedInvoice: Invoice) => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invoice Generator</h1>
            <DarkModeToggle />
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <Link
              href="/"
              className="py-4 px-1 border-b-2 border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600 font-medium"
            >
              Invoices
            </Link>
            <Link
              href="/clients"
              className="py-4 px-1 border-b-2 border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600 font-medium"
            >
              Clients
            </Link>
            <Link
              href="/settings"
              className="py-4 px-1 border-b-2 border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600 font-medium"
            >
              Settings
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to Invoices
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create New Invoice</h2>

        <InvoiceForm invoice={invoice} onSave={handleSave} />
      </main>
    </div>
  );
}
