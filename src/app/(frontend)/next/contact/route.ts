import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string
      email?: string
      subject?: string
      body?: string
    }

    if (!body.name || !body.email || !body.subject || !body.body) {
      return NextResponse.json({ error: '必須項目を入力してください' }, { status: 400 })
    }

    console.log('[contact]', {
      name: body.name,
      email: body.email,
      subject: body.subject,
      body: body.body,
    })

    return NextResponse.json({
      message: 'お問い合わせを受け付けました。内容を確認のうえ、ご連絡いたします。',
    })
  } catch {
    return NextResponse.json({ error: '送信に失敗しました' }, { status: 500 })
  }
}
