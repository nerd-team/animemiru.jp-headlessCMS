import nodemailer from 'nodemailer'

export type ContactEmailPayload = {
  name: string
  email: string
  subject: string
  body: string
}

const DEFAULT_TO = 'factory-admin@nerd.co.jp'
const DEFAULT_FROM = 'factory-webproduction@nerd.co.jp'

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function getTransporter() {
  const host = process.env.SMTP_HOST
  const pass = process.env.SMTP_PASS

  if (!host || !pass) {
    throw new Error('SMTP_HOST and SMTP_PASS must be configured')
  }

  const port = Number(process.env.SMTP_PORT || 587)
  const secure = process.env.SMTP_SECURE === 'true'

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER || DEFAULT_FROM,
      pass,
    },
  })
}

export async function sendContactEmail(payload: ContactEmailPayload): Promise<void> {
  const to = process.env.CONTACT_EMAIL_TO || DEFAULT_TO
  const from = process.env.CONTACT_EMAIL_FROM || DEFAULT_FROM
  const fromName = process.env.CONTACT_EMAIL_FROM_NAME || 'アニメミル お問い合わせ'

  const transporter = getTransporter()

  const text = [
    'アニメミルお問い合わせフォームから送信されました。',
    '',
    `名前: ${payload.name}`,
    `メール: ${payload.email}`,
    `題名: ${payload.subject}`,
    '',
    '--- お問い合わせ内容 ---',
    payload.body,
  ].join('\n')

  const html = [
    '<p>アニメミルお問い合わせフォームから送信されました。</p>',
    '<table cellpadding="4">',
    `<tr><th align="left">名前</th><td>${escapeHtml(payload.name)}</td></tr>`,
    `<tr><th align="left">メール</th><td>${escapeHtml(payload.email)}</td></tr>`,
    `<tr><th align="left">題名</th><td>${escapeHtml(payload.subject)}</td></tr>`,
    '</table>',
    '<p><strong>お問い合わせ内容</strong></p>',
    `<pre style="white-space:pre-wrap;font-family:sans-serif">${escapeHtml(payload.body)}</pre>`,
  ].join('\n')

  await transporter.sendMail({
    from: `"${fromName}" <${from}>`,
    to,
    replyTo: `"${payload.name}" <${payload.email}>`,
    subject: `[お問い合わせ] ${payload.subject}`,
    text,
    html,
  })
}
