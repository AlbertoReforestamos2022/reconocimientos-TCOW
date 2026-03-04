import { useState } from 'react'
import AccordionItem    from './AccordionItem'
import BackgroundControl from './BackgroundControl'
import TextControl      from './TextControl'
import LogoControl      from './LogoControl'
import OverlayControl   from './OverlayControl'
import DownloadControl  from './DownloadControl'
import { useEditorStore } from '../../store/editorStore'

export default function ControlPanel() {
  const setField      = useEditorStore((s) => s.setField)
  const format        = useEditorStore((s) => s.template.format)
  const [projectId, setProjectId] = useState(null)

  return (
    <div>
      {/* Selector de formato */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--gray-200)' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 8 }}>Formato</p>
        <div style={{ display: 'flex', gap: 8 }}>
          {['1:1', '9:16', '16:9'].map((f) => (
            <button key={f} onClick={() => setField('format', f)}
              style={{
                flex: 1, padding: '6px 0', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                background: format === f ? 'var(--green)' : 'var(--gray-100)',
                color:      format === f ? '#fff' : 'var(--gray-700)',
                border: 'none',
              }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <AccordionItem title="Imagen de fondo" defaultOpen>
        <BackgroundControl />
      </AccordionItem>

      <AccordionItem title="Overlay / oscurecimiento">
        <OverlayControl />
      </AccordionItem>

      <AccordionItem title="Porcentaje">
        <TextControl field="percentage" styleField="titleStyle" label="Texto del porcentaje" />
      </AccordionItem>

      <AccordionItem title="Texto principal">
        <TextControl field="titleText" styleField="titleStyle" label="Texto principal" />
      </AccordionItem>

      <AccordionItem title="Texto secundario">
        <TextControl field="bodyText" styleField="bodyStyle" label="Texto secundario" />
      </AccordionItem>

      <AccordionItem title="Ciudad">
        <TextControl field="city" styleField="cityStyle" label="Ciudad" />
      </AccordionItem>

      <AccordionItem title="Logo">
        <LogoControl />
      </AccordionItem>

      <AccordionItem title="Descargar / Guardar">
        <DownloadControl projectId={projectId} setProjectId={setProjectId} />
      </AccordionItem>
    </div>
  )
}