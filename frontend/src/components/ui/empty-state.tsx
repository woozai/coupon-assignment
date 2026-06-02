interface EmptyStateProps {
  message: string;
  title?: string;
}

export const EmptyState = ({
  message,
  title = 'Nothing here yet',
}: EmptyStateProps): JSX.Element => {
  return (
    <section className="page-card state-panel">
      <div className="state-icon state-icon-empty" aria-hidden="true">
        0
      </div>
      <p className="eyebrow">Empty State</p>
      <h2>{title}</h2>
      <p className="state-copy">{message}</p>
    </section>
  );
};
