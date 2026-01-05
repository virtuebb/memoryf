import { createContext, useContext } from 'react';

import { useDmController } from '../model';

const DmContext = createContext(null);

export function DmProvider({ children }) {
	const value = useDmController();
	return <DmContext.Provider value={value}>{children}</DmContext.Provider>;
}

/**
 * useDm 훅 - DM 상태와 함수 사용
 */
export function useDm() {
  const context = useContext(DmContext);
  
  if (!context) {
    throw new Error('useDm must be used within a DmProvider');
  }
  
  return context;
}
