/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface AgencySettings {
  logoUrl?: string;
  signatureUrl?: string;
  agencyName?: string;
  agencyEmail?: string;
  agencyPhone?: string;
  agencyAddress?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  currency: 'INR' | 'USD';
  items: InvoiceItem[];
  taxPercent?: number;
  notes?: string;
  paymentTerms?: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
}

export interface ContractData {
  contractNumber: string;
  date: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  projectDescription: string;
  totalAmount: number;
  currency: 'INR' | 'USD';
  paymentSchedule: string;
  duration: string;
  startDate: string;
  endDate: string;
  revisions: number;
  signedByClient?: boolean;
  clientSignatureName?: string;
  signedAt?: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const SYM: Record<string, string> = { INR: '₹', USD: '$' };
const O: [number, number, number] = [255, 107, 0];  // brand orange
const DARK: [number, number, number] = [12, 12, 12];

async function toBase64(url: string): Promise<string | null> {
  try {
    const r = await fetch(url);
    const blob = await r.blob();
    return new Promise((res) => {
      const fr = new FileReader();
      fr.onload = () => res(fr.result as string);
      fr.onerror = () => res(null);
      fr.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function fmtNum(n: number, currency: string): string {
  if (currency === 'INR') {
    return n.toLocaleString('en-IN', { minimumFractionDigits: 2 });
  }
  return n.toLocaleString('en-US', { minimumFractionDigits: 2 });
}

function pageFooter(doc: jsPDF, pageW: number, pageH: number, text: string) {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(60, 60, 60);
  doc.text(text, pageW / 2, pageH - 6, { align: 'center' });
}

// ── Invoice PDF ────────────────────────────────────────────────────────────────

export async function generateInvoicePDF(
  invoice: InvoiceData,
  agency: AgencySettings
): Promise<void> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const sym = SYM[invoice.currency] || '₹';

  // Background
  doc.setFillColor(...DARK);
  doc.rect(0, 0, W, H, 'F');
  // Orange top stripe
  doc.setFillColor(...O);
  doc.rect(0, 0, W, 2.5, 'F');

  // Load assets
  const [logoB64, sigB64] = await Promise.all([
    agency.logoUrl ? toBase64(agency.logoUrl) : Promise.resolve(null),
    agency.signatureUrl ? toBase64(agency.signatureUrl) : Promise.resolve(null),
  ]);

  let y = 14;

  // ── Header ──
  if (logoB64) {
    doc.addImage(logoB64, 'PNG', 14, y, 38, 14);
  } else {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(...O);
    doc.text(agency.agencyName || 'Optify360', 14, y + 9);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(...O);
  doc.text('INVOICE', W - 14, y + 10, { align: 'right' });

  y += 18;

  // Invoice meta (right)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(190, 190, 190);
  doc.text(`Invoice #:  ${invoice.invoiceNumber}`, W - 14, y, { align: 'right' });
  doc.text(`Date:          ${invoice.date}`, W - 14, y + 5.5, { align: 'right' });
  doc.text(`Due Date:   ${invoice.dueDate}`, W - 14, y + 11, { align: 'right' });

  // Agency info (left)
  doc.setTextColor(190, 190, 190);
  doc.text(agency.agencyName || 'Optify360', 14, y);
  doc.text(agency.agencyEmail || 'optify360official@gmail.com', 14, y + 5.5);
  if (agency.agencyPhone) doc.text(agency.agencyPhone, 14, y + 11);
  if (agency.agencyAddress) doc.text(agency.agencyAddress, 14, y + 16.5);

  y += 24;
  // Divider
  doc.setDrawColor(...O);
  doc.setLineWidth(0.4);
  doc.line(14, y, W - 14, y);
  y += 7;

  // ── Bill To ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...O);
  doc.text('BILL TO', 14, y);
  y += 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(240, 240, 240);
  doc.text(invoice.clientName, 14, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(170, 170, 170);
  if (invoice.clientCompany) { doc.text(invoice.clientCompany, 14, y); y += 4.5; }
  doc.text(invoice.clientEmail, 14, y);
  y += 11;

  // ── Line Items Table ──
  const subtotal = invoice.items.reduce((s, i) => s + i.quantity * i.rate, 0);
  const taxAmt = invoice.taxPercent ? subtotal * (invoice.taxPercent / 100) : 0;
  const total = subtotal + taxAmt;

  const rows = invoice.items.map((item, idx) => [
    String(idx + 1),
    item.description,
    String(item.quantity),
    `${sym}${fmtNum(item.rate, invoice.currency)}`,
    `${sym}${fmtNum(item.quantity * item.rate, invoice.currency)}`,
  ]);

  autoTable(doc, {
    startY: y,
    head: [['#', 'Description', 'Qty', 'Unit Rate', 'Amount']],
    body: rows,
    theme: 'plain',
    styles: { font: 'helvetica', fontSize: 8.5, textColor: [210, 210, 210], cellPadding: { top: 4, bottom: 4, left: 4, right: 4 } },
    headStyles: { fillColor: [28, 28, 28], textColor: [255, 107, 0], fontStyle: 'bold', fontSize: 7.5 },
    alternateRowStyles: { fillColor: [18, 18, 18] },
    bodyStyles: { fillColor: [12, 12, 12] },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      2: { halign: 'center', cellWidth: 14 },
      3: { halign: 'right', cellWidth: 32 },
      4: { halign: 'right', cellWidth: 32 },
    },
    margin: { left: 14, right: 14 },
    tableLineColor: [35, 35, 35],
    tableLineWidth: 0.15,
  });

  const afterTable = (doc as any).lastAutoTable.finalY + 4;

  // ── Totals ──
  const tx = W - 80;
  let ty = afterTable + 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(150, 150, 150);
  doc.text('Subtotal:', tx, ty);
  doc.text(`${sym}${fmtNum(subtotal, invoice.currency)}`, W - 14, ty, { align: 'right' });

  if (taxAmt > 0) {
    ty += 6;
    doc.text(`GST / Tax (${invoice.taxPercent}%):`, tx, ty);
    doc.text(`${sym}${fmtNum(taxAmt, invoice.currency)}`, W - 14, ty, { align: 'right' });
  }

  ty += 4;
  doc.setDrawColor(...O);
  doc.setLineWidth(0.2);
  doc.line(tx, ty, W - 14, ty);
  ty += 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...O);
  doc.text('TOTAL DUE:', tx, ty);
  doc.text(`${sym}${fmtNum(total, invoice.currency)}`, W - 14, ty, { align: 'right' });

  // Notes & Payment Terms
  let notesY = ty + 14;
  if (invoice.notes) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...O);
    doc.text('NOTES', 14, notesY);
    notesY += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const noteLines = doc.splitTextToSize(invoice.notes, W - 28);
    doc.text(noteLines, 14, notesY);
    notesY += noteLines.length * 4.5;
  }

  if (invoice.paymentTerms) {
    notesY += 3;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...O);
    doc.text('PAYMENT TERMS', 14, notesY);
    notesY += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(invoice.paymentTerms, 14, notesY);
  }

  // ── Signature Footer ──
  const sigY = H - 46;
  doc.setDrawColor(35, 35, 35);
  doc.setLineWidth(0.1);
  doc.line(14, sigY, W - 14, sigY);

  if (sigB64) {
    doc.addImage(sigB64, 'PNG', 14, sigY + 3, 40, 15);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...O);
  doc.text('AUTHORIZED BY', 14, sigY + 22);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(160, 160, 160);
  doc.text(agency.agencyName || 'Optify360', 14, sigY + 27);
  doc.text(agency.agencyEmail || 'optify360official@gmail.com', 14, sigY + 32);

  pageFooter(doc, W, H, 'This is a computer-generated document. | Optify360 Digital Solutions');
  doc.save(`INV_${invoice.invoiceNumber}_${invoice.clientName.replace(/\s+/g, '_')}.pdf`);
}

// ── Contract PDF ───────────────────────────────────────────────────────────────

export async function generateContractPDF(
  contract: ContractData,
  agency: AgencySettings
): Promise<void> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const sym = SYM[contract.currency] || '₹';

