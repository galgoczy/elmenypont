import type { CSSProperties } from 'react'

type Shape = 'rect' | 'rounded' | 'circle' | 'pill'

interface ImageSlotProps {
  shape?: Shape
  radius?: number
  fit?: CSSProperties['objectFit']
  position?: string
  placeholder?: string
  /** Optional real image. When absent, the styled empty state shows. */
  src?: string
  alt?: string
  style?: CSSProperties
  className?: string
}

function radiusFor(shape: Shape, radius: number): string {
  if (shape === 'circle') return '50%'
  if (shape === 'pill') return '9999px'
  if (shape === 'rounded') return `${radius}px`
  return '0'
}

/**
 * Client-fillable image placeholder. In the design prototype these were
 * drag-and-drop slots backed by a sidecar; here they render a styled empty
 * state (dashed ring + caption) until a real `src` is supplied, matching the
 * prototype's look so the client can drop images in later.
 */
export function ImageSlot({
  shape = 'rounded',
  radius = 12,
  fit = 'cover',
  position = '50% 50%',
  placeholder = 'Drop an image',
  src,
  alt = '',
  style,
  className,
}: ImageSlotProps) {
  const br = radiusFor(shape, radius)
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: br,
        background: 'rgba(0,0,0,.04)',
        color: 'rgba(0,0,0,.55)',
        font: '13px/1.3 var(--font-body)',
        ...style,
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          draggable={false}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: fit,
            objectPosition: position,
          }}
        />
      ) : (
        <>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              textAlign: 'center',
              padding: 12,
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: 0.45 }}
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
            <div style={{ maxWidth: '90%', fontWeight: 500, letterSpacing: '.01em' }}>
              {placeholder}
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              border: '1.5px dashed rgba(0,0,0,.25)',
              borderRadius: br,
            }}
          />
        </>
      )}
    </div>
  )
}
