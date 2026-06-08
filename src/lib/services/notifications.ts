import { prisma } from '@/lib/prisma'
import { getSiteUrl } from '@/lib/site'
import { emailService, smsService } from '@/lib/services/notification'

type NotificationType =
  | 'INTEREST_RECEIVED'
  | 'INTEREST_ACCEPTED'
  | 'INTEREST_REJECTED'
  | 'PAYMENT_RECEIVED'
  | 'ADVERT_CREATED'
  | 'ADVERT_UPDATED'
  | 'PROFILE_UPDATED'
  | 'SYSTEM'

interface NotifyUserInput {
  userId: string
  type: NotificationType
  title: string
  message: string
  link?: string
}

function appUrl() {
  return getSiteUrl()
}

function emailHtml(title: string, message: string, link?: string) {
  const action = link
    ? `<p><a href="${appUrl()}${link}" style="display:inline-block;background:#4f46e5;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;">View in Spandha</a></p>`
    : ''

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;">
      <h2>${title}</h2>
      <p>${message}</p>
      ${action}
      <p style="color:#6b7280;font-size:13px;">This notification was sent by Spandha.</p>
    </div>
  `
}

export async function notifyUser({ userId, type, title, message, link }: NotifyUserInput) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { phone: true, email: true },
  })

  if (!user) {
    return null
  }

  const notification = await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      link,
    },
  })

  const deliveries: Promise<boolean>[] = []

  if (user.email) {
    deliveries.push(emailService.sendEmail(user.email, title, emailHtml(title, message, link)))
  }

  if (user.phone) {
    deliveries.push(smsService.sendSMS(user.phone, 'You have a new notification from Spandha. Please check your email or login to view details.'))
  }

  if (deliveries.length) {
    const results = await Promise.allSettled(deliveries)
    results.forEach(result => {
      if (result.status === 'rejected') {
        console.error('Notification delivery failed:', result.reason)
      }
    })
  }

  return notification
}
