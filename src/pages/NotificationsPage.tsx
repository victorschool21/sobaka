import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { markNotificationRead, subscribeNotifications } from '../services/notificationService';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import type { AppNotification } from '../types';
import { formatRelativeDate } from '../utils/formatters';

export function NotificationsPage() {
  const { profile } = useAuth();
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    const unsubscribe = subscribeNotifications(profile.uid, (data) => {
      setItems(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [profile]);

  const handleRead = async (notification: AppNotification) => {
    if (!notification.read) {
      await markNotificationRead(notification.id);
    }
  };

  return (
    <div className="page page-narrow">
      <header className="page-header">
        <h1>Notificações</h1>
        <p className="muted">Alertas de ocorrências na sua região.</p>
      </header>

      {loading ? (
        <LoadingSpinner />
      ) : items.length === 0 ? (
        <p className="muted">Nenhuma notificação no momento.</p>
      ) : (
        <ul className="notification-list">
          {items.map((n) => (
            <li key={n.id} className={n.read ? 'read' : 'unread'}>
              <article>
                <h3>{n.title}</h3>
                <p>{n.body}</p>
                <p className="muted small">{formatRelativeDate(n.createdAt)}</p>
                {n.occurrenceId && (
                  <Link to={`/ocorrencias/${n.occurrenceId}`} onClick={() => handleRead(n)}>
                    Ver ocorrência
                  </Link>
                )}
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
