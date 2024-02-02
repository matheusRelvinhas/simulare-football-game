'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { firestore } from '@/assets/firebase';

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
  orangeProbability: number;
  blueProbability: number;
  lastResultOrange: number;
  lastResultBlue: number;
  isLoading: boolean;
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
  orangeProbability: 50,
  blueProbability: 50,
  lastResultOrange: 0,
  lastResultBlue: 0,
  isLoading: false,
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
  const [orangeProbability, setOrangeProbability] = useState(50);
  const [blueProbability, setBlueProbability] = useState(50);
  const [lastResultOrange, setLastResultOrange] = useState(0);
  const [lastResultBlue, setLastResultBlue] = useState(0);

  const simulateFootballGame = async () => {
    try {
      const response = await fetch(
        'https://simulare-football-game-api.vercel.app/simulate'
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSimulateGame = async () => {
    setIsLoading(true);
    try {
      const collectionRef = firestore.collection('teams');
      const orangeRef = collectionRef.doc('orangeID');
      const blueRef = collectionRef.doc('blueID');
      const simulate = await simulateFootballGame();
      // Verifique se 'simulate' não é undefined
      if (simulate) {
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
        setLastResultOrange(simulate.orangeTeam);
        setLastResultBlue(simulate.blueTeam);
      } else {
        console.error('Error: Simulate data is undefined.');
      }
    } catch (error) {
      console.error('Erro ao simular jogo: ', error);
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
    // Calcula a probabilidade de vitória com base nos dados de cada time
    if (teams.length === 2) {
      const orangeTeamTotalMatches = teams[1].victory + teams[1].defeat;
      const blueTeamTotalMatches = teams[0].victory + teams[0].defeat;
      const orangeTeamProbability =
        (teams[1].victory / orangeTeamTotalMatches) * 100;
      const blueTeamProbability = 100 - orangeTeamProbability;
      // Adicione uma variável para a quantidade total de gols
      const totalGoals = teams.reduce((total, team) => total + team.goals, 0);
      // Calcula a probabilidade com base na quantidade total de gols
      const orangeTeamGolProbability = (teams[1].goals / totalGoals) * 100;
      const blueTeamGolProbability = (teams[0].goals / totalGoals) * 100;
      // Pondera a probabilidade com base nos gols marcados
      const finalOrangeProbability =
        (orangeTeamProbability + orangeTeamGolProbability) / 2;
      const finalBlueProbability =
        (blueTeamProbability + blueTeamGolProbability) / 2;
      // Atualiza os estados com as probabilidades
      setOrangeProbability(finalOrangeProbability);
      setBlueProbability(finalBlueProbability);
    }
  }, [teams]);

  useEffect(() => {
    const storedOrangeTeam =
      localStorage.getItem('orangeTeam') || 'Orange Team';
    const storedBlueTeam = localStorage.getItem('blueTeam') || 'Blue Team';
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
        orangeProbability,
        blueProbability,
        lastResultOrange,
        lastResultBlue,
        isLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
