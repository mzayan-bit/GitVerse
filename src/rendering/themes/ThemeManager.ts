import { create } from 'zustand';
import * as THREE from 'three';

// ── Theme Types ───────────────────────────────────────────────────────
export interface ThemeLighting {
  ambient: string;
  directional: string;
  rim: string;
  core: string;
  intensityMultiplier: number;
}

export interface ThemeColors {
  background: string;
  primary: string;
  secondary: string;
  accent: string;
  danger: string;
  text: string;
  uiBackground: string;
}

export interface ThemeEnvironment {
  skybox: string | null;
  fogColor: string;
  fogDensity: number;
  starsColor: string;
  nebulaPrimary: string;
  nebulaSecondary: string;
  particleGlow: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  lighting: ThemeLighting;
  colors: ThemeColors;
  environment: ThemeEnvironment;
  materials: {
    wireframe: boolean;
    emissiveIntensity: number;
    roughness: number;
    metalness: number;
  };
  animationIntensity: number; // 0 to 2
}

// ── Theme Presets ─────────────────────────────────────────────────────
export const THEMES: Record<string, ThemeConfig> = {
  deep_space: {
    id: 'deep_space',
    name: 'Deep Space',
    description: 'Realistic dark void with bright stars and subtle nebula',
    lighting: {
      ambient: '#050510',
      directional: '#ffffff',
      rim: '#4f46e5',
      core: '#f59e0b',
      intensityMultiplier: 1.0,
    },
    colors: {
      background: '#020205',
      primary: '#6366f1',
      secondary: '#818cf8',
      accent: '#f43f5e',
      danger: '#ef4444',
      text: '#f8fafc',
      uiBackground: 'rgba(2, 2, 5, 0.7)',
    },
    environment: {
      skybox: null,
      fogColor: '#020205',
      fogDensity: 0.0001,
      starsColor: '#ffffff',
      nebulaPrimary: '#4f46e5',
      nebulaSecondary: '#e11d48',
      particleGlow: '#818cf8',
    },
    materials: {
      wireframe: false,
      emissiveIntensity: 1.0,
      roughness: 0.8,
      metalness: 0.2,
    },
    animationIntensity: 1.0,
  },
  cyberpunk_neon: {
    id: 'cyberpunk_neon',
    name: 'Cyberpunk Neon',
    description: 'High-contrast neon colors and dark background',
    lighting: {
      ambient: '#100520',
      directional: '#00ffff',
      rim: '#ff00ff',
      core: '#ffff00',
      intensityMultiplier: 1.5,
    },
    colors: {
      background: '#050010',
      primary: '#00ffff',
      secondary: '#ff00ff',
      accent: '#ffff00',
      danger: '#ff3333',
      text: '#e0e0e0',
      uiBackground: 'rgba(5, 0, 16, 0.8)',
    },
    environment: {
      skybox: null,
      fogColor: '#100020',
      fogDensity: 0.0003,
      starsColor: '#00ffff',
      nebulaPrimary: '#ff00ff',
      nebulaSecondary: '#00ffff',
      particleGlow: '#ffff00',
    },
    materials: {
      wireframe: false,
      emissiveIntensity: 2.0,
      roughness: 0.3,
      metalness: 0.8,
    },
    animationIntensity: 1.5,
  },
  blueprint: {
    id: 'blueprint',
    name: 'Blueprint',
    description: 'Technical wireframe aesthetic',
    lighting: {
      ambient: '#002244',
      directional: '#ffffff',
      rim: '#0088ff',
      core: '#ffffff',
      intensityMultiplier: 1.2,
    },
    colors: {
      background: '#001133',
      primary: '#00aaff',
      secondary: '#0066cc',
      accent: '#ffffff',
      danger: '#ff3333',
      text: '#ffffff',
      uiBackground: 'rgba(0, 17, 51, 0.8)',
    },
    environment: {
      skybox: null,
      fogColor: '#001133',
      fogDensity: 0.0005,
      starsColor: '#00aaff',
      nebulaPrimary: '#003366',
      nebulaSecondary: '#002244',
      particleGlow: '#00aaff',
    },
    materials: {
      wireframe: true,
      emissiveIntensity: 1.5,
      roughness: 1.0,
      metalness: 0.0,
    },
    animationIntensity: 0.5,
  },
  dark_matter: {
    id: 'dark_matter',
    name: 'Dark Matter',
    description: 'Monochrome, stark, and high contrast',
    lighting: {
      ambient: '#0a0a0a',
      directional: '#ffffff',
      rim: '#555555',
      core: '#aaaaaa',
      intensityMultiplier: 1.0,
    },
    colors: {
      background: '#000000',
      primary: '#ffffff',
      secondary: '#aaaaaa',
      accent: '#ffffff',
      danger: '#ff0000',
      text: '#ffffff',
      uiBackground: 'rgba(0, 0, 0, 0.9)',
    },
    environment: {
      skybox: null,
      fogColor: '#000000',
      fogDensity: 0.0002,
      starsColor: '#ffffff',
      nebulaPrimary: '#111111',
      nebulaSecondary: '#222222',
      particleGlow: '#ffffff',
    },
    materials: {
      wireframe: false,
      emissiveIntensity: 1.2,
      roughness: 0.9,
      metalness: 0.1,
    },
    animationIntensity: 0.8,
  },
  aurora: {
    id: 'aurora',
    name: 'Aurora',
    description: 'Vibrant greens and purples of the northern lights',
    lighting: {
      ambient: '#051010',
      directional: '#44ffaa',
      rim: '#8844ff',
      core: '#44ffaa',
      intensityMultiplier: 1.2,
    },
    colors: {
      background: '#020808',
      primary: '#44ffaa',
      secondary: '#8844ff',
      accent: '#00ffcc',
      danger: '#ff3366',
      text: '#f0fff0',
      uiBackground: 'rgba(2, 8, 8, 0.8)',
    },
    environment: {
      skybox: null,
      fogColor: '#020808',
      fogDensity: 0.0002,
      starsColor: '#ffffff',
      nebulaPrimary: '#44ffaa',
      nebulaSecondary: '#8844ff',
      particleGlow: '#00ffcc',
    },
    materials: {
      wireframe: false,
      emissiveIntensity: 1.5,
      roughness: 0.6,
      metalness: 0.4,
    },
    animationIntensity: 1.2,
  },
  wireframe: {
    id: 'wireframe',
    name: 'Wireframe',
    description: 'Classic green wireframe on black',
    lighting: {
      ambient: '#001100',
      directional: '#00ff00',
      rim: '#008800',
      core: '#00ff00',
      intensityMultiplier: 1.5,
    },
    colors: {
      background: '#000000',
      primary: '#00ff00',
      secondary: '#00aa00',
      accent: '#00ff00',
      danger: '#ff0000',
      text: '#00ff00',
      uiBackground: 'rgba(0, 0, 0, 0.9)',
    },
    environment: {
      skybox: null,
      fogColor: '#000000',
      fogDensity: 0.0001,
      starsColor: '#00ff00',
      nebulaPrimary: '#002200',
      nebulaSecondary: '#001100',
      particleGlow: '#00ff00',
    },
    materials: {
      wireframe: true,
      emissiveIntensity: 2.0,
      roughness: 1.0,
      metalness: 0.0,
    },
    animationIntensity: 0.5,
  },
  minimal_white: {
    id: 'minimal_white',
    name: 'Minimal White',
    description: 'Clean, bright, studio-like aesthetic',
    lighting: {
      ambient: '#e0e0e0',
      directional: '#ffffff',
      rim: '#cccccc',
      core: '#ffffff',
      intensityMultiplier: 0.8,
    },
    colors: {
      background: '#f8f9fa',
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#10b981',
      danger: '#ef4444',
      text: '#1e293b',
      uiBackground: 'rgba(248, 249, 250, 0.8)',
    },
    environment: {
      skybox: null,
      fogColor: '#f8f9fa',
      fogDensity: 0.0005,
      starsColor: '#cbd5e1',
      nebulaPrimary: '#e2e8f0',
      nebulaSecondary: '#f1f5f9',
      particleGlow: '#3b82f6',
    },
    materials: {
      wireframe: false,
      emissiveIntensity: 0.5,
      roughness: 0.9,
      metalness: 0.1,
    },
    animationIntensity: 0.8,
  },
  nasa_observatory: {
    id: 'nasa_observatory',
    name: 'NASA Observatory',
    description: 'High realism based on James Webb photography',
    lighting: {
      ambient: '#050205',
      directional: '#ffeebb',
      rim: '#44aaff',
      core: '#ffaa44',
      intensityMultiplier: 1.1,
    },
    colors: {
      background: '#010002',
      primary: '#ffaa44',
      secondary: '#44aaff',
      accent: '#ff5533',
      danger: '#e11d48',
      text: '#f8fafc',
      uiBackground: 'rgba(1, 0, 2, 0.7)',
    },
    environment: {
      skybox: null,
      fogColor: '#010002',
      fogDensity: 0.0001,
      starsColor: '#ffeebb',
      nebulaPrimary: '#ffaa44',
      nebulaSecondary: '#44aaff',
      particleGlow: '#ffaa44',
    },
    materials: {
      wireframe: false,
      emissiveIntensity: 1.1,
      roughness: 0.7,
      metalness: 0.3,
    },
    animationIntensity: 0.9,
  },
  hacker_terminal: {
    id: 'hacker_terminal',
    name: 'Hacker Terminal',
    description: 'Amber CRT terminal aesthetic',
    lighting: {
      ambient: '#1a1000',
      directional: '#ffb000',
      rim: '#cc8800',
      core: '#ffb000',
      intensityMultiplier: 1.3,
    },
    colors: {
      background: '#080500',
      primary: '#ffb000',
      secondary: '#cc8800',
      accent: '#ff8800',
      danger: '#ff3300',
      text: '#ffb000',
      uiBackground: 'rgba(8, 5, 0, 0.9)',
    },
    environment: {
      skybox: null,
      fogColor: '#080500',
      fogDensity: 0.0003,
      starsColor: '#ffb000',
      nebulaPrimary: '#332200',
      nebulaSecondary: '#221100',
      particleGlow: '#ffb000',
    },
    materials: {
      wireframe: true,
      emissiveIntensity: 1.8,
      roughness: 1.0,
      metalness: 0.0,
    },
    animationIntensity: 0.6,
  },
  sunset_galaxy: {
    id: 'sunset_galaxy',
    name: 'Sunset Galaxy',
    description: 'Warm oranges, pinks, and purples',
    lighting: {
      ambient: '#1a0510',
      directional: '#ff77aa',
      rim: '#ff9955',
      core: '#aa44ff',
      intensityMultiplier: 1.1,
    },
    colors: {
      background: '#0a0205',
      primary: '#ff77aa',
      secondary: '#ff9955',
      accent: '#aa44ff',
      danger: '#ff3355',
      text: '#ffeef5',
      uiBackground: 'rgba(10, 2, 5, 0.8)',
    },
    environment: {
      skybox: null,
      fogColor: '#0a0205',
      fogDensity: 0.0002,
      starsColor: '#ffccdd',
      nebulaPrimary: '#ff77aa',
      nebulaSecondary: '#aa44ff',
      particleGlow: '#ff9955',
    },
    materials: {
      wireframe: false,
      emissiveIntensity: 1.2,
      roughness: 0.7,
      metalness: 0.3,
    },
    animationIntensity: 1.0,
  },
};

