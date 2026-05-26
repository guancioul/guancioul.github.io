(function () {
  const root = document.querySelector('.devstat[data-username]');
  if (!root) return;

  const username = root.dataset.username;
  const CACHE_KEY = `devstat_cache_${username}`;
  const CACHE_TTL = 6 * 60 * 60 * 1000;

  function cacheGet() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const { data, ts } = JSON.parse(raw);
      if (Date.now() - ts > CACHE_TTL) { localStorage.removeItem(CACHE_KEY); return null; }
      return data;
    } catch { return null; }
  }

  function cacheSet(data) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() })); } catch {}
  }

  function render(data) {
    document.getElementById('devstat-score').textContent = data.contributions ?? '—';
    document.getElementById('devstat-sub').textContent =
      data.prs != null ? 'PRs: ' + data.prs + '  |  Issues: ' + data.issues : '';
  }

  const cached = cacheGet();
  if (cached) { render(cached); return; }

  fetch('https://devstats.cncf.io/api/v1', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api: 'GithubIDContributions', payload: { github_id: username } }),
  })
    .then(r => r.json())
    .then(data => { cacheSet(data); render(data); })
    .catch(() => { document.getElementById('devstat-score').textContent = '—'; });
})();
