import React, { useState } from 'react';
import { Header } from './components/Header';
import { SalesOrderForm } from './components/SalesOrderForm';
import { PackingSlip } from './components/PackingSlip';
import { AppView, SalesOrder } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.SALES_ORDER);
  const [currentOrder, setCurrentOrder] = useState<SalesOrder | null>(null);

  const handleOrderSubmit = (order: SalesOrder) => {
    setCurrentOrder(order);
    setCurrentView(AppView.PACKING_SLIP);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-12">
      <Header 
        currentView={currentView} 
        setView={setCurrentView}
        hasOrder={!!currentOrder}
      />
      
      <main>
        {currentView === AppView.SALES_ORDER && (
          <SalesOrderForm 
            onSubmit={handleOrderSubmit}
            existingOrder={currentOrder}
          />
        )}
        
        {currentView === AppView.PACKING_SLIP && currentOrder && (
          <PackingSlip order={currentOrder} />
        )}
      </main>
    </div>
  );
};

export default App;