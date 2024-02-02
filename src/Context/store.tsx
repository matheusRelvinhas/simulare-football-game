'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { firestore } from '@/assets/firebase';

type Score = {
  orangeTeam: number;
  blueTeam: number;
};

interface TeamStats {
  defeat: number;
  draw: number;
  goals: number;
  ownGoals: number;
  victory: number;
}

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
  handleSimulateGame: () => void;
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
  handleSimulateGame: () => {},
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
  const [isLoading, setIsLoading] = useState(false);
  const [erroMessage, setErrorMessage] = useState('Blue Team');
  const [alert, setAlert] = useState(false);
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

const simulateFootballGame = (): Score => {
  // Probabilidade de ocorrer um gol em geral
  const goalProbability = 0.4;
  // Probabilidade de ocorrer um gol em um determinado momento do jogo
  const momentProbability = 0.1;
  // Gera um número aleatório entre 0 e 1
  const randomNumber = Math.random();
  // Simula o placar com base nas probabilidades
  let orangeTeamScore = 0;
  let blueTeamScore = 0;
  for (let minute = 1; minute <= 90; minute++) {
    // Determina se haverá um gol neste minuto
    if (Math.random() < momentProbability * goalProbability) {
      // Decide qual time marcará o gol
      const scoringTeam = Math.random() < 0.5 ? 'orangeTeam' : 'blueTeam';
      if (scoringTeam === 'orangeTeam') {
        orangeTeamScore += 1;
      } else {
        blueTeamScore += 1;
      }
    }
  }
  console.log(`${orangeTeamScore}${blueTeamScore}`)
  return { orangeTeam: orangeTeamScore, blueTeam: blueTeamScore };
};

const handleSimulateGame = async () => {
  setIsLoading(true);
  try {
    const collectionRef = firestore.collection('teams');
    const orangeRef = collectionRef.doc('orangeID');
    const blueRef = collectionRef.doc('blueID');
    
    const simulate = simulateFootballGame();

    // Atualizar dados para orangeTeam
    const orangeTeamData = await orangeRef.get();
    const orangeTeamStats = orangeTeamData.data() as TeamStats;

    if (simulate.orangeTeam > simulate.blueTeam) {
      // OrangeTeam venceu
      await orangeRef.update({
        victory: orangeTeamStats.victory + 1,
        goals: orangeTeamStats.goals + simulate.orangeTeam,
      });

      await blueRef.update({
        defeat: orangeTeamStats.defeat + 1,
        ownGoals: orangeTeamStats.ownGoals + simulate.blueTeam,
      });
    } else if (simulate.orangeTeam < simulate.blueTeam) {
      // BlueTeam venceu
      await blueRef.update({
        victory: orangeTeamStats.victory + 1,
        goals: orangeTeamStats.goals + simulate.blueTeam,
      });

      await orangeRef.update({
        defeat: orangeTeamStats.defeat + 1,
        ownGoals: orangeTeamStats.ownGoals + simulate.orangeTeam,
      });
    } else {
      // Empate
      await orangeRef.update({
        draw: orangeTeamStats.draw + 1,
        goals: orangeTeamStats.goals + simulate.orangeTeam,
      });

      await blueRef.update({
        draw: orangeTeamStats.draw + 1,
        goals: orangeTeamStats.goals + simulate.blueTeam,
      });
    }
  } catch (error) {
    console.error('Erro ao simular jogo: ', error);
    setErrorMessage('Erro ao simular jogo');
    setAlert(true);
    setTimeout(() => {
      setAlert(false);
      setErrorMessage('');
    }, 3000);
  }
  setIsLoading(false);
};

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
        handleSimulateGame,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
