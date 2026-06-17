import { useEffect, useState } from 'react';
import { cacheGet, cacheSet } from '../lib/cache';
import './DevStat.css';

const CACHE_TTL = 6 * 60 * 60 * 1000;

interface DevStatData {
  contributions?: number;
}

export function DevStat({ username }: { username: string }) {
  const [data, setData] = useState<DevStatData | null>(() => cacheGet<DevStatData>(`devstat_cache_${username}`, CACHE_TTL));
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const key = `devstat_cache_${username}`;
    if (cacheGet<DevStatData>(key, CACHE_TTL)) return;

    fetch('https://devstats.cncf.io/api/v1', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api: 'GithubIDContributions', payload: { github_id: username } }),
    })
      .then((r) => r.json())
      .then((result: DevStatData) => {
        cacheSet(key, result);
        setData(result);
      })
      .catch(() => setFailed(true));
  }, [username]);

  const score = failed ? '—' : data?.contributions ?? '…';

  return (
    <div className="devstat">
      <div className="devstat-card devstat-card--score">
        <span className="devstat-card-label">CNCF Score</span>
        <span className="devstat-card-value">{score}</span>
      </div>
    </div>
  );
}
