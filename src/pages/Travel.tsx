import { Link } from 'react-router-dom';
import { getAllTrips } from '../lib/travel';
import './Travel.css';

export function Travel() {
  const trips = getAllTrips();

  return (
    <div className="travel">
      <h1>Travel</h1>

      {trips.length === 0 ? (
        <p className="travel__empty">No trips logged yet.</p>
      ) : (
        <div className="travel__grid">
          {trips.map((trip) => (
            <Link to={`/travel/${trip.slug}`} className="trip-card" key={trip.slug}>
              {trip.cover && (
                <div className="trip-card__image" style={{ backgroundImage: `url(${trip.cover})` }} />
              )}
              <div className="trip-card__body">
                <h2 className="trip-card__title">{trip.title}</h2>
                <div className="trip-card__meta-row">
                  {trip.location && <span className="trip-card__location">{trip.location}</span>}
                  <span className="trip-card__dates mono">
                    {trip.startDate}
                    {trip.endDate ? ` – ${trip.endDate}` : ''}
                  </span>
                </div>
                {trip.tags.length > 0 && (
                  <div className="trip-card__tags">
                    {trip.tags.map((tag) => (
                      <span className="trip-card__tag mono" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <p className="trip-card__summary">{trip.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
