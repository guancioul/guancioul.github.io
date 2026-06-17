import { useEffect, useState } from 'react';
import { cacheGet, cacheSet } from '../lib/cache';
import './LeetCodeStats.css';

const CACHE_TTL = 60 * 60 * 1000;
const API_BASE = 'https://alfa-leetcode-api.onrender.com';

interface LeetCodeData {
  solvedProblem: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  contestRating: number;
  contestAttend: number;
  contestTopPercentage: number;
}

function cacheKey(username: string) {
  return `leetcode_cache_${username}`;
}

export function LeetCodeStats({ username }: { username: string }) {
  const [data, setData] = useState<LeetCodeData | null>(() => cacheGet<LeetCodeData>(cacheKey(username), CACHE_TTL));
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const key = cacheKey(username);
    if (cacheGet<LeetCodeData>(key, CACHE_TTL)) return;

    Promise.all([
      fetch(`${API_BASE}/${username}/solved`).then((r) => r.json()),
      fetch(`${API_BASE}/${username}/contest`).then((r) => r.json()),
    ])
      .then(([solved, contest]) => {
        const result: LeetCodeData = {
          solvedProblem: solved.solvedProblem,
          easySolved: solved.easySolved,
          mediumSolved: solved.mediumSolved,
          hardSolved: solved.hardSolved,
          contestRating: Math.round(contest.contestRating),
          contestAttend: contest.contestAttend,
          contestTopPercentage: contest.contestTopPercentage,
        };
        cacheSet(key, result);
        setData(result);
      })
      .catch(() => setFailed(true));
  }, [username]);

  if (failed) {
    return <p className="leetcode-stats__empty">Failed to load LeetCode stats.</p>;
  }

  if (!data) {
    return <p className="leetcode-stats__empty">Loading LeetCode stats…</p>;
  }

  const easyPct = (data.easySolved / data.solvedProblem) * 100;
  const mediumPct = (data.mediumSolved / data.solvedProblem) * 100;
  const hardPct = (data.hardSolved / data.solvedProblem) * 100;

  return (
    <div className="leetcode-stats">
      <div className="leetcode-stats__summary">
        <span className="leetcode-stats__stat">
          <span className="leetcode-stats__stat-value mono">{data.solvedProblem}</span>
          <span className="leetcode-stats__stat-label">Problems Solved</span>
        </span>
        <span className="leetcode-stats__divider" />
        <span className="leetcode-stats__stat">
          <span className="leetcode-stats__stat-value mono">{data.contestRating}</span>
          <span className="leetcode-stats__stat-label">Contest Rating</span>
        </span>
        <span className="leetcode-stats__divider" />
        <span className="leetcode-stats__stat">
          <span className="leetcode-stats__stat-value mono">Top {data.contestTopPercentage}%</span>
          <span className="leetcode-stats__stat-label">Global Ranking</span>
        </span>
        <span className="leetcode-stats__divider" />
        <span className="leetcode-stats__stat">
          <span className="leetcode-stats__stat-value mono">{data.contestAttend}</span>
          <span className="leetcode-stats__stat-label">Contests Attended</span>
        </span>
      </div>

      <div className="leetcode-stats__difficulty">
        <div className="leetcode-stats__bar">
          <span className="leetcode-stats__bar-segment leetcode-stats__bar-segment--easy" style={{ width: `${easyPct}%` }} />
          <span
            className="leetcode-stats__bar-segment leetcode-stats__bar-segment--medium"
            style={{ width: `${mediumPct}%` }}
          />
          <span className="leetcode-stats__bar-segment leetcode-stats__bar-segment--hard" style={{ width: `${hardPct}%` }} />
        </div>
        <div className="leetcode-stats__legend mono">
          <span className="leetcode-stats__legend-item">
            <span className="leetcode-stats__dot leetcode-stats__dot--easy" />
            {data.easySolved} Easy
          </span>
          <span className="leetcode-stats__legend-item">
            <span className="leetcode-stats__dot leetcode-stats__dot--medium" />
            {data.mediumSolved} Medium
          </span>
          <span className="leetcode-stats__legend-item">
            <span className="leetcode-stats__dot leetcode-stats__dot--hard" />
            {data.hardSolved} Hard
          </span>
        </div>
      </div>
    </div>
  );
}
