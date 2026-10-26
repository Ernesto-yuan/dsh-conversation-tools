window.__ModuleLoader__.load({
  id: 'dsh-conversation-tools',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    /** Locale namespace of this feature's copy. */
    const NAMESPACE = 'conversation-tools';
    /** Build marker: proves which client bundle the page actually loaded. */
    const VERSION = '2.2.0';
    /** Upper bound on rendered search hits. */
    const MAX_RESULTS = 100;
    /** Upper bound on attachments one recall restores. */
    const MAX_RESTORED_ATTACHMENTS = 6;
    /** Characters of context kept on each side of a hit. */
    const EXCERPT_WINDOW = 70;

    const ZH = {
      'action.regenerate': '重新生成',
      'action.regenerateTip': '点击将重新发送这次提问并重新生成回答，会替换输入框里的内容',
      'action.continue': '继续生成',
      'action.continueTip': '点击将继续生成这条回答的后续内容',
      'action.continuePrompt': '继续',
      'search.open': '查找聊天记录',
      'search.title': '查找聊天记录',
      'search.placeholder': '搜索本会话的消息…',
      'search.close': '关闭查找',
      'search.previous': '上一处',
      'search.next': '下一处',
      'search.empty': '没有匹配的消息',
      'search.hint': '输入关键词，查找这个会话里你和助手的消息。回车跳到下一处。',
      'search.count': '处匹配',
      'search.copy': '点击复制整条消息',
      'search.copyShort': '复制整条',
      'search.copied': '已复制',
      'search.roleUser': '你',
      'search.roleAssistant': '助手',
      'search.turn': '第 {turn} 轮',
      'history.hint': '按向上键取回上一条发送的消息',
    };

    const EN = {
      'action.regenerate': 'Regenerate',
      'action.regenerateTip': 'Click to send this prompt again and regenerate the answer; replaces what is in the composer',
      'action.continue': 'Continue',
      'action.continueTip': 'Click to continue this answer',
      'action.continuePrompt': 'Continue',
      'search.open': 'Search this conversation',
      'search.title': 'Search conversation',
      'search.placeholder': 'Search messages in this conversation…',
      'search.close': 'Close search',
      'search.previous': 'Previous match',
      'search.next': 'Next match',
      'search.empty': 'No matching messages',
      'search.hint': 'Type a keyword to search your messages and the assistant replies. Press Enter for the next match.',
      'search.count': 'matches',
      'search.copy': 'Click to copy the whole message',
      'search.copyShort': 'Copy message',
      'search.copied': 'Copied',
      'search.roleUser': 'You',
      'search.roleAssistant': 'Assistant',
      'search.turn': 'turn {turn}',
      'history.hint': 'Press the up arrow to recall the last message you sent',
    };

    const CSS = `
.ct-action { position: relative; display: inline-flex; }
.ct-icon-btn { box-sizing: border-box; display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; padding: 0; border: none; border-radius: var(--dsw-radius-sm); background: transparent; color: var(--dsw-alias-label-secondary); cursor: pointer; }
.ct-icon-btn:hover { background: color-mix(in srgb, var(--dsw-alias-brand-primary) 10%, transparent); color: var(--dsw-alias-label-primary); }
.ct-icon-btn:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 1px; }
.ct-icon-btn:disabled { opacity: .4; cursor: default; }
.ct-tip { position: absolute; bottom: calc(100% + 6px); left: -6px; z-index: 40; display: block; width: max-content; max-width: 260px; padding: 5px 9px; border-radius: 8px; background: #2b2f36; color: #fff; font-size: 12px; line-height: 18px; text-align: left; white-space: normal; opacity: 0; pointer-events: none; transition: opacity .12s; }
.ct-action:hover .ct-tip, .ct-icon-btn:focus-visible + .ct-tip { opacity: 1; }
.ct-search { box-sizing: border-box; display: flex; flex-direction: column; gap: 4px; width: min(420px, 100%); margin: 0 auto 2px; padding: 6px 8px 7px; border: 1px solid var(--dsw-alias-border-l1); border-radius: var(--dsw-radius-lg); background: var(--dsw-alias-bg-overlay); box-shadow: var(--dsw-elevation-panel, 0 8px 24px rgba(0,0,0,.18)); overflow: hidden; }
.ct-search-row { display: flex; align-items: center; gap: 6px; }
.ct-search-icon { flex: none; color: var(--dsw-alias-label-secondary); }
.ct-search-input { flex: 1; min-width: 0; height: 28px; padding: 0 8px; border: 1px solid var(--dsw-alias-border-l1); border-radius: var(--dsw-radius-sm); background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-primary); font: inherit; font-size: 12px; }
.ct-search-input:focus { outline: none; border-color: var(--dsw-alias-brand-primary); box-shadow: 0 0 0 1px var(--dsw-alias-brand-primary); }
.ct-search-count { flex: none; min-width: 34px; font-size: 11px; text-align: right; color: var(--dsw-alias-label-secondary); font-variant-numeric: tabular-nums; }
.ct-search-results { display: flex; flex-direction: column; gap: 1px; max-height: 300px; overflow-y: auto; }
.ct-hit { display: flex; align-items: center; gap: 8px; width: 100%; padding: 6px 8px; border: none; border-radius: var(--dsw-radius-sm); background: transparent; color: inherit; font: inherit; text-align: left; cursor: default; }
.ct-hit:hover { background: color-mix(in srgb, var(--dsw-alias-brand-primary) 7%, transparent); }
.ct-hit[aria-current="true"] { background: color-mix(in srgb, var(--dsw-alias-brand-primary) 13%, transparent); }
.ct-hit-meta { flex: none; min-width: 72px; font-size: 11px; line-height: 18px; color: var(--dsw-alias-label-secondary); }
.ct-hit-text { flex: 1; min-width: 0; font-size: 13px; line-height: 20px; color: var(--dsw-alias-label-primary); overflow-wrap: anywhere; }
.ct-hit mark { background: color-mix(in srgb, var(--dsw-alias-brand-primary) 32%, transparent); color: inherit; border-radius: 3px; }
.ct-search-empty { padding: 6px 2px; font-size: 12px; line-height: 18px; color: var(--dsw-alias-label-secondary); }
.ct-preview { position: fixed; z-index: 9999; display: flex; flex-direction: column; gap: 8px; max-height: 40vh; overflow: hidden; padding: 10px 12px; border: 1px solid var(--dsw-alias-border-l1); border-radius: var(--dsw-radius-lg); background: var(--dsw-alias-bg-overlay); color: var(--dsw-alias-label-primary); box-shadow: var(--dsw-elevation-panel, 0 8px 24px rgba(0,0,0,.18)); font-size: 12px; line-height: 18px; pointer-events: auto; cursor: default; }
.ct-preview-text { flex: 1; min-height: 0; overflow-y: auto; white-space: pre-wrap; overflow-wrap: anywhere; }
.ct-preview-actions { flex: none; display: flex; justify-content: flex-end; }
.ct-preview-copy { display: inline-flex; align-items: center; gap: 4px; height: 26px; padding: 0 10px; border: 1px solid var(--dsw-alias-border-l1); border-radius: var(--dsw-radius-sm); background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary); font: inherit; font-size: 12px; cursor: pointer; }
.ct-preview-copy:hover { background: color-mix(in srgb, var(--dsw-alias-brand-primary) 10%, transparent); }
`;

    /** Text of user-message wire blocks. */
    function textOfContent(content) {
      if (!Array.isArray(content)) return '';
      let text = '';
      for (const block of content) {
        if (block !== null && typeof block === 'object' && block.type === 'text' && typeof block.text === 'string') text += block.text;
      }
      return text.trim();
    }

    /** Text of assistant-step blocks. */
    function textOfBlocks(blocks) {
      if (!Array.isArray(blocks)) return '';
      let text = '';
      for (const block of blocks) {
        if (block !== null && typeof block === 'object' && block.kind === 'text' && typeof block.text === 'string') text += block.text;
      }
      return text.trim();
    }

    /** Ordered `{ key, node }` pairs of the Chat snapshot. */
    function nodeEntries(snapshot) {
      const entries = [];
      if (snapshot === null || typeof snapshot !== 'object') return entries;
      const nodes = snapshot.nodes;
      if (nodes === undefined || nodes === null || typeof nodes.get !== 'function') return entries;
      const order = snapshot.order;
      const keys = Array.isArray(order) ? order : order !== null && typeof order === 'object' && typeof order[Symbol.iterator] === 'function' ? Array.from(order) : [];
      for (const key of keys) {
        const node = nodes.get(key);
        if (node !== undefined && node !== null && typeof node === 'object') entries.push({ key, node });
      }
      return entries;
    }

    /** Sequence number used to order nodes. */
    function seqOf(node) {
      return typeof node.anchorSeq === 'number' ? node.anchorSeq : 0;
    }

    /** Turn number when the node carries one. */
    function turnOf(node) {
      const location = node.location;
      if (location !== null && typeof location === 'object' && typeof location.turn === 'number') return location.turn;
      const data = node.data;
      if (data !== null && typeof data === 'object' && typeof data.turn === 'number') return data.turn;
      return null;
    }

    /** Every user and assistant message of the loaded conversation, in order. */
    function collectMessages(snapshot) {
      const messages = [];
      for (const { key, node } of nodeEntries(snapshot)) {
        if (node.kind === 'user') {
          const text = textOfContent(node.data === undefined ? undefined : node.data.content);
          if (text !== '') messages.push({ key, role: 'user', seq: seqOf(node), turn: turnOf(node), text });
        } else if (node.kind === 'assistant-step') {
          const text = textOfBlocks(node.data === undefined ? undefined : node.data.blocks);
          if (text !== '') messages.push({ key, role: 'assistant', seq: seqOf(node), turn: turnOf(node), text });
        }
      }
      messages.sort((left, right) => left.seq - right.seq);
      return messages;
    }

    /** Durable attachment references carried by one user message. */
    function attachmentsOfContent(content) {
      if (!Array.isArray(content)) return [];
      const refs = [];
      for (const block of content) {
        if (block === null || typeof block !== 'object') continue;
        if (block.type !== 'image' && block.type !== 'file') continue;
        const ref = block.attachment;
        if (ref === null || ref === undefined || typeof ref !== 'object') continue;
        if (typeof ref.attachmentId !== 'string') continue;
        refs.push({ attachmentId: ref.attachmentId, mediaType: ref.mediaType, name: ref.name });
      }
      return refs;
    }

    /** Sent user messages with their attachment references, oldest first. */
    function userHistory(snapshot) {
      const items = [];
      for (const { key, node } of nodeEntries(snapshot)) {
        if (node.kind !== 'user') continue;
        const content = node.data === undefined ? undefined : node.data.content;
        const text = textOfContent(content);
        const attachments = attachmentsOfContent(content);
        if (text === '' && attachments.length === 0) continue;
        items.push({ key, seq: seqOf(node), text, attachments });
      }
      items.sort((left, right) => left.seq - right.seq);
      return items;
    }

    /** The user prompt that produced one finalized assistant message. */
    function promptForMessage(snapshot, messageId) {
      let targetSeq = null;
      const entries = nodeEntries(snapshot);
      for (const { node } of entries) {
        if (node.kind !== 'turn-tail') continue;
        const closing = node.data === undefined ? undefined : node.data.closing;
        const finalNode = closing === null || closing === undefined ? undefined : closing.finalNode;
        if (finalNode === null || finalNode === undefined || finalNode.messageId !== messageId) continue;
        targetSeq = typeof finalNode.seq === 'number' ? finalNode.seq : seqOf(node);
        break;
      }
      if (targetSeq === null) return '';
      let prompt = '';
      let promptSeq = -1;
      for (const { node } of entries) {
        if (node.kind !== 'user') continue;
        const seq = seqOf(node);
        if (seq > targetSeq || seq < promptSeq) continue;
        const text = textOfContent(node.data === undefined ? undefined : node.data.content);
        if (text === '') continue;
        prompt = text;
        promptSeq = seq;
      }
      return prompt;
    }

    /** Message id of the newest finalized assistant message. */
    function lastAssistantMessageId(snapshot) {
      let last = null;
      let lastSeq = -1;
      for (const { node } of nodeEntries(snapshot)) {
        if (node.kind !== 'turn-tail') continue;
        const closing = node.data === undefined ? undefined : node.data.closing;
        const finalNode = closing === null || closing === undefined ? undefined : closing.finalNode;
        if (finalNode === null || finalNode === undefined || typeof finalNode.messageId !== 'string') continue;
        const seq = typeof finalNode.seq === 'number' ? finalNode.seq : seqOf(node);
        if (seq >= lastSeq) {
          lastSeq = seq;
          last = finalNode.messageId;
        }
      }
      return last;
    }

    /** Equality for two sent-message histories, including their attachments. */
    function sameHistoryList(left, right) {
      if (left === right) return true;
      if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) return false;
      for (let index = 0; index < left.length; index += 1) {
        const a = left[index];
        const b = right[index];
        if (a.text !== b.text || a.attachments.length !== b.attachments.length) return false;
        for (let position = 0; position < a.attachments.length; position += 1) {
          if (a.attachments[position].attachmentId !== b.attachments[position].attachmentId) return false;
        }
      }
      return true;
    }

    /** Equality for two collected message lists. */
    function sameMessageList(left, right) {
      if (left === right) return true;
      if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) return false;
      for (let index = 0; index < left.length; index += 1) {
        const a = left[index];
        const b = right[index];
        if (a.key !== b.key || a.role !== b.role || a.text !== b.text || a.turn !== b.turn) return false;
      }
      return true;
    }

    /** Stand-in selector hook for a scope without a Chat store. */
    function useFallbackChat(selector) {
      const [value] = React.useState(() => selector(null));
      return value;
    }

    /** Stand-in selector hook for a scope without an input store. */
    function useFallbackInput(selector) {
      const [value] = React.useState(() => selector(null));
      return value;
    }

    let styleRefs = 0;
    let styleElement = null;

    /** Mount this page's stylesheet once for every live component, and remove it with the last one. */
    function useStyles() {
      React.useEffect(() => {
        styleRefs += 1;
        if (styleElement === null) {
          styleElement = document.createElement('style');
          styleElement.setAttribute('data-conversation-tools', '');
          styleElement.textContent = CSS;
          document.head.appendChild(styleElement);
        }
        return () => {
          styleRefs -= 1;
          if (styleRefs > 0 || styleElement === null) return;
          styleElement.remove();
          styleElement = null;
          styleRefs = 0;
        };
      }, []);
    }

    /** Excerpt pieces around one hit. */
    function excerptAround(text, at, length) {
      const start = Math.max(0, at - EXCERPT_WINDOW);
      const end = Math.min(text.length, at + length + EXCERPT_WINDOW);
      return {
        before: (start > 0 ? '…' : '') + text.slice(start, at),
        match: text.slice(at, at + length),
        after: text.slice(at + length, end) + (end < text.length ? '…' : ''),
      };
    }

    /** All hits of one query over the loaded messages. */
    function searchMessages(messages, query) {
      const needle = query.toLowerCase();
      if (needle === '') return [];
      const hits = [];
      for (const message of messages) {
        const haystack = message.text.toLowerCase();
        let from = 0;
        while (hits.length < MAX_RESULTS) {
          const at = haystack.indexOf(needle, from);
          if (at < 0) break;
          hits.push({ message, ...excerptAround(message.text, at, needle.length) });
          from = at + Math.max(1, needle.length);
        }
        if (hits.length >= MAX_RESULTS) break;
      }
      return hits;
    }

    /** Whether a key event targets the rich composer editor. */
    function isComposerTarget(target) {
      return target !== null && typeof target === 'object' && target.isContentEditable === true;
    }

    /** Copy text to the clipboard, returning whether it worked. */
    async function copyText(text) {
      try {
        if (navigator.clipboard !== undefined && typeof navigator.clipboard.writeText === 'function') {
          await navigator.clipboard.writeText(text);
          return true;
        }
      } catch (error) {
        /* fall through to the legacy path */
      }
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      let done = false;
      try {
        done = document.execCommand('copy');
      } catch (error) {
        done = false;
      }
      area.remove();
      return done;
    }

    /* ---------- shared open state for the search panel ---------- */

    const searchListeners = new Set();
    let searchOpen = false;

    function setSearchOpen(open) {
      if (searchOpen === open) return;
      searchOpen = open;
      for (const listener of [...searchListeners]) listener();
    }

    /** Subscribe a component to the shared search-panel state. */
    function useSearchOpen() {
      const [, bump] = React.useReducer((revision) => revision + 1, 0);
      React.useEffect(() => {
        searchListeners.add(bump);
        return () => {
          searchListeners.delete(bump);
        };
      }, []);
      return searchOpen;
    }

    /* ---------- icons ---------- */

    function RegenerateIcon() {
      return h('svg', { viewBox: '0 0 16 16', width: 15, height: 15, 'aria-hidden': 'true', fill: 'none' },
        h('path', {
          d: 'M13 8a5 5 0 1 1-1.6-3.7M13 3.3V6h-2.7',
          stroke: 'currentColor',
          strokeWidth: 1.5,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }));
    }

    function ContinueIcon() {
      return h('svg', { viewBox: '0 0 16 16', width: 15, height: 15, 'aria-hidden': 'true', fill: 'none' },
        h('path', { d: 'M4.5 3.5 8 8l-3.5 4.5M9.5 3.5 13 8l-3.5 4.5', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }));
    }

    function SearchIcon({ className }) {
      return h('svg', { viewBox: '0 0 16 16', width: 15, height: 15, 'aria-hidden': 'true', fill: 'none', className },
        h('circle', { cx: 7, cy: 7, r: 4.4, stroke: 'currentColor', strokeWidth: 1.5 }),
        h('path', { d: 'M10.4 10.4 13.6 13.6', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' }));
    }

    function CloseIcon() {
      return h('svg', { viewBox: '0 0 16 16', width: 14, height: 14, 'aria-hidden': 'true', fill: 'none' },
        h('path', { d: 'M4 4l8 8M12 4l-8 8', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' }));
    }

    function ChevronIcon({ up }) {
      return h('svg', { viewBox: '0 0 16 16', width: 14, height: 14, 'aria-hidden': 'true', fill: 'none' },
        h('path', { d: up ? 'M4 10l4-4 4 4' : 'M4 6l4 4 4-4', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }));
    }

    function CopyIcon() {
      return h('svg', { viewBox: '0 0 16 16', width: 14, height: 14, 'aria-hidden': 'true', fill: 'none' },
        h('rect', { x: 5.5, y: 5.5, width: 7, height: 8, rx: 1.5, stroke: 'currentColor', strokeWidth: 1.4 }),
        h('path', { d: 'M10.5 3.5H4.5A1.5 1.5 0 0 0 3 5v6', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' }));
    }

    function CheckIcon() {
      return h('svg', { viewBox: '0 0 16 16', width: 14, height: 14, 'aria-hidden': 'true', fill: 'none' },
        h('path', { d: 'M3.5 8.5 6.5 11.5 12.5 4.5', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }));
    }

    /* ---------- actions ---------- */

    /** Re-send the prompt behind one finished answer, using the composer pipeline. */
    function RegenerateAction(props) {
      const t = typeof props.t === 'function' ? props.t : props.translate;
      const label = (key) => (typeof t === 'function' ? t(key) : key);
      const useChat = typeof props.useChat === 'function' ? props.useChat : useFallbackChat;
      const prompt = useChat((snapshot) => promptForMessage(snapshot, props.messageId), (left, right) => left === right);
      useStyles();
      const run = () => {
        if (prompt === '') return;
        try {
          props.inputActions.setDraft(prompt);
          props.inputActions.submit();
        } catch (error) {
          console.error('conversation-tools: regenerate failed', error);
        }
      };
      if (prompt === '') return null;
      return h('span', { className: 'ct-action' },
        h('button', {
          type: 'button',
          className: 'ct-icon-btn',
          'aria-label': label('action.regenerate'),
          onClick: run,
        }, h(RegenerateIcon)),
        h('span', { className: 'ct-tip' }, label('action.regenerateTip')));
    }

    /** Ask the model to continue the newest answer. */
    function ContinueAction(props) {
      const t = typeof props.t === 'function' ? props.t : props.translate;
      const label = (key) => (typeof t === 'function' ? t(key) : key);
      const useChat = typeof props.useChat === 'function' ? props.useChat : useFallbackChat;
      const lastId = useChat((snapshot) => lastAssistantMessageId(snapshot), (left, right) => left === right);
      useStyles();
      const run = () => {
        try {
          props.inputActions.setDraft(label('action.continuePrompt'));
          props.inputActions.submit();
        } catch (error) {
          console.error('conversation-tools: continue failed', error);
        }
      };
      if (lastId === null || lastId !== props.messageId) return null;
      return h('span', { className: 'ct-action' },
        h('button', {
          type: 'button',
          className: 'ct-icon-btn',
          'aria-label': label('action.continue'),
          onClick: run,
        }, h(ContinueIcon)),
        h('span', { className: 'ct-tip' }, label('action.continueTip')));
    }

    /* ---------- search ---------- */

    /** Composer toolbar button that toggles the find panel; owns the Ctrl/Cmd+F shortcut. */
    function SearchTrigger(props) {
      const t = typeof props.t === 'function' ? props.t : props.translate;
      const label = (key) => (typeof t === 'function' ? t(key) : key);
      const open = useSearchOpen();
      useStyles();
      React.useEffect(() => {
        const onKeyDown = (event) => {
          if (!(event.ctrlKey || event.metaKey) || event.altKey || event.shiftKey) return;
          if (event.key !== 'f' && event.key !== 'F') return;
          event.preventDefault();
          event.stopImmediatePropagation();
          setSearchOpen(!searchOpen);
        };
        document.addEventListener('keydown', onKeyDown, true);
        return () => document.removeEventListener('keydown', onKeyDown, true);
      }, []);
      return h('button', {
        type: 'button',
        className: 'ct-icon-btn',
        'aria-label': label('search.open'),
        'aria-pressed': open ? 'true' : 'false',
        onClick: () => setSearchOpen(!open),
      }, h(SearchIcon));
    }

    /** Where the find panel floats: just above the composer card, same width area. */
    function measureAnchor() {
      let card = null;
      try {
        card = document.querySelector('[data-composer-card]');
      } catch (error) {
        card = null;
      }
      if (card === null || card === undefined) return null;
      const rect = card.getBoundingClientRect();
      const width = Math.min(480, Math.max(320, Math.round(rect.width)));
      return {
        left: Math.round(rect.left + (rect.width - width) / 2),
        bottom: Math.round(window.innerHeight - rect.top + 10),
        width,
      };
    }

    /** The find panel; mounted only while open so a closed panel costs nothing. */
    function SearchPanel(props) {
      const open = useSearchOpen();
      if (!open) return null;
      return h(SearchPanelBody, props);
    }

    function SearchPanelBody(props) {
      const t = typeof props.t === 'function' ? props.t : props.translate;
      const label = (key) => (typeof t === 'function' ? t(key) : key);
      const useChat = typeof props.useChat === 'function' ? props.useChat : useFallbackChat;
      const messages = useChat((snapshot) => collectMessages(snapshot), sameMessageList);
      useStyles();
      const [query, setQuery] = React.useState('');
      const [active, setActive] = React.useState(0);
      const [preview, setPreview] = React.useState(null);
      const [copiedKey, setCopiedKey] = React.useState(null);
      const [anchor, setAnchor] = React.useState(() => measureAnchor());
      const hideTimer = React.useRef(0);
      const inputRef = React.useRef(null);
      const rowRefs = React.useRef(new Map());
      const hits = React.useMemo(() => searchMessages(messages, query.trim()), [messages, query]);

      React.useEffect(() => {
        if (inputRef.current !== null) inputRef.current.focus();
      }, []);

      // Float above the composer instead of taking layout space, so opening the
      // panel never pushes the conversation up.
      React.useEffect(() => {
        const place = () => setAnchor(measureAnchor());
        place();
        window.addEventListener('resize', place);
        return () => window.removeEventListener('resize', place);
      }, []);

      React.useEffect(() => {
        setActive((current) => (hits.length === 0 ? 0 : Math.min(current, hits.length - 1)));
      }, [hits.length]);

      React.useEffect(() => {
        const hit = hits[active];
        if (hit === undefined) return;
        const row = rowRefs.current.get(hit.message.key + ':' + hit.before.length + ':' + hit.match);
        if (row !== undefined && typeof row.scrollIntoView === 'function') row.scrollIntoView({ block: 'nearest' });
      }, [active, hits]);

      /** Copy one matched message and confirm in place. */
      const copy = async (hit) => {
        if (hit === undefined) return;
        const done = await copyText(hit.message.text);
        if (!done) return;
        setCopiedKey(hit.message.key);
        window.setTimeout(() => setCopiedKey(null), 1500);
      };

      /** Keep the card open while the pointer travels from the row into it. */
      const cancelHide = () => {
        if (hideTimer.current !== 0) {
          window.clearTimeout(hideTimer.current);
          hideTimer.current = 0;
        }
      };

      /** Close the card shortly after the pointer leaves both the row and the card. */
      const scheduleHide = () => {
        cancelHide();
        hideTimer.current = window.setTimeout(() => {
          hideTimer.current = 0;
          setPreview(null);
        }, 180);
      };

      /** Show the complete message beside the panel, never on top of the result rows. */
      const showPreview = (event, hit) => {
        cancelHide();
        const target = event.currentTarget;
        const row = target.getBoundingClientRect();
        const panelElement = typeof target.closest === 'function' ? target.closest('.ct-search') : null;
        const panel = panelElement === null || panelElement === undefined ? row : panelElement.getBoundingClientRect();
        const width = Math.min(520, Math.max(280, window.innerWidth - 32));
        let left = panel.right + 12;
        if (left + width > window.innerWidth - 12) left = panel.left - width - 12;
        if (left < 12) left = 12;
        const maxHeight = Math.min(360, Math.max(160, Math.round(window.innerHeight * 0.55)));
        const top = Math.min(Math.max(12, row.top), Math.max(12, window.innerHeight - maxHeight - 12));
        setPreview({ hit, text: hit.message.text, top, left, width, maxHeight });
      };

      const turn = (hit) => (hit.message.turn === null ? '' : label('search.turn').replace('{turn}', String(hit.message.turn)));

      const onKeyDown = (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          setSearchOpen(false);
          return;
        }
        if (event.key === 'Enter') {
          event.preventDefault();
          if (hits.length === 0) return;
          const next = event.shiftKey ? (active - 1 + hits.length) % hits.length : (active + 1) % hits.length;
          setActive(next);
        }
      };

      const rows = hits.map((hit, index) => h('div', {
        key: `${hit.message.key}:${index}`,
        ref: (node) => {
          if (node === null) rowRefs.current.delete(`${hit.message.key}:${hit.before.length}:${hit.match}`);
          else rowRefs.current.set(`${hit.message.key}:${hit.before.length}:${hit.match}`, node);
        },
        className: 'ct-hit',
        'aria-current': index === active ? 'true' : 'false',
        onClick: () => setActive(index),
        onMouseEnter: (event) => showPreview(event, hit),
        onMouseLeave: () => scheduleHide(),
      },
      h('span', { className: 'ct-hit-meta' },
        `${hit.message.role === 'user' ? label('search.roleUser') : label('search.roleAssistant')}${turn(hit) === '' ? '' : ' · ' + turn(hit)}`),
      h('span', { className: 'ct-hit-text' },
        hit.before,
        h('mark', null, hit.match),
        hit.after)));

      return h('div', {
        className: 'ct-search',
        role: 'search',
        style: anchor === null ? undefined : {
          position: 'fixed',
          left: anchor.left + 'px',
          bottom: anchor.bottom + 'px',
          width: anchor.width + 'px',
          margin: 0,
          zIndex: 50,
        },
      },
        h('div', { className: 'ct-search-row' },
          h(SearchIcon, { className: 'ct-search-icon' }),
          h('input', {
            ref: inputRef,
            className: 'ct-search-input',
            type: 'search',
            value: query,
            placeholder: label('search.placeholder'),
            title: label('search.hint'),
            'aria-label': label('search.title'),
            onChange: (event) => {
              setQuery(event.target.value);
              setActive(0);
            },
            onKeyDown,
          }),
          h('span', { className: 'ct-search-count' },
            query.trim() === '' ? '' : `${hits.length === 0 ? 0 : active + 1}/${hits.length}`),
          h('button', {
            type: 'button',
            className: 'ct-icon-btn',
            'aria-label': label('search.previous'),
            disabled: hits.length === 0,
            onClick: () => setActive((current) => (current - 1 + hits.length) % hits.length),
          }, h(ChevronIcon, { up: true })),
          h('button', {
            type: 'button',
            className: 'ct-icon-btn',
            'aria-label': label('search.next'),
            disabled: hits.length === 0,
            onClick: () => setActive((current) => (current + 1) % hits.length),
          }, h(ChevronIcon, { up: false })),
          h('button', {
            type: 'button',
            className: 'ct-icon-btn',
            'aria-label': label('search.close'),
            onClick: () => setSearchOpen(false),
          }, h(CloseIcon))),
        query.trim() === ''
          ? null
          : hits.length === 0
            ? h('div', { className: 'ct-search-empty' }, label('search.empty'))
            : h('div', { className: 'ct-search-results', onScroll: () => { cancelHide(); setPreview(null); } }, rows),
        preview === null ? null : h('div', {
          className: 'ct-preview',
          role: 'tooltip',
          style: {
            top: preview.top + 'px',
            left: preview.left + 'px',
            width: preview.width + 'px',
            maxHeight: preview.maxHeight + 'px',
          },
          onMouseEnter: cancelHide,
          onMouseLeave: () => scheduleHide(),
        },
        h('div', { className: 'ct-preview-text' }, preview.text),
        h('div', { className: 'ct-preview-actions' },
          h('button', {
            type: 'button',
            className: 'ct-preview-copy',
            onClick: () => { void copy(preview.hit); },
          },
          copiedKey === preview.hit.message.key ? h(CheckIcon) : h(CopyIcon),
          h('span', null, copiedKey === preview.hit.message.key ? label('search.copied') : label('search.copyShort'))))));
    }

    /* ---------- composer history ---------- */

    /** Up-arrow recall of sent messages, restoring their attachments as drafts. */
    function HistoryRecall(props) {
      const useChat = typeof props.useChat === 'function' ? props.useChat : useFallbackChat;
      const useInput = typeof props.useInput === 'function' ? props.useInput : useFallbackInput;
      const history = useChat((snapshot) => userHistory(snapshot), sameHistoryList);
      const draft = useInput((state) => (state === null || state === undefined ? '' : state.draft));
      const latest = React.useRef({ history: [], draft: '', actions: null, restore: null, sessionId: null });
      const navigation = React.useRef({ active: false, index: -1, expected: '' });
      const restored = React.useRef({ ids: [], generation: 0 });

      React.useEffect(() => {
        latest.current = {
          history,
          draft,
          actions: props.inputActions,
          restore: props.restoreAttachments,
          sessionId: props.sessionId,
        };
      });

      React.useEffect(() => {
        /** Remove the draft attachments this navigator added on the previous recall. */
        const dropRestored = (actions) => {
          const ids = restored.current.ids;
          restored.current.ids = [];
          if (ids.length === 0) return;
          if (actions === null || actions === undefined || typeof actions.removeAttachment !== 'function') return;
          for (const id of ids) {
            try {
              actions.removeAttachment(id);
            } catch (error) {
              /* the draft may already have been cleared */
            }
          }
        };

        /** Restore one message: text now, attachments when their bytes arrive. */
        const recall = (entry) => {
          const state = latest.current;
          const actions = state.actions;
          if (actions === null || actions === undefined) return;
          const generation = restored.current.generation + 1;
          restored.current.generation = generation;
          dropRestored(actions);
          if (entry === undefined || entry.attachments.length === 0) return;
          if (typeof state.restore !== 'function') return;
          void Promise.resolve(state.restore(state.sessionId, entry.attachments, actions))
            .then((ids) => {
              if (!Array.isArray(ids) || ids.length === 0) return;
              if (restored.current.generation !== generation) {
                for (const id of ids) {
                  try {
                    actions.removeAttachment(id);
                  } catch (error) {
                    /* a stale draft is already gone */
                  }
                }
                return;
              }
              restored.current.ids = ids;
            })
            .catch((error) => console.warn('conversation-tools: attachments were not restored', error));
        };

        const show = (entry) => {
          const state = latest.current;
          const actions = state.actions;
          if (actions === null || actions === undefined) return;
          actions.setDraft(entry === undefined ? '' : entry.text);
          recall(entry);
        };

        const onKeyDown = (event) => {
          if (event.defaultPrevented || event.isComposing) return;
          if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
          if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
          if (!isComposerTarget(event.target)) return;
          const state = latest.current;
          const actions = state.actions;
          if (actions === undefined || actions === null) return;
          const draftNow = typeof state.draft === 'string' ? state.draft : '';
          const cursor = navigation.current;
          if (event.key === 'ArrowUp') {
            if (!cursor.active) {
              if (draftNow.trim() !== '' || state.history.length === 0) return;
              cursor.active = true;
              cursor.index = state.history.length - 1;
              cursor.expected = state.history[cursor.index].text;
            } else {
              if (draftNow !== cursor.expected) {
                cursor.active = false;
                return;
              }
              if (cursor.index <= 0) return;
              cursor.index -= 1;
              cursor.expected = state.history[cursor.index].text;
            }
            event.preventDefault();
            event.stopImmediatePropagation();
            show(state.history[cursor.index]);
            return;
          }
          if (!cursor.active || draftNow !== cursor.expected) return;
          event.preventDefault();
          event.stopImmediatePropagation();
          if (cursor.index >= state.history.length - 1) {
            cursor.active = false;
            cursor.expected = '';
            show(undefined);
            return;
          }
          cursor.index += 1;
          cursor.expected = state.history[cursor.index].text;
          show(state.history[cursor.index]);
        };
        document.addEventListener('keydown', onKeyDown, true);
        return () => document.removeEventListener('keydown', onKeyDown, true);
      }, []);

      return null;
    }

    /**
     * Client plugin body: register the dictionaries and every conversation-UI
     * contribution this bundle makes.
     * @param ctx - Client cordis context.
     */
    function apply(ctx) {
      console.info(`[conversation-tools] v${VERSION} loaded`);
      const locale = ctx.get('locale');
      const slots = ctx.get('slots');
      if (locale === undefined || slots === undefined) return;

      const translate = locale.bind(NAMESPACE);
      ctx.effect(() => locale.register(NAMESPACE, { zh: ZH, en: EN }), 'conversation-tools: dictionaries');

      /**
       * Turn durable attachment references back into composer drafts: read the
       * admitted bytes through the Session binding, rebuild Files, hand them to
       * the conversation service, and add the resulting ids to the draft.
       * @param sessionId - Session the references belong to.
       * @param refs - `{ attachmentId, mediaType?, name? }` references.
       * @param actions - the composer input action face.
       * @returns the added draft ids (empty when nothing could be restored).
       */
      const restoreAttachments = async (sessionId, refs, actions) => {
        const conversation = ctx.get('conversation');
        const sessions = ctx.get('sessions');
        if (conversation === undefined || sessions === undefined) return [];
        if (typeof sessionId !== 'string' || !Array.isArray(refs) || refs.length === 0) return [];
        if (actions === null || actions === undefined || typeof actions.addAttachments !== 'function') return [];
        const binding = sessions.binding(sessionId);
        if (binding === undefined || binding === null || binding.session === undefined) return [];
        const files = [];
        for (const ref of refs.slice(0, MAX_RESTORED_ATTACHMENTS)) {
          try {
            const result = await binding.session.readAttachment(ref.attachmentId);
            if (result === null || result === undefined || result.ok !== true) continue;
            const stored = result.value.attachment === undefined ? {} : result.value.attachment;
            const mediaType = typeof stored.mediaType === 'string' ? stored.mediaType : ref.mediaType;
            const name = typeof stored.name === 'string' && stored.name !== '' ? stored.name : ref.name;
            files.push(new File(
              [Uint8Array.from(result.value.data)],
              typeof name === 'string' && name !== '' ? name : `attachment-${ref.attachmentId}`,
              { type: typeof mediaType === 'string' && mediaType !== '' ? mediaType : 'application/octet-stream' },
            ));
          } catch (error) {
            console.warn('conversation-tools: attachment could not be read', error);
          }
        }
        if (files.length === 0) return [];
        const drafts = conversation.createDrafts(sessionId, files);
        const ids = drafts.map((draft) => draft.id);
        actions.addAttachments(ids);
        return ids;
      };

      const contribute = (slot, options, component) => {
        slots.inject(slot, () => slots.register({
          name: slot,
          locale: NAMESPACE,
          ...options,
          inject: () => ({ translate, restoreAttachments }),
        }, component));
      };

      contribute('conversation.chat.assistant-actions', {
        id: 'regenerate',
        order: 20,
        label: () => translate('action.regenerate'),
      }, RegenerateAction);

      contribute('conversation.chat.assistant-actions', {
        id: 'continue',
        order: 21,
        label: () => translate('action.continue'),
      }, ContinueAction);

      contribute('conversation.input.left', {
        id: 'history-search',
        order: 6,
        label: () => translate('search.open'),
      }, SearchTrigger);

      contribute('conversation.input.dock', {
        id: 'history-search-panel',
        order: 30,
        label: () => translate('search.title'),
      }, SearchPanel);

      contribute('conversation.input.dock', {
        id: 'prompt-history',
        order: 40,
        label: () => translate('history.hint'),
      }, HistoryRecall);
    }

    return { inject: ['slots', 'locale'], apply };
  },
});
