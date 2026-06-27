import { createContext, useContext } from 'react';

export const WikiDrawerContext = createContext<{ closeDrawer: () => void }>({
  closeDrawer: () => {},
});

export function useWikiDrawer() {
  return useContext(WikiDrawerContext);
}
