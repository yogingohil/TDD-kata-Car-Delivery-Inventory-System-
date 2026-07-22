import { IPurchase } from '../types/index.js';

export function downloadPdfInvoice(purchase: IPurchase) {
  const v = typeof purchase.vehicleId === 'object' ? purchase.vehicleId : null;
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>APEX MOTORS - Official Delivery Invoice #${purchase._id.substring(18)}</title>
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; margin: 0; }
        .invoice-card { max-width: 700px; margin: 0 auto; background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 40px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 20px; }
        .logo { font-size: 24px; font-weight: 800; color: #38bdf8; letter-spacing: -1px; }
        .badge { background: #064e3b; color: #34d399; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
        .details { margin-top: 30px; display: grid; grid-template-cols: 1fr 1fr; gap: 20px; font-size: 14px; }
        .label { color: #94a3b8; font-size: 12px; text-transform: uppercase; margin-bottom: 4px; }
        .val { font-weight: 600; color: #ffffff; }
        .table { width: 100%; margin-top: 30px; border-collapse: collapse; text-align: left; font-size: 14px; }
        .table th { background: #090d16; color: #94a3b8; padding: 12px; border-bottom: 1px solid #334155; text-transform: uppercase; font-size: 11px; }
        .table td { padding: 16px 12px; border-bottom: 1px solid #334155; }
        .total-box { margin-top: 30px; text-align: right; font-size: 20px; font-weight: 800; color: #38bdf8; }
        .footer { margin-top: 40px; border-top: 1px solid #334155; padding-top: 20px; text-align: center; font-size: 12px; color: #64748b; }
      </style>
    </head>
    <body>
      <div class="invoice-card">
        <div class="header">
          <div class="logo">APEX<span style="color:#ffffff">MOTORS</span></div>
          <div class="badge">OFFICIAL PURCHASE RECEIPT</div>
        </div>

        <div class="details">
          <div>
            <div class="label">Transaction Reference</div>
            <div class="val">#${purchase._id}</div>
          </div>
          <div>
            <div class="label">Date of Purchase</div>
            <div class="val">${new Date(purchase.purchasedAt).toLocaleString()}</div>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Vehicle Description</th>
              <th>VIN</th>
              <th>Qty</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>${v ? `${v.make} ${v.model} (${v.year})` : 'Luxury Vehicle'}</strong></td>
              <td style="font-family:monospace; color:#38bdf8;">${v?.vin || 'N/A'}</td>
              <td>${purchase.quantity}</td>
              <td>$${purchase.totalPrice?.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        <div class="total-box">
          Total Paid: $${purchase.totalPrice?.toLocaleString()} USD
        </div>

        <div class="footer">
          APEX MOTORS INC. • Clean Architecture & TDD Verified Transaction • Thank you for your purchase!
        </div>
      </div>
      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(content);
  printWindow.document.close();
}
