import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import remark from 'remark';
import html from 'remark-html';

export const getLessonMarkdown = async (slug: string) => {
  const fullPath = path.join(
    'src/views/app/lessons/descriptions',
    `${slug}.md`
  );

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
