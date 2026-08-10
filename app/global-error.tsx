'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body style={{ background: '#0D0D0D', color: '#fff', fontFamily: 'sans-serif' }}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: 420 }}>
            <p style={{ color: '#FF5A1F', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Erreur critique
            </p>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.75rem 0' }}>
              Le site rencontre un problème
            </h1>
            <p style={{ color: '#9CA3AF', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Merci de réessayer dans un instant. Si le problème persiste, contactez-nous directement.
            </p>
            <button
              onClick={() => reset()}
              style={{
                background: '#FF5A1F',
                color: '#fff',
                fontWeight: 700,
                border: 'none',
                borderRadius: 999,
                padding: '0.85rem 1.75rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}
            >
              Réessayer
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
