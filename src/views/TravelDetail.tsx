import { useRef } from 'react';
import { renderMarkdown } from '../lib/markdown';
import { getTripBySlug } from '../lib/travel';
import { useMarkdownEmbeds } from '../hooks/useMarkdownEmbeds';
import { useTranslation } from '../hooks/useTranslation';
import { useLocalizedPath } from '../hooks/useLocalizedPath';
import './TravelDetail.css';

export function TravelDetail({ slug }: { slug: string }) {
  const { t } = useTranslation();
  const lp = useLocalizedPath();
  const trip = getTripBySlug(slug);
  const bodyRef = useRef<HTMLDivElement>(null);

  useMarkdownEmbeds(bodyRef, trip?.content);

  if (!trip) {
    return (
      <div className="travel-detail">
        <a href={lp('/travel')} className="travel-detail__back">
          {t.common.backTo(t.nav.travel)}
        </a>
        <p>Trip not found.</p>
      </div>
    );
  }

  return (
    <div className="travel-detail">
      <a href={lp('/travel')} className="travel-detail__back">
        {t.common.backTo(t.nav.travel)}
      </a>

      {trip.cover && (
        <div className="travel-detail__cover" style={{ backgroundImage: `url(${trip.cover})` }} />
      )}

      <h1 className="travel-detail__title">{trip.title}</h1>
      <div className="travel-detail__meta">
        {trip.location && <span className="travel-detail__location">{trip.location}</span>}
        <span className="travel-detail__dates mono">
          {trip.startDate}
          {trip.endDate ? ` – ${trip.endDate}` : ''}
        </span>
        {trip.tags.length > 0 && (
          <div className="travel-detail__tags">
            {trip.tags.map((tag) => (
              <span className="travel-detail__tag mono" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {trip.content && (
        <div
          ref={bodyRef}
          className="travel-detail__body"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(trip.content) }}
        />
      )}
    </div>
  );
}
