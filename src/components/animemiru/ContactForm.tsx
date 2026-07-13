const GOOGLE_FORM_EMBED_URL =
  process.env.NEXT_PUBLIC_GOOGLE_FORM_EMBED_URL ||
  'https://docs.google.com/forms/d/e/1FAIpQLSdUdGSfyOpaDX6OEiAJ2SFEn_Ev_BiRnK_OuBkY6kvlQgfLZA/viewform?embedded=true'

export function ContactForm() {
  return (
    <div className="contact-form contact-form--google">
      <iframe
        className="contact-form-google-iframe"
        src={GOOGLE_FORM_EMBED_URL}
        title="お問い合わせフォーム"
        loading="lazy"
      >
        読み込み中…
      </iframe>
    </div>
  )
}
