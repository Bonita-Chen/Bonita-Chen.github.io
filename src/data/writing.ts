import { getAllPosts } from '@/lib/posts';
import { SITE_URL } from '@/lib/utils';

export interface WritingItem {
  title: string;
  url: string;
  date: string;
  description: string;
}

const data: WritingItem[] = getAllPosts().map((post) => ({
  title: post.title,
  url: `${SITE_URL}/blogs/${post.slug}/`,
  date: post.date,
  description: post.description,
}));

export default data;
