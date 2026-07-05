'use client';

import { Invoice } from '@/app/lib/types';
import { calculateSubtotal, calculateDiscount, calculateTax, calculateTotal, formatCurrency } from '@/app/lib/calculations';
import { getClientById, getCompanyInfo } from '@/app/lib/storage';

interface InvoicePreviewProps {
  invoice: Invoice;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice }) => {
  const client = getClientById(invoice.clientId);
  const companyInfo = getCompanyInfo();

  if (!client) {
    return <div className="text-red-600 dark:text-red-400">Client not found</div>;
  }

  const subtotal = calculateSubtotal(invoice);
  const discount = calculateDiscount(invoice);
  const tax = calculateTax(invoice);
  const total = calculateTotal(invoice);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-4xl">
      {/* Header */}
      <div className="border-b-2 border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">INVOICE</h1>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">Invoice Number</p>
            <p className="text-gray-900 dark:text-white font-semibold">{invoice.invoiceNumber}</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">Invoice Date</p>
            <p className="text-gray-900 dark:text-white">{new Date(invoice.date).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">Due Date</p>
            <p className="text-gray-900 dark:text-white">{new Date(invoice.dueDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Company and Client Info */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase mb-3">From</h3>
          <p className="font-semibold text-gray-900 dark:text-white">{companyInfo.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{companyInfo.email}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{companyInfo.phone}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{companyInfo.address}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {companyInfo.city}, {companyInfo.state} {companyInfo.zipCode}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{companyInfo.country}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase mb-3">Bill To</h3>
          <p className="font-semibold text-gray-900 dark:text-white">{client.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{client.email}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{client.phone}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{client.address}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {client.city}, {client.state} {client.zipCode}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{client.country}</p>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="mb-8 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-300 dark:border-gray-600">
              <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Description</th>
              <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold w-24">Qty</th>
              <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold w-32">Rate</th>
              <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold w-32">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-3 px-4 text-gray-900 dark:text-gray-200">{item.description}</td>
                <td className="text-right py-3 px-4 text-gray-900 dark:text-gray-200">{item.quantity}</td>
                <td className="text-right py-3 px-4 text-gray-900 dark:text-gray-200">{formatCurrency(item.rate)}</td>
                <td className="text-right py-3 px-4 text-gray-900 dark:text-gray-200">
                  {formatCurrency(item.quantity * item.rate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64 space-y-2">
          <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-700 dark:text-gray-300">Subtotal:</span>
            <span className="text-gray-900 dark:text-white font-medium">{formatCurrency(subtotal)}</span>
          </div>
          {invoice.discountRate > 0 && (
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-700 dark:text-gray-300">Discount ({invoice.discountRate}%):</span>
              <span className="text-gray-900 dark:text-white font-medium">-{formatCurrency(discount)}</span>
            </div>
          )}
          <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-700 dark:text-gray-300">Tax ({invoice.taxRate}%):</span>
            <span className="text-gray-900 dark:text-white font-medium">{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between py-3 bg-gray-100 dark:bg-gray-700 px-4 rounded-lg">
            <span className="font-bold text-gray-900 dark:text-white">Total:</span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Notes</h3>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{invoice.notes}</p>
        </div>
      )}

      {/* Status Badge */}
      <div className="mt-6 flex items-center gap-4">
        <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
        <span
          className={`px-4 py-2 rounded-full font-semibold text-sm uppercase ${
            invoice.status === 'draft'
              ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
              : invoice.status === 'sent'
              ? 'bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
              : invoice.status === 'paid'
              ? 'bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-200'
              : 'bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200'
          }`}
        >
          {invoice.status}
        </span>
      </div>
    </div>
  );
};
