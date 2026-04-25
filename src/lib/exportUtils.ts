import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { Quotation } from '@/types';
import { toast } from 'sonner';

// Helper to check if text contains Bengali characters
const containsBengali = (text: string) => /[\u0980-\u09FF]/.test(text);

// Helper to render Bengali text to a canvas and return an image for jsPDF
const renderBengaliToImage = (text: string, fontSizePt: number, isBold: boolean = false, color: string = 'black') => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  
  const scale = 4; // High res
  // 1 pt is approximately 1.333 pixels at 96 DPI.
  // But we want to match the visual size of helvetica at fontSizePt.
  const canvasFontSize = fontSizePt * scale;
  
  ctx.font = `${isBold ? '700 ' : '400 '}${canvasFontSize}px "Hind Siliguri", "SolaimanLipi", "Vrinda", "Arial Unicode MS", sans-serif`;
  const metrics = ctx.measureText(text);
  
  const padding = 2 * scale;
  canvas.width = metrics.width + (padding * 2);
  canvas.height = (canvasFontSize * 1.5);
  
  ctx.font = `${isBold ? '700 ' : '400 '}${canvasFontSize}px "Hind Siliguri", "SolaimanLipi", "Vrinda", "Arial Unicode MS", sans-serif`;
  ctx.fillStyle = color;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, padding, canvas.height / 2);
  
  // Convert pixels to points (1 px = 0.75 pt) then points to mm if needed, 
  // but jsPDF addImage can take points or mm. 
  // We'll return dimensions in "PDF points" which we then convert to doc units.
  const ptWidth = (canvas.width / scale);
  const ptHeight = (canvas.height / scale);
  
  // Factor to convert points to mm (since doc is in mm): 1 pt = 0.352778 mm
  const mmFactor = 0.352778;

  return {
    dataUrl: canvas.toDataURL('image/png'),
    width: ptWidth * mmFactor,
    height: ptHeight * mmFactor
  };
};

// Global helper to draw text (Bengali or English) safely
const drawTextSafe = (doc: jsPDF, text: string, x: number, y: number, fontSize: number, isBold: boolean = false, color: string = 'black') => {
  if (containsBengali(text)) {
    const img = renderBengaliToImage(text, fontSize, isBold, color);
    if (img) {
      // Y adjustment: Bengali baseline is slightly higher in canvas than Helvetica in PDF
      doc.addImage(img.dataUrl, 'PNG', x, y - (img.height / 1.6), img.width, img.height);
      return img.width;
    }
    return 0;
  } else {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    let rgb = [0, 0, 0];
    if (color === 'white') rgb = [255, 255, 255];
    else if (color === 'grey' || color === '#505050' || color === '#646464') rgb = [100, 100, 100];
    
    doc.setTextColor(rgb[0], rgb[1], rgb[2]);
    doc.text(text, x, y);
    return doc.getTextWidth(text);
  }
};

