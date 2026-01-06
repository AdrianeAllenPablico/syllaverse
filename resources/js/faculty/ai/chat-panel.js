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
		const divider = lines[1];
		return /^\|?\s*:?-{3,}/.test(divider);
	}

	function renderTableBlock(parent, block){
		const lines = block.split(/\n/).map(function(l){ return l.trim(); }).filter(Boolean);
		if (lines.length < 2) return;
		const headerLine = lines[0];
		const bodyLines = lines.slice(2);
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

	function renderAiMessage(bubble, text, metadata){
		if (!bubble) return;
		bubble.innerHTML = '';
		const title = document.createElement('div');
		title.className = 'ai-chat-bubble-title';
		title.textContent = 'AI Assistant';
		const body = document.createElement('div');
		body.className = 'ai-chat-bubble-body';
		let content = (text || '').trim();
		if (!content){
			bubble.appendChild(title);
			return;
		}

		// Detect explicit SV-INSERT markers (takes precedence over metadata)
		let insertKey = null;
		const lines = content.split(/\n+/);
		if (lines.length){
			const first = lines[0].trim();
			// Normal chat reply marker – strip and treat as plain chat
			if (/^\[SV-REPLY\]$/.test(first)){
				content = lines.slice(1).join('\n').trim();
			} else if (/^\[SV-INSERT:/.test(first)){
				const m = first.match(/^\[SV-INSERT:([^\]]+)\]$/);
				if (m && m[1]){
					insertKey = m[1];
					content = lines.slice(1).join('\n').trim();
				}
			}
		}

		// Course Rationale and Description special card (requires explicit insert key)
		if (insertKey === 'course-rationale'){
			renderCourseRationaleCard(body, content);
			bubble.appendChild(title);
			bubble.appendChild(body);
			return;
		}

		const blocks = splitBlocks(content);
		blocks.forEach(function(block){
			if (isTableBlock(block)) {
				renderTableBlock(body, block);
			} else if (isListBlock(block)) {
				renderListBlock(body, block);
			} else if (isHeadingBlock(block)) {
				renderHeadingBlock(body, block);
			} else {
				const p = document.createElement('p');
				renderInlineMarkdown(p, block);
				body.appendChild(p);
			}
		});
		bubble.appendChild(title);
		bubble.appendChild(body);
	}

	function renderCourseRationaleCard(parent, content){
		// Keep only the main paragraph (strip any AI preamble like "Certainly..." that may precede the paragraph)
		const blocks = splitBlocks(content);
		const mainText = blocks.length ? blocks[blocks.length - 1] : content;

		const container = document.createElement('div');
		container.className = 'ai-course-rationale-container';

		const card = document.createElement('div');
		card.className = 'ai-course-rationale-card';

		const header = document.createElement('div');
		header.className = 'ai-card-header';
		const headerTitle = document.createElement('div');
		headerTitle.className = 'ai-card-title';
		headerTitle.textContent = 'Course Rationale and Description';
		header.appendChild(headerTitle);

		const body = document.createElement('div');
		body.className = 'ai-card-body';
		const p = document.createElement('p');
		p.textContent = mainText;
		body.appendChild(p);

		const buttonWrapper = document.createElement('div');
		buttonWrapper.className = 'ai-card-button-wrapper';
		const insertBtn = document.createElement('button');
		insertBtn.className = 'ai-card-insert-btn';
		insertBtn.innerHTML = '<i class="bi bi-plus-circle me-2"></i>Insert into Course Info';
		insertBtn.addEventListener('click', function(){
			insertCourseRationale(mainText);
		});
		buttonWrapper.appendChild(insertBtn);
		body.appendChild(buttonWrapper);

		card.appendChild(header);
		card.appendChild(body);
		container.appendChild(card);
		parent.appendChild(container);
	}

	function insertCourseRationale(content){
		const field = document.querySelector('textarea[name="course_description"]');
		if (!field) {
			console.warn('[AI] Course description field not found');
			return;
		}
		field.value = content;
		field.dispatchEvent(new Event('input', { bubbles: true }));
		field.dispatchEvent(new Event('change', { bubbles: true }));

		const feedback = document.createElement('div');
		feedback.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#10b981;color:#fff;padding:0.75rem 1.5rem;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:9999;font-weight:500;animation:slideUp 0.3s ease;';
		feedback.textContent = 'Course Rationale inserted successfully!';
		document.body.appendChild(feedback);
		setTimeout(() => {
			feedback.style.animation = 'slideDown 0.3s ease';
			setTimeout(() => feedback.remove(), 300);
		}, 2000);

		field.scrollIntoView({ behavior: 'smooth', block: 'center' });
		field.focus();
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
			if (role === 'ai') renderAiMessage(bubble, text, opts && opts.metadata); else bubble.innerText = text;
		}

		// Store metadata for later use
		if (opts && opts.metadata) {
			msg.setAttribute('data-partial-key', opts.metadata.partialKey || '');
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
		const metadata = msgEl.getAttribute('data-partial-key') ? { partialKey: msgEl.getAttribute('data-partial-key') } : null;
		if (msgEl.classList.contains('ai')) renderAiMessage(bubble, text, metadata); else bubble.innerText = text;
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
			// Use `text` key so it matches what the backend AIController expects
			if (el.classList.contains('user')) history.push({ role: 'user', text: text });
			else if (el.classList.contains('ai')) history.push({ role: 'assistant', text: text });
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
		let currentPartialKey = '';

		if (!panel || !fab) return;

		fab.addEventListener('click', function(){ openPanel(); });
		if (backdrop) backdrop.addEventListener('click', function(){ closePanel(); });
		if (closeBtn) closeBtn.addEventListener('click', function(){ closePanel(); });

		// Basic send handler
		async function handleSend(partialKey, userMessage){
			if (!window.SVAI || typeof window.SVAI.send !== 'function') {
				console.warn('[AI] SVAI.send not available');
				return;
			}
			const message = userMessage || (input && input.value || '').trim();
			if (!message) return;

			const effectivePartial = partialKey || currentPartialKey || '';
			if (partialKey) currentPartialKey = partialKey;

			const history = getHistory();
			appendMessage('user', message);
			if (input && !userMessage) input.value = '';
			const loadingMsg = appendMessage('ai', 'Thinking…', { loading:true, metadata: { partialKey: effectivePartial } });
			setSendingState(true);

			try {
				const reply = await window.SVAI.send(message, history, effectivePartial);
				updateLoadingMessage(loadingMsg, reply);
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
				handleSend('');
			});
		} else if (input) {
			input.addEventListener('keydown', function(e){
				if (e.key === 'Enter' && !e.shiftKey) {
					e.preventDefault();
					handleSend('');
				}
			});
		}
		if (sendBtn) {
			sendBtn.addEventListener('click', function(){ handleSend(''); });
		}

		// Quick action chips (section-specific prompts)
		const chipsContainer = $('aiSectionChips');
		if (chipsContainer) {
			chipsContainer.addEventListener('click', function(e){
				const chip = e.target.closest('.ai-chip');
				if (!chip) return;
				const key = getPartialKeyFromChip(chip);
				openPanel();
				handleSend(key);
			});
		}

		// Generate section chips
		const generateChips = $('aiGenerateChips');
		if (generateChips) {
			generateChips.addEventListener('click', function(e){
				const chip = e.target.closest('.ai-chip');
				if (!chip) return;
				const key = getPartialKeyFromChip(chip);
				if (!key) return;
				
				openPanel();
				
				// Generate appropriate message based on partial key
				let message = '';
				if (key === 'course-rationale') {
					message = 'Generate a course rationale and description for this course.';
				}
				
				if (message) {
					handleSend(key, message);
				}
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

