'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Invoice } from '@/app/lib/types';
import { getInvoiceById, deleteInvoice } from '@/app/lib/storage';
import { generateInvoicePDF } from '@/app/lib/pdf';
import { InvoiceForm } from '@/app/components/InvoiceForm';
import { InvoicePreview } from '@/app/components/InvoicePreview';
import { DarkModeToggle } from '@/app/components/DarkModeToggle';

export default function InvoicePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [view, setView] = useState<'edit' | 'preview'>('preview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const inv = getInvoiceById(id);
    setInvoice(inv);
    setIsLoading(false);
  }, [id]);

  const handleSave = (updatedInvoice: Invoice) => {
    setInvoice(updatedInvoice);
    setView('preview');
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
      deleteInvoice(id);
      router.push('/');
    }
  };

  const handleDownloadPDF = () => {
    if (invoice) {
      generateInvoicePDF(invoice);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <header className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invoice Generator</h1>
              <DarkModeToggle />
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-red-600 dark:text-red-400">Invoice not found</p>
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline mt-4">
            ← Back to Invoices
          </Link>
        </main>
      </div>
    );
  }

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
        <div className="mb-8 flex justify-between items-center">
          <Link
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to Invoices
          </Link>
          <div className="flex gap-2">
            <button
              onClick={() => setView(view === 'edit' ? 'preview' : 'edit')}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              {view === 'edit' ? 'View Preview' : 'Edit Invoice'}
            </button>
            <button
              onClick={handleDownloadPDF}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Download PDF
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        {view === 'edit' ? (
          <InvoiceForm invoice={invoice} onSave={handleSave} />
        ) : (
          <InvoicePreview invoice={invoice} />
        )}
      </main>
    </div>
  );
}
