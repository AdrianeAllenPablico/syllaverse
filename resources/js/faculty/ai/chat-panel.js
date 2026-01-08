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

	function showInsertToast(message){
		try {
			const msg = message || 'Inserted.';
			let toast = document.querySelector('.sv-ai-insert-toast');
			if (!toast){
				toast = document.createElement('div');
				toast.className = 'sv-ai-insert-toast';
				toast.style.position = 'fixed';
				toast.style.left = '50%';
				toast.style.bottom = '24px';
				toast.style.transform = 'translateX(-50%)';
				toast.style.zIndex = '9999';
				toast.style.padding = '0.6rem 1.1rem';
				toast.style.borderRadius = '999px';
				toast.style.background = 'rgba(0,0,0,0.78)';
				toast.style.color = '#fff';
				toast.style.fontSize = '0.875rem';
				toast.style.boxShadow = '0 6px 18px rgba(0,0,0,0.25)';
				toast.style.pointerEvents = 'none';
				toast.style.maxWidth = '80%';
				toast.style.textAlign = 'center';
				toast.style.opacity = '0';
				toast.style.transition = 'opacity 0.18s ease-out, transform 0.18s ease-out';
				document.body.appendChild(toast);
			}
			toast.textContent = msg;
			// Restart animation
			toast.style.opacity = '0';
			toast.style.transform = 'translateX(-50%) translateY(6px)';
			requestAnimationFrame(function(){
				toast.style.opacity = '1';
				toast.style.transform = 'translateX(-50%) translateY(0)';
			});
			clearTimeout(toast._svHideTimer);
			toast._svHideTimer = setTimeout(function(){
				toast.style.opacity = '0';
				toast.style.transform = 'translateX(-50%) translateY(6px)';
			}, 2200);
		} catch(e) { /* noop */ }
	}

	function splitBlocks(text){
		return (text || '').split(/\n{2,}/).map(function(b){ return b.trim(); }).filter(Boolean);
	}

	function isTableBlock(block){
		const lines = block.split(/\n/).map(function(l){ return l.trim(); }).filter(Boolean);
		if (lines.length < 2) return false;
		const first = lines[0];
		if (first.indexOf('|') === -1) return false;
		const divider = lines[1];
		if (/^\|?\s*:?-{3,}/.test(divider)) return true;
		// Fallback: treat as a table if there is at least one
		// additional line that also contains pipes.
		const hasBodyRow = lines.slice(1).some(function(line){ return line.indexOf('|') !== -1; });
		return hasBodyRow;
	}

	function renderTableBlock(parent, block){
		const lines = block.split(/\n/).map(function(l){ return l.trim(); }).filter(Boolean);
		if (lines.length < 2) return;
		const headerLine = lines[0];
		let bodyStartIndex = 2;
		if (lines.length > 1){
			const dividerCandidate = lines[1];
			const hasDivider = /^\|?\s*:?-{3,}/.test(dividerCandidate);
			if (!hasDivider) {
				bodyStartIndex = 1;
			}
		}
		const bodyLines = lines.slice(bodyStartIndex);
		function splitRow(line){
			let s = line.trim();
			if (s.startsWith('|')) s = s.slice(1);
			if (s.endsWith('|')) s = s.slice(0, -1);
			return s.split('|').map(function(c){ return c.trim(); });
		}
		function renderCellText(el, text){
			let v = String(text || '');
			// Normalize HTML <br> tags from AI output into real line breaks
			v = v.replace(/<br\s*\/?>(?!\n)/gi, '\n');
			const parts = v.split(/\n/);
			parts.forEach(function(part, idx){
				if (idx > 0) el.appendChild(document.createElement('br'));
				if (part) el.appendChild(document.createTextNode(part));
			});
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
			renderCellText(th, h);
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
					renderCellText(td, c);
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

	function renderMarkdownBlocks(parent, content){
		const blocks = splitBlocks(content || '');
		blocks.forEach(function(block){
			if (!block) return;

			// Handle composite blocks where a heading is immediately followed by a
			// markdown table without a blank line (common in AI replies).
			if (!isTableBlock(block) && block.indexOf('\n|') !== -1){
				const lines = block.split(/\n/);
				let tableStart = -1;
				for (let i = 0; i < lines.length; i++){
					const ln = lines[i].trim();
					if (ln.indexOf('|') === -1) continue;
					const next = (i + 1 < lines.length) ? lines[i+1].trim() : '';
					// Either a proper divider row or another pipe row right after
					if (/^\|?\s*:?-{3,}/.test(next) || (next && next.indexOf('|') !== -1)){
						tableStart = i;
						break;
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
						return; // Done handling this composite block
					}
				}
			}

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

	function insertCourseRationale(text){
		const target = document.querySelector('[name="course_description"]');
		if (!target) {
			console.warn('[AI] course_description field not found for insert');
			return;
		}
		target.value = text || '';
		try {
			const evtInput = new Event('input', { bubbles: true });
			target.dispatchEvent(evtInput);
			const evtChange = new Event('change', { bubbles: true });
			target.dispatchEvent(evtChange);
		} catch (e) {
			// Best-effort; swallowing to avoid breaking UI
		}
		showInsertToast('Inserted into Course Rationale and Description.');
	}

	function renderCourseRationaleCard(parent, text){
		const container = document.createElement('div');
		container.className = 'ai-course-rationale-container';
		const card = document.createElement('div');
		card.className = 'ai-course-rationale-card';
		const header = document.createElement('div');
		header.className = 'ai-card-header';
		const title = document.createElement('div');
		title.className = 'ai-card-title';
		title.textContent = 'Course Rationale and Description';
		header.appendChild(title);
		card.appendChild(header);
		const body = document.createElement('div');
		body.className = 'ai-card-body';
		// Render the generated text as simple paragraphs; allow basic markdown inline
		const p = document.createElement('p');
		renderInlineMarkdown(p, text || '');
		body.appendChild(p);
		const btnWrap = document.createElement('div');
		btnWrap.className = 'ai-card-button-wrapper';
		const btn = document.createElement('button');
		btn.type = 'button';
		btn.className = 'ai-card-insert-btn';
		btn.textContent = 'Insert';
		btn.addEventListener('click', function(){
			insertCourseRationale(text || '');
		});
		btnWrap.appendChild(btn);
		body.appendChild(btnWrap);
		card.appendChild(body);
		container.appendChild(card);
		parent.appendChild(container);
	}

	function renderIloCard(parent, markdown){
		const container = document.createElement('div');
		container.className = 'ai-ilo-container';
		const card = document.createElement('div');
		card.className = 'ai-ilo-card';
		const header = document.createElement('div');
		header.className = 'ai-card-header';
		const title = document.createElement('div');
		title.className = 'ai-card-title';
		title.textContent = 'Proposed Intended Learning Outcomes (ILO)';
		header.appendChild(title);
		card.appendChild(header);
		const body = document.createElement('div');
		body.className = 'ai-card-body';
		// Render the markdown table preview
		renderMarkdownBlocks(body, markdown || '');
		const btnWrap = document.createElement('div');
		btnWrap.className = 'ai-card-button-wrapper';
		const btn = document.createElement('button');
		btn.type = 'button';
		btn.className = 'ai-card-insert-btn';
		btn.textContent = 'Insert';
		btn.addEventListener('click', function(){
			if (window.applyIloFromAi && typeof window.applyIloFromAi === 'function') {
				const ok = window.applyIloFromAi(markdown || '');
				if (ok) {
					showInsertToast('Inserted AI-generated Intended Learning Outcomes.');
				} else {
					showInsertToast('Could not insert ILOs from this AI output.');
				}
			} else {
				console.warn('[AI] applyIloFromAi helper not available');
			}
		});
		btnWrap.appendChild(btn);
		body.appendChild(btnWrap);
		card.appendChild(body);
		container.appendChild(card);
		parent.appendChild(container);
	}

	function insertTlaStrategies(text){
		const target = document.querySelector('[name="tla_strategies"]');
		if (!target) {
			console.warn('[AI] tla_strategies field not found for insert');
			return;
		}
		target.value = text || '';
		try {
			const evtInput = new Event('input', { bubbles: true });
			target.dispatchEvent(evtInput);
			const evtChange = new Event('change', { bubbles: true });
			target.dispatchEvent(evtChange);
		} catch (e) {
			// Best-effort; swallowing to avoid breaking UI
		}
		showInsertToast('Inserted into Teaching, Learning, and Assessment Strategies.');
	}

	function renderTlasCard(parent, text){
		const container = document.createElement('div');
		container.className = 'ai-tlas-container';
		const card = document.createElement('div');
		card.className = 'ai-tlas-card';
		const header = document.createElement('div');
		header.className = 'ai-card-header';
		const title = document.createElement('div');
		title.className = 'ai-card-title';
		title.textContent = 'Teaching, Learning, and Assessment Strategies';
		header.appendChild(title);
		card.appendChild(header);
		const body = document.createElement('div');
		body.className = 'ai-card-body';
		const p = document.createElement('p');
		renderInlineMarkdown(p, text || '');
		body.appendChild(p);
		const btnWrap = document.createElement('div');
		btnWrap.className = 'ai-card-button-wrapper';
		const btn = document.createElement('button');
		btn.type = 'button';
		btn.className = 'ai-card-insert-btn';
		btn.textContent = 'Insert';
		btn.addEventListener('click', function(){
			insertTlaStrategies(text || '');
		});
		btnWrap.appendChild(btn);
		body.appendChild(btnWrap);
		card.appendChild(body);
		container.appendChild(card);
		parent.appendChild(container);
	}

	function renderTlaActivitiesCard(parent, markdown){
		const container = document.createElement('div');
		container.className = 'ai-tla-activities-container';
		const card = document.createElement('div');
		card.className = 'ai-tla-activities-card';
		const header = document.createElement('div');
		header.className = 'ai-card-header';
		const title = document.createElement('div');
		title.className = 'ai-card-title';
		title.textContent = 'Teaching, Learning, and Assessment (TLA) Activities';
		header.appendChild(title);
		card.appendChild(header);
		const body = document.createElement('div');
		body.className = 'ai-card-body';
		// Render the markdown table preview
		renderMarkdownBlocks(body, markdown || '');
		const btnWrap = document.createElement('div');
		btnWrap.className = 'ai-card-button-wrapper';
		const btn = document.createElement('button');
		btn.type = 'button';
		btn.className = 'ai-card-insert-btn';
		btn.textContent = 'Insert';
		btn.addEventListener('click', function(){
			if (window.applyTlaFromAi && typeof window.applyTlaFromAi === 'function') {
				const ok = window.applyTlaFromAi(markdown || '');
				if (ok) {
					showInsertToast('Inserted AI-generated TLA Activities.');
				} else {
					showInsertToast('Could not insert TLA Activities from this AI output.');
				}
			} else {
				console.warn('[AI] applyTlaFromAi helper not available');
			}
		});
		btnWrap.appendChild(btn);
		body.appendChild(btnWrap);
		card.appendChild(body);
		container.appendChild(card);
		parent.appendChild(container);
	}

	function renderAssessmentScheduleCard(parent, markdown){
		const container = document.createElement('div');
		container.className = 'ai-assessment-schedule-container';
		const card = document.createElement('div');
		card.className = 'ai-assessment-schedule-card';
		const header = document.createElement('div');
		header.className = 'ai-card-header';
		const title = document.createElement('div');
		title.className = 'ai-card-title';
		title.textContent = 'Assessment Schedule Mapping';
		header.appendChild(title);
		card.appendChild(header);
		const body = document.createElement('div');
		body.className = 'ai-card-body';
		// Render the markdown table preview
		renderMarkdownBlocks(body, markdown || '');
		card.appendChild(body);
		container.appendChild(card);
		parent.appendChild(container);
	}

	function renderAiMessage(bubble, text){
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

		// Look for specially tagged generated blocks (course rationale, TLAS, ILO table, TLA Activities, mappings)
		let rationaleText = '';
		let tlasText = '';
		let iloTableText = '';
		let tlaActivitiesTableText = '';
		let assessmentScheduleTableText = '';
		let iloSoCpaJsonText = '';
		let iloIgaJsonText = '';
		let iloCdioSdgJsonText = '';
		const tagDefs = [
			{ start: '[GENERATED_COURSE_RATIONALE]', end: '[/GENERATED_COURSE_RATIONALE]', assign: function(inner){ rationaleText = inner; } },
			{ start: '[GENERATED_TLAS]', end: '[/GENERATED_TLAS]', assign: function(inner){ tlasText = inner; } },
			{ start: '[GENERATED_ILO_TABLE]', end: '[/GENERATED_ILO_TABLE]', assign: function(inner){ iloTableText = inner; } },
			{ start: '[GENERATED_TLA_TABLE]', end: '[/GENERATED_TLA_TABLE]', assign: function(inner){ tlaActivitiesTableText = inner; } },
			{ start: '[GENERATED_ASSESSMENT_SCHEDULE]', end: '[/GENERATED_ASSESSMENT_SCHEDULE]', assign: function(inner){ assessmentScheduleTableText = inner; } },
			{ start: '[GENERATED_ILO_SO_CPA_MAPPING]', end: '[/GENERATED_ILO_SO_CPA_MAPPING]', assign: function(inner){ iloSoCpaJsonText = inner; } },
			{ start: '[GENERATED_ILO_IGA_MAPPING]', end: '[/GENERATED_ILO_IGA_MAPPING]', assign: function(inner){ iloIgaJsonText = inner; } },
			{ start: '[GENERATED_ILO_CDIO_SDG_MAPPING]', end: '[/GENERATED_ILO_CDIO_SDG_MAPPING]', assign: function(inner){ iloCdioSdgJsonText = inner; } },
		];
		let remaining = content;
		tagDefs.forEach(function(def){
			const sIdx = remaining.indexOf(def.start);
			const eIdx = remaining.indexOf(def.end);
			if (sIdx !== -1 && eIdx !== -1 && eIdx > sIdx){
				const inner = remaining.slice(sIdx + def.start.length, eIdx).trim();
				def.assign(inner);
				remaining = (remaining.slice(0, sIdx) + remaining.slice(eIdx + def.end.length)).trim();
			}
		});

		if (remaining){
			renderMarkdownBlocks(body, remaining);
		}

		if (rationaleText){
			renderCourseRationaleCard(body, rationaleText);
		}
		if (tlasText){
			renderTlasCard(body, tlasText);
		}
		if (iloTableText){
			renderIloCard(body, iloTableText);
		}
		if (tlaActivitiesTableText){
			renderTlaActivitiesCard(body, tlaActivitiesTableText);
		}
		if (assessmentScheduleTableText){
			// Show a preview of the generated Assessment Schedule mapping
			// and also auto-apply it to the Assessment Schedule Mapping UI.
			renderAssessmentScheduleCard(body, assessmentScheduleTableText);
			if (window.applyAssessmentScheduleFromAi && typeof window.applyAssessmentScheduleFromAi === 'function') {
				const ok = window.applyAssessmentScheduleFromAi(assessmentScheduleTableText);
				if (ok) {
					showInsertToast('Assessment Schedule mapping updated from AI.');
				} else {
					showInsertToast('Could not apply AI Assessment Schedule mapping.');
				}
			} else {
				console.warn('[AI] applyAssessmentScheduleFromAi helper not available');
			}
		}
		if (iloSoCpaJsonText){
			try {
				const parsed = JSON.parse(iloSoCpaJsonText.trim());
				if (parsed && Array.isArray(parsed.so_columns) && Array.isArray(parsed.mappings)) {
					if (window.refreshIloSoCpaPartial && typeof window.refreshIloSoCpaPartial === 'function') {
						const ok = window.refreshIloSoCpaPartial(parsed.so_columns, parsed.mappings);
						if (ok) {
							showInsertToast('ILO-SO-CPA mapping updated from AI.');
						} else {
							showInsertToast('Could not apply AI ILO-SO-CPA mapping.');
						}
					} else {
						console.warn('[AI] refreshIloSoCpaPartial helper not available');
					}
				} else {
					console.warn('[AI] GENERATED_ILO_SO_CPA_MAPPING payload missing so_columns or mappings array');
				}
			} catch (e) {
				console.error('[AI] Failed to parse GENERATED_ILO_SO_CPA_MAPPING JSON from AI:', e);
				showInsertToast('AI ILO-SO-CPA mapping was not valid JSON.');
			}
		}
		if (iloIgaJsonText){
			try {
				const parsed = JSON.parse(iloIgaJsonText.trim());
				if (parsed && Array.isArray(parsed.iga_labels) && Array.isArray(parsed.mappings)) {
					if (window.refreshIloIgaPartial && typeof window.refreshIloIgaPartial === 'function') {
						const ok = window.refreshIloIgaPartial(parsed.iga_labels, parsed.mappings);
						if (ok) {
							showInsertToast('ILO-IGA mapping updated from AI.');
						} else {
							showInsertToast('Could not apply AI ILO-IGA mapping.');
						}
					} else {
						console.warn('[AI] refreshIloIgaPartial helper not available');
					}
				} else {
					console.warn('[AI] GENERATED_ILO_IGA_MAPPING payload missing iga_labels or mappings array');
				}
			} catch (e) {
				console.error('[AI] Failed to parse GENERATED_ILO_IGA_MAPPING JSON from AI:', e);
				showInsertToast('AI ILO-IGA mapping was not valid JSON.');
			}
		}
		if (iloCdioSdgJsonText){
			try {
				const parsed = JSON.parse(iloCdioSdgJsonText.trim());
				if (parsed && Array.isArray(parsed.mappings)) {
					const mappingEl = document.querySelector('.ilo-cdio-sdg-mapping');
					if (mappingEl && typeof window.refreshIloCdioSdgPartial === 'function') {
						// Persist column label arrays on the root element if provided
						if (Array.isArray(parsed.cdio_columns)) {
							try { mappingEl.setAttribute('data-cdio-columns', JSON.stringify(parsed.cdio_columns)); } catch(_) {}
						}
						if (Array.isArray(parsed.sdg_columns)) {
							try { mappingEl.setAttribute('data-sdg-columns', JSON.stringify(parsed.sdg_columns)); } catch(_) {}
						}
						const ok = window.refreshIloCdioSdgPartial(parsed.mappings);
						if (ok) {
							showInsertToast('ILO-CDIO-SDG mapping updated from AI.');
						} else {
							showInsertToast('Could not apply AI ILO-CDIO-SDG mapping.');
						}
					} else {
						console.warn('[AI] refreshIloCdioSdgPartial helper or mapping container not available');
					}
				} else {
					console.warn('[AI] GENERATED_ILO_CDIO_SDG_MAPPING payload missing mappings array');
				}
			} catch (e) {
				console.error('[AI] Failed to parse GENERATED_ILO_CDIO_SDG_MAPPING JSON from AI:', e);
				showInsertToast('AI ILO-CDIO-SDG mapping was not valid JSON.');
			}
		}
		bubble.appendChild(title);
		bubble.appendChild(body);
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
			const message = (overrideMessage != null)
				? String(overrideMessage || '').trim()
				: (input && input.value || '').trim();
			if (!message) return;

			// For some structured actions (like Assessment Schedule mapping), we want
			// a fresh, stateless call that relies ONLY on the current snapshots and
			// prompt, not on prior chat turns. For those, skip history entirely.
			// For regular chat, keep the rolling history.
			let history = [];
			if (partialKey !== 'assessment_schedule' && partialKey !== 'ilo_so_cpa_mapping') {
				history = getHistory();
			}
			appendMessage('user', message);
			if (input) input.value = '';
			const loadingMsg = appendMessage('ai', 'Thinking…', { loading:true });
			setSendingState(true);

			try {
				const reply = await window.SVAI.send(message, history, partialKey || '');
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

		// Generate / Map chips
		const chipContainers = panel.querySelectorAll('.ai-chat-section-body');
		chipContainers.forEach(function(container){
			container.addEventListener('click', function(e){
				const chip = e.target.closest('.ai-chip');
				if (!chip) return;
				const action = chip.getAttribute('data-ai-action') || '';
				if (!action) return;
				openPanel();
				if (action === 'generate-course-rationale') {
					const msg = 'Generate a concise Course Rationale and Description for this course based on the current syllabus context.';
					handleSend('course-rationale', msg);
				} else if (action === 'generate-tlas') {
					const msg = 'Generate a concise Teaching, Learning, and Assessment Strategies narrative for this course based on the current syllabus context.';
					handleSend('tlas', msg);
				} else if (action === 'generate-ilo') {
					const msg = 'Propose a small, coherent set of Intended Learning Outcomes (ILO) for this course based on the current syllabus context.';
					handleSend('ilo-generate', msg);
				} else if (action === 'generate-tla-activities') {
					const msg = 'Propose a structured week-by-week Teaching, Learning, and Assessment (TLA) Activities plan for this course based on the current syllabus context.';
					handleSend('tla-activities-generate', msg);
				} else if (action === 'map-assessment-schedule') {
					const msg = 'Map Assessment Schedule';
					handleSend('assessment_schedule', msg);
				} else if (action === 'map-ilo-so-cpa') {
					const msg = 'Map ILO-SO and ILO-CPA';
					handleSend('ilo_so_cpa_mapping', msg);
				} else if (action === 'map-ilo-iga') {
					const msg = 'Map ILO-IGA';
					handleSend('ilo_iga_mapping', msg);
				} else if (action === 'map-ilo-cdio-sdg') {
					const msg = 'Map ILO-CDIO and ILO-SDG linkages for this course based on the current syllabus context.';
					handleSend('ilo_cdio_sdg_mapping', msg);
				} else {
					// Other actions can be wired later; for now do nothing
				}
			});
		});

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

