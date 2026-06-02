import { EmailLayout } from './layouts/EmailLayout'

export function WelcomeEmail(name: string): string {
return EmailLayout({
title: 'Welcome to Spandha',
content: ` <p style="color:#4b5563;line-height:1.6;">
Hi ${name}, </p>

  <p style="color:#4b5563;line-height:1.6;">
    Welcome to Spandha. Your journey to finding a meaningful life partner begins here.
  </p>

  <p style="color:#4b5563;line-height:1.6;">
    Complete your profile and start connecting with compatible matches.
  </p>
`,

})
}
