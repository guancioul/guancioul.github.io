import { parseFrontmatter } from './markdown';

export interface Trip {
  slug: string;
  title: string;
  cover: string;
  location: string;
  startDate: string;
  endDate: string;
  tags: string[];
  summary: string;
  content: string;
  hidden: boolean;
}

const metaModules = import.meta.glob('../content/travel/*/meta.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

function slugFromMetaPath(path: string): string {
  return path.split('/').slice(-2, -1)[0];
}

const trips: Trip[] = Object.entries(metaModules)
  .map(([path, raw]) => {
    const slug = slugFromMetaPath(path);
    const { data, content } = parseFrontmatter(raw);

    return {
      slug,
      title: data.title ?? slug,
      cover: data.cover ?? '',
      location: data.location ?? '',
      startDate: data.startDate ?? '',
      endDate: data.endDate ?? '',
      tags: data.tags
        ? data.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : [],
      summary: data.summary ?? '',
      content,
      hidden: data.hidden === 'true',
    };
  })
  .sort((a, b) => (a.startDate < b.startDate ? 1 : -1));

export function getAllTrips(): Trip[] {
  return trips.filter((t) => !t.hidden);
}

export function getTripBySlug(slug: string): Trip | undefined {
  return trips.find((t) => t.slug === slug);
}
