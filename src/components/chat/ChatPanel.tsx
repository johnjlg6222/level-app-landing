'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Trash2, Bot } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import type { ChatMessage as ChatMessageType, ChatStatus } from '@/types/chat';

interface ChatPanelProps {
  messages: ChatMessageType[];
  status: ChatStatus;
  error: string | null;
  onSend: (message: string) => void;
  onClear: () => void;
  onClose: () => void;
}

export function ChatPanel({
  messages,
  status,
  error,
  onSend,
  onClear,
  onClose,
}: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isLoading = status === 'loading' || status === 'streaming';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="absolute bottom-20 right-0 w-[400px] h-[500px]
                 bg-[#0F1115]/95 backdrop-blur-xl border border-white/10
                 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Bot size={18} className="text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">Assistant Level App</h3>
            <p className="text-xs text-gray-500">Posez vos questions</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={onClear}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Effacer la conversation"
            >
              <Trash2 size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
              <Bot size={32} className="text-purple-400" />
            </div>
            <h4 className="text-white font-medium mb-2">Bonjour !</h4>
            <p className="text-gray-400 text-sm">
              Je suis l&apos;assistant Level App. Posez-moi vos questions sur nos services, tarifs ou processus.
            </p>
            <div className="mt-6 space-y-2 w-full">
              <SuggestionButton
                text="Combien coute une app ?"
                onClick={() => onSend("Combien coûte le développement d'une application ?")}
              />
              <SuggestionButton
                text="Quels sont vos delais ?"
                onClick={() => onSend("En combien de temps pouvez-vous développer une application ?")}
              />
              <SuggestionButton
                text="Comment demarrer ?"
                onClick={() => onSend("Comment démarrer un projet avec Level App ?")}
              />
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                isStreaming={
                  status === 'streaming' &&
                  index === messages.length - 1 &&
                  message.role === 'assistant'
                }
              />
            ))}
          </>
        )}

        {/* Loading indicator */}
        {status === 'loading' && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <Bot size={16} className="text-purple-400" />
            </div>
            <div className="bg-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-white/10 bg-white/5">
        <ChatInput onSend={onSend} isLoading={isLoading} />
      </div>
    </motion.div>
  );
}

function SuggestionButton({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full px-4 py-2.5 text-left text-sm text-gray-300
                 bg-white/5 border border-white/10 rounded-xl
                 hover:bg-white/10 hover:border-white/20 transition-colors"
    >
      {text}
    </button>
  );
}

export default ChatPanel;
