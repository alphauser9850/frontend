import React, { useState, useEffect, useRef } from 'react';
import { createChat } from '@n8n/chat';
import '@n8n/chat/style.css';
import { MessageCircle, X } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useLocation } from 'react-router-dom';

// We're defining our own simplified version of the interface
// that only includes the properties we're using
interface SimplifiedChatOptions {
  webhookUrl: string;
  theme?: 'light' | 'dark' | Record<string, unknown>;
  mode?: 'window' | 'fullscreen';
  showWelcomeScreen?: boolean;
  i18n?: {
    en: {
      title: string;
      subtitle: string;
      inputPlaceholder: string;
      closeButtonTooltip: string;
    }
  };
}

const ChatBubble: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode } = useThemeStore();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  
  // Don't show chat bubble on lab pages or lesson pages
  const hideChatRoutes = ['/lab/', '/courses/'];
  const shouldHideChat = hideChatRoutes.some(route => location.pathname.includes(route) && location.pathname.split('/').length > 3);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  useEffect(() => {
    if (isOpen && chatContainerRef.current) {
      // Clear any existing content
      chatContainerRef.current.innerHTML = '';
      
      // Create chat instance
      const chatOptions: SimplifiedChatOptions = {
        webhookUrl: 'https://ccielab.app.n8n.cloud/webhook/bd0702b0-f3cf-418b-990a-074bfe286271/chat',
        theme: isDarkMode ? 'dark' : 'light',
        mode: 'window',
        showWelcomeScreen: true,
        i18n: {
          en: {
            title: 'CCIE LAB Support',
            subtitle: 'Ask us anything about our services',
            inputPlaceholder: 'Type your message...',
            closeButtonTooltip: 'Close chat',
          }
        }
      };
      
      // @ts-ignore - We're using a simplified version of the interface
      createChat(chatOptions).mount(chatContainerRef.current);
    }
  }, [isOpen, isDarkMode]);

  if (shouldHideChat) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="relative">
          <div className="absolute bottom-0 right-0 mb-16 w-80 sm:w-96 h-[500px] rounded-lg shadow-lg overflow-hidden">
            <div ref={chatContainerRef} className="w-full h-full"></div>
          </div>
        </div>
      )}
      
      <button
        onClick={toggleChat}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-colors"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};

export default ChatBubble; 