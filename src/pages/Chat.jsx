import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { supabase } from '../lib/supabase';
import { setMessages, addMessage } from '../store/slices/chatSlice';
import { MessageSquare, Send, Bot, User as UserIcon, Trash2 } from 'lucide-react';

export default function Chat() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const messages = useSelector((state) => state.chat.messages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (data) {
      dispatch(setMessages(data));
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! I'm your healthcare assistant. How can I help you today? You can ask me about appointments, medications, symptoms, or general health advice.";
    }

    if (lowerMessage.includes('appointment')) {
      return "I can help you with appointments! You can book, view, or manage your appointments by going to the Appointments section. Would you like me to guide you through the process?";
    }

    if (
      lowerMessage.includes('symptom') ||
      lowerMessage.includes('sick') ||
      lowerMessage.includes('pain')
    ) {
      return "I understand you're experiencing some symptoms. While I can provide general information, it's important to consult with a healthcare professional for proper diagnosis. Would you like to schedule an appointment with a doctor?";
    }

    if (
      lowerMessage.includes('medication') ||
      lowerMessage.includes('medicine') ||
      lowerMessage.includes('drug')
    ) {
      return "For medication-related questions, I recommend consulting with your doctor or pharmacist. They can provide accurate information about dosage, side effects, and interactions. Would you like to schedule a consultation?";
    }

    if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
      return "If this is a medical emergency, please call emergency services immediately (911 in the US). For urgent but non-emergency concerns, you can schedule a same-day appointment or visit an urgent care facility.";
    }

    if (
      lowerMessage.includes('file') ||
      lowerMessage.includes('upload') ||
      lowerMessage.includes('document')
    ) {
      return "You can upload and manage your medical files in the Medical Files section. This includes lab results, prescriptions, imaging reports, and other medical documents. Would you like help organizing your files?";
    }

    if (
      lowerMessage.includes('profile') ||
      lowerMessage.includes('information')
    ) {
      return "You can view and update your profile information including medical history, allergies, and emergency contacts in the Profile section. Keeping this information up to date helps healthcare providers give you better care.";
    }

    return "I'm here to help with your healthcare needs. You can ask me about appointments, medications, symptoms, medical files, or general health information. How can I assist you today?";
  };

  const handleSend = async () => {
    if (!input.trim() || !user) return;

    setLoading(true);

    const userMessage = {
      user_id: user.id,
      message: input,
      sender: 'user',
      created_at: new Date().toISOString(),
    };

    const { data: userMsg } = await supabase
      .from('chat_messages')
      .insert([userMessage])
      .select()
      .single();

    if (userMsg) {
      dispatch(addMessage(userMsg));
    }

    const botResponse = getBotResponse(input);

    setTimeout(async () => {
      const botMessage = {
        user_id: user.id,
        message: botResponse,
        sender: 'bot',
        created_at: new Date().toISOString(),
      };

      const { data: botMsg } = await supabase
        .from('chat_messages')
        .insert([botMessage])
        .select()
        .single();

      if (botMsg) {
        dispatch(addMessage(botMsg));
      }

      setLoading(false);
    }, 1000);

    setInput('');
  };

  const handleClearChat = async () => {
    if (!user || !confirm('Are you sure you want to clear all messages?')) return;

    await supabase.from('chat_messages').delete().eq('user_id', user.id);
    dispatch(setMessages([]));
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                AI Healthcare Assistant
              </h1>
              <p className="text-sm text-gray-600">Always here to help you</p>
            </div>
          </div>

          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm font-medium">Clear Chat</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-blue-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to Healthcare Assistant
              </h2>
              <p className="text-gray-600 mb-6">
                Start a conversation! Ask me anything about your health,
                appointments, or medical information.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {[
                  'Schedule an appointment',
                  'Ask about symptoms',
                  'Medication information',
                  'Upload medical files',
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-left"
                  >
                    <p className="text-sm font-medium text-gray-900">
                      {suggestion}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex items-start space-x-3 max-w-2xl ${
                    msg.sender === 'user'
                      ? 'flex-row-reverse space-x-reverse'
                      : ''
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-blue-600'
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    {msg.sender === 'user' ? (
                      <UserIcon className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-blue-600" />
                    )}
                  </div>

                  <div
                    className={`px-4 py-3 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                    <p
                      className={`text-xs mt-2 ${
                        msg.sender === 'user'
                          ? 'text-blue-100'
                          : 'text-gray-500'
                      }`}
                    >
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-2xl">
                <div className="bg-white border border-gray-200 p-2 rounded-lg">
                  <Bot className="w-5 h-5 text-blue-600" />
                </div>
                <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.4s' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type your message here..."
                rows={1}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
