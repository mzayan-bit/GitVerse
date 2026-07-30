import { PanelInstance } from './PanelController';
import { DockableWindowContainer } from './panels/DockableWindowContainer';
import { RepositoryExplorerPanel } from './panels/RepositoryExplorerPanel';
import { UniverseInspectorPanel } from './panels/UniverseInspectorPanel';
import { KnowledgeGraphPanel } from './panels/KnowledgeGraphPanel';
import { SimulationPanel } from './panels/SimulationPanel';
import { MetricsPanel } from './panels/MetricsPanel';
import { TimelinePanel } from './panels/TimelinePanel';
import { ActivityFeedPanel } from './panels/ActivityFeedPanel';
import { SearchResultsPanel } from './panels/SearchResultsPanel';
import { BookmarksPanel } from './panels/BookmarksPanel';
import { InvestigationsPanel } from './panels/InvestigationsPanel';
import { PropertiesInspectorPanel } from './panels/PropertiesInspectorPanel';
import { CosmosControlPanel } from './panels/CosmosControlPanel';
import { GraphicsControlPanel } from './panels/GraphicsControlPanel';
import { SpatialAICopilotPanel } from './panels/SpatialAICopilotPanel';

import { ExtensionMarketplacePanel } from './panels/ExtensionMarketplacePanel';

import { ReleaseCenterPanel } from './panels/ReleaseCenterPanel';
import { DemoLauncherPanel } from './panels/DemoLauncherPanel';

import { SettingsPanel } from './panels/SettingsPanel';

interface PanelRendererProps {
  panel: PanelInstance;
}

export function PanelRenderer({ panel }: PanelRendererProps) {
  const renderContent = () => {
    switch (panel.type) {
      case 'settings':
        return <SettingsPanel />;
      case 'release':
        return <ReleaseCenterPanel />;
      case 'demo':
        return <DemoLauncherPanel />;
      case 'marketplace':
        return <ExtensionMarketplacePanel />;
      case 'graphics':
        return <GraphicsControlPanel />;
      case 'cosmos':
        return <CosmosControlPanel />;
      case 'explorer':
        return <RepositoryExplorerPanel />;
      case 'inspector':
        return <UniverseInspectorPanel />;
      case 'graph':
        return <KnowledgeGraphPanel />;
      case 'ai':
        return <SpatialAICopilotPanel />;
      case 'simulation':
        return <SimulationPanel />;
      case 'metrics':
        return <MetricsPanel />;
      case 'timeline':
        return <TimelinePanel />;
      case 'activity':
        return <ActivityFeedPanel />;
      case 'search':
        return <SearchResultsPanel />;
      case 'bookmarks':
        return <BookmarksPanel />;
      case 'investigations':
        return <InvestigationsPanel />;
      case 'properties':
        return <PropertiesInspectorPanel />;
      default:
        return <div className="text-gray-400 text-xs">Panel Content</div>;
    }
  };

  return (
    <DockableWindowContainer panel={panel}>
      {renderContent()}
    </DockableWindowContainer>
  );
}
