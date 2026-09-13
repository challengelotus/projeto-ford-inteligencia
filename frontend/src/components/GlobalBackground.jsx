export default function GlobalBackground() {
  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(120% 60% at 50% -10%, rgba(30,107,255,.22), transparent 70%), radial-gradient(90% 50% at 10% 105%, rgba(10,42,107,.35), transparent 70%)' }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage: 'linear-gradient(rgba(120,160,220,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(120,160,220,.055) 1px,transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />
    </>
  )
}