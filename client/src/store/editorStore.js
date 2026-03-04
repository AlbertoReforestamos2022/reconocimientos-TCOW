import { create } from "zustand";

const DEFAULT = {
    percentaje: '[X]',
    titleText : 'De los productos forestales que adquirimos tienen certificación FSC',
    bodyText  : 'Felicidades a la ciudad por ser una Ciudad Árbol del Mundo',
    city      : '',
    background: null,
    logo      : { src: null, position: 'bottom-right', size: 120 },
    overlay   : { color: '#000000', opacity: 0.3 },
    titleStyle: { color: '#ffffff', fontsize: 32, fontWeight: '800'},
    bodyStyle : { color: '#ffffff', fontsize: 18, fontWeight: '400' }, 
    bodyStyle : { color: '#ffffff', fontsize: 22, fontWeight: '700' },
    format    : '1:1',

}


export const useEditorStore = create((set) => ({
    template: { ...DEFAULT },

    setField: (key, value) => 
        set((s) => ({ template: { ...s.template, [key]: value} })),

    setNestedField: (key, subKey, value) => 
        set((s)=> ({
            template: { ...s.template, [key]: {...s.template[key], [subKey]: value} }
        })), 
    
    initFromUser: (user) => 
        set((s)=> ( {template: {...s.template, city: user?.city_name || ''}} )),

    loadProject: (json)=> 
        set({template: { ...DEFAULT, ...json}}),

    reset: ()=> set({ template: {...DEFAULT}}),
}))