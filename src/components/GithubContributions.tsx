import { useEffect, useState } from 'react';
import { cacheGet, cacheSet } from '../lib/cache';
import { mockGithubItems } from '../lib/mockData';
import {
  IssueClosedIcon,
  IssueOpenIcon,
  PrClosedIcon,
  PrDraftIcon,
  PrMergedIcon,
  PrOpenIcon,
} from './StatusIcons';
import './GithubContributions.css';

const PER_PAGE = 5;
const API_BATCH = 100;
const CACHE_TTL = 10 * 60 * 1000;

interface GithubItem {
  number: number;
  title: string;
  html_url: string;
  state: 'open' | 'closed';
  draft?: boolean;
  created_at: string;
  author_association: string;
  repository_url: string;
  user: { login: string };
  pull_request?: { merged_at: string | null };
}

type TabKey = 'prs' | 'issues';

function cacheKey(username: string, type: 'pr' | 'issue') {
  return `gh_cache_${username}_${type}_all`;
}

function apiUrl(username: string, type: 'pr' | 'issue', page: number) {
  const qualifier = type === 'issue' ? `involves:${username}+type:issue` : `author:${username}+type:pr`;
  return `https://api.github.com/search/issues?q=${qualifier}+is:public+-user:${username}&per_page=${API_BATCH}&page=${page}&sort=updated&order=desc`;
}

async function fetchAll(username: string, type: 'pr' | 'issue'): Promise<GithubItem[]> {
  if (import.meta.env.DEV) return mockGithubItems(type);

  const cached = cacheGet<GithubItem[]>(cacheKey(username, type), CACHE_TTL);
  if (cached) return cached;

  let items: GithubItem[] = [];
  let page = 1;
  let total = Infinity;

  while (items.length < total && items.length < 1000) {
    const data = await fetch(apiUrl(username, type, page), {
      headers: { Accept: 'application/vnd.github.v3+json' },
    }).then((r) => r.json());
    total = data.total_count || 0;
    const pageItems: GithubItem[] = data.items || [];
    items = items.concat(pageItems);
    if (pageItems.length < API_BATCH) break;
    page++;
  }

  cacheSet(cacheKey(username, type), items);
  return items;
}

function timeAgo(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
  return `${Math.floor(diff / 31536000)} years ago`;
}

function repoFromUrl(url: string) {
  const m = url.match(/repos\/([^/]+\/[^/]+)$/);
  return m ? m[1] : '';
}

function PrStatusIcon({ item }: { item: GithubItem }) {
  if (item.pull_request?.merged_at) return <PrMergedIcon className="gh-pr-icon gh-pr-icon--merged" />;
  if (item.draft) return <PrDraftIcon className="gh-pr-icon gh-pr-icon--draft" />;
  if (item.state === 'open') return <PrOpenIcon className="gh-pr-icon gh-pr-icon--open" />;
  return <PrClosedIcon className="gh-pr-icon gh-pr-icon--closed" />;
}

function IssueStatusIcon({ item }: { item: GithubItem }) {
  if (item.state === 'open') return <IssueOpenIcon className="gh-pr-icon gh-pr-icon--open" />;
  return <IssueClosedIcon className="gh-pr-icon gh-pr-icon--issue-closed" />;
}

function buildPageList(page: number, totalPages: number): (number | '...')[] {
  const pages: (number | '...')[] = [1];
  if (page > 3) pages.push('...');
  for (let p = Math.max(2, page - 1); p <= Math.min(totalPages - 1, page + 1); p++) {
    pages.push(p);
  }
  if (page < totalPages - 2) pages.push('...');
  if (totalPages > 1) pages.push(totalPages);
  return pages;
}

function Pagination({ page, totalItems, onPageChange }: { page: number; totalItems: number; onPageChange: (p: number) => void }) {
  const totalPages = Math.ceil(totalItems / PER_PAGE);
  if (totalPages <= 1) return null;

  return (
    <div className="gh-pagination">
      <button
        type="button"
        className="gh-pagination-btn gh-pagination-btn--nav"
        disabled={page === 1}
        aria-label="Previous page"
        onClick={() => onPageChange(page - 1)}
      >
        &#8592;
      </button>
      {buildPageList(page, totalPages).map((p, i) =>
        p === '...' ? (
          <span className="gh-pagination-ellipsis" key={`ellipsis-${i}`}>
            …
          </span>
        ) : (
          <button
            type="button"
            key={p}
            className={`gh-pagination-btn${p === page ? ' gh-pagination-btn--active' : ''}`}
            aria-current={p === page ? 'page' : undefined}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ),
      )}
      <button
        type="button"
        className="gh-pagination-btn gh-pagination-btn--nav"
        disabled={page === totalPages}
        aria-label="Next page"
        onClick={() => onPageChange(page + 1)}
      >
        &#8594;
      </button>
    </div>
  );
}

