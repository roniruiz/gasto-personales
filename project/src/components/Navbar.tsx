import React from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { LogOut, User } from 'lucide-react';

interface NavbarProps {
  user: any;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">Seguimiento de Gastos</span>
            </Link>
          </div>
          <div className="flex items-center">
            <div className="ml-4 flex items-center md:ml-6">
              <Link to="/profile" className="flex items-center mr-4">
                <User className="h-5 w-5 mr-1" />
                <span>{user.email}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md"
              >
                <LogOut className="h-5 w-5 mr-1" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;