# Conversation Tools

Three conveniences for the DeepSeek Harness conversation view: in-conversation search, up-arrow recall of sent messages, and regenerate / continue actions on finished answers.

## Features

### In-conversation search

- Open it from the magnifier beside the composer, or with Ctrl/⌘ + F.
- The find bar floats directly above the composer, matches the input width, takes no layout space, and never pushes the conversation upward.
- Hits list as you type, with a match counter; Enter jumps to the next hit, prev / next buttons step through them, Esc closes.
- Hovering a hit opens a scrollable full-text card beside the panel with a Copy message button that reports Copied.

### Up-arrow recall

- With an empty composer, press ↑ to recall the last message you sent; keep pressing ↑ to walk further back, ↓ to walk forward.
- Images and file attachments come back as composer drafts too; recalling another message replaces the previous draft.

### Regenerate / continue

- Every finished answer gains a Regenerate button that resends the prompt behind that answer.
- The newest answer also gets Continue, which sends “continue”.

## Install

From npm:

```bash
dsh plugin --profile <your profile> add dsh-conversation-tools
```

Straight from this repository:

```bash
dsh plugin --profile <your profile> add github:Ernesto-yuan/dsh-conversation-tools
```

Or from a Release tarball:

```bash
dsh plugin --profile <your profile> add <path to the tgz>
```

Then confirm it is enabled under Settings → Plugins. The client bundle needs one page reload.

## Compatibility

Verified on DSH 0.2.1-rc.3.

## Notes and limits

- Client-side only: no files written, no network requests, no state beyond the current session.
- Search covers the messages already loaded in the current conversation.
- Clicking a hit only selects it; there is no jump. The chat list is virtualized and unmounted rows cannot be located, so use Copy message on the hover card instead.
- Recall covers the current conversation only; one message restores at most 6 attachments, and unreadable ones are skipped.
- Regenerate starts a new turn; it does not delete the previous answer.

## License

MIT
