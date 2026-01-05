import { describe, it, expect } from 'vitest';
import { mdast } from '../src/pipeline';
import type { Plugin } from 'unified';

// Mock plugin to inject readability metadata
const mockReadabilityPlugin: Plugin = function () {
  return (tree, file) => {
    file.data = file.data || {};
    file.data.readability = {
      title: 'Test Title',
      length: 99999, // Should be ignored
      author: 'Tester',
      extra: 'info'
    };
  };
};

describe('Metadata Attachment in toMarkdown', () => {
  it('should return a String object with metadata when attachMetadata is true', async () => {
    const pipeline = mdast('# Hello World');
    pipeline.use(mockReadabilityPlugin);

    const result = await pipeline.toMarkdown({ attachMetadata: true });

    // Verify type
    expect(typeof result).toBe('object');
    expect(result).toBeInstanceOf(String);

    // Verify content
    expect(result.toString().trim()).toBe('# Hello World');

    // Verify attached metadata
    const resultAny = result as any;
    expect(resultAny.title).toBe('Test Title');
    expect(resultAny.author).toBe('Tester');
    expect(resultAny.extra).toBe('info');

    // Verify length property safety
    // The length of '# Hello World\n' is 14
    expect(result.length).toBe(14);
    expect(resultAny.length).not.toBe(99999);
  });

  it('should return a primitive string by default (compatibility)', async () => {
    const pipeline = mdast('# Hello World');
    pipeline.use(mockReadabilityPlugin);

    const result = await pipeline.toMarkdown();

    expect(typeof result).toBe('string');
    expect((result as any).title).toBeUndefined();
  });

  it('should return primitive string if attachMetadata is true but no metadata exists', async () => {
    const pipeline = mdast('# Hello World');
    // No mock plugin

    const result = await pipeline.toMarkdown({ attachMetadata: true });

    expect(typeof result).toBe('string');
    expect((result as any).title).toBeUndefined();
  });

  it('should handle attachMetadata: false explicitly', async () => {
    const pipeline = mdast('# Hello World');
    pipeline.use(mockReadabilityPlugin);

    const result = await pipeline.toMarkdown({ attachMetadata: false });

    expect(typeof result).toBe('string');
    expect((result as any).title).toBeUndefined();
  });
});
