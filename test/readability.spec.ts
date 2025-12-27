import { describe, it, expect } from 'vitest';
import { htmlReadabilityPlugin, htmlReadabilityPlugins, mdast, restoreReadabilityMetaPlugin } from '../src';

describe('HTML Readability Plugin', () => {
  const noisyHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>My Article Title</title>
      </head>
      <body>
        <header>
          <nav>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
            </ul>
          </nav>
        </header>
        <aside>
          <div class="sidebar">
            <p>Some noisy sidebar content that should be ignored.</p>
          </div>
        </aside>
        <main>
          <article>
            <h1>Real Content Heading</h1>
            <p>This is the main paragraph of the article. It has enough text to be considered content by Readability.</p>
            <p>Another paragraph with some <b>bold</b> text and a <a href="https://example.com">link</a>.</p>
          </article>
        </main>
        <footer>
          <p>Copyright 2025</p>
        </footer>
      </body>
    </html>
  `;

  it('should parse everything normally when readability is disabled', async () => {
    const md = await mdast(noisyHtml).from('html').use(htmlReadabilityPlugin, { readability: false }).use(restoreReadabilityMetaPlugin).toMarkdown();

    // Default parsing includes navigation and sidebar
    expect(md).toContain('Home');
    expect(md).toContain('About');
    expect(md).toContain('Some noisy sidebar content');
    expect(md).toContain('Real Content Heading');
    expect(md).toContain('Copyright 2025');
  });

  it('should extract main content when readability is enabled(default)', async () => {
    const md = await mdast(noisyHtml)
      .from('html')
      .use(htmlReadabilityPlugin).use(restoreReadabilityMetaPlugin)
      .toMarkdown();

    // Navigation and footer should be gone
    expect(md).not.toContain('Home');
    expect(md).not.toContain('About');
    expect(md).not.toContain('Copyright 2025');
    expect(md).not.toContain('Some noisy sidebar content');

    // Main content should remain
    expect(md).toContain('# Real Content Heading');
    expect(md).toContain('This is the main paragraph');
    expect(md).toContain('**bold**');
    expect(md).toContain('[link](https://example.com/)');
  });

  it('should attach readability metadata to AST', async () => {
    const ast: any = await mdast(noisyHtml)
      .from('html')
      .use(htmlReadabilityPlugin, { enable: true }).use(restoreReadabilityMetaPlugin)
      .toAST({ stage: 'parse' }); // Get raw AST from parser

    expect(ast.data).toBeDefined();
    expect(ast.data.readability).toBeDefined();
    expect(ast.data.readability.title).toBe('My Article Title');
  });

  it('should fallback to normal parsing if readability fails (e.g. empty content)', async () => {
    const emptyHtml = '<div>Just a div</div>';
    const md = await mdast(emptyHtml)
      .from('html')
      .use(htmlReadabilityPlugin).use(restoreReadabilityMetaPlugin)
      .toMarkdown();

    expect(md.trim()).toBe('Just a div');
  });

  it('should support htmlReadabilityPlugins array', async () => {
    const md = await mdast(noisyHtml)
      .from('html')
      .use(htmlReadabilityPlugins)
      .toMarkdown();

    // Main content should remain
    expect(md).toContain('# Real Content Heading');
    expect(md).not.toContain('Home');
  });
});
