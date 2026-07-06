'use client'

import { useState } from 'react'

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('loading')

    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const res = await fetch('/next/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          subject: formData.get('subject'),
          body: formData.get('body'),
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
      </form>
      {message && (
        <p className={`contact-form-message contact-form-message--${status}`}>{message}</p>
      )}
    </div>
  )
}
