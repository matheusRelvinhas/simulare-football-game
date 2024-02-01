'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { firestore, storage, auth } from '@/assets/firebase';

interface ContextProps {
  dataCss: Record<string, any>;
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  inputOrange: string;
  setInputOrange: React.Dispatch<React.SetStateAction<string>>;
  inputBlue: string;
  setInputBlue: React.Dispatch<React.SetStateAction<string>>;
  teams: {
    id: string;
    defeat: number;
    draw: number;
    goals: number;
    ownGoals: number;
    victory: number;
  }[];
}

const GlobalContext = createContext<ContextProps>({
  dataCss: {},
  menuOpen: false,
  setMenuOpen: () => {},
  inputOrange: 'Orange Team',
  setInputOrange: () => {},
  inputBlue: 'Blue Team',
  setInputBlue: () => {},
  teams: [],
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

  const [teams, setTeams] = useState<
  {
    id: string;
    defeat: number;
    draw: number;
    goals: number;
    ownGoals: number;
    victory: number;
  }[]
>([]);

  useEffect(() => {
    const collectionRef = firestore.collection('teams');
    const unsubscribe = collectionRef.onSnapshot((snapshot) => {
      const teamsData: {
        id: string;
        defeat: number;
        draw: number;
        goals: number;
        ownGoals: number;
        victory: number;
      }[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        defeat: doc.data().defeat,
        draw: doc.data().draw,
        goals: doc.data().goals,
        ownGoals: doc.data().ownGoals,
        victory: doc.data().victory,
      }));
      setTeams(teamsData);
    });
    return () => {
      unsubscribe(); // Remove o listener quando o componente é desmontado
    };
  }, []);

  useEffect(() => {
    const storedOrangeTeam = localStorage.getItem('orangeTeam') || '';
    const storedBlueTeam = localStorage.getItem('blueTeam') || '';
    setInputOrange(storedOrangeTeam);
    setInputBlue(storedBlueTeam);
  }, []);

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
        teams,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