  doc.setFillColor(...DARK);
  doc.rect(0, 0, W, H, 'F');
  doc.setFillColor(...O);
  doc.rect(0, 0, W, 2.5, 'F');

  const [logoB64, sigB64] = await Promise.all([
    agency.logoUrl ? toBase64(agency.logoUrl) : Promise.resolve(null),
    agency.signatureUrl ? toBase64(agency.signatureUrl) : Promise.resolve(null),
  ]);

  let y = 13;

  // Header
  if (logoB64) {
    doc.addImage(logoB64, 'PNG', 14, y, 34, 12);
  } else {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(...O);
    doc.text(agency.agencyName || 'Optify360', 14, y + 7);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(...O);
  doc.text('SERVICE AGREEMENT', W / 2, y + 7, { align: 'center' });

  y += 16;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(130, 130, 130);
  doc.text(`Contract #: ${contract.contractNumber}   ·   Date: ${contract.date}`, W / 2, y, { align: 'center' });

  y += 8;
  doc.setDrawColor(...O);
  doc.setLineWidth(0.3);
  doc.line(14, y, W - 14, y);
  y += 7;

  // Parties
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...O);
  doc.text('THIS AGREEMENT IS ENTERED INTO BETWEEN:', 14, y);
  y += 6;

  const halfW = (W - 33) / 2;

