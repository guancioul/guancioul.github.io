(function () {
  const root     = document.getElementById('gh-contributions');
  const username = root.dataset.username;

  const PER_PAGE    = 5;
  const API_BATCH   = 100;
  const CACHE_TTL   = 10 * 60 * 1000;

  const panels = {
    issues: {
      container: document.getElementById('gh-issue-list'),
      countEl:   document.getElementById('gh-issues-count'),
      type:      'issue',
      page:      1,
      items:     null,
    },
    prs: {
      container: document.getElementById('gh-pr-list'),
      countEl:   document.getElementById('gh-prs-count'),
      type:      'pr',
      page:      1,
      items:     null,
    },
  };

  let activeTab = 'prs';

  // ── Cache ─────────────────────────────────────────────────────────────────

  function cacheKey(type) {
    return `gh_cache_${username}_${type}_all`;
  }

  function cacheGet(type) {
    try {
      const raw = localStorage.getItem(cacheKey(type));
      if (!raw) return null;
      const { data, ts } = JSON.parse(raw);
      if (Date.now() - ts > CACHE_TTL) { localStorage.removeItem(cacheKey(type)); return null; }
      return data;
    } catch { return null; }
  }

  function cacheSet(type, data) {
    try {
      localStorage.setItem(cacheKey(type), JSON.stringify({ data, ts: Date.now() }));
    } catch {}
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  function apiUrl(type, page) {
    const qualifier = type === 'issue'
      ? `involves:${username}+type:issue`
      : `author:${username}+type:pr`;
    return `https://api.github.com/search/issues?q=${qualifier}+is:public+-user:${username}&per_page=${API_BATCH}&page=${page}&sort=updated&order=desc`;
  }

  function timeAgo(dateStr) {
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60)       return `${Math.floor(diff)} seconds ago`;
    if (diff < 3600)     return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400)    return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 2592000)  return `${Math.floor(diff / 86400)} days ago`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
    return `${Math.floor(diff / 31536000)} years ago`;
  }

  function icon(id, cls) {
    return `<svg class="${cls}" aria-hidden="true"><use href="#${id}"></use></svg>`;
  }

  function repoFromUrl(url) {
    const m = url.match(/repos\/([^/]+\/[^/]+)\//);
    return m ? m[1] : '';
  }

  // ── Status icons ─────────────────────────────────────────────────────────

  function prStatusIcon(item) {
    if (item.pull_request && item.pull_request.merged_at)
      return icon('icon-pr-merged', 'gh-pr-icon gh-pr-icon--merged');
    if (item.draft)
      return icon('icon-pr-draft', 'gh-pr-icon gh-pr-icon--draft');
    if (item.state === 'open')
      return icon('icon-pr-open', 'gh-pr-icon gh-pr-icon--open');
    return icon('icon-pr-closed', 'gh-pr-icon gh-pr-icon--closed');
  }

  function issueStatusIcon(item) {
    if (item.state === 'open')
      return icon('icon-issue-open', 'gh-pr-icon gh-pr-icon--open');
    return icon('icon-issue-closed', 'gh-pr-icon gh-pr-icon--issue-closed');
  }

  // ── Fetch all pages ───────────────────────────────────────────────────────

  async function fetchAll(type) {
    const cached = cacheGet(type);
    if (cached) return cached;

    let items = [];
    let page  = 1;
    let total = Infinity;

    while (items.length < total && items.length < 1000) {
      const data = await fetch(apiUrl(type, page), { headers: { Accept: 'application/vnd.github.v3+json' } })
        .then(r => r.json());
      total = data.total_count || 0;
      items = items.concat(data.items || []);
      if ((data.items || []).length < API_BATCH) break;
      page++;
    }

    cacheSet(type, items);
    return items;
  }

  // ── Pagination HTML ───────────────────────────────────────────────────────

  function renderPagination(panel, totalItems) {
    const totalPages = Math.ceil(totalItems / PER_PAGE);
    if (totalPages <= 1) return '';

    const pages = [1];
    if (panel.page > 3) pages.push('...');
    for (let p = Math.max(2, panel.page - 1); p <= Math.min(totalPages - 1, panel.page + 1); p++) {
      pages.push(p);
    }
    if (panel.page < totalPages - 2) pages.push('...');
    if (totalPages > 1) pages.push(totalPages);

    const pageButtons = pages.map(p => {
      if (p === '...') return `<span class="gh-pagination-ellipsis">…</span>`;
      const active = p === panel.page ? ' gh-pagination-btn--active' : '';
      return `<button class="gh-pagination-btn${active}" data-page="${p}" ${p === panel.page ? 'aria-current="page"' : ''}>${p}</button>`;
    }).join('');

    const prevDisabled = panel.page === 1           ? ' disabled' : '';
    const nextDisabled = panel.page === totalPages  ? ' disabled' : '';

    return `
      <div class="gh-pagination">
        <button class="gh-pagination-btn gh-pagination-btn--nav" data-page="${panel.page - 1}"${prevDisabled} aria-label="Previous page">&#8592;</button>
        ${pageButtons}
        <button class="gh-pagination-btn gh-pagination-btn--nav" data-page="${panel.page + 1}"${nextDisabled} aria-label="Next page">&#8594;</button>
      </div>`;
  }

  // ── Render ────────────────────────────────────────────────────────────────

  function renderPanel(panel) {
    const all        = panel.items;
    const openCount  = all.filter(i => i.state === 'open').length;
    const closedCount = all.filter(i => i.state !== 'open').length;
    const isPR       = panel.type === 'pr';

    panel.countEl.textContent = all.length;

    if (!all.length) {
      panel.container.innerHTML = `<p class="gh-pr-empty">No contributions found.</p>`;
      return;
    }

    const start     = (panel.page - 1) * PER_PAGE;
    const pageItems = all.slice(start, start + PER_PAGE);

    const cards = pageItems.map(item => {
      const repo        = repoFromUrl(item.repository_url);
      const isMerged    = item.pull_request && item.pull_request.merged_at;
      const statusLabel = isMerged ? 'Merged'
                        : item.draft ? 'Draft'
                        : item.state === 'open' ? 'Open' : 'Closed';
      const association = item.author_association;
      const showBadge   = association && association !== 'NONE';
      const badgeLabel  = association ? association.charAt(0) + association.slice(1).toLowerCase() : '';
      const assocBadge  = showBadge ? `<span class="gh-pr-association">${badgeLabel}</span>` : '';
      const statusIco   = isPR ? prStatusIcon(item) : issueStatusIcon(item);
      const dateVal     = isMerged ? item.pull_request.merged_at : item.created_at;

      return `
      <div class="gh-pr-item">
        <div class="gh-pr-left">
          ${statusIco}
          <div class="gh-pr-info">
            <div class="gh-pr-title">
              <span class="gh-pr-repo">${repo}</span>
              <a class="gh-pr-link" href="${item.html_url}" target="_blank" rel="noopener">${item.title}</a>
            </div>
            <div class="gh-pr-meta">
              #${item.number} by ${item.user.login} ${assocBadge} ${statusLabel} ${timeAgo(dateVal)}
            </div>
          </div>
        </div>
      </div>`;
    }).join('');

    const displayStart = start + 1;
    const displayEnd   = Math.min(start + PER_PAGE, all.length);

    const openIconHtml   = isPR
      ? icon('icon-pr-open',    'gh-pr-icon gh-pr-icon--open gh-pr-icon--sm')
      : icon('icon-issue-open', 'gh-pr-icon gh-pr-icon--open gh-pr-icon--sm');
    const closedIconHtml = icon('icon-pr-merged', 'gh-pr-icon gh-pr-icon--merged gh-pr-icon--sm');

    panel.container.innerHTML = `
      <div class="gh-pr-header">
        <span class="gh-pr-count gh-pr-count--open">
          ${openIconHtml} ${openCount} Open
        </span>
        <span class="gh-pr-count gh-pr-count--closed">
          ${closedIconHtml} ${closedCount} Closed
        </span>
        <span class="gh-pr-page-info">${displayStart}–${displayEnd} of ${all.length}</span>
      </div>
      <div class="gh-pr-items">${cards}</div>
      ${renderPagination(panel, all.length)}`;

    panel.container.querySelectorAll('.gh-pagination-btn[data-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = parseInt(btn.dataset.page, 10);
        if (!isNaN(p) && p !== panel.page) {
          panel.page = p;
          renderPanel(panel);
        }
      });
    });
  }

  // ── Load panel ────────────────────────────────────────────────────────────

  function loadPanel(panel) {
    if (panel.items) { renderPanel(panel); return; }

    const label = panel.type === 'pr' ? 'pull requests' : 'issues';
    panel.container.innerHTML = `<div class="gh-pr-loading"><span class="gh-spinner"></span> Loading ${label}...</div>`;

    fetchAll(panel.type)
      .then(items => { panel.items = items; renderPanel(panel); })
      .catch(() => {
        panel.container.innerHTML = `<p class="gh-pr-empty">Failed to load ${label}. GitHub API rate limit may have been exceeded.</p>`;
      });
  }

  // ── Tab switching ─────────────────────────────────────────────────────────

  root.querySelectorAll('.gh-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.tab;
      if (key === activeTab) return;
      activeTab = key;

      root.querySelectorAll('.gh-tab').forEach(t => {
        const isActive = t.dataset.tab === key;
        t.classList.toggle('gh-tab--active', isActive);
        t.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      Object.entries(panels).forEach(([k, p]) => {
        const show = k === key;
        p.container.style.display = show ? '' : 'none';
        p.container.dataset.active = show ? 'true' : 'false';
        if (show) loadPanel(p);
      });
    });
  });

  // ── Initial load ──────────────────────────────────────────────────────────

  loadPanel(panels.prs);

  // Pre-fetch issues in background so tab switch is instant
  fetchAll('issue')
    .then(items => { panels.issues.items = items; panels.issues.countEl.textContent = items.length; })
    .catch(() => {});
})();
