import { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { renderMarkdown } from '../lib/markdown';
import { getTripBySlug } from '../lib/travel';
import { useMarkdownEmbeds } from '../hooks/useMarkdownEmbeds';
import './TravelDetail.css';

export function TravelDetail() {
  const { slug } = useParams<{ slug: string }>();
  const trip = slug ? getTripBySlug(slug) : undefined;
  const bodyRef = useRef<HTMLDivElement>(null);

  useMarkdownEmbeds(bodyRef, trip?.content);

  if (!trip) {
    return (
      <div className="travel-detail">
        <Link to="/travel" className="travel-detail__back">
          ← Back to Travel
        </Link>
        <p>Trip not found.</p>
      </div>
    );
  }

  return (
    <div className="travel-detail">
      <Link to="/travel" className="travel-detail__back">
        ← Back to Travel
      </Link>

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
