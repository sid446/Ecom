// File: components/admin/AdminDashboard.tsx
'use client'

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import OverviewTab from './OverviewTab';
import ProductsTab from './ProductsTab';
import OrdersTab from './OrdersTab';
import UsersTab from './UsersTab';
import CarouselTab from './CarouselTab';
import ReturnsTab from './ReturnsTab'; // Import the new ReturnsTab
import ProductModal from './ProductModal';
import { Product, Order, User } from './types';
import { api } from './api';
import { useProducts } from '@/context/ProductContext';

const AdminDashboard = () => {
    const { products, loading, refetchProducts } = useProducts();
    
    const [activeTab, setActiveTab] = useState('overview');
    const [orders, setOrders] = useState<Order[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [showProductModal, setShowProductModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const loadNonProductData = async () => {
        try {
            if (activeTab === 'overview' || activeTab === 'orders') {
                const ordersData = await api.getOrders();
                setOrders(ordersData);
            }
            if (activeTab === 'overview' || activeTab === 'users') {
                try {
                    const usersData = await api.getUsers();
                    setUsers(usersData);
                } catch (error) {
                    console.log('Users endpoint not available yet');
                }
            }
        } catch (error) {
            console.error('Error loading non-product data:', error);
        }
    };

    useEffect(() => {
        loadNonProductData();
    }, [activeTab]);

    const handleProductEdit = (product: Product) => {
        setEditingProduct(product);
        setShowProductModal(true);
    };

    const handleProductCreate = () => {
        setEditingProduct(null);
        setShowProductModal(true);
    };

    const handleProductModalClose = () => {
        setShowProductModal(false);
        setEditingProduct(null);
    };

    const handleProductSaveOrDelete = () => {
        refetchProducts();
    };

    const renderContent = () => {
        if (loading && activeTab === 'products') {
            return (
                <div className="flex items-center justify-center h-96">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-gray-600 rounded-full animate-pulse"></div>
                        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                </div>
            );
        }

        switch (activeTab) {
            case 'overview':
                return <OverviewTab products={products} orders={orders} users={users} />;
            case 'products':
                return (
                    <ProductsTab
                        products={products}
                        onProductUpdate={handleProductSaveOrDelete}
                        onEditProduct={handleProductEdit}
                        onCreateProduct={handleProductCreate}
                    />
                );
            case 'orders':
                return <OrdersTab orders={orders} onOrderUpdate={loadNonProductData} />;
            case 'users':
                return <UsersTab users={users} orders={orders} />;
            case 'carousel':
                return <CarouselTab />;
            case 'returns': // Add the new returns case
                return <ReturnsTab />;
            default:
                return <OverviewTab products={products} orders={orders} users={users} />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />
            <Header activeTab={activeTab} sidebarOpen={sidebarOpen} />
            
            {/* Main Content */}
            <main className={`transition-all duration-300 pt-20 ${sidebarOpen ? 'ml-72' : 'ml-20'} p-8`}>
                {renderContent()}
            </main>

            {/* Product Modal */}
            <ProductModal
                isOpen={showProductModal}
                onClose={handleProductModalClose}
                editingProduct={editingProduct}
                onSave={handleProductSaveOrDelete}
            />
        </div>
    );
};

export default AdminDashboard;