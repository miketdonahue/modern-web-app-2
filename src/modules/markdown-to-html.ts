import remark from 'remark';
import html from 'remark-html';

/**
 * Transform markdown to HTML
 */
export const markdownToHtml = async (fileContents: string) => {
  const processedContent = await remark().use(html).process(fileContents);
  const contentHtml = processedContent.toString();

  return contentHtml;
};
