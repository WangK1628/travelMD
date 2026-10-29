/* ══════════════════════════════════════════════════════════
   毛主席 · 入场仪式（红底版）
   朱红虚影浮现 → 完整《沁园春·长沙》渐显为底 → 红底画像升起放大
   → 「人民万岁」题款与语录弹幕同屏 → 收束回红底首屏
   弹幕：Canvas 绘制，上千条同屏右→左，掠过画像时被人物挡住
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* 《毛主席语录》原文 + 上世纪群众口号，重复刷屏用 */
  var QUOTES = [
    /* ── 红宝书 ── */
    '领导我们事业的核心力量是中国共产党',
    '指导我们思想的理论基础是马克思列宁主义',
    '谁是我们的敌人？谁是我们的朋友？',
    '革命不是请客吃饭',
    '星星之火，可以燎原',
    '枪杆子里面出政权',
    '一切反动派都是纸老虎',
    '战略上藐视敌人，战术上重视敌人',
    '政策和策略是党的生命',
    '没有调查，就没有发言权',
    '从群众中来，到群众中去',
    '人民，只有人民，才是创造世界历史的动力',
    '全心全意为人民服务',
    '为人民利益而死，就比泰山还重',
    '人固有一死，或重于泰山，或轻于鸿毛',
    '下定决心，不怕牺牲，排除万难，去争取胜利',
    '愚公移山，改造中国',
    '自力更生，艰苦奋斗',
    '自己动手，丰衣足食',
    '谦虚使人进步，骄傲使人落后',
    '世界上怕就怕「认真」二字',
    '团结、紧张、严肃、活泼',
    '一切从实际出发',
    '实事求是',
    '没有正确的政治观点，就等于没有灵魂',
    '政治是统帅，是灵魂',
    '兵民是胜利之本',
    '军民团结如一人，试看天下谁能敌',
    '深挖洞，广积粮，不称霸',
    '备战、备荒、为人民',
    '抓革命，促生产',
    '抓而不紧，等于不抓',
    '农业学大寨',
    '工业学大庆',
    '全国学人民解放军',
    '向雷锋同志学习',
    '一不怕苦，二不怕死',
    '毫不利己，专门利人',
    '好好学习，天天向上',
    '发展体育运动，增强人民体质',
    '救死扶伤，实行革命的人道主义',
    '百花齐放，百家争鸣',
    '古为今用，洋为中用',
    '中国人民有志气',
    '中国人民从此站起来了',
    '中华人民共和国万岁',
    '世界人民大团结万岁',
    '丢掉幻想，准备斗争',
    '知识青年到农村去',
    '农村是一个广阔的天地',
    '千万不要忘记阶级斗争',
    '凡是敌人反对的，我们就要拥护',
    '思想上政治上的路线正确与否是决定一切的',
    '我们应当相信群众，我们应当相信党',
    '群众是真正的英雄',
    '一切结论产生于调查情况的末尾',
    '没有重点就没有政策',
    '党委要管大事',
    '军民一致，军政一致',
    '瓦解敌军，宽待俘虏',
    '敌进我退，敌驻我扰，敌疲我打，敌退我追',
    '十六字诀',
    '不打无准备之仗',
    '集中优势兵力，各个歼灭敌人',
    '伤其十指不如断其一指',
    '存人失地，人地皆存',
    '星星之火，可以燎原',
    '中国革命战争的战略问题',
    '论持久战',
    '矛盾论',
    '实践论',
    '反对本本主义',
    '改造我们的学习',
    '整顿党的作风',
    '反对党八股',
    '论联合政府',
    '新民主主义论',
    '在延安文艺座谈会上的讲话',
    '文艺为人民服务',
    '为什么人的问题，是一个根本的问题',
    '知识分子要和工农兵结合',
    /* ── 群众口号 ── */
    '人民万岁',
    '毛主席万岁',
    '战无不胜的毛泽东思想万岁',
    '大海航行靠舵手',
    '东方红，太阳升',
    '太阳最红，毛主席最亲',
    '爹亲娘亲不如毛主席亲',
    '天大地大不如党的恩情大',
    '敬祝毛主席万寿无疆',
    '毛主席挥手我前进',
    '读毛主席的书，听毛主席的话',
    '毛主席的书我最爱读',
    '做毛主席的好战士',
    '永远忠于毛主席',
    '毛主席的恩情比海深',
    '沿着毛主席革命路线前进',
    '一颗红心向着党',
    '翻身不忘共产党',
    '吃水不忘挖井人',
    '幸福不忘毛主席',
    '一轮红日从韶山升起',
    '韶山升起红太阳',
    '红太阳照边疆',
    '唱支山歌给党听',
    '北京的金山上',
    '我爱北京天安门',
    '社员都是向阳花',
    '咱们的领袖毛泽东',
    '毛主席来到咱农庄',
    '抓革命促生产促工作促战备',
    '学习雷锋好榜样',
    '工业学大庆',
    '农业学大寨',
    '兴无灭资',
    '破四旧，立四新',
    '造反有理',
    '拿起笔做刀枪',
    '战天斗地',
    '人定胜天',
    '愚公移山',
    '艰苦奋斗',
    '多快好省',
    '鼓足干劲，力争上游',
    '大跃进万岁',
    '人民公社万岁',
    '总路线万岁',
    '三面红旗万岁',
    '无产阶级文化大革命万岁',
    '红卫兵万岁',
    '无产阶级专政下继续革命',
    '斗私批修',
    '一打三反',
    /* ── 今天的怀念 ── */
    '这盛世，如您所愿',
    '今日之中国，如您所愿',
    '公者千古',
    '我们怀念您',
    '山河已无恙',
    '缅怀伟人',
    '您是人民的大救星',
    '您的思想永放光芒',
    '没有毛主席就没有新中国',
    '中国出了个毛泽东'
  ];

  var IMGS = {
    ghost: 'images/mao-shadow-soft.png',
    plate: 'images/mao-plate.png',
    poem: 'images/mao-poem.png'
  };

  var CSS = [
    '.mc{position:fixed;inset:0;z-index:2000;overflow:hidden;isolation:isolate;',
    'background:#1a0403;opacity:0;transition:opacity .85s ease;pointer-events:none;touch-action:none}',
    '.mc.on{opacity:1;pointer-events:auto}',
    '.mc-bg{position:absolute;inset:-6%;',
    'background:radial-gradient(60% 64% at 60% 42%,#cf321d 0%,#9e180e 30%,#5a0d08 62%,#200403 100%);',
    'opacity:0;transition:opacity 2.6s ease}',
    '.mc-bg.on{opacity:1}',
    /* 诗词底：只动 opacity，不再做 9 秒 scale（大图逐帧栅格化是掉帧源头） */
    '.mc-poem{position:absolute;inset:0;z-index:1;background:url(' + IMGS.poem + ') center/contain no-repeat;',
    'opacity:0;transition:opacity 2.8s ease}',
    '.mc-poem.on{opacity:.17}',
    '.mc-poem.dim{opacity:.08;transition:opacity 2.4s ease}',
    '.mc-veil{position:absolute;inset:0;pointer-events:none;z-index:2;',
    'background:radial-gradient(72% 72% at 50% 46%,rgba(20,3,2,0) 34%,rgba(16,3,2,.38) 74%,rgba(10,2,1,.82) 100%)}',
    '.mc-ghost{position:absolute;left:50%;top:50%;height:98vh;width:auto;max-width:none;',
    'transform:translate(-50%,-50%) scale3d(1.14,1.14,1);opacity:0;',
    'transition:opacity 2.2s ease,transform 6s cubic-bezier(.16,.6,.3,1);will-change:transform,opacity}',
    '.mc-ghost.in{opacity:.92;transform:translate(-50%,-50%) scale3d(1.02,1.02,1)}',
    '.mc-ghost.away{opacity:0;transform:translate(-50%,-50%) scale3d(1.06,1.06,1)}',
    '.mc-subject{position:absolute;left:50%;top:50%;height:74vh;width:auto;max-width:none;z-index:5;',
    'transform:translate(-50%,-50%) translate3d(var(--dx,0px),0,0) scale3d(var(--s,.92),var(--s,.92),1);',
    'opacity:0;transition:opacity 1.5s ease,transform 3s cubic-bezier(.19,.9,.26,1);will-change:transform,opacity}',
    '.mc-subject.in{opacity:1;--s:1}',
    '.mc-subject.zoom{--s:1.27;transition:opacity 1.2s ease,transform 4.2s cubic-bezier(.32,.02,.28,1)}',
    '.mc-subject.settle{--s:.94;--dx:17vw;transition:opacity 1s ease,transform 2.6s cubic-bezier(.28,.8,.3,1)}',
    '.mc-subject.out{--s:.88;--dx:17vw;opacity:0;transition:opacity 1.5s ease,transform 2.4s cubic-bezier(.4,.6,.5,1)}',
    /* 弹幕层：整块在画像之下，飘过人脸时被人物遮住 */
    '.mc-dm{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:3;contain:paint}',
    '.mc-dm canvas{display:block;width:100%;height:100%}',
    /* 「人民万岁」题款：与弹幕同屏，竖排单列 */
    '.mc-word{position:absolute;left:7.5%;top:50%;z-index:8;pointer-events:none;',
    'transform:translateY(-50%) translateX(-16px);opacity:0;',
    'writing-mode:vertical-rl;white-space:nowrap;height:max-content;min-height:0;max-height:none;',
    'font-family:var(--kai,"STKaiti",serif);font-weight:600;',
    'font-size:clamp(34px,3.6vw,62px);letter-spacing:.24em;line-height:1.05;',
    'color:#ffe8c2;text-shadow:0 0 5px #000,0 0 12px #000,0 0 26px rgba(0,0,0,.92),0 0 46px rgba(214,64,38,.6);',
    'transition:opacity 1.4s ease,transform 1.8s cubic-bezier(.2,.9,.3,1)}',
    '.mc-word::before{content:"";position:absolute;left:-46%;top:-10%;width:200%;height:120%;z-index:-1;',
    'background:radial-gradient(closest-side,rgba(14,2,1,.86),rgba(14,2,1,.46) 58%,transparent 100%);',
    'filter:blur(8px);pointer-events:none}',
    '.mc-word.on{opacity:1;transform:translateY(-50%) translateX(0)}',
    '.mc-word::after{content:"";position:absolute;right:-26px;top:6px;bottom:6px;width:1px;',
    'background:linear-gradient(180deg,transparent,rgba(238,186,128,.55) 18%,rgba(238,186,128,.55) 82%,transparent)}',
    '.mc-word b{position:absolute;right:-46px;bottom:-6px;width:30px;height:30px;border-radius:3px;',
    'display:grid;place-items:center;background:linear-gradient(145deg,#c8402f,#8c1b14);color:#fff0dd;',
    'font-size:13px;font-weight:400;letter-spacing:0;transform:rotate(-4deg);',
    'box-shadow:0 4px 12px rgba(0,0,0,.55),inset 0 0 0 2px rgba(255,225,200,.3)}',
    '.mc-skip{position:absolute;right:clamp(14px,2.4vw,30px);top:clamp(14px,2.4vw,28px);z-index:20;',
    'padding:7px 15px;border-radius:999px;font-size:11.5px;letter-spacing:.16em;color:rgba(246,232,212,.62);',
    'border:1px solid rgba(246,232,212,.22);background:rgba(18,6,4,.72);',
    'cursor:pointer;transition:.25s}',
    '.mc-skip:hover{color:#fff;border-color:rgba(246,232,212,.5);background:rgba(140,26,18,.5)}',
    '.mc-cap{position:absolute;left:clamp(18px,3vw,44px);bottom:clamp(18px,3.4vw,42px);z-index:7;',
    'opacity:0;transform:translateY(8px);transition:opacity 1.6s ease .4s,transform 1.6s ease .4s;',
    'font-family:var(--song,serif);color:rgba(242,222,196,.6);letter-spacing:.3em;font-size:11px;line-height:2}',
    '.mc-cap.on{opacity:1;transform:none}',
    '.mc-cap b{display:block;font-family:var(--kai,serif);font-size:clamp(15px,1.5vw,19px);',
    'letter-spacing:.34em;color:rgba(248,232,206,.88);font-weight:600;margin-bottom:2px}',
    /* ── 竖屏 / 手机 ── */
    '@media (max-width:767px){',
    '.mc-bg{inset:-10%;background:radial-gradient(76% 54% at 58% 38%,#cf321d 0%,#a01a0f 32%,#5a0d08 64%,#1c0403 100%)}',
    '.mc-poem{background-size:auto 58%;background-position:center 30%}',
    '.mc-ghost{height:74vh}',
    '.mc-subject{height:50vh;top:47%}',
    '.mc-subject.zoom{--s:1.26}',
    '.mc-subject.settle{--s:.99;--dx:4vw}',
    '.mc-subject.out{--s:.9;--dx:4vw}',
    '.mc-word{left:5.5%;top:auto;bottom:16%;transform:translateX(-12px);',
    'font-size:clamp(30px,8.6vw,40px);letter-spacing:.16em;line-height:1.02}',
    '.mc-word.on{transform:none}',
    '.mc-word::before{left:-58%;top:-12%;width:216%;height:124%;',
    'background:radial-gradient(closest-side,rgba(10,2,1,.94),rgba(10,2,1,.62) 56%,transparent 100%)}',
    '.mc-word::after{right:-18px;top:4px;bottom:4px}',
    '.mc-word b{right:auto;left:-2px;bottom:-38px;width:26px;height:26px;font-size:11px}',
    '.mc-cap{left:16px;bottom:14px;letter-spacing:.22em;font-size:9.5px}',
    '.mc-cap b{font-size:13px;letter-spacing:.26em}',
    '.mc-skip{right:12px;top:12px;padding:6px 12px;font-size:10.5px}',
    '}'
  ].join('');

  var T = {};
  var root = null, played = false, running = false;

  function clearTimers() { Object.keys(T).forEach(function (k) { clearTimeout(T[k]); }); T = {}; }
  function at(ms, fn) { T['t' + ms + '_' + Math.random()] = setTimeout(fn, ms); }

  function build() {
    var d = document.createElement('div');
    d.className = 'mc';
    d.setAttribute('aria-hidden', 'true');
    d.innerHTML =
      '<div class="mc-bg"></div>' +
      '<div class="mc-poem"></div>' +
      '<img class="mc-ghost" src="' + IMGS.ghost + '" alt="">' +
      '<div class="mc-veil"></div>' +
      '<img class="mc-subject" src="' + IMGS.plate + '" alt="">' +
      '<div class="mc-dm"></div>' +
      '<div class="mc-word">人民万岁<b>毛</b></div>' +
      '<div class="mc-cap"><b>沁园春 · 长沙</b>一九二五年 · 独立寒秋，湘江北去</div>' +
      '<button class="mc-skip" type="button">跳过 ▸</button>';
    return d;
  }

  /* ────────────────────────────────────────────────
     弹幕引擎（Canvas）
     - 上千条实例同屏，右 → 左滑行，出画即回收
     - 文字预渲染成位图，只做 drawImage，几乎不吃 CPU
     ──────────────────────────────────────────────── */
  function Danmaku(layer) {
    var MOBILE = window.matchMedia('(max-width: 767px)').matches;

    var cv = document.createElement('canvas');
    layer.appendChild(cv);
    var ctx = cv.getContext('2d', { alpha: true });

    // 位图缩放：手机 1.5（字够清楚），桌面 1（1 CSS px = 1 位图像素，drawImage 是纯 blit）
    var SCALE = 1;
    var W = 1, H = 1;

    // 长句在窄画面上必然压成一团，也最吃填充率：手机上只留 ≤14 字，桌面 ≤18 字
    var POOL = QUOTES.filter(function (q) { return q.length <= (MOBILE ? 14 : 18); });

    var FONT = '"STKaiti","KaiTi","Songti SC",serif';
    var sprites = {}, spriteKeys = 0;
    var CACHE_MAX = MOBILE ? 340 : 660;
    var measure = document.createElement('canvas').getContext('2d');

    function sprite(text, size, color) {
      size = Math.round(size);
      var key = text + '|' + size + '|' + color;
      var s = sprites[key];
      if (s) return s;

      measure.font = '600 ' + size + 'px ' + FONT;
      var tw = Math.ceil(measure.measureText(text).width);
      var pad = Math.ceil(size * 0.28);
      var w = tw + pad * 2;
      var h = Math.ceil(size * 1.46) + pad;

      var c = document.createElement('canvas');
      c.width = Math.max(1, Math.round(w * SCALE));
      c.height = Math.max(1, Math.round(h * SCALE));
      var g = c.getContext('2d');
      g.setTransform(SCALE, 0, 0, SCALE, 0, 0);
      g.font = '600 ' + size + 'px ' + FONT;
      g.textBaseline = 'middle';
      g.textAlign = 'left';
      g.lineJoin = 'round';
      g.miterLimit = 2;

      var bx = pad, by = h * 0.5;
      // 两层描边替代 shadowBlur：创建快 3~5 倍，视觉几乎一致
      g.strokeStyle = 'rgba(36,7,4,.42)';
      g.lineWidth = size * 0.36;
      g.strokeText(text, bx, by);
      g.strokeStyle = 'rgba(22,3,2,.95)';
      g.lineWidth = size * 0.16;
      g.strokeText(text, bx, by);
      g.fillStyle = color;
      g.fillText(text, bx, by);

      s = { c: c, w: w, h: h };
      if (spriteKeys < CACHE_MAX) { sprites[key] = s; spriteKeys++; }
      return s;
    }

    var TIERS = null;

    function tiers() {
      if (TIERS) return TIERS;
      var base = MOBILE
        ? Math.min(13, Math.max(11, W * 0.0305))
        : Math.min(19, Math.max(14, W * 0.0106));
      TIERS = MOBILE ? [
        { s: base * 1.34, c: '#ffd792' },
        { s: base * 1.00, c: '#fdf1de' }
      ] : [
        { s: base * 1.55, c: '#ffd792' },
        { s: base * 1.16, c: '#ffd792' },
        { s: base * 1.02, c: '#ff9b82' },
        { s: base * 0.92, c: '#fdf1de' }
      ];
      return TIERS;
    }

    /* 像素预算：弹幕的开销 ≈ 画布面积 × 条数。
       分辨率按窗口面积反推，条数同步缩放，大屏小屏负载基本一致。 */
    function budget() { return 1.28e6 / Math.max(1, W * H); }

    function autoScale() {
      if (MOBILE) return Math.min(1.5, Math.max(1, window.devicePixelRatio || 1));
      return Math.min(1, Math.max(0.68, 0.77 * Math.sqrt(Math.min(1.6, budget()))));
    }

    function autoCount() {
      if (MOBILE) return 180;
      return Math.round(300 * Math.min(1.15, Math.max(0.62, budget())));
    }

    function resize() {
      W = layer.clientWidth || window.innerWidth;
      H = layer.clientHeight || window.innerHeight;
      SCALE = autoScale();
      cv.width = Math.round(W * SCALE);
      cv.height = Math.round(H * SCALE);
      ctx.imageSmoothingEnabled = false;   // 重设画布尺寸会重置上下文状态
      TIERS = null;
    }
    resize();

    var items = [];
    var raf = 0, last = 0, alive = false;

    function speed() {
      return MOBILE ? W * 0.15 + Math.random() * W * 0.17
                    : 190 + Math.random() * 210;      // px/s
    }

    // 生成一批弹幕实例，x 分布在屏外到屏内，保证一开场就满屏
    var laneSeed = 0;

    function seed(count) {
      var tl = tiers();
      var maxH = 0, t;
      for (t = 0; t < tl.length; t++) {
        maxH = Math.max(maxH, Math.ceil(tl[t].s * 1.46) + Math.ceil(tl[t].s * 0.28));
      }
      // 行距按字高算，绝不小于单条精灵高度，避免上下行叠字
      var laneH = Math.max(maxH * 1.1, H / (MOBILE ? 26 : 34));
      var lanes = Math.max(6, Math.floor((H - laneH * 0.35) / laneH));

      for (var i = 0; i < count; i++) {
        var tier = tl[(Math.random() * tl.length) | 0];
        var q = POOL[(Math.random() * POOL.length) | 0];
        var sp = sprite(q, Math.round(tier.s), tier.c);
        // 起始位置：一多半已在屏内，其余在右侧排队入场
        var x = Math.random() < 0.62
          ? -sp.w + Math.random() * (W + sp.w)
          : W + 8 + Math.random() * W * 0.5;
        var lane = (i + laneSeed++) % lanes;
        items.push({
          x: x,
          y: laneH * 0.6 + lane * laneH + (Math.random() - 0.5) * laneH * 0.14,
          v: speed(),
          spr: sp,
          alpha: 0.72 + Math.random() * 0.28
        });
      }
      // 按出场顺序画：靠右的后画，避免压住已在屏内的
      items.sort(function (a, b) { return a.x - b.x; });
    }

    var accT = 0, accN = 0, thinned = 0;

    // 设备顶不住时逐步抽稀，宁可少几条也不掉帧
    function thin() {
      var keep = [];
      for (var i = 0; i < items.length; i++) if (i % 4) keep.push(items[i]);
      items = keep;
    }

    function frame(ts) {
      if (!alive) return;
      var raw = last ? (ts - last) / 1000 : 0.016;
      var dt = Math.min(0.05, raw);
      last = ts;

      accT += Math.min(0.25, raw); accN++;
      if (accN >= 40) {
        if (accN / accT < 48 && thinned < 3) { thin(); thinned++; }
        accT = 0; accN = 0;
      }

      var cw = cv.width, ch = cv.height;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, cw, ch);

      var keep = 0, n = items.length;
      for (var i = 0; i < n; i++) {
        var it = items[i];
        it.x -= it.v * dt;
        if (it.x + it.spr.w < -6) continue;         // 已滑出左侧，回收
        items[keep++] = it;
        if (it.x > W + 2) continue;
        ctx.globalAlpha = it.alpha;
        // 位图与画布同为设备像素，1:1 落点、三参数绘制（不缩放），纯 blit
        ctx.drawImage(it.spr.c, (it.x * SCALE) | 0, ((it.y - it.spr.h * 0.5) * SCALE) | 0);
      }
      items.length = keep;
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }

    /* 预烘焙：把用到的「语录 × 字号」全部提前画成位图。
       放在开场前空闲时段分片做，避免播到一半才创建画布造成顿挫。 */
    function prewarm() {
      var tl = tiers(), jobs = [], i, j;
      for (i = 0; i < POOL.length; i++) {
        for (j = 0; j < tl.length; j++) jobs.push([POOL[i], Math.round(tl[j].s), tl[j].c]);
      }
      var k = 0;
      (function step() {
        var t0 = performance.now();
        while (k < jobs.length && performance.now() - t0 < 6) {
          var job = jobs[k++];
          sprite(job[0], job[1], job[2]);
        }
        if (k < jobs.length) setTimeout(step, 26);
      })();
    }

    return {
      prewarm: prewarm,
      start: function (count) {
        count = count || autoCount();
        // 二次铺量：先撒一批，接下来几秒内继续补，形成"越滚越密"的瀑布
        seed(Math.round(count * 0.58));
        var t0 = Date.now();
        var timer = setInterval(function () {
          if (!alive) { clearInterval(timer); return; }
          var left = count - items.length;
          if (left <= 0) { clearInterval(timer); return; }
          seed(Math.min(Math.ceil(left * 0.5), Math.round(count * 0.12)));
          if (Date.now() - t0 > 4200) clearInterval(timer);
        }, 260);
        alive = true;
        last = 0;
        raf = requestAnimationFrame(frame);
      },
      stop: function () {
        alive = false;
        cancelAnimationFrame(raf);
        items = [];
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, cv.width, cv.height);
      },
      count: function () { return items.length; }
    };
  }
  function finish(immediate) {
    if (!root) return;
    running = false;
    clearTimers();
    var el = root;
    root = null;
    if (el.__dm) el.__dm.stop();
    if (immediate) {
      el.remove();
      document.body.classList.remove('lock');
      return;
    }
    el.classList.remove('on');
    setTimeout(function () {
      el.remove();
      document.body.classList.remove('lock');
    }, 900);
  }

  /* 预加载：素材没到位就开演，会看到图片后到、动画跳变 */
  function preload(cb) {
    var keys = Object.keys(IMGS), left = keys.length, done = false;
    var go = function () { if (!done && --left <= 0) { done = true; cb(); } };
    keys.forEach(function (k) {
      var im = new Image();
      // 解码也提前做掉：否则第一帧出现时主线程要同步解码上百万像素的 PNG，正好卡在动画中段
      im.onload = function () {
        if (im.decode) im.decode().then(go, go); else go();
      };
      im.onerror = go;
      im.src = IMGS[k];
    });
    setTimeout(function () { if (!done) { done = true; cb(); } }, 2600);
  }

  function start() {
    if (!document.getElementById('mc-style')) {
      var st = document.createElement('style');
      st.id = 'mc-style';
      st.textContent = CSS;
      document.head.appendChild(st);
    }

    root = build();
    document.body.appendChild(root);
    document.body.classList.add('lock');

    var bg = root.querySelector('.mc-bg');
    var poem = root.querySelector('.mc-poem');
    var ghost = root.querySelector('.mc-ghost');
    var subj = root.querySelector('.mc-subject');
    var word = root.querySelector('.mc-word');
    var cap = root.querySelector('.mc-cap');
    var dmLayer = root.querySelector('.mc-dm');
    var dm = Danmaku(dmLayer);
    root.__dm = dm;
    dm.prewarm();          // 趁开场这几秒把文字位图烘焙好，播到一半不再临时创建

    root.querySelector('.mc-skip').addEventListener('click', function (e) {
      e.stopPropagation();
      finish();
    });
    var esc = function (e) { if (e.key === 'Escape') { document.removeEventListener('keydown', esc); finish(); } };
    document.addEventListener('keydown', esc);

    void root.offsetWidth;
    root.classList.add('on');

    // ① 底光 + 朱红虚影浮现
    at(120, function () { bg.classList.add('on'); });
    at(260, function () { ghost.classList.add('in'); });
    // ② 虚影退去，成背景
    at(1900, function () { ghost.classList.remove('in'); ghost.classList.add('away'); });
    // ③ 完整《沁园春·长沙》渐显为底
    at(2100, function () { poem.classList.add('on'); cap.classList.add('on'); });
    // ④ 红底画像升起
    at(3200, function () { subj.classList.add('in'); });
    // ⑤ 缓缓放大到最大
    at(4600, function () { subj.classList.add('zoom'); poem.classList.add('dim'); });
    // 用完就撤层：留在合成树里的大图即使 opacity 0 仍占显存、仍参与合成
    at(4400, function () { ghost.style.display = 'none'; });
    at(6700, function () { poem.style.display = 'none'; });
    // ⑥ 画像收到右侧，让出左半场
    at(7000, function () { subj.classList.remove('zoom'); subj.classList.add('settle'); });
    // ⑦ 「人民万岁」题款 + 上千条弹幕同屏开始
    at(7500, function () { word.classList.add('on'); cap.classList.remove('on'); });
    at(7900, function () {
      dm.start(0);   // 0 = 按窗口面积自动定条数
    });
    // ⑧ 弹幕滑尽（约 10 秒）→ 收束回红底首屏
    at(17800, function () { word.classList.remove('on'); });
    at(18400, function () { subj.classList.remove('settle'); subj.classList.add('out'); });
    at(19600, function () { finish(); });
  }

  function play(force) {
    if (running || (played && !force)) return;
    played = true;
    running = true;
    preload(function () { if (running) start(); });
  }

  window.MaoCinema = {
    play: function () { play(true); },
    get played() { return played; }
  };
})();
