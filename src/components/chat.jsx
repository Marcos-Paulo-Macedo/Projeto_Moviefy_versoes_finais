import React, { useState } from 'react';
import './chat.css';

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleChat = () => setOpen(!open);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMsg = { from: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();

      const botMsg = {
        from: 'ia',
        text: data.response || '⚠️ Resposta vazia da IA.',
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('Erro ao chamar a IA:', error);
      const botMsg = {
        from: 'ia',
        text: '⚠️ Erro ao buscar resposta. Tente novamente mais tarde.',
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-widget-container">
      {open && (
        <div className="chat-box">
          <div className="chat-header">
            <span>CineWise 🎥</span>
            <button onClick={toggleChat} className="close-btn">×</button>
          </div>

          <div className="chat-body">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.from}`}>
                <p>{msg.text}</p>
              </div>
            ))}
            {loading && (
              <div className="chat-msg ia">
                <p>⌛ Respondendo...</p>
              </div>
            )}
          </div>

          <div className="chat-footer">
            <input
              type="text"
              placeholder="Digite sua mensagem sobre filmes..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              disabled={loading}
            />
            <button onClick={handleSend} disabled={loading}>Enviar</button>
          </div>
        </div>
      )}

      <button className="chat-toggle" onClick={toggleChat}>💬</button>
    </div>
  );
};

export default ChatWidget;