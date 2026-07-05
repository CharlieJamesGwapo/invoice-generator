import { Invoice } from './types';

export const calculateSubtotal = (invoice: Invoice): number => {
  return invoice.items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
};

export const calculateDiscount = (invoice: Invoice): number => {
  const subtotal = calculateSubtotal(invoice);
  return (subtotal * invoice.discountRate) / 100;
};

export const calculateTax = (invoice: Invoice): number => {
  const subtotal = calculateSubtotal(invoice);
  const discount = calculateDiscount(invoice);
  const discountedSubtotal = subtotal - discount;
  return (discountedSubtotal * invoice.taxRate) / 100;
};

export const calculateTotal = (invoice: Invoice): number => {
  const subtotal = calculateSubtotal(invoice);
  const discount = calculateDiscount(invoice);
  const tax = calculateTax(invoice);
  return subtotal - discount + tax;
};

export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};
