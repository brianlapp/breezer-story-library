import { readdir, readFile, mkdir, writeFile, rm, cp } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({ html: false, typographer: true });
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export async function loadBooks(root = 'content') {
  const books = [];
  for (const folder of await readdir(root, { withFileTypes: true })) {
    if (!folder.isDirectory()) continue;
    if (!slugPattern.test(folder.name)) throw new Error(`Use lowercase words and hyphens for folder: ${folder.name}`);
    const base = path.join(root, folder.name);
    const info = JSON.parse(await readFile(path.join(base, 'book.json'), 'utf8'));
    for (const key of ['title', 'description', 'genre']) {
      if (typeof info[key] !== 'string' || !info[key].trim()) throw new Error(`${base}: missing ${key}`);
    }
    if (typeof info.sample !== 'boolean') throw new Error(`${base}: sample must be true or false`);
    const chapters = [];
    const numbers = new Set();
    for (const file of (await readdir(base)).filter(f => f.endsWith('.md'))) {
      const match = file.match(/^(\d+)-([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/);
      if (!match) throw new Error(`${base}/${file}: use 01-chapter-name.md`);
      const order = Number(match[1]);
      if (!Number.isSafeInteger(order) || order < 1 || numbers.has(order)) throw new Error(`${base}: duplicate or invalid chapter number ${order}`);
      numbers.add(order);
      const source = (await readFile(path.join(base, file), 'utf8')).replace(/\r\n/g, '\n');
      const title = source.match(/^# (.+)\n/);
      if (!title) throw new Error(`${base}/${file}: begin with # Chapter title and a new line`);
      const body = source.slice(title[0].length).trim();
      if (!body) throw new Error(`${base}/${file}: chapter is empty`);
      chapters.push({ title: title[1], order, slug: file.slice(0, -3), html: md.render(body), minutes: Math.max(1, Math.ceil(body.split(/\s+/).length / 220)), url: `/stories/${folder.name}/${file.slice(0, -3)}/` });
    }
    chapters.sort((a,b) => a.order - b.order);
    if (!chapters.length) throw new Error(`${base}: add at least one chapter`);
    books.push({ ...info, slug: folder.name, color: ['pink','green','orange'].includes(info.color) ? info.color : 'pink', chapters, url: `/stories/${folder.name}/` });
  }
  return books.sort((a,b) => a.title.localeCompare(b.title));
}
const contract = `<!-- THESIS: A bright little home for unfinished worlds, with a direct path from shelf to chapter.
OWN-WORLD: Cut-paper record sleeves: grape ink, bubblegum, acid green, tangerine, chunky sans titles and quiet serif reading.
STORY: Pick a story, see its chapters, settle into reading, and come back to the last chapter.
FIRST VIEWPORT: A grape masthead, oversized two-line greeting beside a sculptural typographic book stack, then the real shelf.
FORM: Candidate 4, independent-print sleeve collection; shelf browsing then still reading pages. Seed 51b61a8c.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md -->`;
const header = `<header class="site-header"><a class="brand" href="/" aria-label="Breezer's bookshelf home"><span aria-hidden="true" class="brand-star">✳</span> breezer<span class="brand-dot">.</span></a><nav aria-label="Main"><a href="/#shelf">The bookshelf</a><a href="/adding-stories/">Add a story <span aria-hidden="true">↗</span></a></nav></header>`;
const footer = `<footer class="site-footer"><a class="brand" href="/">breezer.</a><p>A little home for big imaginations.</p><a href="/adding-stories/">How to add your writing ↗</a></footer>`;
function page(title, body, description = 'Books, stories, and little worlds. A story library for Breezer.') {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="${escape(description)}"><meta name="theme-color" content="#45256e"><title>${escape(title)} · Breezer’s bookshelf</title><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/style.css"><script src="/app.js" defer></script></head><body>${contract}<a class="skip" href="#main">Skip to content</a>${header}<main id="main">${body}</main>${footer}</body></html>`;
}
const sample = book => book.sample ? '<span class="sample-label">Sample story · not Breezer’s writing</span>' : '';
const cover = book => `<div class="cover ${book.color}" aria-hidden="true"><span class="cover-top">Breezer’s bookshelf / ${escape(book.genre)}</span><span class="cover-title">${escape(book.title)}</span><span class="cover-art"><i></i><i></i><i></i></span><span class="cover-bottom">${book.sample ? 'THE SAMPLE COLLECTION' : 'A WORLD BY BREEZER'} <span>✳</span></span></div>`;
const toc = (book, current = '') => `<ol class="chapters">${book.chapters.map((c,i) => `<li><a href="${c.url}" ${c.slug === current ? 'aria-current="page"' : ''}><span class="chapter-number">${String(i+1).padStart(2,'0')}</span><span>${escape(c.title)}</span><small>${c.minutes} min <span aria-hidden="true">↗</span></small></a></li>`).join('')}</ol>`;
export async function build(root = 'content', output = 'dist') {
  const books = await loadBooks(root);
  // Validate everything before replacing the previous build.
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  await cp('public', output, { recursive: true });
  const write = async (url, html) => { const dir = path.join(output, url); await mkdir(dir, {recursive:true}); await writeFile(path.join(dir,'index.html'),html); };
  await write('', page('A little shelf. Endless possibilities.', `<section class="hero"><div class="hero-copy"><h1>A little shelf.<br><em>Endless</em><br>possibilities.</h1><p>Books, stories, and the wonderfully weird places a chapter can take you.</p><a class="button" href="#shelf">Find your next little escape <span aria-hidden="true">↓</span></a></div><div class="hero-art" aria-hidden="true"><span class="orbit">✳</span><div class="spine pink">just one more chapter <span>✦</span></div><div class="spine green">a very good plot twist <span>↗</span></div><div class="spine orange">somewhere, a story begins.</div><span class="art-note">Made for getting<br>a little lost.</span></div></section><section id="shelf" class="shelf"><div class="section-heading"><div><h2>The bookshelf<span aria-hidden="true">✳</span></h2><p>${books.length} ${books.length === 1 ? 'world' : 'worlds'} to wander into. Pick one. Stay awhile.</p></div><label class="search">Find a story<input id="search" type="search" placeholder="Title or genre…" autocomplete="off"></label></div><a id="resume" class="resume" hidden></a><p class="demo-note">A first look for Breezer. The stories marked “Sample” are made-up examples, ready to be replaced with your own.</p><div class="book-grid">${books.map(book => `<article class="book" data-search="${escape(`${book.title} ${book.genre} ${book.description}`.toLowerCase())}"><a href="${book.url}" class="cover-link" aria-label="Explore ${escape(book.title)}">${cover(book)}</a><div class="book-meta"><span>${escape(book.genre)}</span><span>${book.chapters.length} ${book.chapters.length === 1 ? 'chapter' : 'chapters'}</span></div><h3><a href="${book.url}">${escape(book.title)}</a></h3><p>${escape(book.description)}</p>${sample(book)}<a class="text-link" href="${book.chapters[0].url}">Start reading <span aria-hidden="true">↗</span></a></article>`).join('')}</div><p id="empty" class="empty" hidden>No stories match. Try another title or genre.</p><p id="search-status" class="sr-only" aria-live="polite"></p></section><section class="closing"><span aria-hidden="true">✷</span><div><h2>Every story starts somewhere.</h2><p>A first sentence. A wild idea. A chapter you can’t leave alone.</p></div><a href="/adding-stories/" class="button">Make room for yours ↗</a></section>`));
  for (const book of books) {
    await write(book.url, page(book.title, `<section class="book-detail"><a class="back" href="/#shelf">← Back to the bookshelf</a><div class="book-intro">${cover(book)}<div><h1>${escape(book.title)}</h1><p class="book-description">${escape(book.description)}</p>${sample(book)}<p>${escape(book.genre)} · ${book.chapters.length} ${book.chapters.length === 1 ? 'chapter' : 'chapters'}</p><a class="button" href="${book.chapters[0].url}">Begin the story ↗</a></div></div><section class="contents"><h2>One chapter at a time.</h2>${toc(book)}</section></section>`, book.description));
    for (const [index, chapter] of book.chapters.entries()) {
      const previous = book.chapters[index-1], next = book.chapters[index+1];
      await write(chapter.url, page(chapter.title, `<div class="reader-layout"><aside class="reader-sidebar"><a class="back" href="${book.url}">← ${escape(book.title)}</a><details open><summary>Chapters</summary>${toc(book,chapter.slug)}</details></aside><div class="reader" data-chapter="${escape(chapter.title)}" data-book="${escape(book.title)}"><div class="reader-tools"><span>Chapter ${index+1} of ${book.chapters.length} · ${chapter.minutes} min read</span><label>Text size <select id="text-size"><option value="regular">Regular</option><option value="large">Large</option><option value="larger">Larger</option></select></label></div><article><h1>${escape(chapter.title)}</h1>${sample(book)}<div class="prose">${chapter.html}</div></article><nav class="chapter-nav" aria-label="Chapter navigation">${previous ? `<a href="${previous.url}"><small>← Previous chapter</small>${escape(previous.title)}</a>` : `<a href="${book.url}"><small>← Story contents</small>${escape(book.title)}</a>`}${next ? `<a href="${next.url}"><small>Next chapter →</small>${escape(next.title)}</a>` : '<a href="/#shelf"><small>You’ve reached the end ✳</small>Back to the bookshelf →</a>'}</nav></div></div>`, book.description));
    }
  }
  await write('adding-stories', page('Make room for your stories', `<section class="guide"><a class="back" href="/#shelf">← Back to the bookshelf</a><h1>Your words.<br><em>A home of their own.</em></h1><p class="lead">Write wherever you like. Keep each chapter as a simple Markdown file. A saved change on GitHub becomes a page here.</p><div class="privacy-note"><strong>This bookshelf and its GitHub repository are public.</strong> Only add writing you want anyone to read. The current stories are labeled samples.</div><h2>From ChatGPT on your phone</h2><ol class="steps"><li><h3>Ask for a clean chapter</h3><p>“Give me the complete chapter as Markdown, beginning with # and the chapter title. Put it in one code block so I can copy it.”</p></li><li><h3>Save it in GitHub</h3><p>Open <a href="https://github.com/brianlapp/breezer-story-library/tree/main/content">the content folder on GitHub</a> in your phone browser. Sign into a GitHub account with write access. Open your story folder, choose <strong>Add file → Create new file</strong>, name it <code>03-your-chapter.md</code>, and paste the text without the surrounding backticks. Choose <strong>Commit changes</strong>. If mobile hides the controls, use your browser’s “Request Desktop Website”.</p></li><li><h3>Let the bookshelf catch up</h3><p>Netlify builds the updated library after a commit to <code>main</code>. Once that deployment finishes, refresh this site. New chapters appear in numerical order.</p></li></ol><p>Already have a downloaded <code>.md</code> file? Choose <strong>Add file → Upload files</strong> in the story folder, then commit it.</p><h2>Starting a new story</h2><p>In <code>content/</code>, create a folder such as <code>my-new-story</code>. Add <code>book.json</code> using the example below, then your first chapter as <code>01-the-beginning.md</code>. Commit both files together before publishing. It’s easiest to ask Codex to do this setup or use GitHub’s web editor.</p><pre><code>${escape(JSON.stringify({title:'Your story title',description:'A sentence about your story.',genre:'Fantasy',sample:false,color:'pink'},null,2))}</code></pre><p>Choose <code>pink</code>, <code>green</code>, or <code>orange</code> for the cover. Chapter files begin with <code># Your chapter title</code>, a blank line, and the writing. Use <code>**bold**</code>, <code>*italic*</code>, and <code>---</code> for a scene break.</p><h2>Prefer to ask Codex?</h2><p>With this repository open in Codex and a GitHub account authorized to write, attach or paste your chapter and say:</p><blockquote>Save this chapter exactly as written in content/my-story/03-chapter-name.md. Keep the chapter title as a Markdown heading. Run the checks, then commit and push to main. This chapter is approved for public publishing.</blockquote><h2>What connecting GitHub to ChatGPT does</h2><p>The ordinary ChatGPT GitHub app can read and discuss the repository; connecting it does not automatically save your writing or give it write access. <a href="https://help.openai.com/en/articles/11145903-connecting-github-to-chatgpt">OpenAI documents this limitation</a> and recommends Codex for writing to GitHub. Breezer can use her own ChatGPT account to write. To edit this repository herself, Brian must invite her GitHub username as a collaborator and she must accept.</p></section>`));
  await writeFile(path.join(output,'404.html'),page('This page wandered off', '<section class="guide"><h1>This page wandered off.</h1><p>The story may have moved. Let’s find you something to read.</p><a class="button" href="/">Back to the bookshelf ↗</a></section>'));
  await writeFile(path.join(output,'robots.txt'),'User-agent: *\nDisallow: /\n');
  return { books: books.length, chapters: books.reduce((n,b)=>n+b.chapters.length,0) };
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) console.log(await build());
