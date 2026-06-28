import { useRef } from 'react';
import { renderMarkdown } from '../lib/markdown';
import { getChallengeBySlug } from '../lib/challenges';
import { useMarkdownEmbeds } from '../hooks/useMarkdownEmbeds';
import { useTranslation } from '../hooks/useTranslation';
import './ChallengeEntry.css';

export function ChallengeEntry({ slug, date }: { slug: string; date: string }) {
  const { t, locale } = useTranslation();
  const challenge = getChallengeBySlug(slug, locale);
  const entry = challenge?.entries.find((e) => e.date === date);
  const bodyRef = useRef<HTMLDivElement>(null);

  useMarkdownEmbeds(bodyRef, entry?.content);

  if (!challenge || !entry) {
    return (
      <div className="challenge-entry-page">
        <a href={slug ? `/challenges/${slug}` : '/challenges'} className="challenge-entry-page__back">
          {t.common.backTo(challenge?.title ?? t.challenges.singular)}
        </a>
        <p>{t.challenges.entryNotFound}</p>
      </div>
    );
  }

  const index = challenge.entries.findIndex((e) => e.date === entry.date);
  const prev = challenge.entries[index + 1];
  const next = challenge.entries[index - 1];

  return (
    <div className="challenge-entry-page">
      <a href={`/challenges/${challenge.slug}`} className="challenge-entry-page__back">
        {t.common.backTo(challenge.title)}
      </a>

      <h1 className="challenge-entry-page__title">{entry.title}</h1>
      <span className="challenge-entry-page__date mono">{entry.date}</span>
      <div
        ref={bodyRef}
        className="challenge-entry-page__body"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(entry.content) }}
      />

      <div className="challenge-entry-page__nav">
        {prev ? (
          <a href={`/challenges/${challenge.slug}/${prev.date}`} className="challenge-entry-page__nav-link">
            ← {prev.date}
          </a>
        ) : (
          <span />
        )}
        {next && (
          <a href={`/challenges/${challenge.slug}/${next.date}`} className="challenge-entry-page__nav-link">
            {next.date} →
          </a>
        )}
      </div>
    </div>
  );
}
