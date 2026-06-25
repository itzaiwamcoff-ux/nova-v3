/* ════════════════════════════════════════════════════════════════════
   NOVA — Main Application
   ════════════════════════════════════════════════════════════════════ */

const NovaApp = (() => {

  /* ─── DOM REFS ─── */
  let els = {};
  let currentTab = 'home';
  let currentArticleId = null;
  let currentCategory = 'all';

  /* ─── INIT ─── */
  function init() {
    /* Init data layer */
    NovaData.init();

    els = {
      mainContent: document.getElementById('mainContent'),
      header: document.getElementById('header'),
      navContainer: document.getElementById('navContainer'),
      tubelightTabs: document.querySelectorAll('.tubelight-tab'),
      tubelightPill: document.getElementById('tubelightPill'),
      tubelightLamp: document.getElementById('tubelightLamp'),
      tabContents: document.querySelectorAll('.tab-content'),
      sidebar: document.getElementById('sidebar'),
      sidebarOverlay: document.getElementById('sidebarOverlay'),
      sidebarPanel: document.getElementById('sidebarPanel'),
      sidebarClose: document.getElementById('sidebarClose'),
      menuBtn: document.getElementById('menuBtn'),
      sidebarItems: document.querySelectorAll('[data-sidebar-close]'),
      themeSwitch: document.getElementById('themeSwitch'),
      featuredArticles: document.getElementById('featuredArticles'),
      topicArticles: document.getElementById('topicArticles'),
      topicChips: document.querySelectorAll('.topic-chip'),
articleDetail: document.getElementById('articleDetail'),
      articleBack: document.getElementById('articleBack'),
      commentsSection: document.getElementById('commentsSection'),
      commentsList: document.getElementById('commentsList'),
      commentInput: document.getElementById('commentInput'),
      commentSubmitBtn: document.getElementById('commentSubmitBtn'),
      commentCount: document.getElementById('commentCount'),
      toastContainer: document.getElementById('toastContainer')
    };

    /* Add shake keyframes dynamically */
    addShakeKeyframes();

    bindEvents();
    initTheme();
    initAuth();
    renderHome();
    renderTopics();

    /* Position lamp on initial active tab */
    requestAnimationFrame(() => moveLamp('home'));
  }

  /* ─── SHAKE ANIMATION ─── */
  function addShakeKeyframes() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
        20%, 40%, 60%, 80% { transform: translateX(6px); }
      }
    `;
    document.head.appendChild(style);
  }

  /* ─── EVENTS ─── */
  function bindEvents() {
    /* Tubelight tab switching */
    els.tubelightTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        switchTab(target);
      });
    });

    /* Topic chips */
    els.topicChips.forEach(chip => {
      chip.addEventListener('click', () => {
        els.topicChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentCategory = chip.dataset.category;
        renderTopics();
      });
    });

    /* Article back */
    els.articleBack.addEventListener('click', () => {
      if (currentArticleId) {
        /* Go back to topics if that's where they came from */
        switchTab('topics');
      } else {
        switchTab('home');
      }
    });

    /* Comment submit */
    els.commentSubmitBtn.addEventListener('click', submitComment);
    els.commentInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submitComment();
      }
    });

    /* Theme switch */
    els.themeSwitch.addEventListener('click', toggleTheme);

    /* Sidebar */
    els.menuBtn.addEventListener('click', openSidebar);
    els.sidebarOverlay.addEventListener('click', closeSidebar);
    els.sidebarClose.addEventListener('click', closeSidebar);
    els.sidebarItems.forEach(item => {
      item.addEventListener('click', closeSidebar);
    });

    /* Sidebar tab navigation */
    document.querySelectorAll('.sidebar-item[data-tab]').forEach(item => {
      item.addEventListener('click', () => {
        switchTab(item.dataset.tab);
      });
    });
  }

  /* ─── AUTH INIT ─── */
  function initAuth() {
    NovaAuth.init();
  }

  /* ─── TAB SWITCHING ─── */
  function switchTab(tab) {
    if (tab === currentTab) return;

    const isTopicCategory = tab !== 'home' && tab !== 'article';
    currentTab = tab;

    /* Update tubelight tabs active state */
    els.tubelightTabs.forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tab);
    });

    /* Move lamp indicator to active tab */
    moveLamp(tab);

    /* Determine which tab-content section to show */
    let targetSection = 'home';
    if (tab === 'article') targetSection = 'article';
    else if (tab === 'home') targetSection = 'home';
    else targetSection = 'topics'; /* all + all topic categories → topics view */

    /* Switch content with animation */
    els.tabContents.forEach(tc => {
      if (tc.id === `tab-${targetSection}`) {
        tc.style.display = 'block';
        void tc.offsetWidth;
        tc.classList.add('active');
      } else {
        tc.classList.remove('active');
        setTimeout(() => {
          if (!tc.classList.contains('active')) {
            tc.style.display = 'none';
          }
        }, 300);
      }
    });

    /* Refresh content & apply filter */
    if (tab === 'home') {
      currentCategory = 'all';
      renderHome();
    } else if (tab === 'article') {
      /* Article already handled */
    } else {
      /* 'all' or a topic category */
      currentCategory = tab === 'all' ? 'all' : tab;
      /* Update topic chips to match */
      document.querySelectorAll('.topic-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.category === currentCategory);
      });
      renderTopics();
    }

    /* Close sidebar on mobile */
    closeSidebar();
  }

  /* ─── TUBELIGHT LAMP POSITIONING ─── */
  function moveLamp(tab) {
    if (!els.tubelightPill || !els.tubelightLamp) return;

    const activeTab = els.tubelightPill.querySelector(`.tubelight-tab[data-tab="${tab}"]`);
    if (!activeTab) return;

    const pillRect = els.tubelightPill.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();

    const left = tabRect.left - pillRect.left;
    const width = tabRect.width;

    els.tubelightLamp.style.left = `${left}px`;
    els.tubelightLamp.style.width = `${width}px`;
    els.tubelightPill.classList.add('has-active');
  }

  /* Expose for other modules */
  window.switchTab = switchTab;

  /* ─── RENDER HOME ─── */
  function renderHome() {
    const articles = NovaData.getArticles();


/* Featured = first 4 */
    const featured = articles.slice(0, 4);
    els.featuredArticles.innerHTML = featured.map((a, i) => createArticleCard(a, i)).join('');

    /* Attach click events */
    els.featuredArticles.querySelectorAll('.article-card').forEach((card, i) => {
      card.addEventListener('click', () => showArticle(featured[i].id));
    });
  }

  /* ─── RENDER TOPICS ─── */
  function renderTopics() {
    let articles = NovaData.getArticles();
    if (currentCategory !== 'all') {
      articles = articles.filter(a => a.category === currentCategory);
    }
    els.topicArticles.innerHTML = articles.length
      ? articles.map((a, i) => createArticleCard(a, i)).join('')
      : '<div class="glass" style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-muted);font-size:0.9375rem;">No articles found in this category.</div>';

    els.topicArticles.querySelectorAll('.article-card').forEach((card, i) => {
      card.addEventListener('click', () => showArticle(articles[i].id));
    });
  }


/* ─── ARTICLE CARD HTML ─── */
  function createArticleCard(a, index = 0) {
    const img = a.image || 'https://images.unsplash.com/photo-1504711434969-e33886168d6c?w=800&h=400&fit=crop';
    const slideClass = index % 2 === 0 ? 'slide-in-left' : 'slide-in-right';
    return `
      <div class="article-card ${slideClass}" data-id="${a.id}" style="animation-delay:${index * 0.08}s">
        <img class="article-card-image" src="${img}" alt="${a.title}" loading="lazy"
             onerror="this.src='https://images.unsplash.com/photo-1504711434969-e33886168d6c?w=800&h=400&fit=crop'" />
        <div class="article-card-body">
          <span class="article-card-category">${capitalize(a.category)}</span>
          <h3 class="article-card-title">${a.title}</h3>
          <p class="article-card-excerpt">${a.excerpt}</p>
          <div class="article-card-meta">
            <span class="article-card-author">${a.author}</span>
            <span>${NovaData.formatDate(a.date)}</span>
          </div>
        </div>
      </div>
    `;
  }

  /* ─── SHOW ARTICLE ─── */
  function showArticle(id) {
    const article = NovaData.getArticleById(id);
    if (!article) {
      showToast('Article not found', 'error');
      return;
    }

    currentArticleId = id;

    /* Show article tab */
    currentTab = 'article';
    els.tabContents.forEach(tc => tc.classList.remove('active'));
    const articleTab = document.getElementById('tab-article');
    articleTab.style.display = 'block';
    void articleTab.offsetWidth;
    articleTab.classList.add('active');

    /* Update nav tabs */
    els.tubelightTabs.forEach(t => t.classList.remove('active'));

    const img = article.image || 'https://images.unsplash.com/photo-1504711434969-e33886168d6c?w=800&h=400&fit=crop';

    els.articleDetail.innerHTML = `
      ${article.image ? `<img class="article-detail-image" src="${img}" alt="${article.title}" onerror="this.style.display='none'" />` : ''}
      <span class="article-detail-category">${capitalize(article.category)}</span>
      <h1 class="article-detail-title">${article.title}</h1>
      <div class="article-detail-meta">
        <span>By ${article.author}</span>
        <span>${NovaData.formatDate(article.date)}</span>
      </div>
      <div class="article-detail-content">
        ${article.content.split('\n\n').map(p => `<p>${p}</p>`).join('')}
      </div>
    `;

    renderComments(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ─── COMMENTS ─── */
  function renderComments(articleId) {
    const comments = NovaData.getComments(articleId);
    els.commentCount.textContent = comments.length;

    if (comments.length === 0) {
      els.commentsList.innerHTML = '<div class="comment-empty">No comments yet. Be the first to share your thoughts!</div>';
      return;
    }

    els.commentsList.innerHTML = comments.map((c, i) => `
      <div class="comment-item slide-in-right" style="animation-delay:${i * 0.06}s">
        <div class="comment-header">
          <div class="comment-author">
            <span class="comment-avatar">${c.author.charAt(0).toUpperCase()}</span>
            ${escHtml(c.author)}
          </div>
          <span class="comment-date">${c.date} ${c.time || ''}</span>
        </div>
        <div class="comment-text">${escHtml(c.text)}</div>
      </div>
    `).join('');
  }

  function submitComment() {
    if (!currentArticleId) return;

    const user = NovaAuth.getUser();
    if (!user) {
      showToast('Please sign in to leave a comment', 'error');
      NovaAuth.openModal('signIn');
      return;
    }

    const text = els.commentInput.value.trim();
    if (!text) {
      showToast('Please write a comment', 'error');
      return;
    }

    const comment = NovaData.addComment(currentArticleId, text, user.name);
    if (comment) {
      els.commentInput.value = '';
      renderComments(currentArticleId);
      showToast('Comment posted!', 'success');

      /* Animate scroll to new comment */
      els.commentsList.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /* ─── THEME ─── */
  function initTheme() {
    const saved = localStorage.getItem('nova_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    let theme;
    if (saved) {
      theme = saved;
    } else {
      theme = prefersDark ? 'dark' : 'light';
    }

    applyTheme(theme);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nova_theme', theme);

    /* Toggle icons */
    const sun = els.themeSwitch.querySelector('.sun-icon');
    const moon = els.themeSwitch.querySelector('.moon-icon');
    if (theme === 'dark') {
      sun.style.display = 'none';
      moon.style.display = 'block';
    } else {
      sun.style.display = 'block';
      moon.style.display = 'none';
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    showToast(`Switched to ${next} mode`, 'info');
  }

  /* ─── SIDEBAR ─── */
  function openSidebar() {
    els.sidebar.classList.add('active');
    els.sidebarPanel.classList.remove('exit');
    document.body.classList.add('no-scroll');
  }

  function closeSidebar() {
    els.sidebarPanel.classList.add('exit');
    setTimeout(() => {
      els.sidebar.classList.remove('active');
      els.sidebarPanel.classList.remove('exit');
      document.body.classList.remove('no-scroll');
    }, 300);
  }

  /* ─── TOAST ─── */
  function showToast(message, type = 'info') {
    const icons = {
      success: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      error: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
      info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = icons[type] || icons.info;
    toast.insertAdjacentHTML('beforeend', message);
    els.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('exit');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  /* ─── UTILITIES ─── */
  function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  }

  function escHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* ─── PUBLIC API ─── */
  return {
    init,
    switchTab,
    showToast,
    capitalize,
    escHtml
  };
})();

/* ─── BOOT ─── */
document.addEventListener('DOMContentLoaded', () => {
  NovaApp.init();
});
