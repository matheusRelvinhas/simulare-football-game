'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface ContextProps {
  originInputRoad: string;
  cepOriginFound: boolean;
}

const GlobalContext = createContext<ContextProps>({
  originInputRoad: '',
  cepOriginFound: false,
});

type GlobalContextProviderProps = {
  children: ReactNode;
};

export const GlobalContextProvider: React.FC<GlobalContextProviderProps> = ({
  children,
}) => {

  const [originInputRoad, setOriginInputRoad] = useState('');
  const [cepOriginFound, setCepOriginFound] = useState(false);

  return (
    <GlobalContext.Provider
      value={{
        originInputRoad,
        cepOriginFound,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
