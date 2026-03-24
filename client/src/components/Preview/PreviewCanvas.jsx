import { useEditorStore } from '../../store/editorStore'
import './Preview.css'

const LOGO_POSITIONS = {
  'top-left':     { top: 20,  left: 20,    bottom: 'auto', right: 'auto' },
  'top-right':    { top: 20,  right: 20,   bottom: 'auto', left: 'auto' },
  'bottom-left':  { bottom: 20, left: 20,  top: 'auto',    right: 'auto' },
  'bottom-right': { bottom: 20, right: 20, top: 'auto',    left: 'auto' },
  'center':       { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bottom: 'auto', right: 'auto' },
}

const SIZE = { width: 540, height: 540 }

export default function PreviewCanvas() {
  const { percentage, titleText, bodyText, city, background, logo, overlay, titleStyle, bodyStyle, cityStyle } = useEditorStore((s) => s.template)

  const logoPos = LOGO_POSITIONS[logo.position] || LOGO_POSITIONS['bottom-right']

  return (
    <div id="preview-canvas" style={{
      position:        'relative',
      width:           SIZE.width,
      height:          SIZE.height,
      borderRadius:    8,
      overflow:        'hidden',
      boxShadow:       'var(--shadow-md)',
      flexShrink:      0,
    }}>
      {/* Imagen de fondo */}
      {background && (
        <img src={background} alt="fondo" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain',
        }} />
      )}

      {/* Overlay de color */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundColor: overlay.color,
        opacity: overlay.opacity,
      }} />

      {/* Barra verde superior */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 10, background: 'var(--green-light)' }} />

      {/* Contenido de texto */}
      <div style={{ position: 'absolute', inset: 0, padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {percentage && (
          <p style={{ ...titleStyle, marginBottom: 16, lineHeight: 1.1, fontSize: titleStyle.fontSize * 1.5 }}>
            {percentage}%
          </p>
        )}
        {titleText && (
          <p style={{ ...titleStyle, marginBottom: 20, lineHeight: 1.3, textTransform: 'uppercase' }}>
            {titleText}
          </p>
        )}
        {bodyText && (
          <p style={{ ...bodyStyle, lineHeight: 1.6 }}>
            {bodyText}
          </p>
        )}
        {city && (
          <p style={{ ...cityStyle, marginTop: 20, opacity: 0.9 }}>
            {city}
          </p>
        )}
      </div>

      {/* Logo */}
      {logo.src && (
        <img src={logo.src} alt="logo" style={{
          position: 'absolute',
          width: logo.size,
          height: logo.size,
          objectFit: 'contain',
          ...logoPos,
        }} />
      )}

      {/* Barra verde inferior */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 10, background: 'var(--green-light)' }} />
    </div>
  )
}