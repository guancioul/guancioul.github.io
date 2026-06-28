export function NotFoundView() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Page not found.</p>
      <a href="/" className="not-found__link">
        ← Back home
      </a>
    </div>
  );
}
