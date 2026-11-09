import {createContext, useContext, useState} from 'react';

const SidebarVisibilityContext = createContext(null);

export function SidebarVisibilityProvider({children}) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <SidebarVisibilityContext.Provider value={{collapsed, setCollapsed}}>
      <div
        className="doc-library-app"
        data-sidebar-collapsed={collapsed}
      >
        {children}
      </div>
    </SidebarVisibilityContext.Provider>
  );
}

export const useSidebarVisibility = () => useContext(SidebarVisibilityContext);
