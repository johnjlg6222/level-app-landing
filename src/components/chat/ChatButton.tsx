'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
  hasNewMessages?: boolean;
}

export function ChatButton({ isOpen, onClick, hasNewMessages }: ChatButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600
                 text-white shadow-lg shadow-blue-500/25
                 flex items-center justify-center
                 hover:shadow-blue-500/40 transition-shadow"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isOpen ? 90 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.div>

      {/* Notification badge */}
      {hasNewMessages && !isOpen && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full
                        flex items-center justify-center text-[10px] font-bold">
          !
        </span>
      )}

      {/* Pulse effect when closed */}
      {!isOpen && (
        <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20" />
      )}
    </motion.button>
  );
}

export default ChatButton;
