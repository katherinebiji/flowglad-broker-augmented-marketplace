import { useEffect, useRef, useState } from 'react';
import { Honcho } from '@honcho-ai/sdk';

interface Peer {
  id: string;
  name?: string;
  [key: string]: any;
}

interface Session {
  id: string;
  [key: string]: any;
}

interface ChatProps {
  userId: string;
  userName?: string;
}

export default function Chat({ userId, userName }: ChatProps) {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const honchoRef = useRef<any>(null);

  useEffect(() => {
    async function setupPeerAndSession() {
      setLoading(true);
      setError(null);
      try {
        if (!honchoRef.current) {
          honchoRef.current = new Honcho({});
        }
        // Try to get or create the peer
        let peer = await honchoRef.current.peer(userId);
        if (!peer) {
          peer = await honchoRef.current.createPeer({ id: userId, name: userName });
        }
        setPeer(peer);
        // Create a new session for this peer
        const session = await honchoRef.current.createSession({ peerId: peer.id });
        setSession(session);
      } catch (err: any) {
        setError(err.message || 'Failed to initialize chat');
      } finally {
        setLoading(false);
      }
    }
    if (userId) {
      setupPeerAndSession();
    }
  }, [userId, userName]);

  async function sendMessage() {
    if (!input.trim() || !session || !peer) return;
    setLoading(true);
    setError(null);
    try {
      setMessages((msgs) => [...msgs, { sender: 'user', text: input }]);
      const response = await honchoRef.current.sendMessage({
        sessionId: session.id,
        peerId: peer.id,
        text: input,
      });
      setMessages((msgs) => [...msgs, { sender: 'agent', text: response.text }]);
      setInput('');
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto border rounded p-4">
      <h2 className="text-lg font-bold mb-2">AI Broker Chat</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="h-64 overflow-y-auto bg-gray-50 p-2 mb-2 rounded">
        {messages.map((msg, i) => (
          <div key={i} className={msg.sender === 'user' ? 'text-right' : 'text-left'}>
            <span className={msg.sender === 'user' ? 'bg-blue-200' : 'bg-green-200'} style={{ borderRadius: 8, padding: 4, display: 'inline-block', margin: 2 }}>
              <b>{msg.sender === 'user' ? 'You' : 'Broker'}:</b> {msg.text}
            </span>
          </div>
        ))}
      </div>
      <form
        className="flex gap-2"
        onSubmit={e => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <input
          className="flex-1 border rounded px-2 py-1"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
          placeholder="Type your message..."
        />
        <button
          className="bg-blue-500 text-white px-4 py-1 rounded"
          type="submit"
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}
