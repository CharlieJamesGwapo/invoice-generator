import { Invoice, Client, CompanyInfo, LineItem } from './types';

const INVOICES_KEY = 'invoices';
const CLIENTS_KEY = 'clients';
const COMPANY_INFO_KEY = 'companyInfo';
const INVOICE_COUNTER_KEY = 'invoiceCounter';

// Initialize default company info
const DEFAULT_COMPANY_INFO: CompanyInfo = {
  name: 'Your Company Name',
  email: 'info@yourcompany.com',
  phone: '+1 (555) 123-4567',
  address: '123 Business Street',
  city: 'Your City',
  state: 'State',
  zipCode: '12345',
  country: 'Country',
};

// Utility functions to ensure we're only running on client side
const isClient = () => typeof window !== 'undefined';

// Company Info
export const getCompanyInfo = (): CompanyInfo => {
  if (!isClient()) return DEFAULT_COMPANY_INFO;
  const stored = localStorage.getItem(COMPANY_INFO_KEY);
  return stored ? JSON.parse(stored) : DEFAULT_COMPANY_INFO;
};

export const updateCompanyInfo = (info: CompanyInfo): void => {
  if (!isClient()) return;
  localStorage.setItem(COMPANY_INFO_KEY, JSON.stringify(info));
};

// Invoice Counter
const getInvoiceCounter = (): number => {
  if (!isClient()) return 1000;
  const counter = localStorage.getItem(INVOICE_COUNTER_KEY);
  return counter ? parseInt(counter) : 1000;
};

const incrementInvoiceCounter = (): number => {
  if (!isClient()) return 1001;
  const counter = getInvoiceCounter();
  const newCounter = counter + 1;
  localStorage.setItem(INVOICE_COUNTER_KEY, newCounter.toString());
  return newCounter;
};

// Invoices
export const getAllInvoices = (): Invoice[] => {
  if (!isClient()) return [];
  const stored = localStorage.getItem(INVOICES_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getInvoiceById = (id: string): Invoice | null => {
  const invoices = getAllInvoices();
  return invoices.find((inv) => inv.id === id) || null;
};

export const createInvoice = (
  clientId: string,
  date: string,
  dueDate: string
): Invoice => {
  const invoiceNumber = `INV-${String(incrementInvoiceCounter()).padStart(5, '0')}`;
  const invoice: Invoice = {
    id: Date.now().toString(),
    invoiceNumber,
    clientId,
    date,
    dueDate,
    items: [],
    taxRate: 10,
    discountRate: 0,
    notes: '',
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (!isClient()) return invoice;

  const invoices = getAllInvoices();
  invoices.push(invoice);
  localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
  return invoice;
};

export const updateInvoice = (invoice: Invoice): void => {
  if (!isClient()) return;
  const invoices = getAllInvoices();
  const index = invoices.findIndex((inv) => inv.id === invoice.id);
  if (index !== -1) {
    invoices[index] = { ...invoice, updatedAt: new Date().toISOString() };
    localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
  }
};

export const deleteInvoice = (id: string): void => {
  if (!isClient()) return;
  const invoices = getAllInvoices();
  const filtered = invoices.filter((inv) => inv.id !== id);
  localStorage.setItem(INVOICES_KEY, JSON.stringify(filtered));
};

export const addLineItem = (invoiceId: string, item: LineItem): void => {
  const invoice = getInvoiceById(invoiceId);
  if (invoice) {
    invoice.items.push(item);
    updateInvoice(invoice);
  }
};

export const updateLineItem = (
  invoiceId: string,
  itemId: string,
  updates: Partial<LineItem>
): void => {
  const invoice = getInvoiceById(invoiceId);
  if (invoice) {
    const item = invoice.items.find((i) => i.id === itemId);
    if (item) {
      Object.assign(item, updates);
      updateInvoice(invoice);
    }
  }
};

export const deleteLineItem = (invoiceId: string, itemId: string): void => {
  const invoice = getInvoiceById(invoiceId);
  if (invoice) {
    invoice.items = invoice.items.filter((i) => i.id !== itemId);
    updateInvoice(invoice);
  }
};

// Clients
export const getAllClients = (): Client[] => {
  if (!isClient()) return [];
  const stored = localStorage.getItem(CLIENTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getClientById = (id: string): Client | null => {
  const clients = getAllClients();
  return clients.find((c) => c.id === id) || null;
};

export const createClient = (
  name: string,
  email: string,
  phone: string,
  address: string,
  city: string,
  state: string,
  zipCode: string,
  country: string
): Client => {
  const client: Client = {
    id: Date.now().toString(),
    name,
    email,
    phone,
    address,
    city,
    state,
    zipCode,
    country,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (!isClient()) return client;

  const clients = getAllClients();
  clients.push(client);
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
  return client;
};

export const updateClient = (client: Client): void => {
  if (!isClient()) return;
  const clients = getAllClients();
  const index = clients.findIndex((c) => c.id === client.id);
  if (index !== -1) {
    clients[index] = { ...client, updatedAt: new Date().toISOString() };
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
  }
};

export const deleteClient = (id: string): void => {
  if (!isClient()) return;
  const clients = getAllClients();
  const filtered = clients.filter((c) => c.id !== id);
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(filtered));
};
