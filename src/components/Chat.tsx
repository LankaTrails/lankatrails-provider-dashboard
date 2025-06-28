import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Message {
  id: number;
  sender: 'provider' | 'tourist';
  text: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'tourist', text: 'Hi, is the tour available on 4th July?' },
    { id: 2, sender: 'provider', text: 'Yes, it is available! Would you like to book?' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, sender: 'provider', text: input.trim() },
    ]);
    setInput('');
  };

  return (
    <Card className="h-[32rem] flex flex-col">
      <CardHeader>
        <CardTitle>Chat with Tourists</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-xs px-4 py-2 rounded-lg text-sm ${msg.sender === 'provider' ? 'bg-primary-500 text-white ml-auto' : 'bg-gray-100'}`}
          >
            {msg.text}
          </div>
        ))}
      </CardContent>
      <div className="p-4 border-t flex gap-2">
        <Input
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </Card>
  );
};

export default Chat;
