/* ═══════════════════════════════════════════════
   DragonWing Docs — Shared Navigation
   ═══════════════════════════════════════════════ */

// ── Nav Tree ────────────────────────────────────
// DOCS_ROOT must be set on each page before this script loads.
// e.g. index.html: window.DOCS_ROOT = '.';
//      iq9/index.html: window.DOCS_ROOT = '..';
//      iq9/flashing/ubuntu.html: window.DOCS_ROOT = '../..';

const NAV_TREE = [
  {
    label: 'Docs Home',
    href: '',
    key: 'home',
  },
  {
    sectionLabel: 'IQ-7',
    items: [
      { label: 'Overview', href: '#', key: 'iq7-overview', badge: 'coming' },
    ],
  },
  {
    sectionLabel: 'IQ-8',
    items: [
      { label: 'Overview', href: '#', key: 'iq8-overview', badge: 'coming' },
    ],
  },
  {
    sectionLabel: 'IQ-9075',
    items: [
      { label: 'Overview',   href: 'iq9/index.html',            key: 'iq9-overview' },
      { label: 'Hardware',   href: 'iq9/hardware.html',          key: 'iq9-hardware' },
      {
        label: 'Flashing',
        href: 'iq9/flashing/index.html',
        key: 'iq9-flashing',
        children: [
          { label: 'Ubuntu 24.04', href: 'iq9/flashing/ubuntu.html', key: 'iq9-flash-ubuntu' },
          { label: 'QLI 1.x',      href: '#',                         key: 'iq9-flash-qli1',   badge: 'coming' },
          { label: 'QLI 2.x',      href: '#',                         key: 'iq9-flash-qli2',   badge: 'coming' },
        ],
      },
      { label: 'SDK & Resources', href: '#', key: 'iq9-sdk', badge: 'coming' },
    ],
  },
  {
    sectionLabel: 'IQ-10',
    items: [
      { label: 'Overview', href: 'iq10/index.html', key: 'iq10-overview', badge: 'coming' },
    ],
  },
  {
    sectionLabel: 'Arduino Ventuno Q',
    items: [
      { label: 'Overview', href: '#', key: 'ventuno-overview', badge: 'coming' },
    ],
  },
];

// ── Determine if a section or item contains the active key ──
function sectionContainsKey(node, key) {
  if (!node.items) return false;
  for (const item of node.items) {
    if (item.key === key) return true;
    if (item.children) {
      for (const child of item.children) {
        if (child.key === key) return true;
      }
    }
  }
  return false;
}

function itemContainsKey(item, key) {
  if (item.key === key) return true;
  if (item.children) {
    for (const child of item.children) {
      if (child.key === key) return true;
    }
  }
  return false;
}

// ── Build sidebar HTML ───────────────────────────
function buildSidebar(root, currentKey) {
  const lines = [];

  for (const node of NAV_TREE) {
    if (node.sectionLabel === undefined) {
      // Top-level link (Docs Home)
      const active = node.key === currentKey ? ' active' : '';
      lines.push(`<a class="sidebar-item${active}" href="${root}/index.html">${node.label}</a>`);
    } else {
      const isActive = sectionContainsKey(node, currentKey);
      const expanded = isActive ? ' expanded' : '';
      lines.push(`<div class="sidebar-section${expanded}">`);
      lines.push(`  <div class="sidebar-section-label">${node.sectionLabel}<span class="sidebar-chevron">&#9654;</span></div>`);
      lines.push(`  <div class="sidebar-section-items">`);
      for (const item of node.items) {
        const href = item.href === '#' ? '#' : `${root}/${item.href}`;
        const active = item.key === currentKey ? ' active' : '';
        const badge = item.badge ? `<span class="sidebar-badge ${item.badge}">${item.badge}</span>` : '';
        lines.push(`    <a class="sidebar-item sub${active}" href="${href}">${item.label}${badge}</a>`);
        if (item.children) {
          const childrenActive = itemContainsKey(item, currentKey);
          const childExpanded = childrenActive ? ' expanded' : '';
          lines.push(`    <div class="sidebar-children${childExpanded}">`);
          for (const child of item.children) {
            const childHref = child.href === '#' ? '#' : `${root}/${child.href}`;
            const childActive = child.key === currentKey ? ' active' : '';
            const childBadge = child.badge ? `<span class="sidebar-badge ${child.badge}">${child.badge}</span>` : '';
            lines.push(`      <a class="sidebar-item sub-sub${childActive}" href="${childHref}">${child.label}${childBadge}</a>`);
          }
          lines.push(`    </div>`);
        }
      }
      lines.push(`  </div>`);
      lines.push(`</div>`);
    }
  }

  return lines.join('\n');
}

