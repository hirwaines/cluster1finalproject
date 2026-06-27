import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';

export function useDashboardTab<T extends string>(
  defaultTab: T,
  validTabs: readonly T[],
): [T, (tab: T) => void] {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const raw = params.get('tab');
    if (raw && validTabs.includes(raw as T)) {
      return raw as T;
    }
    return defaultTab;
  }, [location.search, defaultTab, validTabs]);

  const setTab = (tab: T) => {
    const params = new URLSearchParams(location.search);
    params.set('tab', tab);
    const nextSearch = params.toString();
    navigate(
      { pathname: location.pathname, search: nextSearch ? `?${nextSearch}` : '' },
      { replace: true },
    );
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const raw = params.get('tab');
    if (raw && validTabs.includes(raw as T)) {
      return;
    }
    params.set('tab', defaultTab);
    navigate(
      { pathname: location.pathname, search: `?${params.toString()}` },
      { replace: true },
    );
  }, [location.pathname, location.search, defaultTab, validTabs, navigate]);

  return [activeTab, setTab];
};
