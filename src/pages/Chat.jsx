import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { supabase } from '../lib/supabase';
import { setMessages, addMessage } from '../store/slices/chatSlice';

export default function Chat() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const messages = useSelector((state) => state.chat.messages);

  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user) fetchMessages();
  }, [user]);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', user.id);

    dispatch(setMessages(data || []));
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const messageObj = {
      user_id: user.id,
      message: input,
      sender: 'user',
      created_at: new Date().toISOString(),
    };

    const { data } = await supabase
      .from('chat_messages')
      .insert([messageObj])
      .select()
      .single();

    dispatch(addMessage(data));
    setInput('');
  };

  return (
    <div className="p-6">
      {messages.map((m) => (
        <div key={m.id}>{m.message}</div>
      ))}
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
