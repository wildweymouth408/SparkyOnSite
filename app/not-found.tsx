export default function NotFound() {
  return (
    <html>
      <body style={{ background: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem' }}>404</h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>Page not found</p>
          <a href="/" style={{ padding: '0.5rem 1rem', background: '#f97316', color: 'white', textDecoration: 'none', borderRadius: '0.5rem' }}>Go Home</a>
        </div>
      </body>
    </html>
  );
}