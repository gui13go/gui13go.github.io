/**
 * Unified Agent Roleplay Chat Runtime
 * Reusable across any agent persona (Coach Frank, Clara, Socrates, etc.)
 */
(function (global) {
  'use strict';

  const DEFAULT_CONFIG = {
    agentId: 'coach-frank',
    agentName: 'Coach Frank',
    avatar: '/images/agents/ag_frank_coach_1767695407437.png',
    role: 'Productivity & Life Coach',
    model: 'gemma4:latest',
    apiBaseUrl: (function () {
      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
          // Attempt local backend gateway first if available, otherwise seamlessly use remote cluster
          return 'https://ollama.guilhermeviegas.dev';
        }
      }
      return 'https://ollama.guilhermeviegas.dev';
    })(),
    systemPrompt: '',
    greetingMessage: 'Lace \'em up! Coach Frank is here. What are your training or productivity goals today? No excuses, let\'s get to work!',
    quickPrompts: [
      'Give me a 20-min HIIT workout with no equipment',
      'Critique my morning routine for peak focus',
      'I feel exhausted and unmotivated today, Coach!',
      'Plan my nutrition and hydration for intense study/work'
    ]
  };

  class AgentChatSession {
    constructor(options = {}) {
      this.config = Object.assign({}, DEFAULT_CONFIG, options);
      this.messages = [];
      this.isStreaming = false;
      this.abortController = null;
      this.storageKey = `agent_chat_history_${this.config.agentId}`;

      // Initialize system prompt
      if (this.config.systemPrompt) {
        this.messages.push({
          role: 'system',
          content: this.config.systemPrompt
        });
      }

      this.initDOMElements();
      this.bindEvents();
      this.renderQuickPrompts();
      this.renderGreeting();
    }

    initDOMElements() {
      this.messagesContainer = document.getElementById('chatMessagesContainer');
      this.chatForm = document.getElementById('chatInputForm');
      this.userInput = document.getElementById('chatUserInput');
      this.sendBtn = document.getElementById('chatSendBtn');
      this.clearBtn = document.getElementById('chatClearBtn');
      this.quickPromptsContainer = document.getElementById('chatQuickPrompts');
      this.typingIndicator = document.getElementById('chatTypingIndicator');
      this.statusBadge = document.getElementById('agentConnectionStatus');
    }

    bindEvents() {
      if (this.chatForm) {
        this.chatForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleSendMessage();
        });
      }

      if (this.userInput) {
        this.userInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.handleSendMessage();
          }
        });

        this.userInput.addEventListener('input', () => {
          this.userInput.style.height = 'auto';
          this.userInput.style.height = Math.min(this.userInput.scrollHeight, 180) + 'px';
        });
      }

      if (this.clearBtn) {
        this.clearBtn.addEventListener('click', () => {
          this.resetChat();
        });
      }
    }

    renderQuickPrompts() {
      if (!this.quickPromptsContainer || !this.config.quickPrompts) return;
      this.quickPromptsContainer.innerHTML = '';
      this.config.quickPrompts.forEach((promptText) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'agent-quick-prompt-chip';
        chip.textContent = promptText;
        chip.addEventListener('click', () => {
          if (this.isStreaming) return;
          if (this.userInput) {
            this.userInput.value = promptText;
            this.handleSendMessage();
          }
        });
        this.quickPromptsContainer.appendChild(chip);
      });
    }

    renderGreeting() {
      if (!this.messagesContainer) return;
      this.messagesContainer.innerHTML = '';

      if (this.config.greetingMessage) {
        this.appendMessageElement({
          role: 'assistant',
          content: this.config.greetingMessage,
          isGreeting: true
        });
      }
    }

    resetChat() {
      if (this.isStreaming && this.abortController) {
        this.abortController.abort();
      }
      this.isStreaming = false;
      this.messages = [];
      if (this.config.systemPrompt) {
        this.messages.push({
          role: 'system',
          content: this.config.systemPrompt
        });
      }
      this.renderGreeting();
      if (this.userInput) {
        this.userInput.value = '';
        this.userInput.style.height = 'auto';
        this.userInput.focus();
      }
      if (this.statusBadge) {
        this.statusBadge.textContent = 'Operational';
        this.statusBadge.classList.remove('active');
      }
    }

    formatMarkdown(text) {
      if (!text) return '';
      // Strip any raw HTML tags the LLM tries to emit (e.g. <span ...>, <div ...>, <p>, etc.)
      let clean = text.replace(/<\/?[a-z][a-z0-9_-]*(?:\s+[^>]*)?>/gi, '');

      // Escape remaining sensitive HTML entities to prevent accidental markup injection
      let html = clean
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      // Code blocks ```lang\ncode```
      html = html.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/g, function (_, lang, code) {
        return `<pre class="agent-code-block"><code class="language-${lang}">${code}</code></pre>`;
      });

      // Inline code `code`
      html = html.replace(/`([^`]+)`/g, '<code class="agent-inline-code">$1</code>');

      // Bold **bold**
      html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

      // Italic *italic*
      html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

      // Blockquotes > text
      html = html.replace(/^>\s*(.*$)/gim, '<blockquote class="agent-quote">$1</blockquote>');

      // Numbered lists 1. Item
      html = html.replace(/^\s*(\d+)\.\s+(.*$)/gim, '<div class="agent-list-item"><span class="list-num">$1.</span> <span>$2</span></div>');

      // Unordered lists - Item or * Item
      html = html.replace(/^\s*[-*]\s+(.*$)/gim, '<div class="agent-list-item"><span class="list-bullet">•</span> <span>$1</span></div>');

      // Paragraph newlines
      html = html.replace(/\n\n+/g, '<br><br>');
      html = html.replace(/\n/g, '<br>');

      return html;
    }

    appendMessageElement({ role, content, isGreeting = false, isHtml = false }) {
      if (!this.messagesContainer) return null;

      const msgRow = document.createElement('div');
      msgRow.className = `agent-msg-row ${role === 'user' ? 'user-row' : 'agent-row'}`;

      const avatarCol = document.createElement('div');
      avatarCol.className = 'agent-msg-avatar';

      if (role === 'assistant') {
        const img = document.createElement('img');
        img.src = this.config.avatar;
        img.alt = this.config.agentName;
        img.className = 'agent-avatar-img';
        avatarCol.appendChild(img);
      } else {
        const userIcon = document.createElement('div');
        userIcon.className = 'user-avatar-circle';
        userIcon.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
        avatarCol.appendChild(userIcon);
      }

      const bodyCol = document.createElement('div');
      bodyCol.className = 'agent-msg-body';

      const headerDiv = document.createElement('div');
      headerDiv.className = 'agent-msg-header';

      const nameSpan = document.createElement('span');
      nameSpan.className = 'agent-msg-author';
      nameSpan.textContent = role === 'assistant' ? this.config.agentName : 'You';
      headerDiv.appendChild(nameSpan);

      const timeSpan = document.createElement('span');
      timeSpan.className = 'agent-msg-timestamp';
      const now = new Date();
      timeSpan.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      headerDiv.appendChild(timeSpan);

      const bubbleDiv = document.createElement('div');
      bubbleDiv.className = `agent-msg-bubble ${role === 'user' ? 'user-bubble' : 'agent-bubble'}`;
      if (isHtml) {
        bubbleDiv.innerHTML = content;
      } else {
        bubbleDiv.innerHTML = this.formatMarkdown(content);
      }

      bodyCol.appendChild(headerDiv);
      bodyCol.appendChild(bubbleDiv);

      msgRow.appendChild(avatarCol);
      msgRow.appendChild(bodyCol);

      this.messagesContainer.appendChild(msgRow);
      this.scrollToBottom();

      return bubbleDiv;
    }

    scrollToBottom() {
      if (this.messagesContainer) {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
      }
    }

    async handleSendMessage() {
      if (this.isStreaming || !this.userInput) return;
      const text = this.userInput.value.trim();
      if (!text) return;

      this.userInput.value = '';
      this.userInput.style.height = 'auto';

      // 1. Add user message to UI & history
      this.appendMessageElement({ role: 'user', content: text });
      this.messages.push({ role: 'user', content: text });

      // 2. Prepare placeholder for assistant
      const assistantBubble = this.appendMessageElement({
        role: 'assistant',
        content: '<span class="agent-thinking-dots"><span>.</span><span>.</span><span>.</span></span>',
        isHtml: true
      });
      assistantBubble.classList.add('streaming');

      this.isStreaming = true;
      if (this.sendBtn) this.sendBtn.disabled = true;
      if (this.statusBadge) {
        this.statusBadge.textContent = 'Formulating Game Plan...';
        this.statusBadge.classList.add('active');
      }

      this.abortController = new AbortController();
      let assistantReply = '';
      let hasReceivedFirstToken = false;

      // Candidate API endpoints: try primary first, then local if different
      const candidateEndpoints = [this.config.apiBaseUrl];
      if (this.config.apiBaseUrl !== 'http://localhost:8000') {
        candidateEndpoints.push('http://localhost:8000');
      }

      let succeeded = false;
      let lastError = null;

      // Allow agent customization to dynamically alter or enrich messages (e.g. dynamic flags with timestamps)
      let outgoingMessages = this.messages;
      if (typeof this.config.transformMessages === 'function') {
        try {
          outgoingMessages = await this.config.transformMessages(this.messages);
        } catch (e) {
          console.error('Error in transformMessages hook:', e);
        }
      }

      for (const endpoint of candidateEndpoints) {
        try {
          const response = await fetch(`${endpoint}/api/chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json, text/event-stream'
            },
            body: JSON.stringify({
              model: this.config.model,
              messages: outgoingMessages,
              options: {
                temperature: 0.75
              },
              stream: true
            }),
            signal: this.abortController.signal
          });

          if (!response.ok) {
            throw new Error(`Inference engine returned HTTP ${response.status}`);
          }

          if (!response.body) {
            throw new Error('Streaming not supported by browser response');
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder('utf-8');
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || trimmed.startsWith(':')) continue;

              const rawData = trimmed.startsWith('data:')
                ? trimmed.replace(/^data:\s*/, '')
                : trimmed;

              if (rawData === '[DONE]') break;

              try {
                const parsed = JSON.parse(rawData);
                if (parsed.error) {
                  throw new Error(typeof parsed.error === 'string' ? parsed.error : JSON.stringify(parsed.error));
                }

                // Handle both normal content tokens and thinking tokens
                const chunk =
                  parsed.message?.content ||
                  parsed.choices?.[0]?.delta?.content ||
                  parsed.response ||
                  '';

                // Notice thinking tokens from Gemma 4 / reasoning models
                const thinkingChunk = parsed.message?.thinking || parsed.thinking || '';

                if (chunk) {
                  if (!hasReceivedFirstToken) {
                    hasReceivedFirstToken = true;
                    if (this.statusBadge) this.statusBadge.textContent = 'Speaking...';
                  }
                  assistantReply += chunk;
                  assistantBubble.innerHTML = this.formatMarkdown(assistantReply);
                  this.scrollToBottom();
                } else if (thinkingChunk && !hasReceivedFirstToken) {
                  if (this.statusBadge) this.statusBadge.textContent = 'Analyzing Strategy...';
                }
              } catch (e) {
                if (rawData && rawData !== '[DONE]' && !rawData.startsWith('{')) {
                  assistantReply += rawData;
                  assistantBubble.innerHTML = this.formatMarkdown(assistantReply);
                  this.scrollToBottom();
                }
              }
            }
          }

          succeeded = true;
          break; // successfully streamed from this endpoint
        } catch (err) {
          if (err.name === 'AbortError') {
            succeeded = true;
            assistantBubble.innerHTML = this.formatMarkdown(assistantReply + '\n\n*(Message paused)*');
            break;
          }
          lastError = err;
          // try next candidate endpoint
        }
      }

      if (!succeeded) {
        console.warn('Agent inference network error:', lastError);
        assistantBubble.innerHTML = `
          <div class="agent-network-warning">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span><strong>Connection Note:</strong> ${lastError?.message || 'Gateway connection issue'}. Please ensure the neural gateway is reachable and try again!</span>
          </div>
        `;
      } else if (!assistantReply) {
        assistantBubble.innerHTML = '<em>*Blows whistle* All quiet on the court. Let\'s run that play again!</em>';
      }

      if (assistantReply) {
        this.messages.push({ role: 'assistant', content: assistantReply });
      }

      this.isStreaming = false;
      assistantBubble.classList.remove('streaming');
      if (this.sendBtn) this.sendBtn.disabled = false;
      if (this.statusBadge) {
        this.statusBadge.textContent = 'Operational';
        this.statusBadge.classList.remove('active');
      }
      if (this.userInput) this.userInput.focus();
    }
  }

  // Global factory with singleton/session management
  global.initAgentChat = function (options) {
    if (global._currentAgentChatSession && global._currentAgentChatSession.config.agentId === options.agentId) {
      const existing = global._currentAgentChatSession;
      // If the DOM elements were replaced (e.g. React re-render or SPA navigation), re-init elements and render
      if (!existing.messagesContainer || !document.body.contains(existing.messagesContainer)) {
        existing.initDOMElements();
        existing.bindEvents();
        existing.renderQuickPrompts();
        existing.renderGreeting();
      }
      return existing;
    }
    const session = new AgentChatSession(options);
    global._currentAgentChatSession = session;
    return session;
  };
})(typeof window !== 'undefined' ? window : this);
