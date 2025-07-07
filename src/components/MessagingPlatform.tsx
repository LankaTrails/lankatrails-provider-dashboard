import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Conversation {
  id: number;
  name: string;
  avatar?: string; // url or undefined for initials
  messages: Message[];
}

interface Message {
  id: number;
  sender: 'provider' | 'tourist';
  text: string;
  timestamp: string; // ISO string
}

// Temporary static data – in real app fetch from backend
const sampleConversations: Conversation[] = [
  {
    id: 1,
    name: 'John Smith',
    messages: [
      { id: 1, sender: 'tourist', text: 'Hi, is the tour available on 4th July?', timestamp: '2025-06-17T17:48:00' },
      { id: 2, sender: 'provider', text: 'Yes, it is available! Would you like to book?', timestamp: '2025-06-17T17:50:00' },
    ],
  },
  {
    id: 2,
    name: 'Emma Wilson',
    messages: [
      { id: 1, sender: 'tourist', text: 'Can we get a discount for 5 people?', timestamp: '2025-06-18T11:20:00' },
      { id: 2, sender: 'provider', text: 'Sure, I can offer 10% off.', timestamp: '2025-06-18T11:25:00' },
    ],
  },
  {
    id: 3,
    name: 'David Chen',
    messages: [
      { id: 1, sender: 'tourist', text: 'What time does the safari start?', timestamp: '2025-06-19T08:00:00' },
      { id: 2, sender: 'provider', text: 'We start at 6am sharp.', timestamp: '2025-06-19T08:05:00' },
    ],
  },
];

const MessagingPlatform = () => {
  const [conversations, setConversations] = useState<Conversation[]>(sampleConversations);
  const [selectedId, setSelectedId] = useState<number>(conversations[0].id);
  const [input, setInput] = useState('');

  const current = conversations.find((c) => c.id === selectedId)!;

  const sendMessage = () => {
    if (!input.trim()) return;
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedId
          ? {
              ...conv,
              messages: [
                ...conv.messages,
                { id: conv.messages.length + 1, sender: 'provider', text: input.trim(), timestamp: new Date().toISOString() },
              ],
            }
          : conv
      )
    );
    setInput('');
  };

  return (
    <Card className="rounded-lg border bg-card text-card-foreground shadow-sm h-[30rem] flex flex-col overflow-hidden">
      <div className="flex flex-1">
        {/* conversation list */}
        <div className="w-56 border-r bg-muted/50">
          <ScrollArea className="h-full">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 focus:outline-none transition-colors ${
                  conv.id === selectedId
                    ? 'bg-primary-100/60 dark:bg-primary-900/40'
                    : 'hover:bg-muted/60 dark:hover:bg-muted/40'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-medium uppercase">
                  {conv.avatar ? (
                    <img src={conv.avatar} alt={conv.name} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    conv.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="font-medium truncate">{conv.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {(() => {
                    const txt = conv.messages[conv.messages.length - 1]?.text || '';
                    return txt.length > 30 ? txt.slice(0, 30).trimEnd() + '...' : txt;
                  })()}
                  </p>
                </div>
              </button>
            ))}
          </ScrollArea>
        </div>

        {/* chat pane */}
        <div className="flex-1 flex flex-col">
          {/* header */}
          <div className="px-4 py-3 border-b font-semibold">{current.name}</div>
          {/* messages */}
          <ScrollArea className="flex-1 p-4 space-y-4">
            {current.messages.map((msg, idx) => {
              const prev = current.messages[idx - 1];
              const showDate = !prev || prev.timestamp.split('T')[0] !== msg.timestamp.split('T')[0];
              const dateStr = new Date(msg.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
              const timeStr = new Date(msg.timestamp).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
              return (
                <>
                  {showDate && (
                    <div className="text-center text-xs text-muted-foreground my-2 select-none">
                      {dateStr}
                    </div>
                  )}
                  <div
                    key={msg.id}
                    className={`max-w-xs px-4 py-2 rounded-lg text-sm break-words relative ${
                      msg.sender === 'provider'
                        ? 'bg-primary-500 text-white ml-auto'
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}
                  >
                    {msg.text}
                    <span className="block text-[10px] opacity-75 mt-1 text-right">
                      {timeStr}
                    </span>
                  </div>
                </>
              );
            })}
          </ScrollArea>
          {/* input */}
          <div className="p-4 border-t flex gap-2">
            <Input
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MessagingPlatform;
