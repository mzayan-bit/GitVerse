import { useState } from 'react';
import {
  Sparkles,
  Play,
  Building2,
  Video,
  Camera,
  CheckCircle,
  Clock,
  Compass,
} from 'lucide-react';
import { DemoManager } from '@/demo/DemoManager';
import { OrganizationFactory, DemoOrgMeta } from '@/demo/OrganizationFactory';
import { ConferenceDemoMode } from '@/demo/showcase/ConferenceDemoMode';

export function DemoLauncherPanel() {
  const demoMgr = DemoManager.getInstance();
  const conference = ConferenceDemoMode.getInstance();

  const [activeOrg, setActiveOrg] = useState<DemoOrgMeta>(
    demoMgr.getActiveOrg()
  );
  const [screenshotSuccess, setScreenshotSuccess] = useState(false);

  const handleSelectOrg = (orgId: string) => {
    demoMgr.switchOrg(orgId);
    setActiveOrg(demoMgr.getActiveOrg());
  };

  const handleRecruiterQuickTour = () => {
    conference.launchRecruiterQuickTour();
    setActiveOrg(demoMgr.getActiveOrg());
  };

  const handleInvestorShowcase = () => {
    conference.launchInvestorShowcase();
    setActiveOrg(demoMgr.getActiveOrg());
  };

  const handleTakeScreenshot = () => {
    setScreenshotSuccess(true);
    setTimeout(() => setScreenshotSuccess(false), 2000);
  };

  return (
    <div className="flex flex-col h-full text-xs font-sans text-gray-200 select-none space-y-3">
      {/* Header Banner */}
      <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-white text-sm">
            Demo Launcher & Keynote Hub
          </span>
        </div>
        <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px] border border-indigo-500/40">
          60s First Impression
        </span>
      </div>

      {/* Recruiter Quick Tour Hero Button */}
      <div className="p-3 rounded-lg bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/40 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-indigo-300 font-semibold">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Recruiter 60-Second Quick Tour</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
            RECOMMENDED
          </span>
        </div>
        <p className="text-[11px] text-gray-300 leading-relaxed">
          Instantly loads Netflix micro-service universe and starts narrated
          camera fly-through.
        </p>
        <button
          onClick={handleRecruiterQuickTour}
          className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(99,102,241,0.5)]"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Launch 60s Keynote Showcase</span>
        </button>
      </div>

      {/* Organization Gallery */}
      <div className="space-y-2 border-t border-white/10 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-indigo-400 font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>Enterprise Organization Gallery</span>
          </div>
          <span className="text-[10px] text-gray-400 font-mono">
            10 Worlds Available
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {OrganizationFactory.DEMO_ORGS.map((org) => (
            <button
              key={org.id}
              onClick={() => handleSelectOrg(org.id)}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                activeOrg.id === org.id
                  ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.3)]'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className="font-bold text-xs"
                  style={{
                    color:
                      org.logoColor !== '#000000' ? org.logoColor : '#ffffff',
                  }}
                >
                  {org.name}
                </span>
                <span className="text-[9px] font-mono text-gray-400">
                  {org.category}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 line-clamp-1">
                {org.tagline}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Conference & Showcase Actions */}
      <div className="space-y-2 border-t border-white/10 pt-3">
        <div className="flex items-center gap-1.5 text-indigo-400 font-semibold">
          <Video className="w-3.5 h-3.5" />
          <span>Conference Mode & Export</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleInvestorShowcase}
            className="p-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Investor Showcase</span>
          </button>

          <button
            onClick={handleTakeScreenshot}
            className="p-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all"
          >
            <Camera className="w-3.5 h-3.5 text-purple-400" />
            <span>HQ Screenshot</span>
          </button>
        </div>

        {screenshotSuccess && (
          <div className="p-2 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-2 text-[11px] animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>High-Resolution Viewport Captured!</span>
          </div>
        )}
      </div>
    </div>
  );
}
