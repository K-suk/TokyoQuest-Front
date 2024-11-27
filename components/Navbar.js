// components/Navbar.js
import Link from 'next/link';
import { useEffect } from 'react';
import LogoutButton from './LogoutButton';
import Image from 'next/image';

function Navbar() {
  useEffect(() => {
    // Apply styles for the burger menu icon
    const style = document.createElement('style');
    style.innerHTML = `
            .navbar-toggler {
                border-color: rgba(255, 255, 255, 0.2);
            }
            .navbar-toggler-icon {
                background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba(255, 255, 255, 1)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
            }
        `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#EF454A'}}>
      <div className="container px-4 px-lg-5">
        <Link href="/" legacyBehavior>
          <a className="navbar-brand" style={{ color: '#fff' }}>
            <img src='/images/logoBlackWhite.png' width={100} height={50}></img>
          </a>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li className="nav-item">
              <Link href="/" legacyBehavior>
                <a className="nav-link active" aria-current="page" style={{ color: '#fff' }}>Home</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/profile" legacyBehavior>
                <a className="nav-link" style={{ color: '#fff' }}>Profile</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/completed-quests" legacyBehavior>
                <a className="nav-link" style={{ color: '#fff' }}>Completed Quests</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/saved-quests" legacyBehavior>
                <a className="nav-link" style={{ color: '#fff' }}>Saved Quests</a>
              </Link>
            </li>
          </ul>
          <ul className="d-flex navbar-nav">
            <li className="nav-item">
              <Link href="/change-password" legacyBehavior>
                <a className="nav-link" style={{ color: '#fff' }}>Change Password</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/travel-plan" legacyBehavior>
                <a className="nav-link" style={{ color: '#fff' }}>Make Travel</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/quests-map" legacyBehavior>
                <a className="nav-link" style={{ color: '#fff' }}>Map</a>
              </Link>
            </li>
            <li className="nav-item">
              <LogoutButton />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
