import { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCcw, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class EnterpriseErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(
      '[Enterprise Error Boundary] Uncaught error:',
      error,
      errorInfo
    );
    this.setState({ errorInfo });
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] p-6 rounded-xl bg-red-950/20 border border-red-500/30 text-white font-sans text-center select-none space-y-4">
          <div className="p-3 rounded-full bg-red-500/20 text-red-400">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold">Platform Exception Isolated</h3>
            <p className="text-xs text-gray-400 max-w-md">
              An unhandled runtime error occurred in this workspace view. The
              core platform isolated the crash.
            </p>
          </div>

          {this.state.error && (
            <div className="p-2.5 rounded bg-black/60 border border-white/10 font-mono text-[10px] text-red-300 max-w-lg text-left overflow-x-auto">
              {this.state.error.toString()}
            </div>
          )}

          <button
            onClick={this.handleReset}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium text-xs flex items-center gap-2 transition-all shadow-[0_0_12px_rgba(239,68,68,0.4)]"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Recover Workspace View</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
