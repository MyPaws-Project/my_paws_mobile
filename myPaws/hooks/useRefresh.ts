import { useState } from "react";

let refreshCallback: (() => void) | null = null;

export function registerRefresh(cb: () => void) {
  refreshCallback = cb;
}

export function triggerRefresh() {
  if (refreshCallback) refreshCallback();
}

export default function useRefresh() {
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return { refreshKey, refresh };
}