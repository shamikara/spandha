import { Resend } from 'resend'

export interface NotificationService {
  sendSMS(phone: string, message: string): Promise<boolean>
  sendEmail(email: string, subject: string, html: string): Promise<boolean>
}

// Resend Email Implementation
class ResendNotificationService implements NotificationService {
  private resend: Resend | null = null

  constructor() {
    const apiKey = process.env.RESEND_API_KEY
    if (apiKey && apiKey !== 'your-resend-api-key') {
      this.resend = new Resend(apiKey)
    }
  }

  async sendEmail(email: string, subject: string, html: string): Promise<boolean> {
    if (!this.resend) {
      console.log(`[DEV EMAIL] To: ${email}\n[Subject]: ${subject}\n[Content]: ${html}`)
      return true
    }
    
    try {
      const { error } = await this.resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: email,
        subject,
        html,
      })
      
      if (error) {
        console.error('Resend Error:', error)
        return false
      }
      return true
    } catch (err) {
      console.error('Email sending failed:', err)
      return false
    }
  }

  async sendSMS(phone: string, message: string): Promise<boolean> {
    throw new Error('Resend cannot send SMS. Use an SMS provider instead.')
  }
}

// Notify.lk SMS Implementation
class NotifyLkService implements NotificationService {
  private userId = process.env.NOTIFY_USER_ID
  private apiKey = process.env.NOTIFY_API_KEY
  private senderId = process.env.NOTIFY_SENDER_ID || 'NotifyDEMO'

  async sendSMS(phone: string, message: string): Promise<boolean> {
    if (!this.userId || !this.apiKey || this.userId === 'your-notify-user-id') {
      console.log(`[DEV SMS] To: ${phone} | Message: ${message}`)
      return true
    }

    try {
      // Notify.lk expects phone number in format starting with 94, without the '+'
      let formattedPhone = phone
      if (formattedPhone.startsWith('+')) {
        formattedPhone = formattedPhone.substring(1)
      } else if (formattedPhone.startsWith('0')) {
        formattedPhone = '94' + formattedPhone.substring(1)
      }

      const params = new URLSearchParams({
        user_id: this.userId,
        api_key: this.apiKey,
        sender_id: this.senderId,
        to: formattedPhone,
        message: message
      })

      const response = await fetch(`https://app.notify.lk/api/v1/send?${params.toString()}`, {
        method: 'GET'
      })

      const data = await response.json()
      
      if (data.status === 'success') {
        return true
      }
      
      console.error('Notify.lk API Error:', data)
      return false
    } catch (err) {
      console.error('Notify SMS sending failed:', err)
      return false
    }
  }

  async sendEmail(email: string, subject: string, html: string): Promise<boolean> {
    throw new Error('Notify.lk cannot send Emails. Use an Email provider instead.')
  }
}

// Export pre-configured services
export const emailService = new ResendNotificationService()
export const smsService = new NotifyLkService()
