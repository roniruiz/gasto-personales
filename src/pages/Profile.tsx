import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import { User, Mail, Lock, Save } from 'lucide-react';

const Profile: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || '');
        setName(user.user_metadata?.name || '');
      }
    };
    
    getProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Actualizar nombre
      const { error: updateError } = await supabase.auth.updateUser({
        data: { name }
      });
      
      if (updateError) throw updateError;

      // Actualizar email
      if (email !== supabase.auth.getUser().then(({ data }) => data.user?.email)) {
        const { error: emailError } = await supabase.auth.updateUser({
          email
        });
        
        if (emailError) throw emailError;
      }

      // Actualizar contraseña
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          throw new Error('Las contraseñas nuevas no coinciden');
        }

        const { error: passwordError } = await supabase.auth.updateUser({
          password: newPassword
        });
        
        if (passwordError) throw passwordError;
        
        // Limpiar campos de contraseña
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }

      setSuccess('Perfil actualizado correctamente');
    } catch (err: any) {
      setError('Error al actualizar el perfil: ' + (err.message || 'Intente nuevamente'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleUpdateProfile}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Nombre
              </div>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Correo Electrónico
              </div>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="border-t border-gray-200 my-6 pt-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Lock className="h-5 w-5 mr-2" />
              Cambiar Contraseña
            </h2>

            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-2">
                Nueva Contraseña
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                minLength={6}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                Confirmar Nueva Contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></span>
            ) : (
              <Save className="h-5 w-5 mr-2" />
            )}
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;