'use client';

import { useGlobalContext } from '@/Context/store';
import './Main.css';

const Main: React.FC = () => {
  const {
    originInputRoad,
  } = useGlobalContext();

  return (
    <main className="main">
      Main
    </main>
  );
};

export default Main;
