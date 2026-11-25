import { Component, StrictMode, Suspense, lazy, useEffect, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/code.css';
import './styles/layout.css';
import './styles/learn.css';
import './styles/practice.css';
import './styles/tools.css';
import './styles/prep.css';
import { AppShell } from './components/layout/AppShell';
import { Toaster } from './components/ui';
import { actions } from './lib/store';
import { Dashboard } from './features/dashboard/Dashboard';
import { LearnHome } from './features/learn/LearnHome';
import { ConceptPage } from './features/learn/ConceptPage';
import { PracticePage } from './features/practice/PracticePage';
import { Lc150Page } from './features/lc150/Lc150Page';

const Workspace = lazy(() => import('./features/practice/Workspace').then((m) => ({ default: m.Workspace })));
const prep = () => import('./features/prep/routes');
const PrepHome = lazy(() => prep().then((m) => ({ default: m.PrepHome })));
const SpacePage = lazy(() => prep().then((m) => ({ default: m.SpacePage })));
const TopicPage = lazy(() => prep().then((m) => ({ default: m.TopicPage })));
const TestRunner = lazy(() => prep().then((m) => ({ default: m.TestRunner })));
const TestResult = lazy(() => prep().then((m) => ({ default: m.TestResult })));
const CompilerPage = lazy(() => import('./features/compiler/CompilerPage').then((m) => ({ default: m.CompilerPage })));
const VisualizePage = lazy(() => import('./features/compiler/CompilerPage').then((m) => ({ default: m.VisualizePage })));

function TitleSync() {
  const { pathname } = useLocation();
  useEffect(() => {
    const seg = pathname.split('/')[1];
    const map: Record<string, string> = { '': 'Dashboard', learn: 'Learn', practice: 'Practice', lc150: 'LeetCode 150', prep: 'Placement Prep', compiler: 'Compiler', visualize: 'Visualizer' };
    document.title = `${map[seg] ?? 'Stepwise'} · Stepwise`;
  }, [pathname]);
  return null;
}

class ErrorBoundary extends Component<{ children: ReactNode; resetKey: string }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidUpdate(prev: { resetKey: string }) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null });
  }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="empty" style={{ paddingTop: 96 }}>
        <strong>Something went wrong on this page</strong>
        <div className="mono xs">{this.state.error.message}</div>
        <button className="btn btn-secondary" style={{ marginTop: 12 }} onClick={() => location.reload()}>
          Reload
        </button>
      </div>
    );
  }
}

function Boundary({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return <ErrorBoundary resetKey={pathname}>{children}</ErrorBoundary>;
}

function Loading() {
  return (
    <div className="running" style={{ height: '100%', justifyContent: 'center' }}>
      <span className="spinner" />
    </div>
  );
}

function App() {
  useEffect(() => {
    actions.init();
  }, []);
  return (
    <BrowserRouter>
      <TitleSync />
      <AppShell>
        <Boundary>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/learn" element={<LearnHome />} />
            <Route path="/learn/:subject/:concept" element={<ConceptPage />} />
            <Route path="/learn/:subject" element={<ConceptPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/practice/:id" element={<Workspace source="practice" />} />
            <Route path="/lc150" element={<Lc150Page />} />
            <Route path="/lc150/:id" element={<Workspace source="lc150" />} />
            <Route path="/prep" element={<PrepHome />} />
            <Route path="/prep/test/:specId" element={<TestRunner />} />
            <Route path="/prep/result/:attemptId" element={<TestResult />} />
            <Route path="/prep/:space" element={<SpacePage />} />
            <Route path="/prep/:space/:topic" element={<TopicPage />} />
            <Route path="/compiler" element={<CompilerPage />} />
            <Route path="/visualize" element={<VisualizePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        </Boundary>
      </AppShell>
      <Toaster />
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
