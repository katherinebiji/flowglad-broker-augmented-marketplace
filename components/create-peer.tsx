import { useEffect, useState } from 'react';
import { Honcho } from '@honcho-ai/sdk';

interface Peer {
  id: string;
  name?: string;
  [key: string]: any;
}

interface CreatePeerProps {
  userId: string;
  userName?: string;
  onPeerCreated?: (peer: Peer) => void;
}

export default function CreatePeer({ userId, userName, onPeerCreated }: CreatePeerProps) {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function createPeer() {
      setLoading(true);
      setError(null);
      try {
        const client = new Honcho({});
        const peer = await client.peer(userId);
        setPeer(peer);
        if (onPeerCreated) onPeerCreated(peer);
      } catch (err: any) {
        setError(err.message || 'Failed to create peer');
      } finally {
        setLoading(false);
      }
    }
    if (userId) {
      createPeer();
    }
  }, [userId, userName, onPeerCreated]);

  if (loading) return <div>Creating peer...</div>;
  if (error) return <div>Error: {error}</div>;
  if (peer) return <div>Peer created: {peer.name || peer.id}</div>;
  return null;
}
