import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

function basePostPattern(): string {
  const dir = join(process.cwd(), 'src/content/posts');
  const slugs = readdirSync(dir)
    .filter((file) => file.endsWith('.md') && !file.endsWith('.zh-TW.md'))
    .map((file) => file.replace(/\.md$/, ''));
  return slugs.length > 0 ? `**/{${slugs.join(',')}}.md` : '**/*.md';
}

const posts = defineCollection({
  loader: glob({
    pattern: basePostPattern(),
    base: './src/content/posts',
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.string(),
    summary: z.string().default(''),
    tags: z.string().optional(),
  }),
});

const travel = defineCollection({
  loader: glob({
    pattern: '**/meta.md',
    base: './src/content/travel',
  }),
  schema: z.object({
    title: z.string(),
    cover: z.string().optional(),
    location: z.string().optional(),
    startDate: z.coerce.string().optional(),
    endDate: z.coerce.string().optional(),
    tags: z.string().optional(),
    summary: z.string().default(''),
    hidden: z.union([z.string(), z.boolean()]).optional(),
  }),
});

export const collections = { posts, travel };
