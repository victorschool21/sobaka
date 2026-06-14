import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Send } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { sendMessage, subscribeMessages } from '../../services/chatService';
import type { ChatMessage } from '../../types';
import { chatMessageSchema } from '../../utils/validators';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function ChatPanel({ occurrenceId }: { occurrenceId: string }) {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = subscribeMessages(occurrenceId, setMessages);
    return unsubscribe;
  }, [occurrenceId]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setError(null);
    const parsed = chatMessageSchema.safeParse({ content });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Mensagem inválida');
      return;
    }
    setSending(true);
    try {
      await sendMessage({
        occurrenceId,
        senderId: profile.uid,
        senderName: profile.displayName,
        content: parsed.data.content,
      });
      setContent('');
    } catch {
      setError('Não foi possível enviar a mensagem.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="chat-panel" aria-label="Chat da ocorrência">
      <div className="chat-messages" ref={listRef} role="log" aria-live="polite" aria-relevant="additions">
        {messages.length === 0 && <p className="muted">Nenhuma mensagem ainda. Inicie a conversa.</p>}
        {messages.map((msg) => (
          <article
            key={msg.id}
            className={`chat-message ${msg.senderId === profile?.uid ? 'mine' : ''}`}
          >
            <strong>{msg.senderName}</strong>
            <p>{msg.content}</p>
          </article>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="chat-form">
        <Input
          label="Mensagem"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escreva uma atualização..."
          error={error ?? undefined}
        />
        <Button type="submit" loading={sending} aria-label="Enviar mensagem">
          <Send size={16} aria-hidden="true" />
        </Button>
      </form>
    </section>
  );
}
