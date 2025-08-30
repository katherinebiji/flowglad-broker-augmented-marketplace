import { useState } from 'react';
import Link from 'next/link';
import { useHoncho } from '@/context/honchoProvider';

export default function Chat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { peer, session, error, sendMessage, user } = useHoncho();

  async function handleSendMessage() {
    if (!input.trim() || !session || !peer) return;
    setLoading(true);
    try {
      setMessages((msgs) => [...msgs, { sender: 'user', text: input }]);
      const response = await sendMessage(input);
      setMessages((msgs) => [...msgs, { sender: 'agent', text: response.text }]);
      setInput('');
    } catch (err: any) {
      console.error('Failed to send message:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto border rounded p-4">
      <h2 className="text-lg font-bold mb-2">AI Broker Chat</h2>
      <div className="mb-4">
        <Link href="/">
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded transition">
            Go back to Vercel Boilerplate
          </button>
        </Link>
      </div>
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
          handleSendMessage();
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
