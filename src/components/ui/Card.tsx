interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export function Card({ title, children, className = '', actions }: CardProps) {
  return (
    <article className={`card ${className}`.trim()}>
      {(title || actions) && (
        <header className="card-header">
          {title && <h3>{title}</h3>}
          {actions}
        </header>
      )}
      <div className="card-body">{children}</div>
    </article>
  );
}
