type RecaptchaVerifyResponse = {
  success: boolean
  score?: number
  action?: string
  'error-codes'?: string[]
}

const RECAPTCHA_ACTION = 'contact'

export async function verifyRecaptcha(token: string | undefined): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY

  if (!secret) {
    return true
  }

  if (!token) {
    return false
  }

  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret,
      response: token,
    }),
  })

  if (!response.ok) {
    return false
  }

  const data = (await response.json()) as RecaptchaVerifyResponse
  const threshold = Number(process.env.RECAPTCHA_SCORE_THRESHOLD || 0.5)

  return (
    data.success === true &&
    data.action === RECAPTCHA_ACTION &&
    (data.score ?? 0) >= threshold
  )
}

export function isRecaptchaRequired(): boolean {
  return Boolean(process.env.RECAPTCHA_SECRET_KEY)
}