export const exportToCSV = (quotation: Quotation) => {
  try {
    // Robustly extract business type and message if they are missing but address is present
    let bType = quotation.business_type || 'N/A';
    let msg = quotation.message || 'N/A';
    
    // Defensive parsing for combined address field
    if ((bType === 'N/A' || !bType) && quotation.address) {
      if (quotation.address.includes(' | বার্তা: ')) {
        const parts = quotation.address.split(' | বার্তা: ');
        bType = parts[0].replace('ব্যবসায়: ', '');
        msg = parts[1];
      } else if (quotation.address.includes(' - ')) {
        const parts = quotation.address.split(' - ');
        bType = parts[0];
        msg = parts.slice(1).join(' - ');
      } else {
        bType = quotation.address;
      }
    }

    const rows = [
      ['Customer Name', quotation.customer_name],
      ['Phone', quotation.phone],
      ['Business Type', bType],
      ['Message / Inquiry', msg],
      ['Order Date', format(new Date(quotation.created_at), 'MMM dd, yyyy HH:mm')],
      ['Status', quotation.status],
      [], // Empty row
      ['Requested Items'],
      ['Product Name', 'Size', 'Unit', 'Quantity']
    ];

    if (quotation.items) {
      quotation.items.forEach(item => {
        rows.push([
          item.products?.name || 'Deleted Product',
          item.products?.size || '',
          item.products?.unit || '',
          item.quantity.toString()
        ]);
      });
    }

    const csvContent = rows.map(e => e.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(",")).join("\n");
    
    // Add UTF-8 BOM for Excel support (fixes Bengali in Excel)
    const blob = new Blob(["\ufeff", csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `quotation_${quotation.customer_name.replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('CSV Export Error:', error);
    toast.error('Failed to generate CSV.');
  }
};

export const exportToPDF = (quotation: Quotation) => {
  try {
    const doc = new jsPDF();
    const UNIFORM_FONT_SIZE = 10; // 10pt is professional standard
    
    // Robustly extract business type and message
    let bType = quotation.business_type || 'N/A';
    let msg = quotation.message || 'N/A';
    
    if ((bType === 'N/A' || !bType) && quotation.address) {
      if (quotation.address.includes(' | বার্তা: ')) {
        const parts = quotation.address.split(' | বার্তা: ');
        bType = parts[0].replace('ব্যবসায়: ', '');
        msg = parts[1];
      } else if (quotation.address.includes(' - ')) {
        const parts = quotation.address.split(' - ');
        bType = parts[0];
        msg = parts.slice(1).join(' - ');
      } else {
        bType = quotation.address;
      }
    }

    // Header - Clean Minimalist
    // Header - Professional Red
    doc.setFillColor(185, 28, 28);
    doc.rect(0, 0, 210, 35, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text('SAJEEB National Bulk', 14, 20);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const subTitle = 'অফিসিয়াল বাল্ক কোটেশন ডকুমেন্ট';
    drawTextSafe(doc, subTitle, 14, 28, 9, false, 'white');
    
    // Line Separator
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.1);
    doc.line(14, 45, 196, 45);
    
    doc.setTextColor(33, 33, 33);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    drawTextSafe(doc, 'ক্রেতার তথ্য', 14, 55, 11, true);
    
    const labelX = 14;
    const valueX = 55;
    let currentY = 65;
    
    // Helper to draw text or image if Bengali with perfect baseline alignment
    const drawRow = (label: string, value: string, y: number, isBold: boolean = true) => {
      drawTextSafe(doc, label, labelX, y, 10, false, '#505050');
      drawTextSafe(doc, value, valueX, y, 10, isBold, 'black');
    };

    drawRow("ক্রেতার নাম:", quotation.customer_name, currentY);
    currentY += 8;
    
    drawRow("ফোন নম্বর:", quotation.phone, currentY);
    currentY += 8;
    
    drawRow("ব্যবসায়ের ধরন:", bType, currentY);
    currentY += 8;
    
    // Message section
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    drawTextSafe(doc, `বার্তা:`, labelX, currentY, 10, false, '#505050');
    
    doc.setTextColor(0, 0, 0);
    if (containsBengali(msg)) {
      const img = renderBengaliToImage(msg, 10, true);
      if (img) {
        const maxWidth = 140;
        const scale = Math.min(1, maxWidth / img.width);
        doc.addImage(img.dataUrl, 'PNG', valueX, currentY - (img.height / 1.6), img.width * scale, img.height * scale);
        currentY += (img.height * scale) + 2;
      }
    } else {
      doc.setFont("helvetica", "bold");
      const messageLines = doc.splitTextToSize(msg, 140);
      doc.text(messageLines, valueX, currentY);
      currentY += (messageLines.length * 5) + 3;
    }
    
    currentY += 5;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    const orderDateText = `অর্ডার তারিখ: ${format(new Date(quotation.created_at), 'MMM dd, yyyy HH:mm')}`;
    const statusText = `অবস্থা: ${quotation.status.toUpperCase()}`;
    drawTextSafe(doc, orderDateText, labelX, currentY, 8, false, '#646464');
    drawTextSafe(doc, statusText, 145, currentY, 8, false, '#646464');
    
    currentY += 12;
    
    // Table Header
    doc.setTextColor(33, 33, 33);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    drawTextSafe(doc, 'পণ্যের তালিকা', 14, currentY, 11, true);
    
    // Table
    const tableColumn = ["পণ্যের নাম", "সাইজ", "পরিমাণ", "একক"];
    const tableRows: (string | number)[][] = [];

    if (quotation.items) {
      quotation.items.forEach(item => {
        const rowData = [
          item.products?.name || 'Deleted Product',
          item.products?.size || '-',
          item.quantity,
          item.products?.unit || '-'
        ];
        tableRows.push(rowData);
      });
    }

    autoTable(doc, {
      startY: currentY + 5,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { 
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold',
        fillColor: [185, 28, 28],
        halign: 'left'
      },
      bodyStyles: {
        fontSize: 9,
        cellPadding: 3,
        textColor: [0, 0, 0],
        valign: 'middle'
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 40 }
      },
      margin: { left: 14, right: 14 },
      didDrawCell: (data) => {
        // Handle Bengali in both header and body cells
        if ((data.section === 'body' || data.section === 'head') && typeof data.cell.raw === 'string' && containsBengali(data.cell.raw)) {
          const isHeader = data.section === 'head';
          const img = renderBengaliToImage(data.cell.raw, isHeader ? 9 : 9, isHeader, isHeader ? 'white' : 'black');
          if (img) {
            // Clear the cell background for images
            if (isHeader) {
              doc.setFillColor(185, 28, 28); // Match red header bg
            } else {
              doc.setFillColor(255, 255, 255);
            }
            doc.rect(data.cell.x + 0.5, data.cell.y + 0.5, data.cell.width - 1, data.cell.height - 1, 'F');
            
            const scale = Math.min(1, (data.cell.width - 4) / img.width);
            const drawW = img.width * scale;
            const drawH = img.height * scale;
            
            doc.addImage(
              img.dataUrl, 
              'PNG', 
              data.cell.x + 2, 
              data.cell.y + (data.cell.height / 2) - (drawH / 2), 
              drawW, 
              drawH
            );
          }
        }
      }
    });
    
    doc.save(`quotation_${quotation.customer_name.replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd')}.pdf`);
  } catch (error) {
    console.error('PDF Export Error:', error);
    toast.error('Failed to generate PDF. Please try again.');
  }
};

export const exportAllToCSV = (quotations: Quotation[], fileName: string = 'all_quotations') => {
  try {
    const rows = [
      ['Date', 'Customer Name', 'Phone', 'Business Type', 'Message', 'Status', 'Items (Product x Qty)']
    ];

    quotations.forEach(q => {
      let bType = q.business_type || 'N/A';
      let msg = q.message || 'N/A';
      if ((!bType || bType === 'N/A') && q.address) {
        if (q.address.includes(' | বার্তা: ')) {
          const parts = q.address.split(' | বার্তা: ');
          bType = parts[0].replace('ব্যবসায়: ', '');
          msg = parts[1];
        } else if (q.address.includes(' - ')) {
          const parts = q.address.split(' - ');
          bType = parts[0];
          msg = parts.slice(1).join(' - ');
        } else {
          bType = q.address;
        }
      }

      const itemsStr = q.items?.map(i => `${i.products?.name || 'Product'} (${i.quantity} ${i.products?.unit || ''})`).join('; ') || 'No Items';
      
      rows.push([
        format(new Date(q.created_at), 'yyyy-MM-dd HH:mm'),
        q.customer_name,
        q.phone,
        bType,
        msg,
        q.status,
        itemsStr
      ]);
    });

    const csvContent = rows.map(e => e.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\ufeff", csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${fileName}_${format(new Date(), 'yyyyMMdd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Bulk CSV Export Error:', error);
    toast.error('Failed to generate bulk CSV.');
  }
};

export const exportAllToPDF = (quotations: Quotation[], title: string = 'All Quotations') => {
  try {
    const doc = new jsPDF();
    const UNIFORM_FONT_SIZE = 10;
    
    doc.setFillColor(185, 28, 28);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    const companyTitle = 'SAJEEB National Bulk';
    drawTextSafe(doc, companyTitle, 14, 15, 18, true, 'white');
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    const summaryType = title === 'All Quotations' ? 'সব কোটেশন' : 'সব প্রজেক্ট';
    const summaryInfo = `${summaryType} • অফিসিয়াল সামারি • ${format(new Date(), 'MMM dd, yyyy HH:mm')}`;
    drawTextSafe(doc, summaryInfo, 14, 22, 8, false, 'white');

    let startY = 40;

    quotations.forEach((q, index) => {
      if (startY > 230) {
        doc.addPage();
        startY = 20;
      }

      drawTextSafe(doc, `${index + 1}. ${q.customer_name}`, 14, startY, UNIFORM_FONT_SIZE, true);
      
      let bType = q.business_type || 'N/A';
      let msg = q.message || 'N/A';
      if ((!bType || bType === 'N/A') && q.address) {
        if (q.address.includes(' | বার্তা: ')) {
          const parts = q.address.split(' | বার্তা: ');
          bType = parts[0].replace('ব্যবসায়: ', '');
          msg = parts[1];
        } else if (q.address.includes(' - ')) {
          const parts = q.address.split(' - ');
          bType = parts[0];
          msg = parts.slice(1).join(' - ');
        } else {
          bType = q.address;
        }
      }

      const infoLine = `ফোন: ${q.phone} | ব্যবসায়: ${bType} | তারিখ: ${format(new Date(q.created_at), 'MMM dd, yyyy')}`;
      drawTextSafe(doc, infoLine, 14, startY + 6, 8, false, '#646464');
      
      if (msg && msg !== 'N/A') {
        const msgLine = `বার্তা: ${msg.substring(0, 100)}${msg.length > 100 ? '...' : ''}`;
        drawTextSafe(doc, msgLine, 14, startY + 11, 8, false, '#646464');
        startY += 5;
      }
      
      const tableColumn = ["পণ্য", "সাইজ", "পরিমাণ", "একক"];
      const tableRows = q.items?.map(item => [
        item.products?.name || 'Deleted Product',
        item.products?.size || '-',
        item.quantity,
        item.products?.unit || '-'
      ]) || [];

      autoTable(doc, {
        startY: startY + 10,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 2, textColor: [0, 0, 0] },
        headStyles: { fillColor: [185, 28, 28], textColor: [255, 255, 255], fontStyle: 'bold' },
        margin: { left: 14, right: 14 },
        didDrawCell: (data) => {
          if ((data.section === 'body' || data.section === 'head') && typeof data.cell.raw === 'string' && containsBengali(data.cell.raw)) {
            const isHeader = data.section === 'head';
            const img = renderBengaliToImage(data.cell.raw, 8, isHeader, isHeader ? 'white' : 'black');
            if (img) {
              if (isHeader) {
                doc.setFillColor(185, 28, 28);
              } else {
                doc.setFillColor(255, 255, 255);
              }
              doc.rect(data.cell.x + 0.5, data.cell.y + 0.5, data.cell.width - 1, data.cell.height - 1, 'F');
              const scale = Math.min(1, (data.cell.width - 4) / img.width);
              const drawW = img.width * scale;
              const drawH = img.height * scale;
              doc.addImage(img.dataUrl, 'PNG', data.cell.x + 2, data.cell.y + (data.cell.height / 2) - (drawH / 2), drawW, drawH);
            }
          }
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      startY = (doc as any).lastAutoTable.finalY + 12;
    });

    doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd')}.pdf`);
  } catch (error) {
    console.error('Bulk PDF Error:', error);
    toast.error('Failed to generate bulk PDF.');
  }
};
