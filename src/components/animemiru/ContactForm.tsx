'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
const RECAPTCHA_ACTION = 'contact'

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
    onRecaptchaLoad?: () => void
  }
}

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [scriptReady, setScriptReady] = useState(false)
  const recaptchaEnabled = Boolean(SITE_KEY)

  useEffect(() => {
    window.onRecaptchaLoad = () => setScriptReady(true)
  }, [])

  async function getRecaptchaToken(): Promise<string | null> {
    if (!recaptchaEnabled || !SITE_KEY || !window.grecaptcha) {
      return null
    }

    return new Promise((resolve) => {
      window.grecaptcha!.ready(async () => {
        try {
          const token = await window.grecaptcha!.execute(SITE_KEY, { action: RECAPTCHA_ACTION })
          resolve(token)
        } catch {
          resolve(null)
        }
      })
    })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('loading')

    const form = event.currentTarget
    const formData = new FormData(form)

    let recaptchaToken: string | null = null
    if (recaptchaEnabled) {
      if (!scriptReady) {
        setStatus('error')
        setMessage('セキュリティチェックの読み込み中です。少し待ってから再度お試しください。')
        return
      }

      recaptchaToken = await getRecaptchaToken()
      if (!recaptchaToken) {
        setStatus('error')
        setMessage('セキュリティチェックに失敗しました。再度お試しください。')
        return
      }
    }

    try {
      const res = await fetch('/next/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          subject: formData.get('subject'),
          body: formData.get('body'),
          recaptchaToken,
        }),
      })

      const data = (await res.json()) as { message?: string; error?: string }

      if (!res.ok) {
        setStatus('error')
        setMessage(data.error || '送信に失敗しました')
        return
      }

      setStatus('success')
      setMessage(data.message || 'お問い合わせを受け付けました')
      form.reset()
    } catch {
      setStatus('error')
      setMessage('送信に失敗しました')
    }
  }

  return (
    <div className="contact-form">
      {recaptchaEnabled && (
        <Script
          id="recaptcha-script"
          src={`https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`}
          strategy="afterInteractive"
          onLoad={() => setScriptReady(true)}
        />
      )}
      <form className="wpforms-form" onSubmit={handleSubmit}>
        <div className="wpforms-field-container">
          <div className="wpforms-field">
            <label htmlFor="contact-name">
              名前 <span className="wpforms-required-label">*</span>
            </label>
            <input className="wpforms-field-medium" id="contact-name" name="name" required type="text" />
          </div>
          <div className="wpforms-field">
            <label htmlFor="contact-email">
              メール <span className="wpforms-required-label">*</span>
            </label>
            <input
              className="wpforms-field-medium"
              id="contact-email"
              name="email"
              required
              type="email"
            />
          </div>
          <div className="wpforms-field">
            <label htmlFor="contact-subject">
              題名 <span className="wpforms-required-label">*</span>
            </label>
            <input
              className="wpforms-field-medium"
              id="contact-subject"
              name="subject"
              required
              type="text"
            />
          </div>
          <div className="wpforms-field">
            <label htmlFor="contact-body">
              お問い合わせ内容 <span className="wpforms-required-label">*</span>
            </label>
            <textarea
              className="wpforms-field-medium"
              id="contact-body"
              name="body"
              required
              rows={8}
            />
          </div>
        </div>
        <div className="wpforms-submit-container">
          <button className="wpforms-submit" disabled={status === 'loading'} type="submit">
            {status === 'loading' ? '送信中…' : '送信'}
          </button>
        </div>
        {recaptchaEnabled && (
          <p className="contact-form-recaptcha-notice">
            このサイトは reCAPTCHA によって保護されており、Google の
            <a href="https://policies.google.com/privacy" rel="noopener noreferrer" target="_blank">
              プライバシーポリシー
            </a>
            と
            <a href="https://policies.google.com/terms" rel="noopener noreferrer" target="_blank">
              利用規約
            </a>
            が適用されます。
          </p>
        )}
      </form>
      {message && (
        <p className={`contact-form-message contact-form-message--${status}`}>{message}</p>
      )}
    </div>
  )
}
