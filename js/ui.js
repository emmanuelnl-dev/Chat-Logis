import { init, dispatch, clearSession } from './chatbot.js'

const chat        = document.getElementById('chat-messages')
const chatWindow  = document.getElementById('chat-window')
const fab         = document.getElementById('chat-fab')
const closeBtn    = document.getElementById('chat-close')
const resetBtn    = document.getElementById('chat-reset')
const badge       = document.getElementById('fab-badge')

const NUANCIER_PREVIEW_COUNT = 5
const HISTORY_KEY = 'logis_chat_history'

// ── Historique (sessionStorage) ───────────────────────────────────────────

function saveHistory(data) {
  try { sessionStorage.setItem(HISTORY_KEY, JSON.stringify(data)) } catch (_) {}
}

function loadHistory() {
  try {
    const s = sessionStorage.getItem(HISTORY_KEY)
    return s ? JSON.parse(s) : null
  } catch (_) { return null }
}

function clearHistory() {
  try { sessionStorage.removeItem(HISTORY_KEY) } catch (_) {}
}

function commitChoice(label) {
  const h = loadHistory()
  if (h && h.current) {
    h.turns.push({ ...h.current, userLabel: label })
    h.current = null
    saveHistory(h)
  }
}

// ── Ouverture / fermeture ─────────────────────────────────────────────────

let started = false

function openChat() {
  chatWindow.classList.add('is-open')
  fab.classList.add('is-open')
  fab.setAttribute('aria-label', 'Fermer le chat')
  badge.classList.add('is-hidden')
  if (!started) { started = true; start() }
}

function closeChat() {
  chatWindow.classList.remove('is-open')
  fab.classList.remove('is-open')
  fab.setAttribute('aria-label', 'Ouvrir le chat')
}

fab.addEventListener('click', () => {
  chatWindow.classList.contains('is-open') ? closeChat() : openChat()
})

closeBtn.addEventListener('click', closeChat)

resetBtn.addEventListener('click', async () => {
  clearSession()
  clearHistory()
  chat.innerHTML = ''
  const response = await init()
  withTyping(() => handle(response))
})

// ── Rendu des bulles ──────────────────────────────────────────────────────

function botBubble(text) {
  const el = document.createElement('div')
  el.className = 'bubble bubble--bot'
  el.textContent = text
  chat.appendChild(el)
}

function userBubble(text) {
  const el = document.createElement('div')
  el.className = 'bubble bubble--user'
  el.textContent = text
  chat.appendChild(el)
}

function clearOptions() {
  document.querySelectorAll('.options-row').forEach(el => {
    el.querySelectorAll('.option-btn').forEach(btn => (btn.disabled = true))
  })
}

function renderOptions(options, onSelect) {
  const row = document.createElement('div')
  row.className = 'options-row'
  options.forEach(opt => {
    const btn = document.createElement('button')
    btn.className = 'option-btn'
    btn.textContent = opt.label
    btn.addEventListener('click', () => {
      clearOptions()
      userBubble(opt.label)
      scrollBottom()
      onSelect(opt.value, opt.label)
    })
    row.appendChild(btn)
  })
  chat.appendChild(row)
}

function renderOptionsDisabled(options, selectedLabel) {
  const row = document.createElement('div')
  row.className = 'options-row'
  options.forEach(opt => {
    const btn = document.createElement('button')
    btn.className = 'option-btn'
    if (opt.label === selectedLabel) btn.classList.add('option-btn--selected')
    btn.textContent = opt.label
    btn.disabled = true
    row.appendChild(btn)
  })
  chat.appendChild(row)
}

// ── Carte produit ─────────────────────────────────────────────────────────

function renderFiche(produit, historical = false) {
  const card = document.createElement('div')
  card.className = 'card-produit'

  const nuancierPreview = produit.nuancier.slice(0, NUANCIER_PREVIEW_COUNT)
  const hasMore = produit.nuancier.length > NUANCIER_PREVIEW_COUNT
  const restant = produit.nuancier.length - NUANCIER_PREVIEW_COUNT

  card.innerHTML = `
    <div class="card-produit__header">
      <span class="card-produit__famille">${produit.famille}</span>
      <h3 class="card-produit__name">${produit.name}</h3>
    </div>
    <div class="card-produit__meta">
      <span class="meta-item">
        <span class="meta-label">Rendement</span>
        <span class="meta-value">${produit.rendement}</span>
      </span>
      <span class="meta-item">
        <span class="meta-label">Séchage</span>
        <span class="meta-value">${produit.sechage}</span>
      </span>
      <span class="meta-item">
        <span class="meta-label">Nettoyage</span>
        <span class="meta-value">${produit.nettoyage}</span>
      </span>
    </div>
    <div class="card-produit__section">
      <span class="section-label">Contenances</span>
      <div class="contenances">
        ${produit.contenances.map(c => `<span class="contenance-tag">${c}</span>`).join('')}
      </div>
    </div>
    <div class="card-produit__section">
      <span class="section-label">Nuancier</span>
      <div class="nuancier-preview">
        ${nuancierPreview.map(t => `
          <span class="pastille" style="background:${t.hex}" title="${t.nom}">
            <span class="pastille__tooltip">${t.nom}</span>
          </span>
        `).join('')}
        ${hasMore ? `<button class="nuancier-more" data-action="nuancier:complet">+${restant} teintes</button>` : ''}
      </div>
    </div>
  `

  const moreBtn = card.querySelector('.nuancier-more')
  if (moreBtn && !historical) {
    moreBtn.addEventListener('click', () => {
      clearOptions()
      userBubble('Voir toutes les teintes')
      scrollBottom()
      commitChoice('Voir toutes les teintes')
      const response = dispatch('nuancier:complet')
      withTyping(() => handle(response))
    })
  } else if (moreBtn) {
    moreBtn.disabled = true
  }

  chat.appendChild(card)
}

