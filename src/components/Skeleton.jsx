/**
 * Skeleton loading components for Proof dashboard.
 * Use these when data is loading to maintain visual layout stability.
 */

const shimmerStyle = {
  background: 'linear-gradient(90deg, #161618 25%, #1E1E21 50%, #161618 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s ease-in-out infinite',
  borderRadius: 8,
}

export function SkeletonBox({ width = '100%', height = 16, style = {} }) {
  return <div style={{ ...shimmerStyle, width, height, ...style }} />
}

export function SkeletonKPI() {
  return (
    <div style={{
      background: '#111113', border: '1px solid #1E1E21', borderRadius: 12,
      padding: '18px 20px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <SkeletonBox width={16} height={16} />
        <SkeletonBox width={60} height={14} />
      </div>
      <SkeletonBox width="60%" height={28} style={{ marginBottom: 6 }} />
      <SkeletonBox width="40%" height={12} />
    </div>
  )
}

export function SkeletonChart({ height = 220 }) {
  return (
    <div style={{
      background: '#111113', border: '1px solid #1E1E21', borderRadius: 12,
      padding: 20,
    }}>
      <SkeletonBox width="30%" height={16} style={{ marginBottom: 16 }} />
      <SkeletonBox width="100%" height={height} />
    </div>
  )
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div style={{
      background: '#111113', border: '1px solid #1E1E21', borderRadius: 12,
      padding: 20,
    }}>
      <SkeletonBox width="25%" height={16} style={{ marginBottom: 20 }} />
      {/* Header */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #1E1E21' }}>
        {[1,2,3,4].map(i => <SkeletonBox key={i} height={10} style={{ flex: 1 }} />)}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 10 }}>
          {[1,2,3,4].map(j => <SkeletonBox key={j} height={14} style={{ flex: 1 }} />)}
        </div>
      ))}
    </div>
  )
}

export function SkeletonAlert() {
  return (
    <div style={{
      display: 'flex', gap: 10, padding: '10px 0',
      borderBottom: '1px solid #1E1E21',
    }}>
      <SkeletonBox width={6} height={6} style={{ borderRadius: '50%', marginTop: 6, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <SkeletonBox width="85%" height={13} style={{ marginBottom: 4 }} />
        <SkeletonBox width="40%" height={10} />
      </div>
    </div>
  )
}
