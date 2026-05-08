export const metadata = { title: 'Cancellation Policy' }

export default function CancellationPage() {
  return (
    <>
      <p className="font-sans text-xs uppercase tracking-[0.2em] text-gold mb-3">Legal</p>
      <h1 className="font-display text-4xl font-light text-white mb-8">Cancellation Policy</h1>
      <div className="font-sans text-sm leading-relaxed text-muted space-y-4">
        <p>
          Cancellation policy is communicated and agreed at the time of booking confirmation.
        </p>
        <p className="text-warning text-xs border border-warning/20 rounded-sm bg-warning/5 px-3 py-2">
          PLACEHOLDER: Insert full cancellation terms provided by gestor — see PLACEHOLDERS.md
        </p>
      </div>
    </>
  )
}
