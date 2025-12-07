import React, { useState, useEffect } from 'react';
import { SalesOrder, ProductItem } from '../types';

interface SalesOrderFormProps {
  onSubmit: (order: SalesOrder) => void;
  existingOrder: SalesOrder | null;
}

export const SalesOrderForm: React.FC<SalesOrderFormProps> = ({ onSubmit, existingOrder }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [orderId, setOrderId] = useState('');
  const [products, setProducts] = useState<ProductItem[]>([]);
  
  // Initialize with dummy data or existing order
  useEffect(() => {
    if (existingOrder) {
      setCustomerName(existingOrder.customerName);
      setCustomerAddress(existingOrder.customerAddress);
      setGstNumber(existingOrder.gstNumber || '');
      setOrderId(existingOrder.orderId);
      setProducts(existingOrder.products);
    } else {
      // Set a default Order ID
      setOrderId(`SO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
    }
  }, [existingOrder]);

  const addProduct = () => {
    const newProduct: ProductItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      variant: '',
      quantity: 1
    };
    setProducts([...products, newProduct]);
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const updateProduct = (id: string, field: keyof ProductItem, value: string | number) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (products.length === 0) {
      alert("Please add at least one product.");
      return;
    }
    onSubmit({
      orderId,
      customerName,
      gstNumber,
      customerAddress,
      orderDate: new Date().toISOString().split('T')[0],
      products
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Create Sales Order</h2>
        <p className="text-slate-500">Enter order details to generate a packing slip.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Details Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
            <h3 className="font-semibold text-slate-700">Customer Information</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Order ID</label>
              <input
                type="text"
                required
                value={orderId}
                onChange={e => setOrderId(e.target.value)}
                className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="SO-2024-001"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">GST Number</label>
              <input
                type="text"
                value={gstNumber}
                onChange={e => setGstNumber(e.target.value)}
                className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="e.g. 29ABCDE1234F1Z5"
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter client name"
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Billing/Shipping Address</label>
              <textarea
                rows={3}
                required
                value={customerAddress}
                onChange={e => setCustomerAddress(e.target.value)}
                className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter full address"
              />
            </div>
          </div>
        </div>

        {/* Products Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-semibold text-slate-700">Order Items</h3>
            <button
              type="button"
              onClick={addProduct}
              className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
            >
              <i className="fas fa-plus"></i> Add Item
            </button>
          </div>
          <div className="p-6">
            {products.length === 0 ? (
              <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                <i className="fas fa-box-open text-3xl mb-2"></i>
                <p>No items added yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product, index) => (
                  <div key={product.id} className="flex flex-col md:flex-row gap-4 items-end p-4 bg-slate-50 rounded-lg border border-slate-200 relative group">
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Product Name</label>
                      <input
                        type="text"
                        required
                        value={product.name}
                        onChange={e => updateProduct(product.id, 'name', e.target.value)}
                        placeholder="e.g. Anti-Bird Net"
                        className="w-full rounded-md border-slate-300 border px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Variant / Color</label>
                      <input
                        type="text"
                        required
                        value={product.variant}
                        onChange={e => updateProduct(product.id, 'variant', e.target.value)}
                        placeholder="e.g. Green, 25mm"
                        className="w-full rounded-md border-slate-300 border px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="w-full md:w-32">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Quantity (Rolls)</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={product.quantity}
                        onChange={e => updateProduct(product.id, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-full rounded-md border-slate-300 border px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProduct(product.id)}
                      className="text-red-400 hover:text-red-600 p-2 md:mb-1 transition-colors"
                      title="Remove Item"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                    
                    <div className="absolute top-2 left-2 text-[10px] font-bold text-slate-300">
                      #{index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg shadow-md transition-all transform hover:scale-[1.02] flex items-center gap-2"
          >
            <span>Generate Packing Slip</span>
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </form>
    </div>
  );
};