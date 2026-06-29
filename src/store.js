import { create } from 'zustand'
import { persist } from 'zustand/middleware'

let nextId = 1
const uid = () => `layer-${nextId++}`

export const useStore = create(
  persist(
    (set, get) => ({
      background: '#0f0f0f',
      backgroundType: 'color',
      backgroundImage: null,
      gradient: { from: '#0f0f0f', to: '#1a0a2e', angle: 135 },

      duration: 5,
      layers: [],
      selectedLayerId: null,

      isPlaying: false,
      currentTime: 0,

      audioSrc: null,
      audioName: null,
      audioVolume: 0.8,

      activeTemplateId: null,
      templateProps: {},

      addLayer: (partial) => {
        const layer = {
          id: uid(),
          type: 'image',
          name: 'Lager',
          src: null,
          text: 'Din text',
          fontSize: 48,
          textColor: '#ffffff',
          fontWeight: 700,
          x: 50,
          y: 50,
          width: 50,
          startTime: 0,
          endTime: get().duration,
          animation: 'fade-in',
          opacity: 1,
          ...partial,
        }
        set((s) => ({ layers: [...s.layers, layer], selectedLayerId: layer.id }))
      },

      removeLayer: (id) =>
        set((s) => ({
          layers: s.layers.filter((l) => l.id !== id),
          selectedLayerId: s.selectedLayerId === id ? null : s.selectedLayerId,
        })),

      updateLayer: (id, updates) =>
        set((s) => ({ layers: s.layers.map((l) => (l.id === id ? { ...l, ...updates } : l)) })),

      selectLayer: (id) => set({ selectedLayerId: id }),

      setBackground: (value) => set({ background: value, backgroundType: 'color' }),
      setGradient: (gradient) => set({ gradient, backgroundType: 'gradient' }),
      setBackgroundImage: (src) => set({ backgroundImage: src, backgroundType: 'image' }),

      setAudio: (src, name) => set({ audioSrc: src, audioName: name }),
      setAudioVolume: (v) => set({ audioVolume: v }),
      removeAudio: () => set({ audioSrc: null, audioName: null }),

      setIsPlaying: (v) => set({ isPlaying: v }),
      setCurrentTime: (t) => set({ currentTime: Math.max(0, Math.min(t, get().duration)) }),
      setDuration: (d) => set({ duration: d }),
      restart: () => set({ currentTime: 0, isPlaying: true }),

      setActiveTemplate: (id, defaultProps) =>
        set({ activeTemplateId: id, templateProps: defaultProps }),
      updateTemplateProp: (key, val) =>
        set((s) => ({ templateProps: { ...s.templateProps, [key]: val } })),
      clearTemplate: () => set({ activeTemplateId: null, templateProps: {} }),
    }),
    {
      name: 'jamotion-store',
      partialize: (state) => ({
        background: state.background,
        backgroundType: state.backgroundType,
        gradient: state.gradient,
        duration: state.duration,
        activeTemplateId: state.activeTemplateId,
        templateProps: state.templateProps,
      }),
    }
  )
)
