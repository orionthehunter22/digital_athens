import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const researchCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/research' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    author: z.string().default('The Architect'),
    tags: z.array(z.string()).default([]),
    isDraft: z.boolean().default(false),
  }),
});

const logsCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/logs' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    agent: z.string().default('OpenClaw'),
    status: z.enum(['SUCCESS', 'FAILED', 'IN_PROGRESS']),
    tags: z.array(z.string()).default([]),
  }),
});

const tutorialsCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/tutorials' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    difficulty: z.string(),
    readTime: z.string(),
  }),
});

export const collections = {
  'research': researchCollection,
  'logs': logsCollection,
  'tutorials': tutorialsCollection,
};