// ── Carte nuancier complet ────────────────────────────────────────────────

function renderNuancier(produit) {
  const card = document.createElement('div')
  card.className = 'card-nuancier'
  card.innerHTML = `
    <div class="card-nuancier__header">
      Nuancier complet — ${produit.name}
    </div>
    <div class="nuancier-grid">
      ${produit.nuancier.map(t => `
        <div class="nuancier-item">
          <span class="pastille pastille--lg" style="background:${t.hex}"></span>
          <span class="pastille__nom">${t.nom}</span>
        </div>
      `).join('')}
    </div>
  `
  chat.appendChild(card)
}

// ── Carte téléphone ───────────────────────────────────────────────────────

function renderTel({ numero, href, horaires }) {
  const card = document.createElement('div')
  card.className = 'card-tel'
  card.innerHTML = `
    <div class="card-tel__label">Appelez-nous</div>
    <a class="card-tel__number" href="${href}">${numero}</a>
    <div class="card-tel__horaires">${horaires}</div>
  `
  chat.appendChild(card)
}

// ── Scroll ─────────────────────────────────────────────────────────────────

function scrollBottom() {
  requestAnimationFrame(() => {
    chat.scrollTop = chat.scrollHeight
  })
}

// ── Indicateur de frappe ──────────────────────────────────────────────────

function showTyping() {
  const el = document.createElement('div')
  el.className = 'bubble bubble--bot typing-indicator'
  el.id = 'typing-indicator'
  el.innerHTML = '<span></span><span></span><span></span>'
  chat.appendChild(el)
  scrollBottom()
}

function hideTyping() {
  const el = document.getElementById('typing-indicator')
  if (el) el.remove()
}

function withTyping(fn) {
  showTyping()
  return new Promise(resolve => {
    setTimeout(() => {
      hideTyping()
      fn()
      resolve()
    }, 1800 + Math.random() * 400)
  })
}

// ── Restauration depuis l'historique ─────────────────────────────────────

function restoreTurn(turn) {
  turn.botMessages.forEach(m => botBubble(m))
  if (turn.type === 'fiche')    renderFiche(turn.data, true)
  if (turn.type === 'nuancier') renderNuancier(turn.data)
  if (turn.type === 'tel')      renderTel(turn.data)
  if (turn.options.length > 0)  renderOptionsDisabled(turn.options, turn.userLabel)
  if (turn.userLabel)           userBubble(turn.userLabel)
}

function restoreCurrent(current) {
  current.botMessages.forEach(m => botBubble(m))
  if (current.type === 'fiche')    renderFiche(current.data, false)
  if (current.type === 'nuancier') renderNuancier(current.data)
  if (current.type === 'tel')      renderTel(current.data)
  if (current.options.length > 0)  renderOptions(current.options, onUserChoice)
}

// ── Orchestration ─────────────────────────────────────────────────────────

function handle(response) {
  if (response.type === 'redirect') {
    if (response.messages) {
      response.messages.forEach(m => m && botBubble(m))
    } else {
      botBubble('Redirection en cours…')
    }
    if (response.options) renderOptions(response.options, onUserChoice)
    scrollBottom()
  } else if (response.type === 'fiche') {
    renderFiche(response.data)
    if (response.options) renderOptions(response.options, onUserChoice)
    scrollBottom()
  } else if (response.type === 'nuancier') {
    renderNuancier(response.data)
    if (response.options) renderOptions(response.options, onUserChoice)
    scrollBottom()
  } else if (response.type === 'tel') {
    renderTel(response.data)
    if (response.options) renderOptions(response.options, onUserChoice)
    scrollBottom()
  } else {
    if (response.messages) response.messages.forEach(m => m && botBubble(m))
    if (response.options)  renderOptions(response.options, onUserChoice)
    scrollBottom()
  }

  const h = loadHistory() || { turns: [] }
  h.current = {
    botMessages: response.messages ? response.messages.filter(Boolean) : [],
    type: response.type || null,
    data: response.data || null,
    options: response.options || [],
  }
  saveHistory(h)
}

function onUserChoice(value, label) {
  commitChoice(label)
  const response = dispatch(value)
  withTyping(() => handle(response))
}

// ── Init ──────────────────────────────────────────────────────────────────

async function start() {
  const initResponse = await init()

  if (initResponse === null) {
    const h = loadHistory()
    if (h && (h.turns.length > 0 || h.current)) {
      h.turns.forEach(turn => restoreTurn(turn))
      if (h.current) restoreCurrent(h.current)
      scrollBottom()
      return
    }
    // Session orpheline (état sans historique) — repart à zéro
    clearSession()
    clearHistory()
    const freshResponse = await init()
    withTyping(() => handle(freshResponse))
    return
  }

  withTyping(() => handle(initResponse))
}
