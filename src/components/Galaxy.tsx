'use client'

export default function Galaxy() {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 10,
      overflow: 'hidden',
      pointerEvents: 'none',
    }}>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '20px',
        height: '20px',
        backgroundColor: 'rgba(212, 175, 55, 0.9)',
        borderRadius: '50%',
      }} />
    </div>
  )
}
