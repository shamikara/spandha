import { EmailLayout } from './layouts/EmailLayout'

export function OtpEmail(otp: string): string {
return EmailLayout({
title: 'Your Spandha login code',
content: ` <p style="color:#4b5563;line-height:1.6;">
Use this code to sign in to Spandha. There is no password — this code is your login credential. </p>

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
    This login code expires in <strong>10 minutes</strong>. Do not share it with anyone.
  </p>
`,

})
}