function Panel({ type, items, error }: { type: TabKey; items: GithubItem[] | null; error: boolean }) {
  const [page, setPage] = useState(1);
  const isPR = type === 'prs';
  const label = isPR ? 'pull requests' : 'issues';

  if (error) {
    return <p className="gh-pr-empty">Failed to load {label}. GitHub API rate limit may have been exceeded.</p>;
  }

  if (!items) {
    return (
      <div className="gh-pr-loading">
        <span className="gh-spinner" /> Loading {label}...
      </div>
    );
  }

  if (!items.length) {
    return <p className="gh-pr-empty">No contributions found.</p>;
  }

  const openCount = items.filter((i) => i.state === 'open').length;
  const closedCount = items.length - openCount;
  const start = (page - 1) * PER_PAGE;
  const pageItems = items.slice(start, start + PER_PAGE);
  const displayStart = start + 1;
  const displayEnd = Math.min(start + PER_PAGE, items.length);

  return (
    <>
      <div className="gh-pr-header">
        <span className="gh-pr-count gh-pr-count--open">
          {isPR ? <PrOpenIcon className="gh-pr-icon gh-pr-icon--open gh-pr-icon--sm" /> : <IssueOpenIcon className="gh-pr-icon gh-pr-icon--open gh-pr-icon--sm" />}
          {openCount} Open
        </span>
        <span className="gh-pr-count gh-pr-count--closed">
          <PrMergedIcon className="gh-pr-icon gh-pr-icon--merged gh-pr-icon--sm" />
          {closedCount} Closed
        </span>
        <span className="gh-pr-page-info">
          {displayStart}–{displayEnd} of {items.length}
        </span>
      </div>
      <div className="gh-pr-items">
        {pageItems.map((item) => {
          const repo = repoFromUrl(item.repository_url);
          const isMerged = !!item.pull_request?.merged_at;
          const statusLabel = isMerged ? 'Merged' : item.draft ? 'Draft' : item.state === 'open' ? 'Open' : 'Closed';
          const association = item.author_association;
          const showBadge = association && association !== 'NONE';
          const badgeLabel = association ? association.charAt(0) + association.slice(1).toLowerCase() : '';
          const dateVal = isMerged ? item.pull_request!.merged_at! : item.created_at;

          return (
            <div className="gh-pr-item" key={item.html_url}>
              <div className="gh-pr-left">
                {isPR ? <PrStatusIcon item={item} /> : <IssueStatusIcon item={item} />}
                <div className="gh-pr-info">
                  <div className="gh-pr-title">
                    <span className="gh-pr-repo">{repo}</span>
                    <a className="gh-pr-link" href={item.html_url} target="_blank" rel="noopener">
                      {item.title}
                    </a>
                  </div>
                  <div className="gh-pr-meta">
                    #{item.number} by {item.user.login} {showBadge && <span className="gh-pr-association">{badgeLabel}</span>} {statusLabel} {timeAgo(dateVal)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Pagination page={page} totalItems={items.length} onPageChange={setPage} />
    </>
  );
}

export function GithubContributions({ username }: { username: string }) {
  const [activeTab, setActiveTab] = useState<TabKey>('prs');
  const [prItems, setPrItems] = useState<GithubItem[] | null>(null);
  const [issueItems, setIssueItems] = useState<GithubItem[] | null>(null);
  const [prError, setPrError] = useState(false);
  const [issueError, setIssueError] = useState(false);

  useEffect(() => {
    fetchAll(username, 'pr')
      .then(setPrItems)
      .catch(() => setPrError(true));
    fetchAll(username, 'issue')
      .then(setIssueItems)
      .catch(() => setIssueError(true));
  }, [username]);

  return (
    <div className="gh-contributions">
      <nav className="gh-tabs" role="tablist">
        <button
          type="button"
          className={`gh-tab${activeTab === 'prs' ? ' gh-tab--active' : ''}`}
          role="tab"
          aria-selected={activeTab === 'prs'}
          onClick={() => setActiveTab('prs')}
        >
          <PrOpenIcon className="gh-tab-icon" />
          Pull Requests
          <span className="gh-tab-count">{prItems ? prItems.length : '…'}</span>
        </button>
        <button
          type="button"
          className={`gh-tab${activeTab === 'issues' ? ' gh-tab--active' : ''}`}
          role="tab"
          aria-selected={activeTab === 'issues'}
          onClick={() => setActiveTab('issues')}
        >
          <IssueOpenIcon className="gh-tab-icon" />
          Issues
          <span className="gh-tab-count">{issueItems ? issueItems.length : '…'}</span>
        </button>
      </nav>

      <div className="gh-pr-list" style={{ display: activeTab === 'prs' ? undefined : 'none' }}>
        <Panel type="prs" items={prItems} error={prError} />
      </div>
      <div className="gh-pr-list" style={{ display: activeTab === 'issues' ? undefined : 'none' }}>
        <Panel type="issues" items={issueItems} error={issueError} />
      </div>
    </div>
  );
}
