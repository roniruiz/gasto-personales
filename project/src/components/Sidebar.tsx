import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, History, User } from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <aside className="w-64 bg-blue-800 text-white h-screen">
      <div className="p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              className={`flex items-center p-2 rounded-md hover:bg-blue-700 ${isActive('/')}`}
            >
              <Home className="h-5 w-5 mr-3" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/add-expense"
              className={`flex items-center p-2 rounded-md hover:bg-blue-700 ${isActive('/add-expense')}`}
            >
              <PlusCircle className="h-5 w-5 mr-3" />
              <span>Añadir Gasto</span>
            </Link>
          </li>
          <li>
            <Link
              to="/history"
              className={`flex items-center p-2 rounded-md hover:bg-blue-700 ${isActive('/history')}`}
            >
              <History className="h-5 w-5 mr-3" />
              <span>Historial</span>
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className={`flex items-center p-2 rounded-md hover:bg-blue-700 ${isActive('/profile')}`}
            >
              <User className="h-5 w-5 mr-3" />
              <span>Perfil</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;