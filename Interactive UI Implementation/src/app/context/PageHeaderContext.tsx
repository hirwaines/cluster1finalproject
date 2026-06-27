import {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  type ReactNode,
} from 'react';
import { useLocation } from 'react-router';
import type { PageMeta } from '../components/layout/pageMeta';

type PageHeaderState = {
  override: Partial<PageMeta> | null;
  actions: ReactNode;
  setOverride: (meta: Partial<PageMeta> | null) => void;
  setActions: (actions: ReactNode) => void;
};

const PageHeaderContext = createContext<PageHeaderState | null>(null);

export function PageHeaderProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [override, setOverride] = useState<Partial<PageMeta> | null>(null);
  const [actions, setActions] = useState<ReactNode>(null);

  useEffect(() => {
    setOverride(null);
    setActions(null);
  }, [location.pathname, location.search]);

  const value = useMemo(
    () => ({ override, actions, setOverride, setActions }),
    [override, actions],
  );

  return <PageHeaderContext.Provider value={value}>{children}</PageHeaderContext.Provider>;
}

export function usePageHeaderContext() {
  const ctx = useContext(PageHeaderContext);
  if (!ctx) {
    throw new Error('usePageHeaderContext must be used within PageHeaderProvider');
  }
  return ctx;
}

/** Override title/description for dynamic pages (e.g. funder welcome). */
export function usePageHeaderMeta(title?: string, description?: string) {
  const { setOverride } = usePageHeaderContext();
  useEffect(() => {
    if (!title && !description) {
      setOverride(null);
      return;
    }
    setOverride({ title, description });
    return () => setOverride(null);
  }, [title, description, setOverride]);
}

/** Register action buttons for the shell page header. */
export function usePageHeaderActions(actions: ReactNode | null) {
  const { setActions } = usePageHeaderContext();
  useEffect(() => {
    setActions(actions ?? null);
    return () => setActions(null);
  }, [actions, setActions]);
}
