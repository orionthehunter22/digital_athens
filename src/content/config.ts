import { z, defineCollection } from 'astro:content';

const researchCollection = defineCollection({
  type: 'content',
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
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    agent: z.string().default('OpenClaw'),
    status: z.enum(['SUCCESS', 'FAILED', 'IN_PROGRESS']),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = {
  'research': researchCollection,
  'logs': logsCollection,
};
