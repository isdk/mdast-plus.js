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
            <p>Last paragraph with a <a href="/abc/">relative link</a>.</p>
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
      .use(htmlReadabilityPlugins, {url: 'https://my.com'})
      .toMarkdown();

    // Main content should remain
    expect(md).toContain('# Real Content Heading');
    expect(md).toContain('[relative link](https://my.com/abc/)');
    expect(md).not.toContain('Home');
  });

  it('should respect fragment option', async () => {
    // Default: fragment = true -> returns root
    const astDefault: any = await mdast(noisyHtml)
      .from('html')
      .use(htmlReadabilityPlugin)
      .toAST({ stage: 'parse' });

    // console.log('🚀 ~ file: readability.spec.ts:111 ~ astDefault:', JSON.stringify(astDefault, null, 2))
    expect(astDefault.type).toBe('root');
    expect(astDefault.children[0]).toMatchObject({tagName: 'div', type: 'element'});

    // Explicit: fragment = false -> returns element (the extracted article div)
    const astNoFragment: any = await mdast(noisyHtml)
      .from('html')
      .use(htmlReadabilityPlugin, { hast: { fragment: false } })
      .toAST({ stage: 'parse' });

    // console.log('🚀 ~ file: readability.spec.ts:121 ~ astNoFragment:', JSON.stringify(astNoFragment, null, 2))
    expect(astNoFragment.type).toBe('root');
    expect(astNoFragment.children[0]).toMatchObject({tagName: 'html', type: 'element'});
  });

  it('should inject frontmatter when requested', async () => {
    const md = await mdast(noisyHtml)
      .from('html')
      .use(htmlReadabilityPlugins, { frontmatter: true })
      .toMarkdown();

    expect(md).toMatch(/^---/);
    expect(md).toContain('title: My Article Title');
    expect(md).toContain('---');
    expect(md).toContain('# Real Content Heading');
  });

  it('should inject TOML frontmatter when requested', async () => {
    const md = await mdast(noisyHtml)
      .from('html')
      .use(htmlReadabilityPlugins, { frontmatter: 'toml' })
      .toMarkdown();

    expect(md).toMatch(/^\+\+\+/);
    expect(md).toContain('title = "My Article Title"');
    expect(md).toContain('\+\+\+');
    expect(md).toContain('# Real Content Heading');
  });

  it('should append source link when requested', async () => {
    const url = 'https://example.com/article';
    const md = await mdast(noisyHtml)
      .from('html')
      .use(htmlReadabilityPlugins, { sourceLink: true, url })
      .toMarkdown();

    expect(md).toContain('> Source: [My Article Title](https://example.com/article)');
  });

  it('should support both frontmatter and source link', async () => {
    const url = 'https://example.com/article';
    const md = await mdast(noisyHtml)
      .from('html')
      .use(htmlReadabilityPlugins, { frontmatter: true, sourceLink: true, url })
      .toMarkdown();

    expect(md).toMatch(/^---/);
    expect(md).toContain('title: My Article Title');
    expect(md).toContain('> Source: [My Article Title](https://example.com/article)');
  });

  it('should inject extra metadata into frontmatter', async () => {
    const md = await mdast(noisyHtml)
      .from('html')
      .use(htmlReadabilityPlugins, {
        frontmatter: true,
        extraMetadata: {
          author: 'John Doe',
          category: 'Tech'
        }
      })
      .toMarkdown();

    expect(md).toMatch(/^---/);
    expect(md).toContain('title: My Article Title');
    expect(md).toContain('author: John Doe');
    expect(md).toContain('category: Tech');
    expect(md).toContain('---');
  });

  it('should not append source link if the URL already exists in the content', async () => {
    const url = 'https://example.com';
    const htmlWithLink = `
      <div>
        <h1>Title</h1>
        <p>Check this <a href="${url}">link</a> which is the same as source.</p>
      </div>
    `;
    const md = await mdast(htmlWithLink)
      .from('html')
      .use(htmlReadabilityPlugins, { sourceLink: true, url, frontmatter: true })
      .toMarkdown();

    const sourceCount = (md.match(/Source:/g) || []).length;
    expect(sourceCount).toBe(0);
    expect(md).toContain('[link](https://example.com/)');

    expect(md).toContain('length: ');
    expect(md).not.toContain('title: ');
  });

  describe('Smart Excerpt', () => {
    const htmlWithDuplicateExcerpt = `
      <html>
        <head><title>Duplicate Excerpt</title></head>
        <body>
          <article>
            <h1>Duplicate Excerpt</h1>
            <p>This is the content. It is exactly the same as the excerpt because it is short.</p>
          </article>
        </body>
      </html>
    `;

    // Note: readability's default behavior for short content is often to use the first paragraph as excerpt.

    it('should remove excerpt by default if it overlaps significantly with content', async () => {
      const ast: any = await mdast(htmlWithDuplicateExcerpt)
        .from('html')
        .use(htmlReadabilityPlugin)
        .toAST({ stage: 'parse' });

      expect(ast.data.readability).toBeDefined();
      expect(ast.data.readability.excerpt).toBeUndefined();
    });

    it('should keep excerpt if smartExcerpt is disabled', async () => {
      const ast: any = await mdast(htmlWithDuplicateExcerpt)
        .from('html')
        .use(htmlReadabilityPlugin, { smartExcerpt: false })
        .toAST({ stage: 'parse' });

      expect(ast.data.readability).toBeDefined();
      // Readability usually generates an excerpt. Verify it exists.
      expect(ast.data.readability.excerpt).toBeDefined();
    });

    it('should keep excerpt if it is unique enough', async () => {
      const htmlWithUniqueExcerpt = `
        <html>
          <head>
            <title>Unique Excerpt</title>
            <meta name="description" content="This is a unique summary provided in meta description." />
          </head>
          <body>
            <article>
              <h1>Unique Excerpt</h1>
              <p>This is the main content. It is completely different from the meta description which Readability might pick up as the excerpt. We want to ensure that this distinct summary is preserved.</p>
              <p>Adding more text to make the content length substantially different and ensure ratio is low.</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </article>
          </body>
        </html>
      `;

      const ast: any = await mdast(htmlWithUniqueExcerpt)
        .from('html')
        .use(htmlReadabilityPlugin) // Default smartExcerpt: true
        .toAST({ stage: 'parse' });

      expect(ast.data.readability).toBeDefined();
      expect(ast.data.readability.excerpt).toBeDefined();
      expect(ast.data.readability.excerpt).toContain('unique summary');
    });

    it('should respect custom threshold configuration', async () => {
      // Create content where excerpt is ~50% of content.
      // Default threshold is 0.6, so it should be KEPT by default (if length > 300).
      // If we lower threshold to 0.4, it should be REMOVED.
      
      const content = "This is the content. " + "A".repeat(200);
      const excerpt = "This is the content. " + "A".repeat(50); // overlap
      
      // We can't easily force Readability to produce a specific excerpt/content ratio purely via HTML input 
      // because Readability's logic is complex. 
      // However, we can mock the internal behavior if we were unit testing the function directly.
      // Since we are integration testing via the plugin, we rely on the logic:
      // "If excerpt is contained in content..."
      
      // Let's try a case where we force the "short content" rule to NOT apply (long content)
      // but the overlap is high.
      
      const part = "Unique part of content. ";
      const common = "Common part repeated. ".repeat(20); 
      const html = `
        <html>
          <head><meta name="description" content="${common.trim()}"/></head>
          <body>
            <article>
              <p>${part} ${common}</p>
              <p>${"B".repeat(500)}</p> <!-- Make content long enough > 300 -->
            </article>
          </body>
        </html>
      `;
      
      // With default threshold 0.6: 
      // Excerpt (common) length approx 440. Content length > 900. Ratio < 0.5.
      // Should be KEPT.
      const astKept: any = await mdast(html)
        .from('html')
        .use(htmlReadabilityPlugin)
        .toAST({ stage: 'parse' });
        
      expect(astKept.data.readability.excerpt).toBeDefined();

      // With strict threshold 0.1:
      // Ratio ~0.4 > 0.1. Should be REMOVED.
      const astRemoved: any = await mdast(html)
        .from('html')
        .use(htmlReadabilityPlugin, { smartExcerpt: { threshold: 0.1 } })
        .toAST({ stage: 'parse' });

      // Note: This relies on Readability picking up the meta description as excerpt 
      // and the body as content, and our logic matching them.
      // Readability normalization might differ, so this test is sensitive.
      // If this flakes, we might check if excerpt is actually matching.
      if (astRemoved.data.readability.excerpt) {
          // Debug info if test fails
           console.log('Excerpt:', astRemoved.data.readability.excerpt);
           console.log('Content:', astRemoved.data.readability.textContent);
      }
      expect(astRemoved.data.readability.excerpt).toBeUndefined();
    });

    it('should respect custom minContentLength configuration', async () => {
      // Content length small, but ratio small.
      // Default minContentLength is 300.
      
      const htmlShort = `
        <html>
          <head><meta name="description" content="Short summary"/></head>
          <body>
            <article>
              <p>Short summary is here.</p>
              <p>Total content length is small but larger than summary.</p>
            </article>
          </body>
        </html>
      `;
      
      // Content length < 300. Excerpt contained.
      // Default behavior: REMOVE (because length < 300).
      const astDefault: any = await mdast(htmlShort)
        .from('html')
        .use(htmlReadabilityPlugin)
        .toAST({ stage: 'parse' });
        
      expect(astDefault.data.readability.excerpt).toBeUndefined();

      // Custom minContentLength: 10.
      // Content length > 10. Ratio is small.
      // Should KEEP.
      const astCustom: any = await mdast(htmlShort)
        .from('html')
        .use(htmlReadabilityPlugin, { smartExcerpt: { minContentLength: 10 } })
        .toAST({ stage: 'parse' });
        
      expect(astCustom.data.readability.excerpt).toBeDefined();
    });
  });

  it('should support fields allowlist', async () => {
    const ast: any = await mdast(noisyHtml).from('html')
      .use(htmlReadabilityPlugin, { fields: ['title'] })
      .toAST({ stage: 'parse' });

    expect(ast.data.readability).toBeDefined();
    expect(ast.data.readability.title).toBe('My Article Title');
    expect(ast.data.readability.excerpt).toBeUndefined(); // Should be filtered out
  });

  it('should support fields projection/renaming', async () => {
    const ast: any = await mdast(noisyHtml).from('html')
      .use(htmlReadabilityPlugin, { fields: { title: 'headline', excerpt: 'summary' } })
      .toAST({ stage: 'parse' });

    expect(ast.data.readability).toBeDefined();
    expect(ast.data.readability.headline).toBe('My Article Title');
    expect(ast.data.readability.title).toBeUndefined();
  });

  it('should generate source link even if url field is filtered out', async () => {
    const url = 'https://example.com/filtered';
    // Note: We only use htmlReadabilityPlugin (parser), not the restore plugin.
    // The parser should inject the source link into HAST, which then becomes Markdown.
    const md = await mdast(noisyHtml)
      .from('html')
      .use(htmlReadabilityPlugin, { fields: ['title'], sourceLink: true, url })
      .toMarkdown();

    expect(md).toContain('> Source: [My Article Title](https://example.com/filtered)');
  });

  it('should generate source link even if url field is renamed', async () => {
    const url = 'https://example.com/renamed';
    const md = await mdast(noisyHtml)
      .from('html')
      .use(htmlReadabilityPlugin, { 
          fields: { title: 'headline', url: 'permalink' }, 
          sourceLink: true, 
          url 
      })
      .toMarkdown();

    expect(md).toContain('> Source: [My Article Title](https://example.com/renamed)');
  });

  it('should generate source link when fragment is false', async () => {
    const url = 'https://example.com/full';
    const ast: any = await mdast(noisyHtml)
      .from('html')
      .use(htmlReadabilityPlugin, { 
          hast: { fragment: false }, 
          sourceLink: true, 
          url 
      })
      .toAST({ stage: 'parse' });

    // Verify structure: root -> html -> body -> [...children, sourceNode]
    const htmlNode = ast.children.find((c: any) => c.tagName === 'html');
    expect(htmlNode).toBeDefined();
    const bodyNode = htmlNode?.children.find((c: any) => c.tagName === 'body');
    expect(bodyNode).toBeDefined();
    const blockquote = bodyNode?.children.find((c: any) => c.tagName === 'blockquote');
    
    expect(blockquote).toBeDefined();
    // Path to link: blockquote -> p -> a
    const paragraph = blockquote.children[0];
    const link = paragraph.children.find((c: any) => c.tagName === 'a');
    expect(link.properties.href).toBe(url);
  });
});
