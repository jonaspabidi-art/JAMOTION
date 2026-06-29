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
      backgroundImageKey: null,
      gradient: { from: '#0f0f0f', to: '#1a0a2e', angle: 135 },

      duration: 5,
      layers: [],
      selectedLayerId: null,

      isPlaying: false,
      currentTime: 0,

      audioSrc: null,
      audioName: null,
      audioVolume: 0.8,
      audioKey: null,

      activeTemplateId: null,
      templateProps: {},

      addLayer: (partial) => {
        const layer = {
          id: uid(),
          type: 'image',
          name: 'Lager',
          src: null,
          srcKey: null,
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
      setBackgroundImage: (src, key = null) =>
        set({ backgroundImage: src, backgroundType: 'image', backgroundImageKey: key }),

      setAudio: (src, name, key = null) => set({ audioSrc: src, audioName: name, audioKey: key }),
      setAudioVolume: (v) => set({ audioVolume: v }),
      removeAudio: () => set({ audioSrc: null, audioName: null, audioKey: null }),

      setIsPlaying: (v) => set({ isPlaying: v }),
      setCurrentTime: (t) => set({ currentTime: Math.max(0, Math.min(t, get().duration)) }),
      setDuration: (d) => set({ duration: d }),
      restart: () => set({ currentTime: 0, isPlaying: true }),

      setActiveTemplate: (id, defaultProps) =>
        set({ activeTemplateId: id, templateProps: defaultProps }),
      updateTemplateProp: (key, val) =>
        set((s) => ({ templateProps: { ...s.templateProps, [key]: val } })),
      clearTemplate: () => set({ activeTemplateId: null, templateProps: {} }),

      // Hydration: called on startup to restore blob URLs from IndexedDB
      hydrateLayerSrc: (id, src) =>
        set((s) => ({ layers: s.layers.map((l) => (l.id === id ? { ...l, src } : l)) })),
      hydrateAudioSrc: (src) => set({ audioSrc: src }),
      hydrateBackgroundImageSrc: (src) => set({ backgroundImage: src }),
    }),
    {
      name: 'jamotion-store',
      partialize: (state) => ({
        background: state.background,
        backgroundType: state.backgroundType,
        gradient: state.gradient,
        backgroundImageKey: state.backgroundImageKey,
        duration: state.duration,
        layers: state.layers.map((l) => ({ ...l, src: null })), // strip ephemeral blob URL
        audioKey: state.audioKey,
        audioName: state.audioName,
        audioVolume: state.audioVolume,
        activeTemplateId: state.activeTemplateId,
        templateProps: state.templateProps,
      }),
    }
  )
)
