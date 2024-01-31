'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface ContextProps {
  dataCss: Record<string, any>;
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  inputOrange: string;
  setInputOrange: React.Dispatch<React.SetStateAction<string>>;
  inputBlue: string;
  setInputBlue: React.Dispatch<React.SetStateAction<string>>;
}

const GlobalContext = createContext<ContextProps>({
  dataCss: {},
  menuOpen: false,
  setMenuOpen: () => {},
  inputOrange: 'Orange Team',
  setInputOrange: () => {},
  inputBlue: 'Blue Team',
  setInputBlue: () => {},
});

type GlobalContextProviderProps = {
  children: ReactNode;
};

export const GlobalContextProvider: React.FC<GlobalContextProviderProps> = ({
  children,
}) => {

  const dataCss = {
    logoImage: './img/logo.png',
    orangeImage: './img/orange-team.png',
    blueImage: '/img/blue-team.png',
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const [inputOrange, setInputOrange] = useState('Orange Team');
  const [inputBlue, setInputBlue] = useState('Blue Team');

  return (
    <GlobalContext.Provider
      value={{
        dataCss,
        menuOpen,
        setMenuOpen,
        inputOrange,
        setInputOrange,
        inputBlue,
        setInputBlue,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
