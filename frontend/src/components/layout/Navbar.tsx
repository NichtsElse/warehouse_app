import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 border-b bg-white flex items-center justify-end px-6 gap-4">
      {user && (
        <span className="text-sm text-gray-600">{user.name}</span>
      )}
      <Button variant="ghost" size="sm" onClick={logout} className="gap-2 text-gray-600">
        <LogOut size={16} />
        Keluar
      </Button>
    </header>
  );
}
