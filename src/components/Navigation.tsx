import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, User, Trophy, Award, Moon, Sun, Home, Menu, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Navigation = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { signOut } = useAuth();

  const navItems = [
    { path: '/', icon: Home, label: 'Inicio' },
    { path: '/communities', icon: MessageCircle, label: 'Comunidades' },
    { path: '/chat', icon: MessageCircle, label: 'Chat Global' },
    { path: '/profile', icon: User, label: 'Perfil' },
    { path: '/leaderboard', icon: Trophy, label: 'Rankings' },
    { path: '/banners', icon: Award, label: 'Banners' },
    { path: '/banner-settings', icon: Settings, label: 'Configuración de Banners' },
  ];

  return (
    <nav className="fixed top-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="glass border-border/50 bg-background/95 backdrop-blur-md hover:bg-background-secondary"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-48 glass border-border/50 bg-background/95 backdrop-blur-md"
        >
          {navItems.map(({ path, icon: Icon, label }) => (
            <DropdownMenuItem key={path} asChild>
              <Link 
                to={path}
                className={cn(
                  "flex items-center gap-2 cursor-pointer",
                  location.pathname === path && "bg-gradient-primary text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={toggleTheme}
            className="flex items-center gap-2 cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-yellow-400" />
            ) : (
              <Moon className="h-4 w-4 text-blue-400" />
            )}
            Cambiar tema
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={signOut}
            className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};