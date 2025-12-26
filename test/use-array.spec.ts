import { describe, it, expect } from 'vitest';
import { mdast } from '../src';

describe('use plugins array', () => {
  it('should support array of plugins in .use()', async () => {
    let p1Called = false;
    let p2Called = false;

    const p1 = () => {
      p1Called = true;
      return (tree: any) => tree;
    };
    const p2 = () => {
      p2Called = true;
      return (tree: any) => tree;
    };

    await mdast('# Hello')
      .use([p1, p2])
      .toAST();

    expect(p1Called).toBe(true);
    expect(p2Called).toBe(true);
  });

  it('should support array of MdastPlugin in .use()', async () => {
    let p1Called = false;
    let p2Called = false;

    const p1 = () => {
      p1Called = true;
      return (tree: any) => tree;
    };
    const p2 = () => {
      p2Called = true;
      return (tree: any) => tree;
    };

    await mdast('# Hello')
      .use([
        { plugin: p1, name: 'p1' },
        { plugin: p2, name: 'p2' }
      ])
      .toAST();

    expect(p1Called).toBe(true);
    expect(p2Called).toBe(true);
  });

  it('should support array of plugins in .useAt()', async () => {
    let p1Called = false;
    let p2Called = false;

    const p1 = () => {
      p1Called = true;
      return (tree: any) => tree;
    };
    const p2 = () => {
      p2Called = true;
      return (tree: any) => tree;
    };

    await mdast('# Hello')
      .useAt('compile', [p1, p2])
      .toAST();

    expect(p1Called).toBe(true);
    expect(p2Called).toBe(true);
  });

  it('should support mixed array in .use()', async () => {
    let p1Called = false;
    let p2Called = false;

    const p1 = () => {
      p1Called = true;
      return (tree: any) => tree;
    };
    const p2 = () => {
      p2Called = true;
      return (tree: any) => tree;
    };

    await mdast('# Hello')
      .use([
        p1,
        { plugin: p2, name: 'p2' }
      ])
      .toAST();

    expect(p1Called).toBe(true);
    expect(p2Called).toBe(true);
  });
});
