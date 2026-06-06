export function baseTemplate(content: string, title: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f4f6f9; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #2563EB, #1d4ed8); padding: 32px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 24px; font-weight: 700; }
    .header p { color: #bfdbfe; font-size: 14px; margin-top: 4px; }
    .body { padding: 32px; }
    .body h2 { color: #1e293b; font-size: 20px; margin-bottom: 16px; }
    .body p { color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 12px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .card-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
    .card-row:last-child { border-bottom: none; }
    .card-row .label { color: #64748b; }
    .card-row .value { color: #1e293b; font-weight: 600; }
    .btn { display: inline-block; background: #2563EB; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; margin: 16px 0; }
    .btn-danger { background: #ef4444; }
    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; }
    .status-pending   { background: #fef3c7; color: #d97706; }
    .status-paid      { background: #dbeafe; color: #2563eb; }
    .status-completed { background: #dcfce7; color: #16a34a; }
    .status-cancelled { background: #fee2e2; color: #dc2626; }
    .table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px; }
    .table th { background: #2563EB; color: white; padding: 10px 12px; text-align: left; }
    .table td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; color: #475569; }
    .table tr:last-child td { border-bottom: none; }
    .table .total-row td { font-weight: 700; color: #1e293b; background: #f1f5f9; }
    .footer { background: #f8fafc; padding: 24px 32px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer p { color: #94a3b8; font-size: 13px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>CRM System</h1>
      <p>Order Management Platform</p>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} CRM System. All rights reserved.</p>
      <p style="margin-top:8px">This is an automated email, please do not reply.</p>
    </div>
  </div>
</body>
</html>
  `;
}
