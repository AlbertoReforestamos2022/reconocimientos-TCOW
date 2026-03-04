import html2canvas from "html2canvas";

export function useExport() {
    const exportImage = async (elementId = 'preview-canvas', format = 'png', filename = 'branding') => {
        const el = document.getElementById(elementId)
        if(!el) return; 


        const canvas = await html2canvas(el, {
            useCORS:         true,
            scale  :         2,
            backgroundColor: null,
        })

        const mimeType = format === 'jpg' ? 'image/jpg' : 'image/png'
        const url      = canvas.toDataURL(mimeType, 0.95);
        const link     = document.createElement('a');
        link.download  = `${filename}.${format}`;
        link.href      = url;
        link.click(); 
    }

    return { exportImage }
}