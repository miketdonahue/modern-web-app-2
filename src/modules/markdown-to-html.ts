import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import remark from 'remark';
import html from 'remark-html';

/**
 * Given a markdown file, transforms the contents to HTML
 */
export const markdownToHtml = async (dir: string, slug: string) => {
  const fullPath = path.join(dir, `${slug}.md`);

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);

  const contentHtml = processedContent.toString();

  return {
    ...matterResult.data,
    contentHtml,
  };
};
