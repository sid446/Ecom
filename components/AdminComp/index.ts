// index.ts - Export all components
export { default as AdminDashboard } from './AdminDashboard';
export { default as Sidebar } from './Sidebar';
export { default as Header } from './Header';
export { default as OverviewTab } from './OverviewTab';
export { default as ProductsTab } from './ProductsTab';
export { default as OrdersTab } from './OrdersTab';
export { default as UsersTab } from './UsersTab';
export { default as ProductModal } from './ProductModal';

// Export types and API
export * from './types';
export { api } from './api';

// Example usage:
// import { AdminDashboard, api, Product, Order, User } from './admin-dashboard';