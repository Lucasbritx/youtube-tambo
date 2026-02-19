import React from 'react';
import { ArrowRight, Plus, Search } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  status?: 'thinking' | 'generating' | 'completed';
}

interface ChatSidebarProps {
  messages?: Message[];
  onSendMessage?: (message: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ 
  messages = [], 
  onSendMessage 
}) => {
  const [inputValue, setInputValue] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && onSendMessage) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">AI Assistant</h2>
        <p className="text-sm text-gray-500 mt-1">Ask about analytics & trends</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-800 text-sm">{message.text}</p>
            </div>
            {message.status && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="animate-spin h-3 w-3 border-2 border-gray-400 border-t-transparent rounded-full" />
                <span className="capitalize">{message.status}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="p-4 space-y-2 border-t border-gray-200">
        <button className="w-full flex items-center justify-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
          <ArrowRight className="w-5 h-5 text-gray-600" />
        </button>
        <button className="w-full flex items-center justify-center gap-2 p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors">
          <Plus className="w-5 h-5" />
        </button>
        <button className="w-full flex items-center justify-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
          <Search className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};
