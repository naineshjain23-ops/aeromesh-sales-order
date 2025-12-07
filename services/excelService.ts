import { utils, writeFile } from 'xlsx';
import { SalesOrder, RollEntry } from '../types';

export const generatePackingSlipExcel = (order: SalesOrder, rollEntries: RollEntry[]) => {
  const data: any[] = [];

  // Header Section
  data.push(["AEROMESH NETTING SOLUTIONS"]);
  data.push(["PACKING SLIP"]);
  data.push([]); // Spacer

  // Order Information (Vertical Key-Value pairs)
  data.push(["Order ID", order.orderId]);
  data.push(["Date", order.orderDate]);
  data.push(["Customer Name", order.customerName]);
  data.push(["GST Number", order.gstNumber || ""]);
  data.push(["Address", order.customerAddress]);
  data.push([]); // Spacer

  // Group entries by product for vertical layout
  order.products.forEach(product => {
    // Product Header
    // Format: Product Name - Variant
    data.push([`${product.name} - ${product.variant}`, `Qty: ${product.quantity} Rolls`]);
    
    // Column Headers for the specific product block
    data.push(["Roll No.", "Weight (kg)"]);

    // Get all rolls for this product in order
    const productRolls = rollEntries.filter(r => r.productId === product.id);
    
    // Add rows vertically (Roll # and Weight only)
    productRolls.forEach(entry => {
      data.push([
        entry.rollNumber,
        parseFloat(entry.weight) || 0
      ]);
    });

    // Subtotal for the product
    const subTotal = productRolls.reduce((sum, r) => sum + (parseFloat(r.weight) || 0), 0);
    data.push(["Subtotal", subTotal]);
    
    data.push([]); // Spacer between products
  });

  // Grand Total
  const grandTotal = rollEntries.reduce((acc, curr) => acc + (parseFloat(curr.weight) || 0), 0);
  data.push(["GRAND TOTAL WEIGHT", grandTotal]);

  // Create Workbook
  const ws = utils.aoa_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, "Packing Slip");

  // Adjust Column Widths
  // Column A (Labels/Roll No) and Column B (Values/Weights)
  ws['!cols'] = [
    { wch: 35 }, // Width for Product Name / Customer Name
    { wch: 15 }, // Width for Weight
  ];

  // Generate File
  const safeOrderId = order.orderId.replace(/[^a-z0-9]/gi, '_');
  writeFile(wb, `PackingSlip_${safeOrderId}.xlsx`);
};
