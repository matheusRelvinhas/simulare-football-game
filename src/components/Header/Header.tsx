'use client';

import { useGlobalContext } from '@/Context/store';
import './Header.css';

const Header: React.FC = () => {
  const {
    originInputRoad,
  } = useGlobalContext();

  return (
    <header className="main">
      Header
    </header>
  );
};

export default Header;
