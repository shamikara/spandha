import { EmailLayout } from './layouts/EmailLayout'

export function OtpEmail(otp: string): string {
return EmailLayout({
title: 'Verify Your Login',
content: ` <p style="color:#4b5563;line-height:1.6;">
We received a request to access your Spandha account. </p>

  <div style="margin:32px 0;text-align:center;">
    <div style="
      display:inline-block;
      background:#f9fafb;
      border:2px dashed #d11a5b;
      border-radius:12px;
      padding:20px 40px;
      font-size:32px;
      font-weight:bold;
      letter-spacing:8px;
      color:#111827;
    ">
      ${otp}
    </div>
  </div>

  <p style="color:#4b5563;">
    This verification code expires in <strong>10 minutes</strong>.
  </p>
`,

})
}
