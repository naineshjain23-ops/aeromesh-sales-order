import React from 'react';
import { AppView } from '../types';

interface HeaderProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  hasOrder: boolean;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setView, hasOrder }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 print:hidden shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold">
            A
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 leading-none">Aeromesh</h1>
            <p className="text-xs text-slate-500 font-medium tracking-wide">NETTING SOLUTIONS</p>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <button
            onClick={() => setView(AppView.SALES_ORDER)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentView === AppView.SALES_ORDER
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Sales Order
          </button>
          
          <div className="h-4 w-px bg-slate-300 mx-1"></div>

          <button
            onClick={() => setView(AppView.PACKING_SLIP)}
            disabled={!hasOrder}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              currentView === AppView.PACKING_SLIP
                ? 'bg-blue-50 text-blue-700'
                : !hasOrder 
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Packing Slip
            {!hasOrder && <i className="fas fa-lock text-xs"></i>}
          </button>
        </nav>
      </div>
    </header>
  );
};