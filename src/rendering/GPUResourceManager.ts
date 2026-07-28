import * as THREE from 'three';

export class GPUResourceManager {
  private static instance: GPUResourceManager | null = null;

  private textureMap: Map<string, THREE.Texture> = new Map();
  private bufferMap: Map<string, THREE.BufferAttribute> = new Map();
  private allocatedMemoryBytes = 0;

  public static getInstance(): GPUResourceManager {
    if (!GPUResourceManager.instance) {
      GPUResourceManager.instance = new GPUResourceManager();
    }
    return GPUResourceManager.instance;
  }

  public registerTexture(key: string, texture: THREE.Texture): THREE.Texture {
    if (this.textureMap.has(key)) {
      return this.textureMap.get(key)!;
    }
    this.textureMap.set(key, texture);
    this.allocatedMemoryBytes += 1024 * 1024 * 4; // ~4MB per texture estimate
    return texture;
  }

  public registerBuffer(
    key: string,
    buffer: THREE.BufferAttribute
  ): THREE.BufferAttribute {
    this.bufferMap.set(key, buffer);
    this.allocatedMemoryBytes += buffer.array.byteLength;
    return buffer;
  }

  public getGPUAllocatedMemoryMB(): number {
    return parseFloat((this.allocatedMemoryBytes / (1024 * 1024)).toFixed(2));
  }

  public disposeAll(): void {
    this.textureMap.forEach((t) => t.dispose());
    this.textureMap.clear();
    this.bufferMap.clear();
    this.allocatedMemoryBytes = 0;
  }
}
