interface ErrorStateProps {
  message: string;
  title?: string;
}

export const ErrorState = ({
  message,
  title = 'Something went wrong',
}: ErrorStateProps): JSX.Element => {
  return (
    <section className="page-card state-panel">
      <div className="state-icon state-icon-error" aria-hidden="true">
        !
      </div>
      <p className="eyebrow">Error</p>
      <h2>{title}</h2>
      <p className="state-copy">{message}</p>
    </section>
  );
};