// ── Theme Store ───────────────────────────────────────────────────────
interface ThemeStore {
  activeThemeId: string;
  activeTheme: ThemeConfig;
  targetTheme: ThemeConfig | null; // For transition
  transitionProgress: number; // 0 to 1

  setTheme: (id: string) => void;
  updateTransition: (delta: number) => void;
}

export const useThemeManager = create<ThemeStore>((set, get) => ({
  activeThemeId: 'deep_space',
  activeTheme: THEMES['deep_space'],
  targetTheme: null,
  transitionProgress: 1,

  setTheme: (id) => {
    const theme = THEMES[id];
    if (!theme) return;

    // If we're already transitioning, we jump to the active theme being the current interpolated state?
    // For simplicity, just start a new transition from the current activeTheme.
    set({
      targetTheme: theme,
      transitionProgress: 0,
      activeThemeId: id,
    });
  },

  updateTransition: (delta) => {
    const { targetTheme, activeTheme, transitionProgress } = get();
    if (!targetTheme || transitionProgress >= 1) return;

    const newProgress = Math.min(transitionProgress + delta * 2.0, 1); // 0.5s transition

    if (newProgress >= 1) {
      set({
        activeTheme: targetTheme,
        targetTheme: null,
        transitionProgress: 1,
      });
      return;
    }

    // Interpolate numeric values and colors
    const interpolateColor = (c1: string, c2: string, t: number) => {
      const color1 = new THREE.Color(c1);
      const color2 = new THREE.Color(c2);
      return '#' + color1.lerp(color2, t).getHexString();
    };

    const interpolateNum = (n1: number, n2: number, t: number) => {
      return n1 + (n2 - n1) * t;
    };

    const interpolatedTheme: ThemeConfig = {
      ...targetTheme, // Take static properties from target
      lighting: {
        ambient: interpolateColor(
          activeTheme.lighting.ambient,
          targetTheme.lighting.ambient,
          newProgress
        ),
        directional: interpolateColor(
          activeTheme.lighting.directional,
          targetTheme.lighting.directional,
          newProgress
        ),
        rim: interpolateColor(
          activeTheme.lighting.rim,
          targetTheme.lighting.rim,
          newProgress
        ),
        core: interpolateColor(
          activeTheme.lighting.core,
          targetTheme.lighting.core,
          newProgress
        ),
        intensityMultiplier: interpolateNum(
          activeTheme.lighting.intensityMultiplier,
          targetTheme.lighting.intensityMultiplier,
          newProgress
        ),
      },
      colors: {
        background: interpolateColor(
          activeTheme.colors.background,
          targetTheme.colors.background,
          newProgress
        ),
        primary: interpolateColor(
          activeTheme.colors.primary,
          targetTheme.colors.primary,
          newProgress
        ),
        secondary: interpolateColor(
          activeTheme.colors.secondary,
          targetTheme.colors.secondary,
          newProgress
        ),
        accent: interpolateColor(
          activeTheme.colors.accent,
          targetTheme.colors.accent,
          newProgress
        ),
        danger: interpolateColor(
          activeTheme.colors.danger,
          targetTheme.colors.danger,
          newProgress
        ),
        text: interpolateColor(
          activeTheme.colors.text,
          targetTheme.colors.text,
          newProgress
        ),
        uiBackground: targetTheme.colors.uiBackground, // Hard to interpolate rgba strings easily, just snap or use target
      },
      environment: {
        skybox: targetTheme.environment.skybox, // Snap
        fogColor: interpolateColor(
          activeTheme.environment.fogColor,
          targetTheme.environment.fogColor,
          newProgress
        ),
        fogDensity: interpolateNum(
          activeTheme.environment.fogDensity,
          targetTheme.environment.fogDensity,
          newProgress
        ),
        starsColor: interpolateColor(
          activeTheme.environment.starsColor,
          targetTheme.environment.starsColor,
          newProgress
        ),
        nebulaPrimary: interpolateColor(
          activeTheme.environment.nebulaPrimary,
          targetTheme.environment.nebulaPrimary,
          newProgress
        ),
        nebulaSecondary: interpolateColor(
          activeTheme.environment.nebulaSecondary,
          targetTheme.environment.nebulaSecondary,
          newProgress
        ),
        particleGlow: interpolateColor(
          activeTheme.environment.particleGlow,
          targetTheme.environment.particleGlow,
          newProgress
        ),
      },
      materials: {
        wireframe: targetTheme.materials.wireframe, // Snap
        emissiveIntensity: interpolateNum(
          activeTheme.materials.emissiveIntensity,
          targetTheme.materials.emissiveIntensity,
          newProgress
        ),
        roughness: interpolateNum(
          activeTheme.materials.roughness,
          targetTheme.materials.roughness,
          newProgress
        ),
        metalness: interpolateNum(
          activeTheme.materials.metalness,
          targetTheme.materials.metalness,
          newProgress
        ),
      },
      animationIntensity: interpolateNum(
        activeTheme.animationIntensity,
        targetTheme.animationIntensity,
        newProgress
      ),
    };

    set({
      activeTheme: interpolatedTheme,
      transitionProgress: newProgress,
    });
  },
}));
