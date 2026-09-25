# Breezer’s bookshelf

A funky little home for books, stories, and chapters. Static HTML, one Markdown parser, no database. **This repository is public. Its Netlify site is public too.** The included stories are original illustrative samples, not Breezer’s writing. Do not put private drafts here, including in Git history.

## Save a chapter from your phone

1. Write with your own ChatGPT account. Ask: **“Give me the complete chapter as Markdown in one code block. Start with # and the chapter title.”** Copy the text inside the block.
2. Sign into GitHub in your phone browser using an account with write access to this repository. Brian needs to invite Breezer’s GitHub username under **Settings → Collaborators**, and she must accept. Her ChatGPT account and GitHub account are separate.
3. Open `content/your-story/`. Choose **Add file → Create new file**, name it `03-your-chapter.md`, paste the Markdown without the wrapping triple backticks, and **Commit changes** to `main`. To replace an existing chapter, open its file and use the pencil/edit control instead. If mobile hides these controls, request the desktop website from the browser menu.
4. Netlify rebuilds on a push to `main`. Refresh after the deployment succeeds. Build status appears in Netlify; a rejected/failed build leaves the last successful site live.

If ChatGPT offers a downloadable `.md` file, save it to Files/Downloads and use GitHub’s **Add file → Upload files** instead. File-download availability depends on the ChatGPT experience; copying Markdown is sufficient.

**Connecting the ordinary ChatGPT GitHub app does not enable saving or pushing.** OpenAI’s [current GitHub help page](https://help.openai.com/en/articles/11145903-connecting-github-to-chatgpt) says it is read-only and directs users to Codex for writes (checked September 24, 2026). It can help discuss the repository; it is not an automatic backup of chats. Existing ChatGPT histories are not imported by this project.

### Optional: let Codex save it

Open this repository in Codex, with GitHub write access, then paste/attach the chapter and say:

> Save this chapter exactly as written in content/my-story/03-chapter-name.md. Preserve the prose, start with a Markdown title, run npm test and npm run build, then commit and push to main. This chapter is approved for public publishing.

Codex availability on phone and included usage depend on plan and product surface. Do not assume the Free plan supports this phone workflow; see [current official pricing and availability](https://learn.chatgpt.com/docs/pricing). The GitHub-browser route above does not require Codex.

## Content convention

```text
content/
  my-story/
    book.json
    01-the-beginning.md
    02-the-next-chapter.md
```

`book.json`:

```json
{
  "title": "My story",
  "description": "A sentence about this world.",
  "genre": "Fantasy",
  "sample": false,
  "color": "pink"
}
```

`01-the-beginning.md`:

```markdown
# The Beginning

Your chapter starts here. **Bold**, *italic*, lists, links, and blockquotes work.

---

A new scene.
```

- One folder per book or standalone story; lowercase folder names with hyphens.
- Add `book.json` and at least one chapter together when creating a new story. GitHub’s web editor (`.` on the repository, or github.dev) can commit multiple files at once; Codex can also do this setup.
- Chapters sort by the number at the start of the filename, even beyond 09. Use unique positive numbers. The first line must be `# Title`, followed by a newline and nonempty body.
- New folders and chapters are discovered automatically at build. Books sort alphabetically. No menu code to edit.
- `sample` must explicitly be true for demonstration content or false for actual writing. It is a label, **not a privacy control**. Every file committed here is public, and all valid content is published.
- Cover colors: `pink`, `green`, or `orange`. Other colors fall back to pink.
- Raw HTML is displayed as text; unsafe Markdown links are rejected by the parser. Keep links absolute (`https://...`) for content portability.
- Removing sample folders removes their books on the next build. Renaming a folder/chapter changes its URL; old bookmarks may then lead to the friendly 404 page.
- Reading preferences and the last visited chapter stay in this browser only. They are not synced between devices.

## Run locally

Requires Node 20+ (Netlify uses Node 22) and Python 3 for the optional preview command.

```sh
npm ci
npm test
npm run build
npm run preview
```

Visit `http://localhost:4173`. The build emits `dist/`. The runnable check covers numeric chapter ordering, Markdown rendering, escaping, unsafe links, required fields/content, generated navigation, and internal links.

## Netlify continuous deployment

Import `brianlapp/breezer-story-library` into Brian’s existing Netlify account. Choose `main`, build command `npm test && npm run build`, publish directory `dist`; `netlify.toml` already supplies those settings. Git-backed Netlify deployment must be linked to the repo, not a drag-and-drop deployment.

The account checked during setup is Brian’s BrandlingLabs Starter account. Its API flags private *organization* repositories as unavailable; that is not evidence that all personal private repositories require payment. Public visibility was explicitly chosen by Brian regardless.

`robots.txt` asks search crawlers not to index this demo. It does **not** make anything private. No authentication or private-draft storage is included.
