interface LoadingStateProps {
  message: string;
  title?: string;
}

export const LoadingState = ({
  message,
  title = 'Loading',
}: LoadingStateProps): JSX.Element => {
  return (
    <section className="page-card state-panel">
      <div className="state-icon state-icon-loading" aria-hidden="true" />
      <p className="eyebrow">Please Wait</p>
      <h2>{title}</h2>
      <p className="state-copy">{message}</p>
    </section>
  );
};
