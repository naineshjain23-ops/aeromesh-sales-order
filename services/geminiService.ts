import { GoogleGenAI } from "@google/genai";
import { SalesOrder, RollEntry } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDispatchEmail = async (
  order: SalesOrder,
  rollEntries: RollEntry[]
): Promise<string> => {
  try {
    // Calculate totals for the prompt
    const totalRolls = rollEntries.length;
    const totalWeight = rollEntries.reduce((acc, curr) => acc + (parseFloat(curr.weight) || 0), 0);

    const prompt = `
      You are a professional logistics manager for "Aeromesh Netting Solutions".
      
      Write a polite, professional dispatch notification email to the customer.
      
      Customer Details:
      Name: ${order.customerName}
      Order ID: ${order.orderId}
      ${order.gstNumber ? `GST No: ${order.gstNumber}` : ''}
      
      Order Summary:
      Total Rolls: ${totalRolls}
      Total Weight: ${totalWeight.toFixed(2)} kg
      
      Products included:
      ${order.products.map(p => `- ${p.name} (${p.variant}): ${p.quantity} rolls`).join('\n')}
      
      The email should confirm the order is packed and ready for dispatch. 
      Keep it concise and business-professional. 
      Do not include placeholders like "[Your Name]", sign off as "Aeromesh Logistics Team".
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate email.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating email. Please try again.";
  }
};