  // Agency box
  doc.setFillColor(20, 20, 20);
  doc.roundedRect(14, y, halfW, 26, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...O);
  doc.text('AGENCY (Service Provider)', 17, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(200, 200, 200);
  doc.text(agency.agencyName || 'Optify360 Digital Solutions', 17, y + 11);
  doc.setFontSize(7.5);
  doc.setTextColor(160, 160, 160);
  doc.text(agency.agencyEmail || 'optify360official@gmail.com', 17, y + 16);
  if (agency.agencyPhone) doc.text(agency.agencyPhone, 17, y + 21);

  // Client box
  const cx = 14 + halfW + 5;
  doc.setFillColor(20, 20, 20);
  doc.roundedRect(cx, y, halfW, 26, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...O);
  doc.text('CLIENT', cx + 3, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(200, 200, 200);
  doc.text(contract.clientName, cx + 3, y + 11);
  doc.setFontSize(7.5);
  doc.setTextColor(160, 160, 160);
  if (contract.clientCompany) doc.text(contract.clientCompany, cx + 3, y + 16);
  doc.text(contract.clientEmail, cx + 3, y + (contract.clientCompany ? 21 : 16));

  y += 32;

  // Section helper
  const section = (num: string, title: string, body: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...O);
    doc.text(`${num}. ${title}`, 14, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.8);
    doc.setTextColor(180, 180, 180);
    const lines = doc.splitTextToSize(body, W - 28);
    doc.text(lines, 14, y);
    y += lines.length * 4 + 5;
    if (y > H - 60) {
      doc.addPage();
      doc.setFillColor(...DARK);
      doc.rect(0, 0, W, H, 'F');
      y = 15;
    }
  };

  section('1', 'SCOPE OF WORK',
    contract.projectDescription || 'As discussed and detailed in the separately provided project brief.');

  section('2', 'PAYMENT TERMS',
    `Total Project Value: ${sym}${fmtNum(contract.totalAmount, contract.currency)}\nPayment Schedule: ${contract.paymentSchedule}\nAll invoices are due within 14 days of issue. Late payments incur a 2% monthly penalty.`);

  section('3', 'PROJECT TIMELINE',
    `Start Date: ${contract.startDate}  |  Estimated Completion: ${contract.endDate}  |  Duration: ${contract.duration}`);

  section('4', 'INTELLECTUAL PROPERTY',
    'Upon receipt of full payment, all deliverables specifically created for this project become the exclusive property of the Client. The Agency retains the right to showcase the work in its portfolio unless the Client requests otherwise in writing.');

  section('5', 'CONFIDENTIALITY',
    'Both parties agree to keep confidential any proprietary business information, trade secrets, and strategies shared during this engagement. This obligation persists after the termination of this agreement.');

  section('6', 'REVISIONS & CHANGE ORDERS',
    `This project includes ${contract.revisions} rounds of revisions. Additional revisions are billed at ₹2,500/hour or $30/hour (USD). Any scope changes require written approval from both parties before work begins.`);

  section('7', 'TERMINATION',
    'Either party may terminate this agreement with 14 days written notice. Work completed to the termination date will be invoiced at the pro-rata rate. Advance payments for undelivered work will be refunded within 7 business days.');

  section('8', 'LIMITATION OF LIABILITY',
    "The Agency's total liability under this agreement shall not exceed the fees paid by the Client. The Agency shall not be liable for indirect, incidental, or consequential damages arising from this engagement.");

  section('9', 'GOVERNING LAW & DISPUTE RESOLUTION',
    'This agreement is governed by the laws of India. Any disputes will first be resolved through good-faith negotiation. If unresolved within 30 days, disputes shall be settled through binding arbitration in New Delhi, India.');

  // Signature block
  y += 3;
  if (y > H - 55) {
    doc.addPage();
    doc.setFillColor(...DARK);
    doc.rect(0, 0, W, H, 'F');
    y = 15;
  }

  doc.setDrawColor(...O);
  doc.setLineWidth(0.3);
  doc.line(14, y, W - 14, y);
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...O);
  doc.text('SIGNATURES & ACCEPTANCE', 14, y);
  y += 8;

