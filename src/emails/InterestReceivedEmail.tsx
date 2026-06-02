import { EmailLayout } from './layouts/EmailLayout'

export function InterestReceivedEmail(
senderName: string
): string {
return EmailLayout({
title: 'New Interest Received',
content: ` <p style="color:#4b5563;line-height:1.6;">
Great news! </p>
  <p style="color:#4b5563;line-height:1.6;">
    <strong>${senderName}</strong> has shown interest in your profile.
  </p>

  <p style="color:#4b5563;line-height:1.6;">
    Log in to Spandha to view the profile and respond.
  </p>
`,

})
}
