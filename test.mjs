import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { build, loadBooks } from './build.mjs';
const temp = await mkdtemp(path.join(tmpdir(), 'breezer-check-'));
try {
  const content = path.join(temp, 'content'), book = path.join(content, 'test-story'), output = path.join(temp, 'site');
  await mkdir(book,{recursive:true});
  await writeFile(path.join(book,'book.json'), JSON.stringify({title:'A <story>',description:'A test & only a test',genre:'Test',sample:true}));
  await writeFile(path.join(book,'10-last.md'),'# Last\n\nThe end.');
  await writeFile(path.join(book,'02-first.md'),'# First\n\n**Bold** and *italic*.\n\n<script>alert(1)</script>\n\n[unsafe](javascript:alert(1))');
  const books = await loadBooks(content);
  assert.deepEqual(books[0].chapters.map(c=>c.order),[2,10]);
  assert.match(books[0].chapters[0].html,/<strong>Bold<\/strong>/);
  assert.match(books[0].chapters[0].html,/<em>italic<\/em>/);
  assert.ok(!books[0].chapters[0].html.includes('<script>'));
  assert.ok(!books[0].chapters[0].html.includes('href="javascript:'));
  assert.deepEqual(await build(content,output),{books:1,chapters:2});
  const html = await readFile(path.join(output,'stories/test-story/02-first/index.html'),'utf8');
  assert.match(html,/Sample story · not Breezer’s writing/);
  assert.match(html,/href="\/stories\/test-story\/10-last\/"/);
  assert.match(html,/A &lt;story&gt;/);
  assert.match(html,/51b61a8c/);
  // Every internal page/asset link in a real build resolves, including chapter navigation.
  const actual = path.join(temp,'actual');
  await build('content',actual);
  async function checkLinks(dir) {
    for (const entry of await readdir(dir,{withFileTypes:true})) {
      const file = path.join(dir,entry.name);
      if (entry.isDirectory()) await checkLinks(file);
      else if (entry.name.endsWith('.html')) {
        const source = await readFile(file,'utf8');
        for (const [,url] of source.matchAll(/(?:href|src)="(\/[^"#]*)(?:#[^"]*)?"/g)) {
          await readFile(path.join(actual,url.endsWith('/') ? `${url}index.html` : url));
        }
      }
    }
  }
  await checkLinks(actual);
  await writeFile(path.join(book,'2-duplicate.md'),'# Duplicate\n\nNope.');
  await assert.rejects(loadBooks(content),/duplicate/);
  await rm(path.join(book,'2-duplicate.md'));
  await writeFile(path.join(book,'11-empty.md'),'# Empty\n\n');
  await assert.rejects(loadBooks(content),/empty/);
  await rm(path.join(book,'11-empty.md'));
  await writeFile(path.join(book,'bad-name.md'),'# Title\n\nNope.');
  await assert.rejects(loadBooks(content),/01-chapter-name/);
  console.log('Passed: discovery, chapter ordering, Markdown, escaping, unsafe links, navigation, content validation, and internal links.');
} finally { await rm(temp,{recursive:true,force:true}); }
