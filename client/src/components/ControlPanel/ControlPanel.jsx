import { useState } from 'react'
import AccordionItem    from './AccordionItem'
import BackgroundControl from './BackgroundControl'
import TextControl      from './TextControl'
import LogoControl      from './LogoControl'
import OverlayControl   from './OverlayControl'
import DownloadControl  from './DownloadControl'

export default function ControlPanel() {
  const [projectId, setProjectId] = useState(null)

  return (
    <div>
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