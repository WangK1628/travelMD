/* 毛泽东生平编年（1893—1976）
 * 数据分四辑存放，这里合并：mao-ch-a（1893—1921）、mao-ch-b（1921—1936）、
 * mao-ch-c（1937—1956）、mao-ch-d（1957—1976）。
 * 每一章：一个年份、一段事略；有历史照片的排照片，没有的排"年份碑"。
 */
window.MAO_CHAPTERS = []
  .concat(window.MAO_CH_A || [])
  .concat(window.MAO_CH_B || [])
  .concat(window.MAO_CH_C || [])
  .concat(window.MAO_CH_D || []);

/* 编年 · 版式 */
(function () {
  if (document.getElementById('mao-ch-style')) return;
  var css = [
    '.mao-ch{margin-top:6px}',
    '.mao-ch-list{display:grid;gap:14px}',
    '.mao-ch-item{display:grid;grid-template-columns:196px 1fr;gap:20px;align-items:start;',
    'padding:14px;border-radius:10px;background:linear-gradient(180deg,rgba(255,253,248,.9),rgba(246,241,230,.55));',
    'border:1px solid rgba(120,80,50,.13);box-shadow:0 10px 26px -20px rgba(60,30,10,.55);',
    'transition:transform .3s cubic-bezier(.2,.8,.3,1),box-shadow .3s,border-color .3s}',
    '.mao-ch-item:hover{transform:translateY(-2px);border-color:rgba(179,52,44,.3);',
    'box-shadow:0 18px 38px -22px rgba(120,30,10,.55)}',
    '.mao-ch-ph{position:relative;border-radius:6px;overflow:hidden;background:#1b1310;',
    'box-shadow:0 8px 20px -12px rgba(0,0,0,.8),inset 0 0 0 1px rgba(255,235,205,.16)}',
    '.mao-ch-ph img{width:100%;height:100%;aspect-ratio:3/4;object-fit:cover;display:block;',
    'filter:contrast(1.02) saturate(1.02)}',
    '.mao-ch-ph--w img{aspect-ratio:4/3}',
    '.mao-ch-ph--w{align-self:start}',
    '.mao-ch-ph::after{content:"";position:absolute;inset:0;pointer-events:none;',
    'background:radial-gradient(120% 90% at 50% 34%,transparent 52%,rgba(26,10,6,.42) 100%)}',
    /* 没有照片的年份：墨底竖排地名，与照片列同宽同高 */
    '.mao-ch-ph--text{aspect-ratio:3/4;display:flex;align-items:center;justify-content:center;',
    'background:radial-gradient(120% 92% at 50% 26%,#4b3629,#181110 74%)}',
    '.mao-ch-ph--text::before{content:"";position:absolute;inset:0;z-index:0;',
    'background:repeating-linear-gradient(90deg,rgba(255,232,196,.05) 0 1px,transparent 1px 8px)}',
    '.mao-ch-key{position:relative;z-index:1;writing-mode:vertical-rl;text-orientation:upright;',
    'font-family:var(--kai,serif);font-size:20px;letter-spacing:.2em;color:rgba(255,243,226,.93);',
    'text-shadow:0 2px 18px rgba(255,186,132,.32)}',
    '.mao-ch-yr{position:absolute;left:0;bottom:0;z-index:2;padding:4px 9px;',
    'font-family:var(--song,serif);font-variant-numeric:tabular-nums;font-size:12px;letter-spacing:.16em;',
    'color:#fff2dd;background:linear-gradient(90deg,rgba(150,26,18,.92),rgba(150,26,18,0))}',
    /* 阶段分组标题 */
    '.mao-g{display:flex;align-items:center;gap:14px;padding:26px 2px 0;margin-bottom:-4px;',
    'font-family:var(--kai,serif);font-size:15.5px;font-weight:600;letter-spacing:.2em;color:#8a3a2c}',
    '.mao-g::after{content:"";flex:1;height:1px;',
    'background:linear-gradient(90deg,rgba(179,52,44,.34),rgba(179,52,44,0))}',
    '.mao-g:first-child{padding-top:4px}',
    '.mao-ch-tx{min-width:0}',
    '.mao-ch-hd{margin:0 0 7px;font-family:var(--kai,serif);font-size:19px;font-weight:600;',
    'color:#7d2319;letter-spacing:.06em;display:flex;align-items:center;gap:9px}',
    '.mao-ch-hd::before{content:"";width:4px;height:15px;border-radius:2px;background:#b3342c;flex:none}',
    '.mao-ch-tx p{margin:0;font-size:14.5px;line-height:2.02;color:#413730;text-align:justify}',
    '.mao-ch-tx figcaption{margin-top:8px;font-size:11.5px;line-height:1.9;color:#8a7a63;',
    'letter-spacing:.04em;border-left:2px solid rgba(179,52,44,.25);padding-left:9px}',
    '@media (max-width:767px){',
    /* 手机：图文改上下排，长文不再挤在窄图旁边 */
    '.mao-ch-item{grid-template-columns:1fr;gap:11px;padding:12px;border-radius:8px}',
    '.mao-ch-ph{width:100%}',
    '.mao-ch-ph img{aspect-ratio:16/9;object-position:50% 30%}',
    '.mao-ch-ph--text{aspect-ratio:auto;height:96px}',
    '.mao-ch-hd{font-size:16px;margin-bottom:5px}',
    '.mao-ch-tx p{font-size:13.5px;line-height:1.95}',
    '.mao-ch-tx figcaption{font-size:10.5px;line-height:1.8}',
    '.mao-ch-key{font-size:15px;letter-spacing:.18em}',
    '.mao-g{font-size:13px;padding-top:20px;letter-spacing:.16em}',
    '}'
  ].join('');
  var st = document.createElement('style');
  st.id = 'mao-ch-style';
  st.textContent = css;
  document.head.appendChild(st);
})();
