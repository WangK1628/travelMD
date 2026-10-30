/* 毛主席诗词 · 竖排逐字渐显展示层
 * 用法：MaoPoemView.open()       随机一首
 *       MaoPoemView.openList()   诗目（只列篇名）
 *       MaoPoemView.play(i)      指定第 i 首
 * 逐字浮现 → 全篇显完停留数秒 → 整幅淡去
 */
window.MaoPoemView = (function () {
  'use strict';

  var DATA = (window.MaoPoems && window.MaoPoems.data) || [];
  var STYLE = (window.MaoPoems && window.MaoPoems.style) || {};
  /* 打开页面后第一次点「诗」必读的篇目 */
  var INTRO_POEM = '贺新郎·读史';

  var el = null, stage = null, colsEl = null, metaEl = null, listEl = null;
  var raf = 0, timers = [], cur = -1, lastPick = -1;
  /* 展阅轮转：一首不重复地走完 67 首，走完再重开一轮 */
  var shown = {}, shownN = 0, bag = [], bagAt = 0, introDone = false;
  var scrollMode = false, panX = 0, colEls = [], colStarts = [];
  /* 朗读状态 */
  var recEl = null, recCols = null, recLine = null, recTitle = null,
      recCta = null, recPgBar = null, recCharEls = [];
  var audio = null, recRaf = 0, recOn = false, recLineIdx = -2, recCur = -1,
      recEndTimer = 0, recDur = 0, recData = null, recStartAt = 0, recPoemIdx = -1,
      recMuted = false, recEnded = false, recHint = null, closeTimer = 0, recHideAt = 0;
  var REC_HINT = '点击任意处 · 直接看全文';
  var RECITES = window.MaoRecites || [];

  var BREAK = '，。；：？！';                    // 句读：断列
  var PUNCT = '，。；：？！、·「」《》（）';      // 顿号等只是停顿，只删不断

  var CSS = [
    '.mp{position:fixed;inset:0;z-index:2200;display:none;',
    'background:radial-gradient(120% 120% at 50% 40%,#f6efdd 0%,#efe4cb 46%,#e3d5b6 100%);',
    'opacity:0;transition:opacity .55s ease;overflow:hidden}',
    '.mp.on{display:block}',
    '.mp.in{opacity:1}',
    /* 纸纹：极淡的横竖经纬 + 四角暗 */
    '.mp::before{content:"";position:absolute;inset:0;pointer-events:none;opacity:.5;',
    'background-image:repeating-linear-gradient(0deg,rgba(120,96,60,.045) 0 1px,transparent 1px 4px),',
    'repeating-linear-gradient(90deg,rgba(120,96,60,.035) 0 1px,transparent 1px 6px)}',
    '.mp::after{content:"";position:absolute;inset:0;pointer-events:none;',
    'background:radial-gradient(120% 100% at 50% 46%,transparent 52%,rgba(96,70,36,.16) 100%)}',
    '.mp-stage{position:absolute;inset:clamp(26px,5vh,64px) clamp(22px,4vw,72px);',
    'display:flex;align-items:center;justify-content:center}',
    '.mp-cols{display:flex;flex-direction:row-reverse;align-items:flex-start;',
    'flex:none;gap:0;transition:opacity 1.1s ease}',
    '.mp-cols.out{opacity:0}',
    '.mp-col{display:flex;flex-direction:column;align-items:center;justify-content:flex-start;flex:none}',
    '.mp-ch{display:block;opacity:0;transform:translateY(.22em) scale(.94);',
    'transition:opacity .62s ease,transform .62s cubic-bezier(.2,.85,.3,1);',
    'line-height:1.04;white-space:pre}',
    '.mp-ch.on{opacity:1;transform:none}',
    '.mp-ch i{font-style:normal;display:inline-block;line-height:1}',
    /* 年款、印章 */
    '.mp-meta{position:absolute;left:clamp(16px,3vw,40px);bottom:clamp(52px,8vh,74px);z-index:3;',
    'writing-mode:vertical-rl;font-family:var(--kai,"STKaiti",serif);font-size:12px;letter-spacing:.3em;',
    'color:rgba(84,64,40,.62);opacity:0;transition:opacity 1.4s ease 1.2s}',
    '.mp-meta.on{opacity:1}',
    '.mp-seal{position:absolute;right:clamp(16px,3vw,40px);bottom:clamp(52px,8vh,74px);z-index:3;',
    'width:42px;height:42px;border-radius:4px;display:grid;place-items:center;',
    'font-family:var(--kai,serif);font-size:19px;color:#fff2e6;letter-spacing:0;',
    'background:linear-gradient(148deg,#b23a2c,#8d1f16);',
    'box-shadow:0 6px 16px -10px rgba(90,20,10,.9),inset 0 0 0 2px rgba(255,228,208,.34);',
    'transform:rotate(-5deg) scale(.86);opacity:0;transition:opacity .8s ease,transform .8s cubic-bezier(.2,.9,.3,1)}',
    '.mp-seal.on{opacity:.92;transform:rotate(-5deg) scale(1)}',
    /* 操作条 */
    '.mp-bar{position:absolute;left:50%;bottom:clamp(12px,2.2vh,22px);transform:translateX(-50%);',
    'z-index:5;display:flex;gap:8px;opacity:0;transition:opacity .6s ease}',
    '.mp-bar.on{opacity:1}',
    '.mp-b{flex:none;white-space:nowrap;padding:7px 15px;border-radius:999px;border:1px solid rgba(96,72,44,.26);',
    'background:rgba(255,253,246,.66);color:#54402a;font-size:11.5px;letter-spacing:.14em;',
    'font-family:var(--song,serif);cursor:pointer;transition:.2s}',
    '.mp-b:hover{background:#3c2c1c;color:#f6efdd;border-color:transparent}',
    /* 「朗读」入口：朱色描边，一眼能认出这首有音频 */
    '.mp-b-rec{color:#8e2318;border-color:rgba(150,40,30,.4);background:rgba(255,246,240,.8)}',
    '.mp-b-rec:hover{background:#9c2418;color:#fff3ea;border-color:transparent}',
    /* 诗目 */
    '.mp-list{position:absolute;inset:0;z-index:8;display:none;',
    'background:#f7f0e2;overflow:auto;padding:clamp(30px,6vh,64px) clamp(18px,5vw,64px)}',
    '.mp-list.on{display:block}',
    '.mp-list h3{margin:0 0 4px;font-family:var(--kai,serif);font-size:20px;font-weight:600;',
    'color:#6d2419;letter-spacing:.16em}',
    '.mp-list p{margin:0 0 22px;font-size:11.5px;letter-spacing:.2em;color:#94805f}',
    '.mp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:2px 18px}',
    '.mp-it{display:flex;align-items:baseline;gap:9px;padding:9px 4px;border:0;background:none;',
    'border-bottom:1px solid rgba(120,96,60,.13);text-align:left;cursor:pointer;',
    'font-family:var(--kai,serif);font-size:15.5px;color:#3b2f22;transition:.18s}',
    '.mp-it i{font-style:normal;font-size:10.5px;color:#a5906e;font-variant-numeric:tabular-nums;',
    'min-width:22px;letter-spacing:.06em}',
    '.mp-it:hover{color:#a5342a;background:rgba(165,52,42,.06);padding-left:9px}',
    '.mp-it:hover i{color:#a5342a}',
    '.mp-it em{font-style:normal;margin-left:auto;flex:none;font-size:9.5px;letter-spacing:.1em;',
    'color:#9c7b52;border:1px solid rgba(150,120,80,.3);border-radius:2px;padding:1px 5px;',
    'font-family:var(--song,serif)}',
    '.mp-it.has-rec em{color:#9c2418;border-color:rgba(156,36,24,.36);background:rgba(156,36,24,.05)}',
    /* 已展过的：编号变淡，一眼看出还剩哪些没看 */
    '.mp-it.seen i{color:#c9bda6}',
    '.mp-it.seen span{color:#7d6d55}',
    '.mp-sub .mp-remain{color:#a5342a}',
    /* ===== 朗读层：红底、中央逐句、背景同步全文 ===== */
    '.mp.recite{background:radial-gradient(122% 118% at 50% 36%,#c42012 0%,#a8130a 44%,#780c05 100%)}',
    '.mp.recite::before{opacity:.32;background-image:repeating-linear-gradient(0deg,rgba(255,255,255,.035) 0 1px,transparent 1px 5px)}',
    '.mp.recite::after{background:radial-gradient(118% 96% at 50% 44%,transparent 44%,rgba(52,3,0,.6) 100%)}',
    '.mp.recite .mp-stage,.mp.recite .mp-meta,.mp.recite .mp-seal,.mp.recite .mp-bar{display:none}',
    '.mp-rec{position:absolute;inset:0;z-index:4;display:none}',
    '.mp.recite .mp-rec{display:block}',
    /* 背景：整首竖排，读到哪列哪列亮 */
    '.mp-rec-bg{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;',
    'overflow:hidden;pointer-events:none;opacity:1}',
    '.mp-rec-cols{display:flex;flex-direction:row-reverse;align-items:flex-start;flex:none}',
    '.mp-rec-col{display:flex;flex-direction:column;align-items:center;flex:none;',
    'font-family:var(--kai,"STKaiti",serif);font-weight:600;letter-spacing:.02em}',
    '.mp-rec-col span{color:rgba(255,240,232,.115);transition:color 1s ease,text-shadow 1s ease}',
    '.mp-rec-col span.lit{color:rgba(255,248,242,.34);text-shadow:0 0 14px rgba(255,220,190,.2)}',
    /* 左上角题名 */
    '.mp-rec-title{position:absolute;left:clamp(18px,4vw,56px);top:clamp(15px,3.2vh,36px);',
    'font-family:var(--kai,serif);font-size:clamp(12.5px,1.35vw,17px);letter-spacing:.26em;',
    'color:rgba(255,240,230,.74)}',
    '.mp-rec-title em{font-style:normal;font-size:.76em;letter-spacing:.18em;',
    'color:rgba(255,226,208,.5);margin-left:.9em}',
    /* 中央逐句：先压一层暗晕，让大字与背景分开 */
    '.mp-rec-mid{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;',
    'padding:0 6vw;pointer-events:none}',
    '.mp-rec-mid::before{content:"";position:absolute;inset:0;pointer-events:none;',
    'background:linear-gradient(180deg,rgba(112,6,1,0) 10%,rgba(112,6,1,.58) 34%,rgba(112,6,1,.66) 50%,rgba(112,6,1,.58) 66%,rgba(112,6,1,0) 90%)}',
    '.mp-rec-line{position:relative;font-family:var(--song,"Songti SC","STSong","SimSun",serif);',
    'color:#fff9f4;text-align:center;white-space:nowrap;font-weight:600;',
    'text-shadow:0 4px 34px rgba(58,0,0,.6),0 0 2px rgba(255,236,220,.45);',
    'opacity:0;transform:translateY(20px);',
    'transition:opacity .62s ease,transform .62s cubic-bezier(.2,.85,.3,1)}',
    '.mp-rec-line.on{opacity:1;transform:none}',
    /* 进度线 + 提示 */
    '.mp-rec-pg{position:absolute;left:0;right:0;bottom:0;height:2px;background:rgba(255,220,200,.13)}',
    '.mp-rec-pg i{display:block;height:100%;width:0;background:linear-gradient(90deg,rgba(255,206,170,.35),rgba(255,236,214,.8))}',
    '.mp-rec-hint{position:absolute;right:clamp(16px,3vw,42px);bottom:clamp(13px,2.4vh,26px);',
    'font-size:11px;letter-spacing:.18em;color:rgba(255,238,226,.42)}',
    '.mp-rec-cta{position:absolute;left:50%;bottom:16%;transform:translate(-50%,8px);',
    'font-family:var(--kai,serif);font-size:13px;letter-spacing:.24em;padding:9px 22px;border-radius:999px;',
    'border:1px solid rgba(255,226,206,.34);color:rgba(255,244,234,.9);background:rgba(90,6,0,.28);',
    'opacity:0;transition:opacity .7s ease,transform .7s ease;pointer-events:none}',
    '.mp-rec-cta.on{opacity:1;transform:translate(-50%,0)}',
    '@media (max-width:767px){',
    '.mp-stage{inset:clamp(18px,4vh,42px) 14px clamp(56px,10vh,86px)}',
    '.mp-grid{grid-template-columns:1fr 1fr;gap:0 12px}',
    '.mp-rec-tip{display:none}',
    '.mp-it{font-size:13.5px;padding:8px 2px}',
    '.mp-seal{width:34px;height:34px;font-size:15px}',
    '.mp-meta{font-size:10.5px;bottom:clamp(62px,12vh,96px)}',
    '.mp-b{padding:6px 12px;font-size:10.5px;letter-spacing:.1em}',
    '.mp-rec-title{font-size:11.5px;letter-spacing:.16em}',
    '.mp-rec-hint{font-size:10px;bottom:12px}',
    '.mp-rec-cta{font-size:12px;bottom:13%}',
    /* 手机屏小，背景字太亮会压住中央大字，压一档 */
    '.mp-rec-col span{color:rgba(255,240,232,.075)}',
    '.mp-rec-col span.lit{color:rgba(255,248,242,.24)}',
    '.mp-rec-mid::before{background:linear-gradient(180deg,rgba(112,6,1,0) 12%,rgba(112,6,1,.62) 34%,rgba(112,6,1,.72) 50%,rgba(112,6,1,.62) 66%,rgba(112,6,1,0) 88%)}',
    '}'
  ].join('');

  function injectCSS() {
    if (document.getElementById('mp-style')) return;
    var st = document.createElement('style');
    st.id = 'mp-style';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  function build() {
    if (el) return;
    injectCSS();
    el = document.createElement('div');
    el.className = 'mp';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', '毛主席诗词');
    el.innerHTML =
      '<div class="mp-stage"><div class="mp-cols"></div></div>' +
      '<div class="mp-meta"></div>' +
      '<div class="mp-seal">毛</div>' +
      '<div class="mp-bar">' +
      '<button class="mp-b mp-b-rec" data-act="recite">▶ 朗读</button>' +
      '<button class="mp-b" data-act="list">诗目 · ' + DATA.length + ' 首</button>' +
      '<button class="mp-b" data-act="next">换一首</button>' +
      '<button class="mp-b" data-act="close">收起 ✕</button>' +
      '</div>' +
      '<div class="mp-list"><h3>毛泽东诗词</h3><p class="mp-sub">共 ' + DATA.length + ' 首 · 点篇名即可观看<span class="mp-remain"></span>' +
      (RECITES.length ? '<span class="mp-rec-tip"> · 带「朗读」的可听朗诵</span>' : '') + '</p>' +
      '<div class="mp-grid"></div></div>' +
      /* 朗读层 */
      '<div class="mp-rec">' +
      '<div class="mp-rec-bg"><div class="mp-rec-cols"></div></div>' +
      '<div class="mp-rec-title"></div>' +
      '<div class="mp-rec-mid"><span class="mp-rec-line"></span></div>' +
      '<div class="mp-rec-pg"><i></i></div>' +
      '<div class="mp-rec-hint">点击任意处 · 直接看全文</div>' +
      '<div class="mp-rec-cta">朗读完毕 · 看全文</div>' +
      '</div>';
    document.body.appendChild(el);

    stage = el.querySelector('.mp-stage');
    colsEl = el.querySelector('.mp-cols');
    metaEl = el.querySelector('.mp-meta');
    listEl = el.querySelector('.mp-list');
    recEl = el.querySelector('.mp-rec');
    recCols = el.querySelector('.mp-rec-cols');
    recLine = el.querySelector('.mp-rec-line');
    recTitle = el.querySelector('.mp-rec-title');
    recCta = el.querySelector('.mp-rec-cta');
    recPgBar = el.querySelector('.mp-rec-pg i');
    recHint = el.querySelector('.mp-rec-hint');

    var grid = listEl.querySelector('.mp-grid');
    DATA.forEach(function (p, i) {
      var b = document.createElement('button');
      b.className = 'mp-it';
      b.type = 'button';
      var hasRec = !!reciteOf(p);
      if (hasRec) b.className += ' has-rec';
      b.innerHTML = '<i>' + (i + 1) + '</i><span>' + p.t + '</span>' +
        (hasRec ? '<em>朗读</em>' : '');
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        hideList();
        if (reciteOf(p)) reciteStart(i); else play(i);
      });
      grid.appendChild(b);
    });

    el.querySelector('.mp-bar').addEventListener('click', function (e) {
      var act = e.target.getAttribute('data-act');
      if (act === 'list') showList();
      else if (act === 'next') playRandom();
      else if (act === 'recite') reciteStart(cur >= 0 ? cur : 0);
      else if (act === 'close') close();
      e.stopPropagation();
    });

    el.addEventListener('click', function (e) {
      // 诗目开着时，点击一律先收起诗目（不误触朗读跳过）
      if (listEl.classList.contains('on')) { hideList(); return; }
      // 朗读中：首次点击先开声音（自动播放被拦时），之后才是跳过看全文
      if (recOn) { if (!recFirstTap()) toPaper(); return; }
      // 点空白处关闭整层
      if (e.target === el || e.target === stage || e.target === colsEl) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && el && el.classList.contains('on')) {
        if (listEl.classList.contains('on')) hideList(); else close();
      }
    });
  }

  function showList() {
    if (!listEl) return;
    var left = Math.max(0, DATA.length - shownN);
    var r = listEl.querySelector('.mp-remain');
    if (r) r.textContent = left ? ' · 还剩 ' + left + ' 首未展' : ' · 已展一遍 · 重新轮起';
    var items = listEl.querySelectorAll('.mp-it');
    for (var i = 0; i < items.length; i++) {
      if (shown[i]) items[i].classList.add('seen'); else items[i].classList.remove('seen');
    }
    listEl.classList.add('on');
  }
  function hideList() { if (listEl) listEl.classList.remove('on'); }

  function clearRun() {
    cancelAnimationFrame(raf);
    timers.forEach(clearTimeout);
    timers = [];
  }

  /* 关层是「淡出后再隐藏」，这里把那次延时撤掉；
   * 否则刚关又开（或纸面正在自动消隐时点了朗读），旧定时器会把新打开的一层直接关掉 */
  function cancelClose() {
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = 0; }
  }

  /* 断句：按句读切分，一句一列（书法本无标点）；p 的每个元素视为一行，行首句带 brk 标记留呼吸空隙 */
  function splitSentences(lines) {
    var out = [], i, j;
    for (i = 0; i < lines.length; i++) {
      var cur = '', first = true;
      for (j = 0; j < lines[i].length; j++) {
        var ch = lines[i][j];
        if (BREAK.indexOf(ch) >= 0) {
          if (cur) { out.push({ txt: cur, brk: i > 0 && first }); cur = ''; first = false; }
        } else if (PUNCT.indexOf(ch) >= 0) {
          continue;                                   // 顿号、书名号等：删掉，但不断列
        } else cur += ch;
      }
      if (cur) out.push({ txt: cur, brk: i > 0 && first });
    }
    return out;
  }

  function render(poem) {
    var sty = STYLE[poem.s] || STYLE.lang;
    var availW = stage.clientWidth, availH = stage.clientHeight;
    var mob = availW < 560;

    var sents = splitSentences(poem.p);
    /* 题名：词牌与题面用「·」隔开，各自成列，免得「沁园春雪」连读 */
    var titleParts = poem.t.split('·').map(function (t) {
      return t.split('').filter(function (c) { return PUNCT.indexOf(c) < 0; }).join('');
    }).filter(Boolean);
    var titleLen = 0;
    titleParts.forEach(function (t) { if (t.length > titleLen) titleLen = t.length; });

    var maxLen = 1;
    sents.forEach(function (x) { if (x.txt.length > maxLen) maxLen = x.txt.length; });

    /* 一句一列：字号由「最长句占满列高」与「总列数占满行宽」共同推出，绝不折句 */
    var nT = titleParts.length;
    var nC = sents.length + nT;
    var bC = 0; sents.forEach(function (x) { if (x.brk) bC++; });
    var fCol = mob ? 1.04 : 1.12, fGap = mob ? 0.04 : 0.12, fBrk = mob ? 0.08 : 0.30;
    var tf = 1.08;                                               // 题名略大于正文
    var wPer = (nC - nT) * fCol + nT * fCol * tf + (nC - 1) * fGap + bC * fBrk;
    var layoutW = availW * (mob ? 0.9 : 0.97);                   // 左右留白，免得顶到屏幕边
    var s = Math.min(layoutW / wPer, availH / (maxLen * 1.06), availH / 6);
    s = Math.max(mob ? 11 : 16, Math.min(150, Math.floor(s)));

    /* 列少时把富余的横向空间匀进列距，免得整幅缩在中间发飘（最多用掉一半） */
    var ts = Math.min(s * tf, availH / (titleLen * 1.06));

    /* 窄屏/小窗：一句一列会把字压到看不清，改用「手卷」——放大到约两屏宽，逐列自动移卷 */
    scrollMode = false;
    var minRead = mob ? 15 : 32;
    if (s < minRead) {
      var mult = mob ? 2.2 : 1.7;
      var s2 = Math.floor(Math.min(availH / (maxLen * 1.06), layoutW * mult / wPer, mob ? 34 : 120));
      if (s2 > s) { s = s2; scrollMode = true; ts = Math.min(s * tf, availH / (titleLen * 1.06)); }
    }
    var colWSum = (nC - nT) * s * fCol + nT * ts * fCol + ts * (0.12 + 0.34 * Math.max(0, nT - 1));
    var brkK = fBrk * s;
    var slack = layoutW - (colWSum + (nC - 1) * s * fGap + bC * brkK);
    var gapPx = s * fGap + (slack > 0 ? Math.min(slack * 0.55 / Math.max(1, nC - 1), s * 0.5) : 0);

    var seq = [];
    function col(chars, fs, cls, brk) {
      var d = document.createElement('div');
      d.className = 'mp-col' + (cls ? ' ' + cls : '');
      d.style.width = (fs * fCol).toFixed(1) + 'px';
      if (brk) d.style.marginLeft = (fs * fBrk).toFixed(1) + 'px';  // 行间呼吸空隙
      if (cls) d.style.marginLeft = (fs * (cls === 't2' ? 0.34 : 0.12)).toFixed(1) + 'px';
      colStarts.push(seq.length);
      colEls.push(d);
      chars.forEach(function (ch) {
        var sp = document.createElement('span');
        sp.className = 'mp-ch';
        sp.style.fontSize = fs.toFixed(1) + 'px';
        // 行高锁死，字的「步进」正好是 fs*1.06
        sp.style.height = (fs * 1.06).toFixed(1) + 'px';
        sp.style.lineHeight = (fs * 1.06).toFixed(1) + 'px';
        sp.style.fontFamily = sty.f;
        sp.style.fontWeight = sty.w;
        sp.style.color = cls === 't' ? '#2b2016' : '#1f1811';
        var gi = document.createElement('i');
        gi.textContent = ch;
        if (sty.sk) gi.style.transform = 'skewX(' + sty.sk + 'deg)';
        sp.appendChild(gi);
        d.appendChild(sp);
        seq.push(sp);
      });
      colsEl.appendChild(d);
    }

    colsEl.innerHTML = '';
    colEls = []; colStarts = [];
    titleParts.forEach(function (t, k) { col(t.split(''), ts, 't' + (k ? ' t2' : '')); });
    sents.forEach(function (x) { col(x.txt.split(''), s, '', x.brk); });
    colsEl.style.gap = gapPx.toFixed(1) + 'px';

    /* 手卷模式：整幅比屏宽，靠位移移卷，起首从右端看起 */
    if (scrollMode) {
      stage.style.flexDirection = 'column';
      stage.style.justifyContent = 'center';
      stage.style.alignItems = 'flex-start';
      colsEl.style.width = 'max-content';
      colsEl.style.transition = 'transform .62s cubic-bezier(.32,.82,.32,1), opacity 1.1s ease';
      // 两端渐隐：手卷边缘的字化进纸里，不再被硬切一半（遮罩加在视窗上，才对齐屏幕边缘）
      var edgeMask = 'linear-gradient(90deg,transparent 0,rgba(0,0,0,.3) 2%,#000 7%,#000 93%,rgba(0,0,0,.3) 98%,transparent 100%)';
      stage.style.webkitMaskImage = edgeMask;
      stage.style.maskImage = edgeMask;
      requestAnimationFrame(function () { panTo(stage.clientWidth - colsEl.offsetWidth, false); });   // 起首：题名靠右，左侧留白
    } else {
      stage.style.flexDirection = '';
      stage.style.justifyContent = '';
      stage.style.alignItems = '';
      colsEl.style.width = '';
      colsEl.style.transition = '';
      colsEl.style.transform = '';
      stage.style.webkitMaskImage = '';
      stage.style.maskImage = '';
      panX = 0;
    }

    metaEl.textContent = poem.y;
    return seq;
  }

  /* 位移到 x（px），限位在手卷两端之内 */
  function panTo(x, anim) {
    if (!el) return;
    var W = stage.clientWidth, CW = colsEl.offsetWidth;
    if (!CW) return;
    var xi = Math.min(0, Math.max(W - CW, x));
    if (!anim) colsEl.style.transition = 'none';
    panX = xi;
    colsEl.style.transform = 'translateX(' + xi.toFixed(1) + 'px)';
    if (!anim) {
      void colsEl.offsetWidth;
      colsEl.style.transition = 'transform .62s cubic-bezier(.32,.82,.32,1), opacity 1.1s ease';
    }
  }

  /* 正在写的这一列将出左侧时，整幅右移，让已写的部分仍然留在屏上 */
  function maybePan(c) {
    if (!scrollMode || !c) return;
    var W = stage.clientWidth;
    var sr = stage.getBoundingClientRect(), r = c.getBoundingClientRect();
    var left = r.left - sr.left;
    if (left > W * 0.12) return;
    panTo(panX + (W * 0.12 - left), true);
  }

  /* ============ 朗读模式：红底 · 中央逐句 · 背景同步全文 ============ */
  function reciteOf(poem) {
    for (var i = 0; i < RECITES.length; i++) if (RECITES[i].t === poem.t) return RECITES[i];
    return null;
  }

  /* 退出朗读：停音频、撤样式、清背景列（可重复调用） */
  function clearRecite() {
    recOn = false;
    cancelAnimationFrame(recRaf);
    recRaf = 0;
    clearTimeout(recEndTimer);
    recEndTimer = 0;
    if (audio) {
      try { audio.pause(); } catch (e) {}
      try { audio.removeAttribute('src'); audio.load(); } catch (e) {}
      audio = null;
    }
    recLineIdx = -2;
    recCur = -1;
    recData = null;
    recPoemIdx = -1;
    recEnded = false;
    recMuted = false;
    recHideAt = 0;
    try { document.removeEventListener('visibilitychange', recVis); } catch (e) {}
    if (recHint) recHint.textContent = REC_HINT;
    if (el) el.classList.remove('recite');
    if (recCols) recCols.innerHTML = '';
    recCharEls = [];
    if (recLine) { recLine.classList.remove('on'); recLine.textContent = ''; }
    if (recCta) recCta.classList.remove('on');
    if (recPgBar) recPgBar.style.width = '0%';
  }

  /* 背景全文：一句一列竖排（句多时两三句并一列），读到第 k 句时该句及之前点亮 */
  function buildRecBg(rc) {
    var availW = el.clientWidth, availH = el.clientHeight;
    var lines = rc.l.map(function (x) { return x[1]; });
    var n = lines.length;
    var strip = function (t) { return t.replace(/[，。；：？！、·「」《》（）]/g, ''); };

    /* 每列几句：1~3 句都算一遍，取「字能开到最大」的那种，
     * 短词一句一列疏朗，长调并句才不会缩成中间一条细纹 */
    var best = null;
    var cap = availW < 560 ? 32 : 58;      // 窄屏水印字压小一档，别盖过中央大字
    for (var per = 1; per <= 3; per++) {
      var gs = Math.ceil(n / per), mx = 1;
      for (var i0 = 0; i0 < n; i0 += per) {
        var c0 = 0;
        for (var q0 = i0; q0 < n && q0 < i0 + per; q0++) c0 += strip(lines[q0]).length;
        if (c0 > mx) mx = c0;
      }
      var f0 = Math.min(availW * 0.94 / (gs * 1.42), availH * 0.9 / (mx * 1.06), cap);
      if (!best || f0 > best.fs + 0.5) best = { per: per, fs: f0 };
    }
    var perCol = best.per;
    var fs = Math.max(7, best.fs);

    var groups = [], gi = 0;
    while (gi < n) {
      var g = [];
      for (var q = 0; q < perCol && gi < n; q++, gi++) g.push({ t: lines[gi], i: gi });
      groups.push(g);
    }

    recCols.innerHTML = '';
    recCols.style.gap = (fs * 0.34).toFixed(1) + 'px';
    recCharEls = [];
    groups.forEach(function (g) {
      var d = document.createElement('div');
      d.className = 'mp-rec-col';
      d.style.fontSize = fs.toFixed(1) + 'px';
      d.style.width = (fs * 1.04).toFixed(1) + 'px';
      g.forEach(function (x) {
        var s = strip(x.t);
        for (var k = 0; k < s.length; k++) {
          var sp = document.createElement('span');
          sp.textContent = s.charAt(k);
          sp.dataset.i = x.i;
          sp.style.height = (fs * 1.06).toFixed(1) + 'px';
          sp.style.lineHeight = (fs * 1.06).toFixed(1) + 'px';
          d.appendChild(sp);
          recCharEls.push(sp);
        }
      });
      recCols.appendChild(d);
    });
  }

  /* 切到第 k 句（中央大字 + 背景点亮）；k<0 时显示片头篇名 */
  function recSetLine(k) {
    if (k === recLineIdx) return;
    recLineIdx = k;
    if (!recData) return;
    var txt = k < 0 ? recData.t.replace('·', ' · ') : recData.l[k][1];
    var body = txt.replace(/[，。；：？！、·\s]/g, '');
    var mob = window.innerWidth < 560;
    var fs = Math.min(el.clientWidth * (mob ? 0.78 : 0.72) / Math.max(1, body.length),
                      el.clientHeight * 0.24,
                      mob ? 60 : 136);
    if (k < 0) fs *= 0.72;                    // 片头篇名略小，正句更醒目
    recLine.style.fontSize = Math.max(18, fs).toFixed(1) + 'px';

    recLine.classList.remove('on');
    void recLine.offsetWidth;          // 强制回流，让每句都重新上浮淡入
    recLine.textContent = txt;
    recLine.classList.add('on');

    if (k >= 0) {
      for (var i = 0; i < recCharEls.length; i++) {
        var sp = recCharEls[i];
        if (+sp.dataset.i <= k) { if (!sp.classList.contains('lit')) sp.classList.add('lit'); }
        else if (sp.classList.contains('lit')) sp.classList.remove('lit');
      }
      recCur = k;
    }
  }

  function recLoop() {
    if (!recOn || !recData) return;
    var t;
    if (audio && !audio.error && !recMuted && !audio.paused) t = audio.currentTime || 0;
    else t = Math.max(0, (performance.now() - recStartAt) / 1000);   // 音频被拦/还没起播：用墙钟兜底
    var k = -1;
    for (var j = 0; j < recData.l.length; j++) if (t >= recData.l[j][0]) k = j;
    recSetLine(k);
    var dur = recDur || (audio && audio.duration) || 1;
    if (recPgBar) recPgBar.style.width = Math.min(100, t / dur * 100).toFixed(2) + '%';
    // 收尾：音频真的放完了（ended 最可靠），或时间已过尾声，或音频彻底没声
    if (!recEnded && (t >= dur - 0.04)) { recEnd(); return; }
    recRaf = requestAnimationFrame(recLoop);
  }

  function recEnd() {
    if (!recOn || recEnded) return;
    recEnded = true;
    recSetLine(recData.l.length - 1);
    if (recPgBar) recPgBar.style.width = '100%';
    recCta.classList.add('on');
    clearTimeout(recEndTimer);
    recEndTimer = setTimeout(function () { if (recOn) toPaper(); }, 4200);
  }

  /* 朗读 → 纸色全文（多留一会儿，让人把整篇看完） */
  function toPaper() {
    var keep = recPoemIdx >= 0 ? recPoemIdx : 0;
    clearRecite();
    play(keep, 1);
  }

  /* 进入朗读；音频缺失或不支持则回退普通展示 */
  function reciteStart(i) {
    build();
    if (!DATA.length) return;
    i = ((i | 0) % DATA.length + DATA.length) % DATA.length;
    var poem = DATA[i];
    var rc = reciteOf(poem);
    if (!rc) { play(i); return; }
    if (!rc.l || !rc.l.length) { play(i); return; }

    clearRun();                    // 纸面的逐字/自动消隐定时器必须先撤掉，否则会把朗读层关掉
    cancelClose();
    clearRecite();
    recData = rc;
    recPoemIdx = i;
    recDur = rc.d || 0;
    cur = i;
    lastPick = i;
    markShown(i);                  // 展过的登记，轮转不再抽到

    el.classList.add('on');
    document.documentElement.style.overflow = 'hidden';
    void el.offsetWidth;
    el.classList.add('in', 'recite');

    colsEl.innerHTML = '';              // 纸面内容清掉，免得红底上透出来
    colsEl.classList.remove('out');
    colsEl.style.opacity = '';
    metaEl.classList.remove('on');
    el.querySelector('.mp-bar').classList.remove('on');
    el.querySelector('.mp-seal').classList.remove('on');

    recTitle.innerHTML = poem.t.replace('·', ' · ') + '<em>' + poem.y + '</em>';
    buildRecBg(rc);
    recLine.textContent = '';
    recLine.classList.remove('on');
    recCta.classList.remove('on');
    recPgBar.style.width = '0%';

    recOn = true;
    recEnded = false;
    recStartAt = performance.now();

    var a2 = new Audio();
    audio = a2;                    // 先挂上，事件的「是不是当前这段音频」判断才有意义
    a2.preload = 'auto';
    a2.src = rc.a;
    a2.addEventListener('error', function () {
      if (audio !== a2) return;    // 上一段被拆掉时 load() 会抛 error，别误杀新的朗读
      if (!recOn) return;
      clearRecite();
      play(i);                     // 音频读不到：直接给全文
    });
    a2.addEventListener('ended', function () {
      if (audio !== a2) return;
      recEnd();
    });
    a2.addEventListener('pause', function () {
      // 切后台被系统暂停：回到前台若还在朗读层就续上，免得字幕停住不动
      if (audio !== a2) return;
      if (recOn && !recEnded && !document.hidden) {
        var q = a2.play(); if (q && q.catch) q.catch(function () {});
      }
    });
    a2.addEventListener('timeupdate', function () {
      if (audio !== a2 || !recOn || recMuted) return;
      if (a2.currentTime > 0.05) recStartAt = performance.now() - a2.currentTime * 1000;
    });
    el.__audio = a2;               // 便于调试/外部控制
    var pr = a2.play();
    if (pr && pr.then) {
      pr.then(function () {
        if (audio !== a2) return;
        recMuted = false;
        if (recHint) recHint.textContent = REC_HINT;
      }).catch(function () {
        // 浏览器拦了自动播放：先用墙钟把字幕走完，首次点击专门用来开声音
        if (audio !== a2) return;
        recMuted = true;
        recStartAt = performance.now();
        if (recHint) recHint.textContent = '点一下开启声音';
      });
    }
    document.addEventListener('visibilitychange', recVis);

    cancelAnimationFrame(recRaf);
    recRaf = requestAnimationFrame(recLoop);
  }

  /* 切回前台时把墙钟基准拨正，否则静音兜底的字幕会快进 */
  function recVis() {
    if (document.hidden) { recHideAt = performance.now(); return; }
    var gap = recHideAt ? performance.now() - recHideAt : 0;
    recHideAt = 0;
    if (!recOn) return;
    if (audio && audio.currentTime && !audio.paused) recStartAt = performance.now() - audio.currentTime * 1000;
    else if (recMuted) recStartAt += gap;     // 静音兜底：后台那段时间不算进去
  }

  /* 静音兜底时，首次点击只用来开声音，不跳过 */
  function recFirstTap() {
    if (!recMuted || !audio) return false;
    recMuted = false;
    if (recHint) recHint.textContent = REC_HINT;
    // 画面已经按墙钟走了几秒，把音频对齐过去，免得一开声就跳回篇名
    var walked = (performance.now() - recStartAt) / 1000;
    if (audio.currentTime < 0.05 && walked > 0.35 && (!recDur || walked < recDur - 0.6)) {
      try { audio.currentTime = walked; } catch (e) {}
    }
    var q = audio.play();
    if (q && q.catch) q.catch(function () {});
    return true;
  }

  function play(i, dwell) {
    build();
    if (!DATA.length) return;
    i = ((i | 0) % DATA.length + DATA.length) % DATA.length;
    cur = i;
    lastPick = i;
    markShown(i);                  // 诗目里点过的也算展过

    clearRun();
    cancelClose();
    clearRecite();                 // 从朗读切回纸面：停音频、撤红底
    el.classList.add('on');
    document.documentElement.style.overflow = 'hidden';
    void el.offsetWidth;          // 先落一次布局，让淡入真的过渡起来
    el.classList.add('in');
    el.querySelector('.mp-bar').classList.remove('on');
    metaEl.classList.remove('on');
    el.querySelector('.mp-seal').classList.remove('on');
    colsEl.classList.remove('out');   // 上次淡出残留会让整幅透明 —— 只剩背景，字全不见
    colsEl.style.opacity = '';

    var seq = render(DATA[i]);
    var n = seq.length;
    // 这一首若有朗读音频，操作条给出「朗读」入口
    var recBtn = el.querySelector('.mp-b-rec');
    if (recBtn) recBtn.style.display = reciteOf(DATA[i]) ? '' : 'none';

    // 逐字：整篇 3 秒到 6.5 秒之间，短篇慢一点、长篇略快，但不至于一闪而过
    var step = Math.max(52, Math.min(130, 6300 / Math.max(1, n)));
    var k = 0;

    function tick() {
      if (k < n) {
        var idx = k++;
        seq[idx].classList.add('on');
        if (scrollMode) {
          var ci = colStarts.indexOf(idx);
          if (ci >= 0) maybePan(colEls[ci]);
        }
        timers.push(setTimeout(tick, step));
        return;
      }
      // 全篇显完：题款、印章、操作条依次浮出，停住让人看
      metaEl.classList.add('on');
      el.querySelector('.mp-seal').classList.add('on');
      el.querySelector('.mp-bar').classList.add('on');
      // 朗读结束转过来的，多停留（整篇要读得完）；随手浏览的，短一些
      var hold = dwell ? Math.min(18000, 4200 + n * 110) : Math.min(6800, 2600 + n * 32);
      timers.push(setTimeout(function () {
        colsEl.classList.add('out');
        metaEl.classList.remove('on');
        el.querySelector('.mp-seal').classList.remove('on');
        el.querySelector('.mp-bar').classList.remove('on');
        timers.push(setTimeout(close, 1200));
      }, hold));
    }
    tick();
  }

  /* ---------- 展阅轮转：一首不重复地走完全部，走完再重开一轮 ---------- */
  function markShown(i) {
    if (i >= 0 && i < DATA.length && !shown[i]) { shown[i] = 1; shownN++; }
  }

  function reshuffle() {
    bag = [];
    for (var i = 0; i < DATA.length; i++) bag.push(i);
    for (var j = bag.length - 1; j > 0; j--) {
      var k = (Math.random() * (j + 1)) | 0, t = bag[j]; bag[j] = bag[k]; bag[k] = t;
    }
    bagAt = 0;
  }

  /* 取下一首没展过的；全展过就整轮重开。avoid 用来避免连着两首相同 */
  function nextUnseen(avoid) {
    if (!DATA.length) return 0;
    if (DATA.length === 1) return 0;
    if (shownN >= DATA.length) { shown = {}; shownN = 0; reshuffle(); }   // 一轮走完 → 重新开始
    if (bagAt >= bag.length) reshuffle();

    var pick = -1, guard = 0;
    while (bagAt < bag.length && guard++ < DATA.length * 2) {
      var c = bag[bagAt++];
      if (shown[c]) continue;
      if (avoid >= 0 && c === avoid && shownN < DATA.length - 1) continue;
      pick = c; break;
    }
    if (pick < 0) {                                   // 兜底：本轮只剩刚看过的那首
      for (var m = 0; m < DATA.length; m++) {
        if (!shown[m] && m !== avoid) { pick = m; break; }
      }
    }
    if (pick < 0) { shown = {}; shownN = 0; reshuffle(); pick = bag[bagAt++]; }
    markShown(pick);
    return pick;
  }

  /* 换一首：走轮转（不重复），安静纸面，不会突然出声 */
  function playRandom() {
    if (!DATA.length) return;
    if (DATA.length === 1) { play(0); return; }
    play(nextUnseen(lastPick));
  }

  function close() {
    if (!el) return;
    clearRun();
    clearRecite();
    cancelClose();
    el.classList.remove('in');
    document.documentElement.style.overflow = '';
    closeTimer = setTimeout(function () {
      closeTimer = 0;
      el.classList.remove('on');
      listEl.classList.remove('on');
      colsEl.innerHTML = '';
      colsEl.classList.remove('out');
      colsEl.style.opacity = '';
    }, 600);
  }

  /* 点「诗」进来：
   *   本页第一次  → 朗读指定的《贺新郎·读史》（原片音轨），读完转纸面全文；
   *   以后每一次  → 从没展过的篇目里随机取一首，展过的不重复，67 首走完再重开一轮；
   *                轮到有原声的那几首就朗读，其余安静走纸面。 */
  function openIntro() {
    build();
    if (!DATA.length) return;

    if (!introDone) {
      introDone = true;
      var intro = -1;
      for (var i = 0; i < DATA.length; i++) {
        if (DATA[i].t === INTRO_POEM && reciteOf(DATA[i])) { intro = i; break; }
      }
      if (intro >= 0) { markShown(intro); reciteStart(intro); return; }
    }

    var k = nextUnseen(lastPick);
    if (reciteOf(DATA[k])) reciteStart(k);
    else play(k);
  }

  return {
    open: openIntro,
    openList: function () {
      build();
      cancelClose();
      el.classList.add('on');
      document.documentElement.style.overflow = 'hidden';
      requestAnimationFrame(function () { el.classList.add('in'); });
      showList();
    },
    play: play,
    recite: reciteStart,
    random: playRandom,
    close: close,
    data: DATA,
    recites: RECITES,
    /* 轮转状态（调试/回归用） */
    state: function () { return { shownN: shownN, lastPick: lastPick, introDone: introDone, cur: cur }; }
  };
})();