// ── Inject sidebar ───────────────────────────────
function initNav() {
  const root  = (window.DOCS_ROOT || '.').replace(/\/+$/, '');
  const key   = window.DOCS_NAV_KEY || '';
  const el    = document.getElementById('sidebar');
  if (el) el.innerHTML = buildSidebar(root, key);

  // Section label click — toggle expand/collapse
  if (el) {
    el.querySelectorAll('.sidebar-section-label').forEach(label => {
      label.addEventListener('click', () => {
        label.closest('.sidebar-section').classList.toggle('expanded');
      });
    });
  }

  // Hamburger toggle
  const btn = document.getElementById('hamburger');
  if (btn && el) {
    btn.addEventListener('click', () => {
      el.classList.toggle('open');
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!el.contains(e.target) && !btn.contains(e.target)) {
        el.classList.remove('open');
      }
    });
  }
}

// ── Copy buttons ─────────────────────────────────
function initCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const block = btn.closest('.code-block');
      const pre   = block ? block.querySelector('pre') : null;
      if (!pre) return;
      navigator.clipboard.writeText(pre.textContent.trim()).then(() => {
        const orig = btn.textContent;
        btn.textContent = 'copied';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = orig;
          btn.classList.remove('copied');
        }, 1800);
      });
    });
  });
}

// ── Host tabs (Ubuntu / Windows) ─────────────────
function initTabs() {
  document.querySelectorAll('.tab-bar').forEach(bar => {
    bar.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const group = btn.closest('.host-tabs');
        if (!group) return;
        const target = btn.dataset.tab;
        // Update buttons
        bar.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // Update panels
        group.querySelectorAll('.tab-panel').forEach(p => {
          p.classList.toggle('active', p.dataset.tab === target);
        });
      });
    });
  });
}

// ── Right TOC active tracking ─────────────────────
function initTocHighlight() {
  const tocLinks = document.querySelectorAll('.page-toc-list a');
  if (!tocLinks.length) return;

  const sections = Array.from(tocLinks).map(a => {
    const id = a.getAttribute('href').replace('#', '');
    return document.getElementById(id);
  }).filter(Boolean);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tocLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  sections.forEach(s => observer.observe(s));
}

// ── Expand / Collapse all sections ───────────────
function initExpandCollapse() {
  const toc = document.querySelector('.page-toc');
  if (!toc) return;

  const sections = document.querySelectorAll('.collapsible-section');
  if (!sections.length) return;

  const controls = document.createElement('div');
  controls.className = 'toc-controls';
  controls.innerHTML =
    '<button class="toc-ctrl-btn" id="expand-all">Expand all</button>' +
    '<button class="toc-ctrl-btn" id="collapse-all">Collapse all</button>';

  const label = toc.querySelector('.page-toc-label');
  if (label) {
    label.after(controls);
  } else {
    toc.prepend(controls);
  }

  document.getElementById('expand-all').addEventListener('click', () => {
    sections.forEach(s => s.setAttribute('open', ''));
  });

  document.getElementById('collapse-all').addEventListener('click', () => {
    sections.forEach(s => s.removeAttribute('open'));
  });
}

// ── Init ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initCopyButtons();
  initTabs();
  initTocHighlight();
  initExpandCollapse();
});
