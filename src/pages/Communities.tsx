import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { useCommunities } from '@/hooks/useCommunities';
import { CommunityCard } from '@/components/CommunityCard';
import { CreateCommunityDialog } from '@/components/CreateCommunityDialog';
import { Skeleton } from '@/components/ui/skeleton';

const Communities = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  const { 
    communities, 
    loading, 
    createCommunity,
    joinCommunity,
    leaveCommunity,
    deleteCommunity
  } = useCommunities();

  const filteredCommunities = communities.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateCommunity = async (name: string, description: string) => {
    const newCommunity = await createCommunity(name, description);
    if (newCommunity) {
      navigate(`/chat?community=${newCommunity.id}`);
    }
  };

  const handleSelectCommunity = (communityId: string) => {
    navigate(`/chat?community=${communityId}`);
  };

  return (
    <AppLayout>
      <div className="container max-w-6xl py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🏘️ Comunidades</h1>
          <p className="text-muted-foreground">
            Únete o crea espacios para conectar con personas de intereses similares
          </p>
        </div>

        {/* Search & Create */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar comunidades..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Crear Comunidad
          </Button>
        </div>

        {/* Communities Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : filteredCommunities.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground mb-4">
              {searchQuery ? 'No se encontraron comunidades' : 'No hay comunidades aún'}
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              Crear la Primera Comunidad
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCommunities.map((community) => (
              <CommunityCard
                key={community.id}
                community={community}
                onJoin={joinCommunity}
                onLeave={leaveCommunity}
                onDelete={deleteCommunity}
                onSelect={handleSelectCommunity}
              />
            ))}
          </div>
        )}

        {/* Create Dialog */}
        <CreateCommunityDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onCreate={handleCreateCommunity}
        />
      </div>
    </AppLayout>
  );
};

export default Communities;
