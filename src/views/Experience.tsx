import { experience } from '../data/experience';
import { SectionHeading } from '../components/SectionHeading';
import './Experience.css';

export function Experience() {
  return (
    <section id="experience" className="page">
      <div className="page__heading">
        <SectionHeading number="02" title="Experience" />
      </div>

      <div className="page__body">
        <ol className="timeline">
          {experience.map((entry) => (
            <li className="timeline-item" key={entry.company}>
              <span className="timeline-item__logo">
                <img src={entry.logo} alt="" width={24} height={24} />
              </span>
              <div className="timeline-item__content">
                <div className="timeline-item__company">{entry.company}</div>
                <div className="timeline-item__role">{entry.role}</div>
                <div className="timeline-item__meta mono">
                  {entry.period} · {entry.location} · {entry.type}
                </div>
                {entry.description && <p className="timeline-item__description">{entry.description}</p>}

                {entry.teams && (
                  <ul className="timeline-item__teams">
                    {entry.teams.map((team) => (
                      <li key={team.name}>
                        {team.linkTo ? (
                          <a href={team.linkTo} className="timeline-item__team-name mono">
                            {team.name}
                          </a>
                        ) : (
                          <span className="timeline-item__team-name mono">{team.name}</span>
                        )}
                        <span className="timeline-item__team-period">{team.period}</span>
                        <p>{team.description}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
