import { baseTemplate } from './base.template';

export function resetPasswordTemplate(
  name: string,
  resetToken: string,
  frontendUrl: string,
): string {
  const baseUrl = (frontendUrl || '').replace(/\/$/, '');
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

  const content = `
    <h2>Reset Your Password 🔐</h2>
    <p>Hi <strong>${name}</strong>,</p>
    <p>We received a request to reset your password. Click the button below to create a new password.</p>

    <div style="text-align:center;margin:24px 0">
      <a href="${resetUrl}" class="btn">
        Reset Password →
      </a>
    </div>

    <div class="card">
      <div class="card-row">
        <span class="label">⏰ Expires in</span>
        <span class="value">15 minutes</span>
      </div>
      <div class="card-row">
        <span class="label">🔒 One-time use</span>
        <span class="value">Link expires after use</span>
      </div>
    </div>

    <p style="font-size:13px;color:#94a3b8;margin-top:24px">
      If you did not request a password reset, please ignore this email.
      Your password will not be changed.
    </p>

    <p style="font-size:12px;color:#cbd5e1;margin-top:8px">
      Or copy this link: <br/>
      <span style="word-break:break-all;color:#2563eb">${resetUrl}</span>
    </p>
  `;
  return baseTemplate(content, 'Reset Your Password');
}
