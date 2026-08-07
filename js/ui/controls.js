function renderAnswers(options, submitFn) {
  const wrap    = document.getElementById('answerDropdownWrap');
  const trigger = document.getElementById('ansDropdownTrigger');
  const list    = document.getElementById('ansDropdownList');

  wrap.style.display = '';
  trigger.textContent = 'Select your answer…';
  trigger.className = 'ans-dropdown-trigger';
  list.innerHTML = '';
  list.classList.remove('open');

  // Sort alphabetically for easy scanning
  const sorted = [...options].sort((a, b) => a.name.localeCompare(b.name));

  sorted.forEach(item => {
    const el = document.createElement('div');
    el.className = 'ans-dropdown-item';
    el.textContent = item.displayName || item.name;
    el.dataset.symbol = item.symbol;
    el.addEventListener('click', () => {
      closeDropdown();
      submitFn(item, el);
    });
    list.appendChild(el);
  });

  function openDropdown() {
    if (trigger.classList.contains('disabled')) return;
    list.classList.add('open');
    trigger.classList.add('open');
  }
  function closeDropdown() {
    list.classList.remove('open');
    trigger.classList.remove('open');
  }

  trigger.onclick = () => list.classList.contains('open') ? closeDropdown() : openDropdown();
  trigger.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDropdown(); } };

  // Close on outside click — remove any prior listener first to avoid stacking
  if (wrap._outsideClick) document.removeEventListener('click', wrap._outsideClick);
  wrap._outsideClick = function(e) {
    if (!wrap.contains(e.target)) {
      closeDropdown();
      document.removeEventListener('click', wrap._outsideClick);
      wrap._outsideClick = null;
    }
  };
  document.addEventListener('click', wrap._outsideClick);
}

// POINT 11: After answering, update dropdown trigger and highlight correct/wrong items
function revealDropdownAnswer(chosenSymbol, correctSymbol) {
  const trigger = document.getElementById('ansDropdownTrigger');
  const list    = document.getElementById('ansDropdownList');
  trigger.classList.add('disabled');
  trigger.classList.remove('open');
  list.classList.remove('open');

  list.querySelectorAll('.ans-dropdown-item').forEach(el => {
    if (el.dataset.symbol === correctSymbol) {
      el.classList.add('correct');
      if (el.dataset.symbol === chosenSymbol) trigger.classList.add('correct');
    } else if (el.dataset.symbol === chosenSymbol) {
      el.classList.add('wrong');
    }
  });

  // Show chosen name in trigger
  const chosenEl = list.querySelector(`[data-symbol="${chosenSymbol}"]`);
  if (chosenEl) trigger.textContent = chosenEl.textContent;
  if (chosenSymbol !== correctSymbol) trigger.classList.add('wrong');
}

function renderControls(nextFn, playFn) {
  const c = document.getElementById('controls');
  c.innerHTML = '';
  if (answered) {
    const nb = document.createElement('button');
    nb.className = 'ctrl-btn primary';
    nb.id = 'nextBtn';
    nb.textContent = currentMode === 'intervals'    ? 'Next interval'
                   : currentMode === 'scales'       ? 'Next scale'
                   : currentMode === 'progressions' ? 'Next progression'
                   : 'Next chord';
    nb.addEventListener('click', nextFn);
    c.appendChild(nb);
  }
  // POINT 8: Hear slowly — only shown after answering
  if (answered) {
    const sb = document.createElement('button');
    sb.className = 'ctrl-btn slow';
    sb.textContent = '🐢 Hear slowly';
    sb.addEventListener('click', playSlowly);
    c.appendChild(sb);
  }
  // POINT 37: Resolve ↔ Chord toggle — only shown after answering, only in chord mode
  if (answered && currentMode === 'chords') {
    const rb = document.createElement('button');
    rb.className = 'ctrl-btn resolve';
    rb.id = 'resolveBtn';
    rb.textContent = resolutionActive ? '← Chord' : 'Resolve →';
    rb.addEventListener('click', playResolution);
    c.appendChild(rb);
  }
}
