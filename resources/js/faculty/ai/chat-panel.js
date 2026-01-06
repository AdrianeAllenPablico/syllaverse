/*
 * File: resources/js/faculty/ai/chat-panel.js
 * Description: UI logic for the AI chat FAB + slide-in panel on the syllabus page.
 * Depends on:
 *   - window.SVAI (from ai.js)
 *   - window.SVPrompts (from prompts.js)
 */
(function(){
	'use strict';

	function $(id){ return document.getElementById(id); }

	function splitBlocks(text){
		return (text || '').split(/\n{2,}/).map(function(b){ return b.trim(); }).filter(Boolean);
	}

	function isTableBlock(block){
		const lines = block.split(/\n/).map(function(l){ return l.trim(); }).filter(Boolean);
		if (lines.length < 2) return false;
		if (lines[0].indexOf('|') === -1) return false;
		// Treat as a table if there is at least one more line that also
		// looks like a row (contains "|") or if there is a markdown
		// divider/alignment row. This is more lenient so AI outputs
		// without explicit "---" divider still render as tables.
		for (let i = 1; i < lines.length; i++){
			const ln = lines[i];
			if (ln.indexOf('|') !== -1) return true;
			if (/^\|?\s*:?-{3,}/.test(ln)) return true;
		}
		return false;
	}

	function renderTableBlock(parent, block){
		const lines = block.split(/\n/).map(function(l){ return l.trim(); }).filter(Boolean);
		if (lines.length < 2) return;
		const headerLine = lines[0];
		// Skip markdown divider row if present, otherwise treat all
		// remaining lines as body rows.
		let bodyStart = 1;
		if (lines[1] && /^\|?\s*:?-{3,}/.test(lines[1])){
			bodyStart = 2;
		}
		const bodyLines = lines.slice(bodyStart);
		function splitRow(line){
			let s = line.trim();
			if (s.startsWith('|')) s = s.slice(1);
			if (s.endsWith('|')) s = s.slice(0, -1);
			return s.split('|').map(function(c){ return c.trim(); });
		}
		const headers = splitRow(headerLine);
		if (!headers.length) return;
		const wrap = document.createElement('div');
		wrap.className = 'ai-chat-table-wrap';
		const table = document.createElement('table');
		table.className = 'ai-chat-table';
		const thead = document.createElement('thead');
		const htr = document.createElement('tr');
		headers.forEach(function(h){
			const th = document.createElement('th');
			th.textContent = h;
			htr.appendChild(th);
		});
		thead.appendChild(htr);
		table.appendChild(thead);
		if (bodyLines.length){
			const tbody = document.createElement('tbody');
			bodyLines.forEach(function(line){
				if (line.indexOf('|') === -1) return;
				const cells = splitRow(line);
				if (!cells.length) return;
				const tr = document.createElement('tr');
				cells.forEach(function(c){
					const td = document.createElement('td');
					td.textContent = c;
					tr.appendChild(td);
				});
				tbody.appendChild(tr);
			});
			table.appendChild(tbody);
		}
		wrap.appendChild(table);
		parent.appendChild(wrap);
	}

	function isListBlock(block){
		const lines = block.split(/\n/).map(function(l){ return l.trim(); }).filter(Boolean);
		if (!lines.length) return false;
		return lines.every(function(line){
			return /^[-*\u2022]\s+/.test(line) || /^\d+\.\s+/.test(line);
		});
	}

	function renderListBlock(parent, block){
		const lines = block.split(/\n/).map(function(l){ return l.trim(); }).filter(Boolean);
		if (!lines.length) return;
		const isOrdered = lines.every(function(line){ return /^\d+\.\s+/.test(line); });
		const list = document.createElement(isOrdered ? 'ol' : 'ul');
		lines.forEach(function(line){
			let text = line.replace(/^[-*\u2022]\s+/, '').replace(/^\d+\.\s+/, '').trim();
			if (!text) return;
			const li = document.createElement('li');
			renderInlineMarkdown(li, text);
			list.appendChild(li);
		});
		parent.appendChild(list);
	}

	function isHeadingBlock(block){
		return /^#{1,3}\s+/.test(block.trim());
	}

	function renderInlineMarkdown(parent, text){
		const src = String(text || '');
		if (!src){
			return;
		}
		const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
		let lastIndex = 0;
		let match;
		while ((match = re.exec(src))){
			if (match.index > lastIndex){
				parent.appendChild(document.createTextNode(src.slice(lastIndex, match.index)));
			}
			const token = match[0];
			if (token.startsWith('**')){
				const strong = document.createElement('strong');
				strong.textContent = token.slice(2, -2);
				parent.appendChild(strong);
			} else if (token.startsWith('`')){
				const code = document.createElement('code');
				code.textContent = token.slice(1, -1);
				parent.appendChild(code);
			} else if (token.startsWith('*')){
				const em = document.createElement('em');
				em.textContent = token.slice(1, -1);
				parent.appendChild(em);
			}
			lastIndex = re.lastIndex;
		}
		if (lastIndex < src.length){
			parent.appendChild(document.createTextNode(src.slice(lastIndex)));
		}
	}

	function renderMarkdownBody(parent, content){
		const text = (content || '').trim();
		if (!text) return;
		const blocks = splitBlocks(text);
		blocks.forEach(function(block){
			let handledComposite = false;
			// Handle cases where a plain heading or paragraph is followed by a markdown table
			// without a blank line between them (common in AI replies).
			if (!isTableBlock(block) && block.indexOf('\n|') !== -1){
				const lines = block.split(/\n/);
				let tableStart = -1;
				for (let i = 0; i < lines.length - 1; i++){
					const ln = lines[i].trim();
					if (ln.indexOf('|') !== -1){
						const next = lines[i+1].trim();
						// Start a table where a row with '|' is followed by
						// another row that also looks like a table row or
						// an alignment/divider row.
						if (next.indexOf('|') !== -1 || /^\|?\s*:?-{3,}/.test(next)){
							tableStart = i;
							break;
						}
					}
				}
				if (tableStart > -1){
					const before = lines.slice(0, tableStart).join('\n').trim();
					const tablePart = lines.slice(tableStart).join('\n');
					if (before){
						if (isHeadingBlock(before)) {
							renderHeadingBlock(parent, before);
						} else {
							const p = document.createElement('p');
							renderInlineMarkdown(p, before);
							parent.appendChild(p);
						}
					}
					if (isTableBlock(tablePart)){
						renderTableBlock(parent, tablePart);
						handledComposite = true;
					}
				}
			}

			if (handledComposite) return;

			if (isTableBlock(block)) {
				renderTableBlock(parent, block);
			} else if (isListBlock(block)) {
				renderListBlock(parent, block);
			} else if (isHeadingBlock(block)) {
				renderHeadingBlock(parent, block);
			} else {
				const p = document.createElement('p');
				renderInlineMarkdown(p, block);
				parent.appendChild(p);
			}
		});
	}

	function renderHeadingBlock(parent, block){
		const match = block.trim().match(/^(#{1,3})\s+(.+)$/);
		if (!match) return;
		const level = match[1].length;
		const text = match[2].trim();
		const h = document.createElement('div');
		h.className = 'ai-chat-heading ai-chat-heading-' + level;
		renderInlineMarkdown(h, text);
		parent.appendChild(h);
	}

	function renderAiMessage(bubble, text){
		if (!bubble) return;
		bubble.innerHTML = '';
		const title = document.createElement('div');
		title.className = 'ai-chat-bubble-title';
		title.textContent = 'AI Assistant';
		const body = document.createElement('div');
		body.className = 'ai-chat-bubble-body';
		const content = (text || '').trim();
		if (!content){
			bubble.appendChild(title);
			return;
		}
		renderMarkdownBody(body, content);
		bubble.appendChild(title);
		bubble.appendChild(body);
	}

	function getOrCreateCourseRationaleContainer(){
		const messages = $('aiChatMessages');
		if (!messages) return null;
		let container = messages.querySelector('.ai-course-rationale-container');
		if (!container){
			container = document.createElement('div');
			container.className = 'ai-course-rationale-container';
			messages.appendChild(container);
		}
		return container;
	}

	function extractCourseDescriptionFromMarkdown(markdown){
		// For course rationale we now expect a plain-text narrative,
		// so just return the trimmed string.
		return String(markdown || '').trim();
	}

	function renderCourseRationaleCard(markdown){
		const container = getOrCreateCourseRationaleContainer();
		if (!container) return;
		container.innerHTML = '';

		const card = document.createElement('div');
		card.className = 'ai-course-rationale-card';
		card.dataset.markdown = markdown || '';

		const header = document.createElement('div');
		header.className = 'ai-card-header';
		const title = document.createElement('div');
		title.className = 'ai-card-title';
		title.textContent = 'Course Rationale and Description (AI Draft)';
		header.appendChild(title);
		const btnWrap = document.createElement('div');
		btnWrap.className = 'ai-card-button-wrapper';
		const insertBtn = document.createElement('button');
		insertBtn.type = 'button';
		insertBtn.className = 'ai-card-insert-btn';
		insertBtn.textContent = 'Insert into syllabus';
		btnWrap.appendChild(insertBtn);
		header.appendChild(btnWrap);
		card.appendChild(header);

		const body = document.createElement('div');
		body.className = 'ai-card-body';
		// Show the draft as simple text (no special table rendering)
		const p = document.createElement('p');
		p.className = 'ai-card-text';
		renderInlineMarkdown(p, markdown || '');
		body.appendChild(p);
		card.appendChild(body);

		insertBtn.addEventListener('click', function(){
			const raw = card.dataset.markdown || '';
			const text = extractCourseDescriptionFromMarkdown(raw).trim();
			if (!text) return;
			const field = document.querySelector('[name="course_description"]');
			if (!field) return;
			if (typeof field.value !== 'undefined') {
				field.value = text;
			} else {
				field.textContent = text;
			}
			try {
				field.dispatchEvent(new Event('input', { bubbles:true }));
			} catch(e){}
		});

		container.appendChild(card);
	}

	function appendMessage(role, text, opts){
		const container = $('aiChatMessages');
		if (!container) return;
		const msg = document.createElement('div');
		msg.className = 'ai-chat-msg ' + (role === 'user' ? 'user' : role === 'ai' ? 'ai' : role);

		const bubble = document.createElement('div');
		bubble.className = 'ai-chat-bubble';
		if (opts && opts.loading) {
			msg.classList.add('loading');
		} else {
			if (role === 'ai') renderAiMessage(bubble, text); else bubble.innerText = text;
		}

		msg.appendChild(bubble);
		container.appendChild(msg);
		container.scrollTop = container.scrollHeight + 100;
		return msg;
	}

	function updateLoadingMessage(msgEl, text){
		if (!msgEl) return;
		msgEl.classList.remove('loading');
		const bubble = msgEl.querySelector('.ai-chat-bubble');
		if (!bubble) return;
		if (msgEl.classList.contains('ai')) renderAiMessage(bubble, text); else bubble.innerText = text;
	}

	function getHistory(){
		const container = $('aiChatMessages');
		if (!container) return [];
		const history = [];
		container.querySelectorAll('.ai-chat-msg').forEach(el => {
			const bubble = el.querySelector('.ai-chat-bubble');
			if (!bubble) return;
			const text = bubble.innerText || '';
			if (!text.trim()) return;
			if (el.classList.contains('user')) history.push({ role: 'user', content: text });
			else if (el.classList.contains('ai')) history.push({ role: 'assistant', content: text });
		});
		return history;
	}

	function getPartialKeyFromChip(chip){
		if (!chip) return '';
		return chip.getAttribute('data-partial-key') || '';
	}

	function setSendingState(isSending){
		const input = $('aiChatInput');
		const sendBtn = $('aiChatSend');
		if (input) input.disabled = isSending;
		if (sendBtn) {
			sendBtn.disabled = isSending;
			sendBtn.classList.toggle('disabled', !!isSending);
		}
	}

	function openPanel(){
		const panel = $('aiChatPanel');
		const backdrop = $('aiChatBackdrop');
		if (!panel || !backdrop) return;
		panel.classList.add('open');
		backdrop.classList.add('show');
		panel.setAttribute('aria-hidden','false');
		const input = $('aiChatInput');
		if (input) {
			setTimeout(() => { try { input.focus(); } catch(e){} }, 50);
		}
	}

	function closePanel(){
		const panel = $('aiChatPanel');
		const backdrop = $('aiChatBackdrop');
		if (!panel || !backdrop) return;
		panel.classList.remove('open');
		backdrop.classList.remove('show');
		panel.setAttribute('aria-hidden','true');
	}

	function wireDragAndResize(){
		const panel = $('aiChatPanel');
		if (!panel) return;

		// Drag (header)
		const header = panel.querySelector('.ai-chat-header');
		if (header) {
			let dragging = false;
			let startX = 0;
			let startRight = 0;
			const onMove = (e) => {
				if (!dragging) return;
				const clientX = e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX;
				const dx = startX - clientX;
				panel.style.right = Math.max(0, startRight + dx) + 'px';
			};
			const onUp = () => {
				dragging = false;
				panel.classList.remove('dragging');
				document.removeEventListener('mousemove', onMove);
				document.removeEventListener('mouseup', onUp);
				document.removeEventListener('touchmove', onMove);
				document.removeEventListener('touchend', onUp);
			};
			const onDown = (e) => {
				if (e.target.closest('.ai-chat-close-btn') || e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea')) return;
				dragging = true;
				panel.classList.add('dragging');
				startX = e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX;
				const rect = panel.getBoundingClientRect();
				startRight = window.innerWidth - rect.right;
				document.addEventListener('mousemove', onMove);
				document.addEventListener('mouseup', onUp);
				document.addEventListener('touchmove', onMove, { passive:false });
				document.addEventListener('touchend', onUp);
			};
			header.addEventListener('mousedown', onDown);
			header.addEventListener('touchstart', onDown, { passive:true });
		}

		// Resize (handle)
		const handle = panel.querySelector('.ai-chat-resize-handle');
		if (handle) {
			let resizing = false;
			let startX = 0;
			let startWidth = 0;
			const MIN_W = 260;
			// Allow the panel to grow up to the CSS max-width (90vw)
			const MAX_W = Math.floor(window.innerWidth * 0.9);
			const onMove = (e) => {
				if (!resizing) return;
				const clientX = e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX;
				const dx = startX - clientX;
				let w = startWidth + dx;
				w = Math.max(MIN_W, Math.min(MAX_W, w));
				panel.style.width = w + 'px';
			};
			const onUp = () => {
				resizing = false;
				handle.classList.remove('resizing');
				document.removeEventListener('mousemove', onMove);
				document.removeEventListener('mouseup', onUp);
				document.removeEventListener('touchmove', onMove);
				document.removeEventListener('touchend', onUp);
			};
			const onDown = (e) => {
				resizing = true;
				handle.classList.add('resizing');
				startX = e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX;
				startWidth = panel.getBoundingClientRect().width;
				document.addEventListener('mousemove', onMove);
				document.addEventListener('mouseup', onUp);
				document.addEventListener('touchmove', onMove, { passive:false });
				document.addEventListener('touchend', onUp);
			};
			handle.addEventListener('mousedown', onDown);
			handle.addEventListener('touchstart', onDown, { passive:true });
		}
	}

	function initAiChatPanel(){
		const fab = $('aiChatFab');
		const panel = $('aiChatPanel');
		const backdrop = $('aiChatBackdrop');
		const closeBtn = $('aiChatClose');
		const form = $('aiChatForm');
		const input = $('aiChatInput');
		const sendBtn = $('aiChatSend');

		if (!panel || !fab) return;

		fab.addEventListener('click', function(){ openPanel(); });
		if (backdrop) backdrop.addEventListener('click', function(){ closePanel(); });
		if (closeBtn) closeBtn.addEventListener('click', function(){ closePanel(); });

		// Basic send handler
		async function handleSend(partialKey, overrideMessage){
			if (!window.SVAI || typeof window.SVAI.send !== 'function') {
				console.warn('[AI] SVAI.send not available');
				return;
			}
			const baseText = (input && input.value || '').trim();
			const message = (overrideMessage || baseText).trim();
			if (!message) return;

			const history = getHistory();
			appendMessage('user', message);
			if (input) input.value = '';
			const loadingMsg = appendMessage('ai', 'Thinking…', { loading:true });
			setSendingState(true);

			try {
				const reply = await window.SVAI.send(message, history, partialKey || '');
				if (partialKey === 'course-rationale') {
					// For generate: do not show the full reply in the
					// normal AI bubble, only in the unique card.
					updateLoadingMessage(loadingMsg, 'Draft generated below.');
					renderCourseRationaleCard(reply);
				} else {
					updateLoadingMessage(loadingMsg, reply);
				}
			} catch (err) {
				console.error('[AI] Error', err);
				updateLoadingMessage(loadingMsg, 'I had trouble answering this right now. Please check your internet connection and try again in a moment.');
			} finally {
				setSendingState(false);
			}
		}

		if (form) {
			form.addEventListener('submit', function(e){
				e.preventDefault();
				handleSend('', '');
			});
		} else if (input) {
			input.addEventListener('keydown', function(e){
				if (e.key === 'Enter' && !e.shiftKey) {
					e.preventDefault();
					handleSend('', '');
				}
			});
		}
		if (sendBtn) {
			sendBtn.addEventListener('click', function(){ handleSend('', ''); });
		}

		// Course Rationale and Description generate chip
		const courseRationaleChip = document.getElementById('aiChipCourseRationale');
		if (courseRationaleChip) {
			courseRationaleChip.addEventListener('click', function(){
				openPanel();
				const partialKey = this.getAttribute('data-partial-key') || 'course-rationale';
				const basePrompt = 'Generate a high-quality Course Rationale and Description for this syllabus, as a single narrative suitable for the Course Rationale and Description field.';
				const input = $('aiChatInput');
				const userHint = input && input.value ? input.value.trim() : '';
				const msg = userHint ? (basePrompt + ' ' + userHint) : basePrompt;
				handleSend(partialKey, msg);
			});
		}

		// Keyboard shortcut: Alt+Shift+A to toggle panel
		document.addEventListener('keydown', function(e){
			if (e.altKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
				e.preventDefault();
				const isOpen = panel.classList.contains('open');
				if (isOpen) closePanel(); else openPanel();
			}
		});

		wireDragAndResize();
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initAiChatPanel);
	} else {
		initAiChatPanel();
	}
})();

