'use client';

import { useGlobalContext } from '@/Context/store';
import './Header.css';
import { useState } from 'react';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <label className="container">
        <input
          checked={menuOpen}
          type="checkbox"
          onClick={() => setMenuOpen(!menuOpen)}
        />
        <svg
          viewBox="0 0 512 512"
          height="1em"
          xmlns="http://www.w3.org/2000/svg"
          className="chevron-down"
        >
          <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path>
        </svg>
      </label>
      <header className={`header ${!menuOpen ? 'closed' : ''}`}>
        <div className="custom-select-container">
          <svg
            y="0"
            xmlns="http://www.w3.org/2000/svg"
            x="0"
            width="100"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
            height="100"
            className="custom-select-svg"
          >
            <path
              strokeWidth="4"
              strokeLinejoin="round"
              strokeLinecap="round"
              fill="none"
              d="M60.7,53.6,50,64.3m0,0L39.3,53.6M50,64.3V35.7m0,46.4A32.1,32.1,0,1,1,82.1,50,32.1,32.1,0,0,1,50,82.1Z"
            ></path>
          </svg>
          <select className="custom-select">
            <option>HTML</option>
            <option>React</option>
            <option>Vue</option>
            <option>Angular</option>
            <option>Svelte</option>
          </select>
        </div>
        <span>VS</span>
        <div className="custom-select-container-2">
          <svg
            y="0"
            xmlns="http://www.w3.org/2000/svg"
            x="0"
            width="100"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
            height="100"
            className="custom-select-svg-2"
          >
            <path
              strokeWidth="4"
              strokeLinejoin="round"
              strokeLinecap="round"
              fill="none"
              d="M60.7,53.6,50,64.3m0,0L39.3,53.6M50,64.3V35.7m0,46.4A32.1,32.1,0,1,1,82.1,50,32.1,32.1,0,0,1,50,82.1Z"
            ></path>
          </svg>
          <select className="custom-select">
            <option>HTML</option>
            <option>React</option>
            <option>Vue</option>
            <option>Angular</option>
            <option>Svelte</option>
          </select>
        </div>
      </header>
    </>
  );
};

export default Header;
