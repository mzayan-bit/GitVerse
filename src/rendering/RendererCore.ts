import * as THREE from 'three';
import { RenderGraph } from './RenderGraph';
import { LightingEngine } from './LightingEngine';
import { ShaderManager } from './ShaderManager';
import { MaterialLibrary } from './MaterialLibrary';
import { GPUResourceManager } from './GPUResourceManager';
import { RenderProfiler } from './RenderProfiler';
import { PostProcessingPipeline } from './PostProcessingPipeline';
import { ShadowEngine } from './ShadowEngine';

export class RendererCore {
  private static instance: RendererCore | null = null;

  public renderGraph: RenderGraph = new RenderGraph();
  public lightingEngine: LightingEngine = LightingEngine.getInstance();
  public shaderManager: ShaderManager = ShaderManager.getInstance();
  public materialLibrary: MaterialLibrary = MaterialLibrary.getInstance();
  public gpuResources: GPUResourceManager = GPUResourceManager.getInstance();
  public profiler: RenderProfiler = RenderProfiler.getInstance();
  public postProcessing: PostProcessingPipeline = new PostProcessingPipeline();
  public shadowEngine: ShadowEngine = new ShadowEngine();

  public static getInstance(): RendererCore {
    if (!RendererCore.instance) {
      RendererCore.instance = new RendererCore();
    }
    return RendererCore.instance;
  }

  public init(renderer: THREE.WebGLRenderer): void {
    this.postProcessing.applyToRenderer(renderer);
    this.shadowEngine.configureShadows(renderer);
  }

  public render(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera
  ): void {
    const t0 = this.profiler.beginFrame();
    this.renderGraph.executeGraph(renderer, scene, camera);
    this.profiler.endFrame(t0, {
      drawCalls: renderer.info.render.calls,
      triangles: renderer.info.render.triangles,
    });
  }
}