  // Agency sig box
  doc.setFillColor(18, 18, 18);
  doc.roundedRect(14, y, halfW, 38, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...O);
  doc.text('AGENCY AUTHORIZED SIGNATURE', 17, y + 5);

  if (sigB64) {
    doc.addImage(sigB64, 'PNG', 17, y + 9, 38, 15);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(160, 160, 160);
    doc.text(agency.agencyName || 'Optify360', 17, y + 28);
    doc.text(`Date: ${contract.date}`, 17, y + 33);
  } else {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(200, 200, 200);
    doc.text(agency.agencyName || 'Optify360', 17, y + 18);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(120, 120, 120);
    doc.text(`Date: ${contract.date}`, 17, y + 24);
  }

  // Client sig box
  doc.setFillColor(18, 18, 18);
  doc.roundedRect(cx, y, halfW, 38, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...O);
  doc.text('CLIENT ACCEPTANCE', cx + 3, y + 5);

  if (contract.signedByClient && contract.clientSignatureName) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(80, 220, 120);
    doc.text(`✓ ${contract.clientSignatureName}`, cx + 3, y + 18);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(120, 180, 120);
    doc.text('Digitally Accepted', cx + 3, y + 25);
    if (contract.signedAt) {
      doc.setTextColor(120, 120, 120);
      doc.text(`Date: ${contract.signedAt}`, cx + 3, y + 31);
    }
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(200, 80, 80);
    doc.text('PENDING CLIENT SIGNATURE', cx + 3, y + 20);
  }

  const currentH = doc.internal.pageSize.getHeight();
  pageFooter(doc, W, currentH,
    'This is a legally binding digital service agreement. Generated & issued by Optify360 Digital Solutions.');

  doc.save(`CONTRACT_${contract.contractNumber}_${contract.clientName.replace(/\s+/g, '_')}.pdf`);
}
