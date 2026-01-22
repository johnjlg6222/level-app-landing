'use client';

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ChatButton } from './ChatButton';
import { ChatPanel } from './ChatPanel';
import { useChat } from '@/hooks/useChat';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, status, error, sendMessage, clearMessages } = useChat();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <ChatPanel
            messages={messages}
            status={status}
            error={error}
            onSend={sendMessage}
            onClear={clearMessages}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>

      <ChatButton isOpen={isOpen} onClick={handleToggle} />
    </div>
  );
}

export default ChatWidget;
