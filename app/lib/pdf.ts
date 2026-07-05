import { jsPDF } from 'jspdf';
import { Invoice, Client } from './types';
import { getCompanyInfo, getClientById } from './storage';

export const generateInvoicePDF = (invoice: Invoice): void => {
  const client = getClientById(invoice.clientId);
  if (!client) {
    alert('Client not found');
    return;
  }

  const companyInfo = getCompanyInfo();

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 15;

  // Header
  doc.setFontSize(24);
  doc.setFont('', 'bold');
  doc.text('INVOICE', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 10;

  // Invoice details
  doc.setFontSize(10);
  doc.setFont('', 'normal');
  doc.text(`Invoice Number: ${invoice.invoiceNumber}`, 15, yPosition);
  yPosition += 5;
  doc.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, 15, yPosition);
  yPosition += 5;
  doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 15, yPosition);
  yPosition += 5;
  doc.text(`Status: ${invoice.status.toUpperCase()}`, 15, yPosition);

  yPosition += 10;

  // Company and Client info
  doc.setFont('', 'bold');
  doc.text('FROM:', 15, yPosition);
  yPosition += 5;
  doc.setFont('', 'normal');
  doc.text(companyInfo.name, 15, yPosition);
  yPosition += 4;
  doc.text(companyInfo.email, 15, yPosition);
  yPosition += 4;
  doc.text(companyInfo.phone, 15, yPosition);
  yPosition += 4;
  doc.text(companyInfo.address, 15, yPosition);
  yPosition += 4;
  doc.text(`${companyInfo.city}, ${companyInfo.state} ${companyInfo.zipCode}`, 15, yPosition);
  yPosition += 4;
  doc.text(companyInfo.country, 15, yPosition);

  yPosition += 8;

  // Client info
  doc.setFont('', 'bold');
  doc.text('BILL TO:', 15, yPosition);
  yPosition += 5;
  doc.setFont('', 'normal');
  doc.text(client.name, 15, yPosition);
  yPosition += 4;
  doc.text(client.email, 15, yPosition);
  yPosition += 4;
  doc.text(client.phone, 15, yPosition);
  yPosition += 4;
  doc.text(client.address, 15, yPosition);
  yPosition += 4;
  doc.text(`${client.city}, ${client.state} ${client.zipCode}`, 15, yPosition);
  yPosition += 4;
  doc.text(client.country, 15, yPosition);

  yPosition += 10;

  // Line items table header
  const tableTop = yPosition;
  doc.setFont('', 'bold');
  doc.setFillColor(230, 230, 230);
  doc.rect(15, tableTop, pageWidth - 30, 7, 'F');
  doc.text('Description', 20, tableTop + 5);
  doc.text('Qty', 120, tableTop + 5);
  doc.text('Rate', 145, tableTop + 5);
  doc.text('Amount', 170, tableTop + 5);

  yPosition = tableTop + 12;

  // Line items
  doc.setFont('', 'normal');
  invoice.items.forEach((item) => {
    const amount = item.quantity * item.rate;
    doc.text(item.description, 20, yPosition);
    doc.text(item.quantity.toString(), 120, yPosition);
    doc.text(`$${item.rate.toFixed(2)}`, 145, yPosition);
    doc.text(`$${amount.toFixed(2)}`, 170, yPosition);
    yPosition += 6;
  });

  yPosition += 5;

  // Calculations
  const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const discountAmount = (subtotal * invoice.discountRate) / 100;
  const discountedSubtotal = subtotal - discountAmount;
  const taxAmount = (discountedSubtotal * invoice.taxRate) / 100;
  const total = discountedSubtotal + taxAmount;

  doc.setFont('', 'normal');
  const rightX = 150;
  doc.text('Subtotal:', rightX, yPosition);
  doc.text(`$${subtotal.toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });

  if (invoice.discountRate > 0) {
    yPosition += 6;
    doc.text(`Discount (${invoice.discountRate}%):`, rightX, yPosition);
    doc.text(`-$${discountAmount.toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });
  }

  yPosition += 6;
  doc.text(`Tax (${invoice.taxRate}%):`, rightX, yPosition);
  doc.text(`$${taxAmount.toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });

  yPosition += 6;
  doc.setFont('', 'bold');
  doc.setFontSize(12);
  doc.text('TOTAL:', rightX, yPosition);
  doc.text(`$${total.toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });

  // Notes
  if (invoice.notes) {
    yPosition += 15;
    doc.setFont('', 'bold');
    doc.setFontSize(10);
    doc.text('Notes:', 15, yPosition);
    yPosition += 5;
    doc.setFont('', 'normal');
    const noteLines = doc.splitTextToSize(invoice.notes, pageWidth - 30);
    doc.text(noteLines, 15, yPosition);
  }

  // Save PDF
  const fileName = `${invoice.invoiceNumber}.pdf`;
  doc.save(fileName);
};
