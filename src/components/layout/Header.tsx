import React from 'react';
import { Menu } from 'lucide-react';
import { User } from '../../types';

interface HeaderProps {
  title: string;
  user: User | null;
  onMenuToggle: (e: React.MouseEvent) => void;
}

const Header: React.FC<HeaderProps> = ({ title, user, onMenuToggle }) => {
  return (
    <header className="app-header">
      <button className="btn-icon" onClick={onMenuToggle}>
        <Menu size={24} />
      </button>
      <h2 id="page-title">{title}</h2>
      {user && (
        <div className="user-profile">
          <span id="user-initials">{user.avatarInitial}</span>
        </div>
      )}
    </header>
  );
};

export default Header;
