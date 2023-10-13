import * as z from 'zod';

export const formChapterSchema = z.object({
  title: z.string().min(1).max(255),
  videoUrl: z.string().min(1), 
isFree: z.boolean(),
 
});

export const formCourseSchema = z.object({
  title: z.string().min(1).max(255),
  price: z.number(),
  imageUrl: z.string().min(1),
  category: z.string().min(1),
  chapters: z.array(formChapterSchema), 
});
