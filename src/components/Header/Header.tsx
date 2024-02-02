'use client';

import { useGlobalContext } from '@/Context/store';
import './Header.css';

const Header: React.FC = () => {
  const {
    dataCss,
    menuOpen,
    setMenuOpen,
    inputOrange,
    setInputOrange,
    inputBlue,
    setInputBlue,
    handleReset,
  } = useGlobalContext();

  const getReady = async () => {
    localStorage.setItem('orangeTeam', inputOrange);
    localStorage.setItem('blueTeam', inputBlue);
    setMenuOpen(false);
  }

  return (
    <>
      <header className="header">
        <figure>
          <picture>
            <source src={dataCss.logoImage} type="image/png" />
            <img src={dataCss.logoImage} alt="logo-img" />
          </picture>
        </figure>
      </header>
      <label className="container">
        <input
          checked={menuOpen}
          type="checkbox"
          onClick={() => setMenuOpen(!menuOpen)}
          key={'menuOpen'}
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
      <div className={`tab-up ${!menuOpen ? 'closed' : ''}`}>
        <div className={'tab-up-container'}>
          <div className="tab-up-team-div">
            <input
              placeholder="Orange Team Name"
              type="text"
              className="input-orange"
              value={inputOrange}
              onChange={(e) => setInputOrange(e.target.value)}
            />
            <figure>
              <picture>
                <source src={dataCss.orangeImage} type="image/png" />
                <img src={dataCss.orangeImage} alt="orange-img" />
              </picture>
            </figure>
          </div>
          <span className="VS">VS</span>
          <div className="tab-up-team-div">
            <input
              placeholder="Blue Team Name"
              type="text"
              className="input-blue"
              value={inputBlue}
              onChange={(e) => setInputBlue(e.target.value)}
            />
            <figure>
              <picture>
                <source src={dataCss.blueImage} type="image/png" />
                <img src={dataCss.blueImage} alt="blue-img" />
              </picture>
            </figure>
          </div>
        </div>
        <div className="buttons reset-buttons">
          <button className="btn" onClick={handleReset}>
            <span></span>
            <p data-start="Good Luck!" data-text="Reseted" data-title="Reset"></p>
          </button>
        </div>
        <div className="buttons">
          <button className="btn" onClick={getReady}>
            <span></span>
            <p data-start="Good Luck!" data-text="GO!" data-title="Ready?"></p>
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;
