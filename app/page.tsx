export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #0f172a, #1e293b)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '600px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>Sparky</h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem', color: '#cbd5e1' }}>
          Professional electrical calculations and NEC reference for field electricians
        </p>
        <a href="/mission-control" style={{
          display: 'inline-block',
          padding: '0.75rem 1.5rem',
          background: '#06b6d4',
          color: 'white',
          borderRadius: '0.5rem',
          fontWeight: '600',
          textDecoration: 'none',
          marginRight: '1rem'
        }}>
          View Dashboard
        </a>
      </div>
    </div>
  );
}