'use client';

import React from 'react';
import { 
  MessageInput, 
  MessageInputSubmitButton, 
  MessageInputTextarea 
} from '@/components/tambo/message-input';
import { ScrollableMessageContainer } from '@/components/tambo/scrollable-message-container';
import { ThreadContent, ThreadContentMessages } from '@/components/tambo/thread-content';
import { ArrowRight, Plus, Search } from 'lucide-react';

interface ChatSidebarProps {
  className?: string;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ className }) => {
  return (
    <div className={`w-96 bg-white border-l border-gray-200 flex flex-col h-full ${className || ''}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">AI Assistant</h2>
        <p className="text-sm text-gray-500 mt-1">Ask about analytics & trends</p>
      </div>

      {/* Messages - Integrated with Tambo */}
      <ScrollableMessageContainer className="flex-1 p-6">
        <ThreadContent>
          <ThreadContentMessages />
        </ThreadContent>
      </ScrollableMessageContainer>

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

      {/* Input Area - Integrated with Tambo */}
      <div className="p-4 border-t border-gray-200">
        <MessageInput>
          <div className="flex items-center gap-2">
            <MessageInputTextarea 
              placeholder="Ask about analytics & trends..."
              className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <MessageInputSubmitButton className="p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              <ArrowRight className="w-5 h-5" />
            </MessageInputSubmitButton>
          </div>
        </MessageInput>
      </div>
    </div>
  );
};
