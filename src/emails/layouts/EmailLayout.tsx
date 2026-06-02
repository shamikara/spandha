interface EmailLayoutProps {
title: string
content: string
}

export function EmailLayout({
title,
content,
}: EmailLayoutProps): string {
return `

  <!DOCTYPE html>

  <html>
  <head>
    <meta charset="UTF-8" />
  </head>

  <body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 20px;">
          <table width="600" cellpadding="0" cellspacing="0"
            style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">

        <tr>
          <td style="background:#d11a5b;padding:32px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:28px;">
              Spandha
            </h1>
            <p style="margin:8px 0 0;color:#ffe4ee;">
              Sri Lankan Matrimony Platform
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding:40px;">
            <h2 style="margin-top:0;color:#111827;">
              ${title}
            </h2>

            ${content}
          </td>
        </tr>

        <tr>
          <td style="background:#f9fafb;padding:20px;text-align:center;color:#6b7280;font-size:12px;">
            © Spandha Matrimony. All rights reserved.
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

  </body>
  </html>
  `
}
