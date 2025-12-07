import React, { useState, useEffect, useRef } from 'react';
import { SalesOrder, RollEntry } from '../types';
import { generateDispatchEmail } from '../services/geminiService';
import { generatePackingSlipExcel } from '../services/excelService';

interface PackingSlipProps {
  order: SalesOrder;
}

export const PackingSlip: React.FC<PackingSlipProps> = ({ order }) => {
  const [rollEntries, setRollEntries] = useState<RollEntry[]>([]);
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState('');
  
  // Ref for the email dialog
  const emailDialogRef = useRef<HTMLDialogElement>(null);

  // Initialize roll entries based on order quantities
  useEffect(() => {
    const entries: RollEntry[] = [];
    
    order.products.forEach(product => {
      for (let i = 1; i <= product.quantity; i++) {
        entries.push({
          productId: product.id,
          productName: product.name,
          variant: product.variant,
          rollNumber: i,
          weight: ''
        });
      }
    });
    
    setRollEntries(entries);
  }, [order]);

  const handleWeightChange = (index: number, value: string) => {
    const newEntries = [...rollEntries];
    newEntries[index].weight = value;
    setRollEntries(newEntries);
  };

  const calculateTotalWeight = () => {
    return rollEntries.reduce((acc, curr) => {
      return acc + (parseFloat(curr.weight) || 0);
    }, 0).toFixed(2);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    generatePackingSlipExcel(order, rollEntries);
  };

  const handleGenerateEmail = async () => {
    setIsGeneratingEmail(true);
    const email = await generateDispatchEmail(order, rollEntries);
    setGeneratedEmail(email);
    setIsGeneratingEmail(false);
    emailDialogRef.current?.showModal();
  };

  // Group entries by product for better visual layout on the packing slip
  const groupedEntries = order.products.map(product => {
    return {
      product,
      entries: rollEntries.filter(r => r.productId === product.id)
    };
  });

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Actions Bar (No Print) */}
      <div className="no-print flex flex-col md:flex-row justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200 gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Packing Slip Mode</h2>
          <p className="text-sm text-slate-500">Enter weights for each roll below.</p>
        </div>
        <div className="flex gap-3 flex-wrap justify-end">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-medium transition-colors border border-green-200"
          >
            <i className="fas fa-file-excel"></i> Export Excel
          </button>
          <button
            onClick={handleGenerateEmail}
            className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg font-medium transition-colors border border-purple-200"
          >
            <i className="fas fa-magic"></i> AI Email
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white hover:bg-slate-900 rounded-lg font-medium transition-colors"
          >
            <i className="fas fa-print"></i> Print Slip
          </button>
        </div>
      </div>

      {/* The Printable Packing Slip */}
      <div className="bg-white shadow-lg print:shadow-none p-8 md:p-12 min-h-[1000px] relative print:p-0">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 uppercase tracking-wider mb-2">Packing Slip</h1>
            <p className="text-slate-500 font-medium">Aeromesh Netting Solutions</p>
            <p className="text-slate-400 text-sm mt-1">Industrial & Commercial Netting</p>
          </div>
          <div className="text-right">
            <div className="inline-block bg-slate-100 px-4 py-2 rounded-lg print:bg-transparent print:p-0">
              <p className="text-sm text-slate-500 uppercase font-bold tracking-wide">Order ID</p>
              <p className="text-xl font-mono font-bold text-slate-900">{order.orderId}</p>
            </div>
            <p className="mt-2 text-slate-600">Date: {order.orderDate}</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-2 gap-12 mb-10">
          <div>
            <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">Ship To</h3>
            <p className="text-lg font-bold text-slate-800">{order.customerName}</p>
            {order.gstNumber && (
              <p className="text-sm text-slate-500 font-mono mb-1 font-semibold">GST: {order.gstNumber}</p>
            )}
            <p className="text-slate-600 whitespace-pre-wrap">{order.customerAddress}</p>
          </div>
          <div>
             <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">Order Summary</h3>
             <div className="flex justify-between border-b border-slate-100 py-1">
               <span className="text-slate-600">Total Rolls</span>
               <span className="font-bold">{rollEntries.length}</span>
             </div>
             <div className="flex justify-between border-b border-slate-100 py-1 mt-1">
               <span className="text-slate-600">Total Weight</span>
               <span className="font-bold text-blue-600">{calculateTotalWeight()} kg</span>
             </div>
          </div>
        </div>

        {/* Dynamic Packing Lines */}
        <div className="mb-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-300">
                <th className="py-3 text-sm font-bold text-slate-700 w-16">#</th>
                <th className="py-3 text-sm font-bold text-slate-700">Description</th>
                <th className="py-3 text-sm font-bold text-slate-700 w-32">Variant</th>
                <th className="py-3 text-sm font-bold text-slate-700 text-right w-32">Weight (kg)</th>
              </tr>
            </thead>
            <tbody>
              {groupedEntries.map((group) => (
                <React.Fragment key={group.product.id}>
                  {/* Group Header Row */}
                  <tr className="bg-slate-50 print:bg-slate-50/50 print-break-inside-avoid">
                    <td colSpan={4} className="py-2 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 mt-4">
                      {group.product.name} — {group.product.quantity} Rolls Total
                    </td>
                  </tr>
                  
                  {/* Individual Roll Rows */}
                  {group.entries.map((entry) => {
                    const globalIndex = rollEntries.findIndex(r => r === entry);
                    return (
                      <tr key={`${entry.productId}-${entry.rollNumber}`} className="border-b border-slate-100 hover:bg-blue-50/30 transition-colors print-break-inside-avoid">
                        <td className="py-3 text-slate-400 font-mono text-sm">{entry.rollNumber}</td>
                        <td className="py-3 text-slate-800 font-medium">
                          {entry.productName} 
                          <span className="text-slate-400 font-normal ml-2 text-xs">Roll {entry.rollNumber} of {group.product.quantity}</span>
                        </td>
                        <td className="py-3 text-slate-600 text-sm">{entry.variant}</td>
                        <td className="py-2 text-right">
                          <input
                            type="number"
                            step="0.01"
                            value={entry.weight}
                            onChange={(e) => handleWeightChange(globalIndex, e.target.value)}
                            placeholder="0.00"
                            className="w-24 text-right p-1 border-b border-slate-300 focus:border-blue-500 focus:ring-0 outline-none bg-transparent font-mono font-bold text-slate-900 print:border-none print:p-0"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-800">
                <td colSpan={3} className="py-4 text-right font-bold text-slate-800 uppercase tracking-wide">Total Net Weight</td>
                <td className="py-4 text-right font-bold text-xl text-slate-900">{calculateTotalWeight()} kg</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer */}
        <div className="absolute bottom-12 left-8 right-8 text-center text-xs text-slate-400 print:bottom-8">
          <p>Thank you for your business. Please contact support for any discrepancies within 24 hours.</p>
          <p className="mt-1">Generated by Aeromesh Netting Solutions System</p>
        </div>
      </div>

      {/* AI Email Dialog */}
      <dialog ref={emailDialogRef} className="rounded-xl shadow-2xl p-0 w-full max-w-2xl backdrop:bg-slate-900/50">
        <div className="bg-white p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <i className="fas fa-robot text-purple-600"></i> Generated Dispatch Email
            </h3>
            <button onClick={() => emailDialogRef.current?.close()} className="text-slate-400 hover:text-slate-600">
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          {isGeneratingEmail ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-500">
              <i className="fas fa-spinner fa-spin text-3xl mb-4 text-purple-500"></i>
              <p>Drafting email with AI...</p>
            </div>
          ) : (
            <>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
                <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 leading-relaxed">{generatedEmail}</pre>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedEmail);
                    alert("Email copied to clipboard!");
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <i className="fas fa-copy mr-2"></i> Copy Text
                </button>
              </div>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
};