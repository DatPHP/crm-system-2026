import { baseTemplate } from './base.template';

export function welcomeTemplate(name: string, frontendUrl: string): string {
  const baseUrl = (frontendUrl || '').replace(/\/$/, '');
  const content = `
    <h2>Welcome to CRM System! 👋</h2>
    <p>Hi <strong>${name}</strong>,</p>
    <p>Your account has been created successfully. You can now manage orders, products, and customers.</p>

    <div class="card">
      <div class="card-row">
        <span class="label">Account Name</span>
        <span class="value">${name}</span>
      </div>
      <div class="card-row">
        <span class="label">Role</span>
        <span class="value">Admin</span>
      </div>
      <div class="card-row">
        <span class="label">Status</span>
        <span class="value" style="color:#16a34a">✅ Active</span>
      </div>
    </div>

    <p>Get started by logging into your dashboard:</p>
    <a href="${baseUrl}/dashboard" class="btn">
      Go to Dashboard →
    </a>

    <p style="margin-top:24px;font-size:13px;color:#94a3b8">
      If you did not create this account, please ignore this email.
    </p>
  `;
  return baseTemplate(content, 'Welcome to CRM System');
}
