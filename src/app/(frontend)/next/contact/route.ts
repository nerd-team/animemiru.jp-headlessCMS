import { NextResponse } from 'next/server'

import { sendContactEmail } from '@/lib/sendContactEmail'
import { isRecaptchaRequired, verifyRecaptcha } from '@/lib/verifyRecaptcha'

export const dynamic = 'force-dynamic'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string
      email?: string
      subject?: string
      body?: string
      recaptchaToken?: string
    }

    const name = body.name?.trim()
    const email = body.email?.trim()
    const subject = body.subject?.trim()
    const messageBody = body.body?.trim()

    if (!name || !email || !subject || !messageBody) {
      return NextResponse.json({ error: '必須項目を入力してください' }, { status: 400 })
    }

    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ error: 'メールアドレスの形式が正しくありません' }, { status: 400 })
    }

    if (isRecaptchaRequired()) {
      const valid = await verifyRecaptcha(body.recaptchaToken)
      if (!valid) {
        return NextResponse.json({ error: 'セキュリティチェックに失敗しました。再度お試しください。' }, { status: 400 })
      }
    }

    await sendContactEmail({
      name,
      email,
      subject,
      body: messageBody,
    })

    return NextResponse.json({
      message: 'お問い合わせを受け付けました。内容を確認のうえ、ご連絡いたします。',
    })
  } catch (error) {
    console.error('[contact]', error)
    return NextResponse.json({ error: '送信に失敗しました' }, { status: 500 })
  }
}
