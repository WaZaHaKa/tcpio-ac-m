"use strict";var Nagishon=(()=>{var se=Object.defineProperty;var Ot=Object.getOwnPropertyDescriptor;var Pt=Object.getOwnPropertyNames;var Rt=Object.prototype.hasOwnProperty;var It=(e,t)=>{for(var o in t)se(e,o,{get:t[o],enumerable:!0})},Ft=(e,t,o,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of Pt(t))!Rt.call(e,i)&&i!==o&&se(e,i,{get:()=>t[i],enumerable:!(n=Ot(t,i))||n.enumerable});return e};var Dt=e=>Ft(se({},"__esModule",{value:!0}),e);var gn={};It(gn,{get:()=>zt,init:()=>we,version:()=>un});function Ke(e,t){let o=t||document.documentElement;o.setAttribute("data-nagishon-text",String(e.textScale)),o.setAttribute("data-nagishon-contrast",e.contrast);let n=[["data-nagishon-grayscale",e.grayscale],["data-nagishon-links",e.underlineLinks],["data-nagishon-headings",e.highlightHeadings],["data-nagishon-font",e.readableFont],["data-nagishon-spacing",e.textSpacing],["data-nagishon-motion",e.stopMotion],["data-nagishon-cursor",e.bigCursor],["data-nagishon-guide",e.readingGuide]];for(let i=0;i<n.length;i++)n[i][1]?o.setAttribute(n[i][0],""):o.removeAttribute(n[i][0])}function Ue(e=document.documentElement){for(let t of e.getAttributeNames())t.startsWith("data-nagishon-")&&e.removeAttribute(t)}var Gt=/icon|font ?awesome|material|glyph|symbols?|fontello|ionicons/i,ce="data-nagishon-keep-font",le="data-nagishon-font";function _e(){let e=document.documentElement,t=e.hasAttribute(le);t&&e.removeAttribute(le);try{let o=[];document.body.querySelectorAll("*").forEach(n=>{if(n.closest("[data-nagishon-root]"))return;let i=getComputedStyle(n).fontFamily;i&&Gt.test(i)&&o.push(n)}),o.forEach(n=>n.setAttribute(ce,""))}finally{t&&e.setAttribute(le,"")}}function de(){document.querySelectorAll(`[${ce}]`).forEach(e=>e.removeAttribute(ce))}var qe=`/* nagishon global page effects, keyed on html[data-nagishon-*]. The widget host carries
   [data-nagishon-root]; every global rule excludes it (and anything inside it). */

/* ---------- Contrast: dark (black bg / white text / yellow links) ---------- */
html[data-nagishon-contrast="dark"],
html[data-nagishon-contrast="dark"] body {
  background-color: #000 !important;
  color: #fff !important;
}
html[data-nagishon-contrast="dark"] :not(img, video, svg, picture, canvas, iframe, [data-nagishon-root], [data-nagishon-root] *) {
  background-color: #000 !important;
  background-image: none !important;
  color: #fff !important;
  border-color: #fff !important;
  text-shadow: none !important;
  box-shadow: none !important;
}
html[data-nagishon-contrast="dark"] a:not([data-nagishon-root] *),
html[data-nagishon-contrast="dark"] a:not([data-nagishon-root] *) * {
  color: #ffff00 !important;
}
html[data-nagishon-contrast="dark"] a:visited:not([data-nagishon-root] *),
html[data-nagishon-contrast="dark"] a:visited:not([data-nagishon-root] *) * {
  color: #ffc000 !important;
}
html[data-nagishon-contrast="dark"] :focus-visible:not([data-nagishon-root] *) {
  outline: 3px solid #ffff00 !important;
  outline-offset: 2px !important;
}

/* ---------- Contrast: light (white bg / black text / dark-blue links) ---------- */
html[data-nagishon-contrast="light"],
html[data-nagishon-contrast="light"] body {
  background-color: #fff !important;
  color: #000 !important;
}
html[data-nagishon-contrast="light"] :not(img, video, svg, picture, canvas, iframe, [data-nagishon-root], [data-nagishon-root] *) {
  background-color: #fff !important;
  background-image: none !important;
  color: #000 !important;
  border-color: #000 !important;
  text-shadow: none !important;
  box-shadow: none !important;
}
html[data-nagishon-contrast="light"] a:not([data-nagishon-root] *),
html[data-nagishon-contrast="light"] a:not([data-nagishon-root] *) * {
  color: #0000ee !important;
}
html[data-nagishon-contrast="light"] a:visited:not([data-nagishon-root] *),
html[data-nagishon-contrast="light"] a:visited:not([data-nagishon-root] *) * {
  color: #551a8b !important;
}
html[data-nagishon-contrast="light"] :focus-visible:not([data-nagishon-root] *) {
  outline: 3px solid #005a9c !important;
  outline-offset: 2px !important;
}

/* ---------- Grayscale ----------
   filter on <html> creates a containing block for position:fixed descendants (documented trade-off). */
html[data-nagishon-grayscale] {
  filter: grayscale(1);
}

/* ---------- Underline links ---------- */
html[data-nagishon-links] a:not([data-nagishon-root] *) {
  text-decoration: underline !important;
  text-decoration-thickness: 2px !important;
  text-underline-offset: 0.15em !important;
}
html[data-nagishon-links] a:focus-visible:not([data-nagishon-root] *) {
  outline: 3px solid currentColor !important;
  outline-offset: 3px !important;
}

/* ---------- Highlight headings ---------- */
html[data-nagishon-headings] :is(h1, h2, h3, h4, h5, h6):not([data-nagishon-root] *) {
  outline: 2px dashed currentColor !important;
  outline-offset: 4px !important;
  background-color: rgb(255 235 0 / 0.25) !important;
}

/* ---------- Readable font ---------- */
html[data-nagishon-font] :not([data-nagishon-root], [data-nagishon-root] *, [data-nagishon-keep-font], [data-nagishon-keep-font] *, svg *) {
  font-family: Arial, "Helvetica Neue", Helvetica, "Noto Sans Hebrew", "Segoe UI", Roboto, sans-serif !important;
}
html[data-nagishon-font] {
  font-family: Arial, "Helvetica Neue", Helvetica, "Noto Sans Hebrew", "Segoe UI", Roboto, sans-serif !important;
}

/* ---------- Text spacing (WCAG 1.4.12) ---------- */
html[data-nagishon-spacing] :not([data-nagishon-root], [data-nagishon-root] *, svg *) {
  line-height: 1.5 !important;
  letter-spacing: 0.12em !important;
  word-spacing: 0.16em !important;
}
html[data-nagishon-spacing] p:not([data-nagishon-root] *) {
  margin-block-end: 2em !important;
}

/* ---------- Stop motion ---------- */
html[data-nagishon-motion],
html[data-nagishon-motion] *:not([data-nagishon-root], [data-nagishon-root] *),
html[data-nagishon-motion] *:not([data-nagishon-root], [data-nagishon-root] *)::before,
html[data-nagishon-motion] *:not([data-nagishon-root], [data-nagishon-root] *)::after {
  animation: none !important;
  transition: none !important;
  scroll-behavior: auto !important;
}

/* ---------- Skip link ---------- */
.nagishon-skip {
  position: absolute !important;
  inset-block-start: 0;
  inset-inline-start: 0;
  z-index: 2147483647;
  padding-block: 12px;
  padding-inline: 20px;
  background: #0b57d0 !important;
  color: #fff !important;
  font: 600 16px/1.4 Arial, "Noto Sans Hebrew", sans-serif !important;
  letter-spacing: normal !important;
  word-spacing: normal !important;
  text-decoration: underline !important;
  border: 2px solid #fff !important;
  transform: translateY(-200%);
}
.nagishon-skip:focus,
.nagishon-skip:focus-visible {
  transform: none;
  outline: 3px solid #ffbf47 !important;
  outline-offset: 2px;
}
@media (prefers-reduced-motion: no-preference) {
  .nagishon-skip {
    transition: transform 0.15s ease-out;
  }
}

/* ---------- Reading guide (element created by JS) ---------- */
[data-nagishon-root="guide"] {
  position: fixed;
  inset-inline: 0;
  inset-block-start: 0;
  block-size: 12px;
  background: rgb(255 230 0 / 0.35);
  border-block: 2px solid rgb(0 0 0 / 0.6);
  box-sizing: border-box;
  pointer-events: none;
  z-index: 2147483646;
  will-change: transform;
}
`;var Ut='<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path d="M6 3v34l9-8 6 14 6-3-6-13h12z" fill="#000" stroke="#fff" stroke-width="3" stroke-linejoin="round"/></svg>',_t='<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path d="M18 4c-2 0-3 1-3 3v18l-3-3c-2-2-5 0-3 3l8 12c2 4 5 6 9 6h4c6 0 9-4 9-10V22c0-2-1-3-3-3s-3 1-3 3v-3c0-2-1-3-3-3s-3 1-3 3v-3c0-2-1-3-3-3s-3 1-3 3V7c0-2-1-3-3-3z" fill="#000" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/></svg>';function Be(e){return"data:image/svg+xml,"+encodeURIComponent(e).replace(/"/g,"%22").replace(/'/g,"%27")}function je(){let e=Be(Ut),t=Be(_t),o=":not([data-nagishon-root], [data-nagishon-root] *)";return`html[data-nagishon-cursor], html[data-nagishon-cursor] *${o} { cursor: url("${e}") 4 3, auto !important; }
html[data-nagishon-cursor] :is(a[href], button, [role="button"], [role="link"], summary, label, select, input:is([type="button"], [type="submit"], [type="checkbox"], [type="radio"]))${o} { cursor: url("${t}") 18 4, pointer !important; }
`}var ue="nagishon-effects",ge=!1;function We(){let e=document.getElementById(ue);return e||(e=document.createElement("style"),e.id=ue,e.textContent=qe+`
`+je(),(document.head||document.documentElement).appendChild(e),ge=!0),e}function Ve(){ge&&(document.getElementById(ue)?.remove(),ge=!1)}var fe="data-nagishon-paused",pe="video, audio",D=null;function he(e){if(!(!e.hasAttribute("autoplay")&&!e.autoplay)){e.removeAttribute("autoplay"),e.autoplay=!1;try{e.pause()}catch{}e.setAttribute(fe,"")}}function qt(e){e instanceof Element&&(e.closest("[data-nagishon-root]")||(e.matches(pe)&&he(e),e.querySelectorAll(pe).forEach(t=>he(t)),$e(e)))}function $e(e){e.querySelectorAll("marquee").forEach(t=>{t.stop?.()})}function Ye(){document.querySelectorAll(pe).forEach(e=>{e.closest("[data-nagishon-root]")||he(e)}),$e(document),!D&&(D=new MutationObserver(e=>{for(let t of e)t.addedNodes.forEach(qt)}),D.observe(document.body,{childList:!0,subtree:!0}))}function me(){D?.disconnect(),D=null,document.querySelectorAll(`[${fe}]`).forEach(e=>{let t=e;if(t.removeAttribute(fe),t.loop||t.muted)try{t.play()?.catch(()=>{})}catch{}}),document.querySelectorAll("marquee").forEach(e=>{e.start?.()})}var x=null,N=0,Je=0;function Xe(e){e.pointerType!=="touch"&&(Je=e.clientY,!(N||!x)&&(N=requestAnimationFrame(()=>{N=0,x&&(x.style.transform=`translateY(${Math.round(Je-6)}px)`)})))}function Bt(){return typeof matchMedia=="function"?matchMedia("(pointer: fine)").matches:!1}function Qe(){x||!Bt()||(x=document.createElement("div"),x.setAttribute("data-nagishon-root","guide"),x.setAttribute("aria-hidden","true"),x.style.transform="translateY(-100px)",document.body.appendChild(x),document.addEventListener("pointermove",Xe,{passive:!0}))}function be(){document.removeEventListener("pointermove",Xe),N&&cancelAnimationFrame(N),N=0,x?.remove(),x=null}var Ze={launcher:"\u0625\u0645\u0643\u0627\u0646\u064A\u0629 \u0627\u0644\u0648\u0635\u0648\u0644",title:"\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0625\u0645\u0643\u0627\u0646\u064A\u0629 \u0627\u0644\u0648\u0635\u0648\u0644",subtitle:"\u062E\u0635\u0651\u0635\u0648\u0627 \u0627\u0644\u0639\u0631\u0636 \u0628\u0645\u0627 \u064A\u0646\u0627\u0633\u0628\u0643\u0645.",close:"\u0625\u063A\u0644\u0627\u0642 \u0627\u0644\u0642\u0627\u0626\u0645\u0629",textSize:"\u062D\u062C\u0645 \u0627\u0644\u0646\u0635",increase:"\u062A\u0643\u0628\u064A\u0631 \u0627\u0644\u0646\u0635",decrease:"\u062A\u0635\u063A\u064A\u0631 \u0627\u0644\u0646\u0635",contrast:"\u0627\u0644\u062A\u0628\u0627\u064A\u0646",contrastNone:"\u0639\u0627\u062F\u064A",contrastDark:"\u062F\u0627\u0643\u0646",contrastLight:"\u0641\u0627\u062A\u062D",grayscale:"\u062A\u062F\u0631\u0651\u062C \u0627\u0644\u0631\u0645\u0627\u062F\u064A",underlineLinks:"\u062A\u0633\u0637\u064A\u0631 \u0627\u0644\u0631\u0648\u0627\u0628\u0637",highlightHeadings:"\u062A\u0645\u064A\u064A\u0632 \u0627\u0644\u0639\u0646\u0627\u0648\u064A\u0646",readableFont:"\u062E\u0637 \u0645\u0642\u0631\u0648\u0621",textSpacing:"\u062A\u0628\u0627\u0639\u062F \u0627\u0644\u0646\u0635",stopMotion:"\u0625\u064A\u0642\u0627\u0641 \u0627\u0644\u062D\u0631\u0643\u0629",bigCursor:"\u0645\u0624\u0634\u0631 \u0643\u0628\u064A\u0631",readingGuide:"\u0645\u0633\u0637\u0631\u0629 \u0627\u0644\u0642\u0631\u0627\u0621\u0629",reset:"\u0625\u0639\u0627\u062F\u0629 \u0636\u0628\u0637 \u062C\u0645\u064A\u0639 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A",resetDone:"\u062A\u0645\u062A \u0625\u0639\u0627\u062F\u0629 \u0636\u0628\u0637 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A",statement:"\u0628\u064A\u0627\u0646 \u0625\u0645\u0643\u0627\u0646\u064A\u0629 \u0627\u0644\u0648\u0635\u0648\u0644",contact:"\u0627\u0644\u0625\u0628\u0644\u0627\u063A \u0639\u0646 \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u0625\u0645\u0643\u0627\u0646\u064A\u0629 \u0627\u0644\u0648\u0635\u0648\u0644",hotkeyHint:"\u0627\u062E\u062A\u0635\u0627\u0631 \u0644\u0648\u062D\u0629 \u0627\u0644\u0645\u0641\u0627\u062A\u064A\u062D: {hotkey}",skipToContent:"\u062A\u062E\u0637\u064E\u0651 \u0625\u0644\u0649 \u0627\u0644\u0645\u062D\u062A\u0648\u0649 \u0627\u0644\u0631\u0626\u064A\u0633\u064A",on:"\u0645\u0641\u0639\u0651\u0644",off:"\u0645\u062A\u0648\u0642\u0641",announceTextSize:"\u062D\u062C\u0645 \u0627\u0644\u0646\u0635: {value}",announceOn:"{feature} \u0645\u0641\u0639\u0651\u0644",announceOff:"{feature} \u0645\u062A\u0648\u0642\u0641",poweredBy:"\u0628\u064F\u0646\u064A \u0628\u0627\u0633\u062A\u062E\u062F\u0627\u0645 nagishon"};var et={launcher:"Accessibility",title:"Accessibility settings",subtitle:"Adjust the display to your comfort.",close:"Close menu",textSize:"Text size",increase:"Increase text size",decrease:"Decrease text size",contrast:"Contrast",contrastNone:"Normal",contrastDark:"Dark",contrastLight:"Light",grayscale:"Grayscale",underlineLinks:"Underline links",highlightHeadings:"Highlight headings",readableFont:"Readable font",textSpacing:"Text spacing",stopMotion:"Stop motion",bigCursor:"Big cursor",readingGuide:"Reading guide",reset:"Reset all settings",resetDone:"Settings were reset",statement:"Accessibility statement",contact:"Report an accessibility issue",hotkeyHint:"Keyboard shortcut: {hotkey}",skipToContent:"Skip to main content",on:"On",off:"Off",announceTextSize:"Text size: {value}",announceOn:"{feature} on",announceOff:"{feature} off",poweredBy:"Built with nagishon"};var tt={launcher:"\u05E0\u05D2\u05D9\u05E9\u05D5\u05EA",title:"\u05D4\u05EA\u05D0\u05DE\u05D5\u05EA \u05E0\u05D2\u05D9\u05E9\u05D5\u05EA",subtitle:"\u05D4\u05EA\u05D0\u05D9\u05DE\u05D5 \u05D0\u05EA \u05D4\u05EA\u05E6\u05D5\u05D2\u05D4 \u05DC\u05E0\u05D5\u05D7\u05D5\u05EA \u05E9\u05DC\u05DB\u05DD.",close:"\u05E1\u05D2\u05D9\u05E8\u05EA \u05D4\u05EA\u05E4\u05E8\u05D9\u05D8",textSize:"\u05D2\u05D5\u05D3\u05DC \u05D8\u05E7\u05E1\u05D8",increase:"\u05D4\u05D2\u05D3\u05DC\u05EA \u05D8\u05E7\u05E1\u05D8",decrease:"\u05D4\u05E7\u05D8\u05E0\u05EA \u05D8\u05E7\u05E1\u05D8",contrast:"\u05E0\u05D9\u05D2\u05D5\u05D3\u05D9\u05D5\u05EA",contrastNone:"\u05E8\u05D2\u05D9\u05DC\u05D4",contrastDark:"\u05DB\u05D4\u05D4",contrastLight:"\u05D1\u05D4\u05D9\u05E8\u05D4",grayscale:"\u05D2\u05D5\u05D5\u05E0\u05D9 \u05D0\u05E4\u05D5\u05E8",underlineLinks:"\u05D4\u05D3\u05D2\u05E9\u05EA \u05E7\u05D9\u05E9\u05D5\u05E8\u05D9\u05DD",highlightHeadings:"\u05D4\u05D3\u05D2\u05E9\u05EA \u05DB\u05D5\u05EA\u05E8\u05D5\u05EA",readableFont:"\u05D2\u05D5\u05E4\u05DF \u05E7\u05E8\u05D9\u05D0",textSpacing:"\u05E8\u05D9\u05D5\u05D5\u05D7 \u05D8\u05E7\u05E1\u05D8",stopMotion:"\u05E2\u05E6\u05D9\u05E8\u05EA \u05EA\u05E0\u05D5\u05E2\u05D4",bigCursor:"\u05E1\u05DE\u05DF \u05D2\u05D3\u05D5\u05DC",readingGuide:"\u05E1\u05E8\u05D2\u05DC \u05E7\u05E8\u05D9\u05D0\u05D4",reset:"\u05D0\u05D9\u05E4\u05D5\u05E1 \u05DB\u05DC \u05D4\u05D4\u05EA\u05D0\u05DE\u05D5\u05EA",resetDone:"\u05D4\u05D4\u05EA\u05D0\u05DE\u05D5\u05EA \u05D0\u05D5\u05E4\u05E1\u05D5",statement:"\u05D4\u05E6\u05D4\u05E8\u05EA \u05E0\u05D2\u05D9\u05E9\u05D5\u05EA",contact:"\u05D3\u05D9\u05D5\u05D5\u05D7 \u05E2\u05DC \u05D1\u05E2\u05D9\u05D9\u05EA \u05E0\u05D2\u05D9\u05E9\u05D5\u05EA",hotkeyHint:"\u05E7\u05D9\u05E6\u05D5\u05E8 \u05DE\u05E7\u05DC\u05D3\u05EA: {hotkey}",skipToContent:"\u05D3\u05D9\u05DC\u05D5\u05D2 \u05DC\u05EA\u05D5\u05DB\u05DF \u05D4\u05DE\u05E8\u05DB\u05D6\u05D9",on:"\u05E4\u05E2\u05D9\u05DC",off:"\u05DB\u05D1\u05D5\u05D9",announceTextSize:"\u05D2\u05D5\u05D3\u05DC \u05D4\u05D8\u05E7\u05E1\u05D8: {value}",announceOn:"{feature} \u05E4\u05E2\u05D9\u05DC",announceOff:"{feature} \u05DB\u05D1\u05D5\u05D9",poweredBy:"\u05E0\u05D1\u05E0\u05D4 \u05E2\u05DD nagishon"};var nt={launcher:"\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u043E\u0441\u0442\u044C",title:"\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E\u0441\u0442\u0438",subtitle:"\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u0442\u0435 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u043F\u043E\u0434 \u0441\u0435\u0431\u044F.",close:"\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u043C\u0435\u043D\u044E",textSize:"\u0420\u0430\u0437\u043C\u0435\u0440 \u0442\u0435\u043A\u0441\u0442\u0430",increase:"\u0423\u0432\u0435\u043B\u0438\u0447\u0438\u0442\u044C \u0442\u0435\u043A\u0441\u0442",decrease:"\u0423\u043C\u0435\u043D\u044C\u0448\u0438\u0442\u044C \u0442\u0435\u043A\u0441\u0442",contrast:"\u041A\u043E\u043D\u0442\u0440\u0430\u0441\u0442\u043D\u043E\u0441\u0442\u044C",contrastNone:"\u041E\u0431\u044B\u0447\u043D\u0430\u044F",contrastDark:"\u0422\u0451\u043C\u043D\u0430\u044F",contrastLight:"\u0421\u0432\u0435\u0442\u043B\u0430\u044F",grayscale:"\u041E\u0442\u0442\u0435\u043D\u043A\u0438 \u0441\u0435\u0440\u043E\u0433\u043E",underlineLinks:"\u041F\u043E\u0434\u0447\u0451\u0440\u043A\u0438\u0432\u0430\u043D\u0438\u0435 \u0441\u0441\u044B\u043B\u043E\u043A",highlightHeadings:"\u0412\u044B\u0434\u0435\u043B\u0435\u043D\u0438\u0435 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u043E\u0432",readableFont:"\u0427\u0438\u0442\u0430\u0435\u043C\u044B\u0439 \u0448\u0440\u0438\u0444\u0442",textSpacing:"\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u044B \u0432 \u0442\u0435\u043A\u0441\u0442\u0435",stopMotion:"\u041E\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0430 \u0430\u043D\u0438\u043C\u0430\u0446\u0438\u0438",bigCursor:"\u0411\u043E\u043B\u044C\u0448\u043E\u0439 \u043A\u0443\u0440\u0441\u043E\u0440",readingGuide:"\u041B\u0438\u043D\u0435\u0439\u043A\u0430 \u0434\u043B\u044F \u0447\u0442\u0435\u043D\u0438\u044F",reset:"\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0432\u0441\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",resetDone:"\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0441\u0431\u0440\u043E\u0448\u0435\u043D\u044B",statement:"\u0417\u0430\u044F\u0432\u043B\u0435\u043D\u0438\u0435 \u043E \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E\u0441\u0442\u0438",contact:"\u0421\u043E\u043E\u0431\u0449\u0438\u0442\u044C \u043E \u043F\u0440\u043E\u0431\u043B\u0435\u043C\u0435 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E\u0441\u0442\u0438",hotkeyHint:"\u0421\u043E\u0447\u0435\u0442\u0430\u043D\u0438\u0435 \u043A\u043B\u0430\u0432\u0438\u0448: {hotkey}",skipToContent:"\u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u043A \u043E\u0441\u043D\u043E\u0432\u043D\u043E\u043C\u0443 \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u043C\u0443",on:"\u0412\u043A\u043B\u044E\u0447\u0435\u043D\u043E",off:"\u0412\u044B\u043A\u043B\u044E\u0447\u0435\u043D\u043E",announceTextSize:"\u0420\u0430\u0437\u043C\u0435\u0440 \u0442\u0435\u043A\u0441\u0442\u0430: {value}",announceOn:"{feature}: \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u043E",announceOff:"{feature}: \u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D\u043E",poweredBy:"\u0421\u043E\u0437\u0434\u0430\u043D\u043E \u0441 \u043F\u043E\u043C\u043E\u0449\u044C\u044E nagishon"};var ot={he:tt,en:et,ar:Ze,ru:nt},jt=["he","ar"];function xe(e){return typeof e=="string"&&Object.prototype.hasOwnProperty.call(ot,e)?e:"he"}function it(e){return jt.includes(e)?"rtl":"ltr"}function ye(e){return ot[xe(e)]}function at(e,t,o){let n=ye(e)[t];return o?n.replace(/\{(\w+)\}/g,(i,r)=>r in o?String(o[r]):i):n}var G=null,K=null;function rt(e,t="he"){if(ve(),!document.body)return;let o=null;try{o=document.querySelector(e.target)}catch{}if(!o)return;let n=e.target.startsWith("#")&&!/[\s.>[:]/.test(e.target)?e.target:"";n||(o.id||(o.id="nagishon-skip-target"),n="#"+o.id);let i=document.createElement("a");i.href=n,i.className="nagishon-skip",i.setAttribute("data-nagishon-root","skip"),i.textContent=e.label??ye(t).skipToContent,K=r=>{let s=document.querySelector(n);s&&(r.preventDefault(),s.hasAttribute("tabindex")||s.setAttribute("tabindex","-1"),s.focus(),s.scrollIntoView?.({block:"start"}))},i.addEventListener("click",K),document.body.insertBefore(i,document.body.firstChild),G=i}function ve(){G&&K&&G.removeEventListener("click",K),G?.remove(),G=null,K=null}function U(e,t,o,n,i){let r=0,s=()=>{if(n())return;let c=Math.min(r+o,e.length);for(;r<c;r++)t(e[r]);r<e.length?setTimeout(s,0):i?.()};s()}var te="data-nagishon-scaled",Wt=500,Vt=new Set(["SCRIPT","STYLE","NOSCRIPT","TEMPLATE","HEAD","META","LINK","BR","WBR"]),$t=new Set(["INPUT","TEXTAREA","SELECT","BUTTON"]),Z=new WeakMap,m=1,X="elements",M=0,_=null,q=[],C=null,ee=Wt,E=null;function Yt(e){for(let t=e.firstChild;t;t=t.nextSibling)if(t.nodeType===3&&(t.nodeValue??"").trim()!=="")return!0;return!1}function Jt(e){return Vt.has(e.tagName)||e.closest("[data-nagishon-root], svg")?!1:$t.has(e.tagName)||Yt(e)}function Q(e){if(!e||!e.endsWith("px"))return null;let t=parseFloat(e);return Number.isFinite(t)&&t>0?t:null}function st(e){let t=Z.get(e);if(t)return t;let o=getComputedStyle(e),n=Q(o.fontSize);if(n===null)return null;let i=e.parentElement;if(i&&i.hasAttribute(te)&&e.style.getPropertyValue("font-size")===""&&Q(getComputedStyle(i).fontSize)===n)return null;let r={fontSize:n,lineHeight:Q(o.lineHeight),inlineFont:e.style.getPropertyValue("font-size"),inlineFontPriority:e.style.getPropertyPriority("font-size"),inlineLine:e.style.getPropertyValue("line-height"),inlineLinePriority:e.style.getPropertyPriority("line-height")};return Z.set(e,r),r}function lt(e,t){e.style.setProperty("font-size",`${ke(t.fontSize*m)}px`,"important"),t.lineHeight!==null&&e.style.setProperty("line-height",`${ke(t.lineHeight*m)}px`,"important"),e.setAttribute(te,"")}function ke(e){return Math.round(e*1e3)/1e3}function Xt(e){let t=Z.get(e);t&&(t.inlineFont===""?e.style.removeProperty("font-size"):e.style.setProperty("font-size",t.inlineFont,t.inlineFontPriority),t.inlineLine===""?e.style.removeProperty("line-height"):e.style.setProperty("line-height",t.inlineLine,t.inlineLinePriority),Z.delete(e)),e.removeAttribute(te),e.getAttribute("style")===""&&e.removeAttribute("style")}function ct(){document.querySelectorAll(`[${te}]`).forEach(Xt)}function dt(e){return[e,...Array.from(e.querySelectorAll("*"))].filter(Jt)}function Qt(e){let t=++M,o=[],n=new Set;for(let s of e)for(let c of dt(s))n.has(c)||(n.add(c),o.push(c));let i=()=>t!==M,r=[];U(o,s=>{let c=st(s);c&&r.push([s,c])},ee,i,()=>U(r,([s,c])=>lt(s,c),ee,i))}function Zt(){C=null;let e=q.filter(r=>r.isConnected);if(q=[],m===1||e.length===0)return;let t=[],o=new Set;for(let r of e)for(let s of dt(r))o.has(s)||(o.add(s),t.push(s));let n=M,i=[];U(t,r=>{let s=st(r);s&&i.push([r,s])},ee,()=>n!==M||m===1,()=>U(i,([r,s])=>lt(r,s),ee,()=>n!==M||m===1))}function en(){_||(_=new MutationObserver(e=>{for(let t of e)t.addedNodes.forEach(o=>{o instanceof Element&&!o.closest("[data-nagishon-root]")&&q.push(o)});q.length&&C===null&&(C=setTimeout(Zt,0))}),_.observe(document.body,{childList:!0,subtree:!0}))}function ut(){_?.disconnect(),_=null,q=[],C!==null&&clearTimeout(C),C=null}function gt(){let e=document.documentElement;if(m===1){E&&(E.inline===""?e.style.removeProperty("font-size"):e.style.setProperty("font-size",E.inline,E.priority),e.getAttribute("style")===""&&e.removeAttribute("style"),E=null);return}E||(E={px:Q(getComputedStyle(e).fontSize)??16,inline:e.style.getPropertyValue("font-size"),priority:e.style.getPropertyPriority("font-size")}),e.style.setProperty("font-size",`${ke(E.px*m)}px`,"important")}function ft(e,t="elements"){if(t!==X&&(pt(X),X=t),m=e,t==="root"){gt();return}if(e===1){M++,ut(),ct();return}en();let o=[document.body];Qt(o)}function pt(e){let t=m;m=1,e==="root"?gt():(M++,ut(),ct()),m=t}function ht(){pt(X),m=1,E=null}function mt(e,t,o={}){We(),Ke(e),(!t||t.textScale!==e.textScale)&&ft(e.textScale,o.textScaling??"elements"),(!t||t.readableFont!==e.readableFont)&&(e.readableFont?_e():de()),(!t||t.stopMotion!==e.stopMotion)&&(e.stopMotion?Ye():t&&me()),(!t||t.readingGuide!==e.readingGuide)&&(e.readingGuide?Qe():be()),t||o.skipLink&&rt(o.skipLink,o.locale)}function bt(){ht(),de(),me(),be(),ve(),Ue(),Ve()}var Ee=Object.freeze({textScale:1,contrast:"none",grayscale:!1,underlineLinks:!1,highlightHeadings:!1,readableFont:!1,textSpacing:!1,stopMotion:!1,bigCursor:!1,readingGuide:!1}),O=[1,1.25,1.5,1.75,2],B="nagishon:v1";function H(e){let t=e!==null&&typeof e=="object"&&!Array.isArray(e)?e:{},o=[1,1.25,1.5,1.75,2],n=typeof t.textScale=="string"?Number(t.textScale):t.textScale,i=t.contrast==="dark"||t.contrast==="light"?t.contrast:"none";return{textScale:typeof n=="number"&&o.indexOf(n)!==-1?n:1,contrast:i,grayscale:t.grayscale===!0,underlineLinks:t.underlineLinks===!0,highlightHeadings:t.highlightHeadings===!0,readableFont:t.readableFont===!0,textSpacing:t.textSpacing===!0,stopMotion:t.stopMotion===!0,bigCursor:t.bigCursor===!0,readingGuide:t.readingGuide===!0}}var vt=Object.keys(Ee);function tn(e){return vt.every(t=>e[t]===Ee[t])}function Se(e,t){return vt.every(o=>e[o]===t[o])}function xt(e=B){try{let t=localStorage.getItem(e);return t===null?null:H(JSON.parse(t))}catch{return null}}function yt(e,t=B){try{tn(e)?localStorage.removeItem(t):localStorage.setItem(t,JSON.stringify(e))}catch{}}function kt(e=B,t){let o=new Set,n=xt(e)??H({...Ee,...t}),i=()=>o.forEach(s=>s(n)),r=s=>{if(s.key!==null&&s.key!==e)return;let c=s.newValue===null?H(null):xt(e)??H(null);Se(c,n)||(n=c,i())};return window.addEventListener("storage",r),{get:()=>n,set(s){let c=H({...n,...s});return Se(c,n)||(n=c,yt(n,e),i()),n},reset(){let s=H(null),c=!Se(s,n);return n=s,yt(n,e),c&&i(),n},subscribe(s){return o.add(s),()=>o.delete(s)},destroy(){window.removeEventListener("storage",r),o.clear()}}}function nn(){return typeof navigator<"u"&&/Mac|iPhone|iPad|iPod/i.test(navigator.platform||navigator.userAgent||"")}function Le(e){if(typeof e!="string"||!e.trim())return null;let t=e.split("+").map(i=>i.trim()),o=t.pop();if(!o)return e.trim().endsWith("++")?Le(e.trim().slice(0,-1)+"Plus"):null;let n={alt:!1,ctrl:!1,shift:!1,meta:!1,key:o==="Plus"?"+":o.toLowerCase()};for(let i of t)switch(i.toLowerCase()){case"alt":case"option":n.alt=!0;break;case"ctrl":case"control":n.ctrl=!0;break;case"shift":n.shift=!0;break;case"meta":case"cmd":case"command":n.meta=!0;break;case"mod":nn()?n.meta=!0:n.ctrl=!0;break;default:return null}return n}function St(e){let t=Le(e);if(!t)return null;let o=t.key.length===1&&/[a-z]/.test(t.key)?"Key"+t.key.toUpperCase():t.key.length===1&&/\d/.test(t.key)?"Digit"+t.key:"";return n=>n.altKey!==t.alt||n.ctrlKey!==t.ctrl||n.shiftKey!==t.shift||n.metaKey!==t.meta?!1:(n.key||"").toLowerCase()===t.key||o!==""&&n.code===o}function Et(e){let t=Le(e);if(!t)return e;let o=[];return t.ctrl&&o.push("Ctrl"),t.alt&&o.push("Alt"),t.shift&&o.push("Shift"),t.meta&&o.push("Meta"),o.push(t.key.length===1?t.key.toUpperCase():t.key.charAt(0).toUpperCase()+t.key.slice(1)),o.join("+")}var Lt=`/* nagishon widget (Shadow DOM). Logical properties only. */
:host{
  all:initial;position:fixed;inset:0;pointer-events:none;z-index:var(--nagishon-z,2147483000);
  display:block;font:16px/1.5 system-ui,-apple-system,"Segoe UI",Heebo,Arial,sans-serif;
  --bg:var(--nagishon-u-bg,#fff);--surf:var(--nagishon-u-surf,#f4f5f8);--fg:var(--nagishon-u-fg,#111318);
  --mut:#5f6470;--bd:#d9dbe3;--ctl:#737885;--ac:var(--nagishon-u-accent,#0b57d0);--on:var(--nagishon-u-on,#fff);
  --r:var(--nagishon-u-radius,16px);--ls:48px;--tint:color-mix(in srgb,var(--fg) 6%,transparent);
}
:host([data-size="lg"]){--ls:56px}
@media (prefers-color-scheme:dark){
  :host([data-contrast="none"]:not([data-theme="light"])){
    --bg:var(--nagishon-u-bg,#17181c);--surf:var(--nagishon-u-surf,#1f2127);--fg:var(--nagishon-u-fg,#f1f2f6);
    --mut:#b7bbc7;--bd:#353842;--ctl:#8a8f9e;--ac:var(--nagishon-u-accent,#8ab4f8);--on:var(--nagishon-u-on,#17181c);
  }
}
:host([data-contrast="none"][data-theme="dark"]){
  --bg:var(--nagishon-u-bg,#17181c);--surf:var(--nagishon-u-surf,#1f2127);--fg:var(--nagishon-u-fg,#f1f2f6);
  --mut:#b7bbc7;--bd:#353842;--ctl:#8a8f9e;--ac:var(--nagishon-u-accent,#8ab4f8);--on:var(--nagishon-u-on,#17181c);
}
:host([data-contrast="dark"]){--bg:#000;--surf:#000;--fg:#fff;--mut:#fff;--bd:#fff;--ctl:#fff;--ac:#ffeb3b;--on:#000}
*,*::before,*::after{box-sizing:border-box}
[hidden]{display:none!important}
button{font:inherit;color:inherit;background:none;border:0;margin:0;padding:0;cursor:pointer;min-block-size:44px;min-inline-size:44px;
  display:inline-flex;align-items:center;justify-content:center;gap:8px;-webkit-tap-highlight-color:transparent}
a{color:var(--ac);min-block-size:44px;display:inline-flex;align-items:center;text-decoration:underline;text-underline-offset:3px}
:focus-visible{outline:3px solid var(--ac);outline-offset:2px}
svg{inline-size:20px;block-size:20px;flex:none;fill:none;stroke:currentColor;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}
svg.fill{fill:currentColor;stroke:none}
svg.half path{fill:currentColor}
.ico{display:inline-flex;flex:none}

/* Launcher */
.launcher{position:fixed;inset-block-end:var(--ob,20px);inset-inline-start:var(--oi,20px);pointer-events:auto;
  min-block-size:var(--ls);min-inline-size:var(--ls);padding-inline:20px;border-radius:999px;background:var(--ac);color:var(--on);
  font-weight:600;box-shadow:0 6px 20px -6px rgb(0 0 0/.35),inset 0 0 0 1px rgb(255 255 255/.2)}
:host([data-size="lg"]) .launcher{font-size:1.0625em;padding-inline:24px}
.launcher.icon{padding:0;inline-size:var(--ls)}
:host([data-lstyle="neutral"]) .launcher{background:var(--surf,var(--bg));color:var(--fg);box-shadow:0 6px 20px -6px rgb(0 0 0/.35),inset 0 0 0 1px var(--ctl)}
.launcher svg circle{fill:none}
.launcher svg{inline-size:24px;block-size:24px}
.launcher:focus-visible{outline:3px solid var(--fg);outline-offset:2px;box-shadow:0 0 0 2px var(--bg),0 6px 20px -6px rgb(0 0 0/.35)}
:host([data-pos="end"]) .launcher,:host([data-pos="end"]) .panel{inset-inline-start:auto;inset-inline-end:var(--oi,20px)}

/* Panel */
.backdrop{position:fixed;inset:0;background:rgb(0 0 0/.4);pointer-events:auto}
.panel{position:fixed;inset-block-end:calc(var(--ob,20px) + var(--ls) + 12px);inset-inline-start:var(--oi,20px);pointer-events:auto;
  inline-size:min(380px,calc(100vw - 24px));max-block-size:calc(100vh - 24px);max-block-size:calc(100svh - var(--ob,20px) - var(--ls) - 24px);
  overflow:auto;overscroll-behavior:contain;padding:22px 16px 16px;color:var(--fg);
  background:linear-gradient(var(--ac),var(--ac)) 0 0/100% 3px no-repeat border-box,var(--bg);background-origin:border-box;
  border:1px solid var(--bd);border-block-start:0;border-radius:var(--r);
  box-shadow:0 24px 48px -16px rgb(0 0 0/.4),0 0 0 1px rgb(0 0 0/.06)}
.head{display:flex;align-items:center;gap:12px;margin-block-end:18px}
.badge{inline-size:40px;block-size:40px;border-radius:50%;flex:none;display:grid;place-items:center;
  background:color-mix(in srgb,var(--ac) 14%,var(--bg));color:var(--ac)}
.badge svg{inline-size:22px;block-size:22px}
.heading{flex:1;min-inline-size:0}
h2{margin:0;font-size:1.125em;font-weight:700;line-height:1.3;outline:none}
.sub{margin:2px 0 0;font-size:.8125em;line-height:1.4;color:var(--mut)}
.close{border-radius:50%;color:var(--mut);flex:none}
.close:hover{background:var(--tint);color:var(--fg)}
fieldset{border:0;margin:0 0 20px;padding:0;min-inline-size:0}
legend{padding:0;font-size:.8125em;font-weight:600;color:var(--mut);margin-block-end:8px}

/* Segmented controls */
.seg{display:flex;border:1px solid var(--bd);border-radius:12px;background:var(--surf)}
.seg>button{flex:1 1 0;min-inline-size:0;padding-inline:4px;font-size:.9375em;font-weight:500;border-radius:0}
.seg>button+button{border-inline-start:1px solid var(--bd)}
.seg>button:first-child{border-start-start-radius:11px;border-end-start-radius:11px}
.seg>button:last-child{border-start-end-radius:11px;border-end-end-radius:11px}
.seg>button:hover:not([aria-pressed="true"]){background:var(--tint)}
.seg>button[aria-pressed="true"]{background:var(--ac);color:var(--on);font-weight:700}
.seg.sizes>button.step{flex:0 0 44px;font-size:1.25em;font-weight:400}
.seg .ico svg{inline-size:16px;block-size:16px}
button[aria-disabled="true"]{opacity:.45;cursor:default}

/* Toggle card */
.list{display:flex;flex-direction:column;margin-block-end:20px;border:1px solid var(--bd);border-radius:14px;background:var(--surf)}
.sw{inline-size:100%;justify-content:flex-start;gap:12px;text-align:start;padding-inline:14px;min-block-size:46px;border-radius:0}
.sw+.sw{border-block-start:1px solid var(--bd)}
.sw:first-child{border-start-start-radius:13px;border-start-end-radius:13px}
.sw:last-child{border-end-start-radius:13px;border-end-end-radius:13px}
.sw:hover{background:var(--tint)}
.sw>.ico{color:var(--mut)}
.lbl{flex:1;font-size:.9375em}
.track{position:relative;inline-size:44px;block-size:26px;border-radius:13px;background:var(--ctl);flex:none}
.thumb{position:absolute;inset-block-start:3px;inset-inline-start:3px;inline-size:20px;block-size:20px;border-radius:50%;
  background:var(--bg);color:transparent;display:grid;place-items:center;font-size:13px;font-weight:700;line-height:1;
  box-shadow:0 1px 2px rgb(0 0 0/.25)}
.sw[aria-checked="true"] .track{background:var(--ac)}
.sw[aria-checked="true"] .thumb{inset-inline-start:21px;color:var(--ac)}

/* Footer */
.foot{display:flex;flex-direction:column;gap:4px}
.reset{inline-size:100%;border:1px solid var(--ctl);border-radius:12px;font-weight:600;font-size:.9375em;padding-inline:14px}
.reset:hover{background:var(--tint)}
.links{display:flex;flex-wrap:wrap;column-gap:16px;font-size:.875em}
.meta{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:4px 12px;margin-block-start:4px}
.hint{margin:0;color:var(--mut);font-size:.8125em;display:flex;align-items:center;gap:6px}
kbd{font:600 .75em/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:var(--fg);background:var(--surf);
  border:1px solid var(--bd);border-block-end-width:2px;border-radius:6px;padding:4px 6px}
.credit{font-size:12px;color:var(--mut)}
.sr{position:absolute;inline-size:1px;block-size:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
@media (max-width:479.98px){
  :host .panel,:host([data-pos="end"]) .panel{inset-inline:0!important;inset-block-end:0;inline-size:auto;max-block-size:90vh;max-block-size:90svh;
    border-radius:var(--r) var(--r) 0 0;border-inline:0;border-block-end:0}
  :host([data-open]) .launcher{visibility:hidden}
}
@media (prefers-reduced-motion:no-preference){
  .launcher,.track,.thumb,button{transition:background-color .15s,transform .15s,filter .15s,box-shadow .15s,inset-inline-start .18s ease}
  .launcher:hover{transform:translateY(-1px);filter:brightness(1.08)}
  .panel{animation:nagishon-pop .18s ease-out}
}
@keyframes nagishon-pop{from{transform:translateY(8px)}}
`;function l(e,t={},...o){let n=document.createElement(e);for(let i in t){let r=t[i];r!==void 0&&r!==!1&&n.setAttribute(i,r===!0?"":r)}return n.append(...o),n}var an=[["grayscale","grayscale"],["underlineLinks","underlineLinks"],["highlightHeadings","highlightHeadings"],["readableFont","readableFont"],["textSpacing","textSpacing"],["stopMotion","stopMotion"],["bigCursor","bigCursor"],["readingGuide","readingGuide"]],rn=[["none","contrastNone"],["dark","contrastDark"],["light","contrastLight"]],Mt=(e,t="")=>'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"'+(t?' class="'+t+'"':"")+'><path d="'+e+'"/></svg>',wt=Mt("M12 2a2.6 2.6 0 1 1 0 5.2A2.6 2.6 0 0 1 12 2zM5 8.5h14v2.2h-5.2v3.6l2.4 6.2-2.1.8L12 15.9l-2.1 5.4-2.1-.8 2.4-6.2v-3.6H5z","fill"),sn='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="4" r="2"/><path d="M4 8.5 12 10l8-1.5M12 10v5m0 0-4 6m4-6 4 6"/></svg>',ln={grayscale:"M12 3v18M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z",underlineLinks:"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",highlightHeadings:"M6 4v16M18 4v16M6 12h12",readableFont:"M2.5 19 7.5 5l5 14M4.6 14h5.8M21 19v-7M21 15a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",textSpacing:"M4 4v16M20 4v16M8 12h8M8 12l2.5-2.5M8 12l2.5 2.5M16 12l-2.5-2.5M16 12l-2.5 2.5",stopMotion:"M8 5h2.5v14H8zM13.5 5H16v14h-2.5z",bigCursor:"M5 3l14 7-6 2-2 6z",readingGuide:"M3 8h18v8H3zM7 8v3M11 8v2M15 8v3M19 8v2",undo:"M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3",close:"M6 6l12 12M18 6 6 18",darkGlyph:"M12 4a8 8 0 0 0 0 16zM12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16z",lightGlyph:"M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16z"},ne=e=>{let t=l("span",{class:"ico","aria-hidden":"true"});return t.innerHTML=Mt(ln[e],e==="darkGlyph"?"half":""),t};function cn(e){let t=/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(e.trim());if(!t)return;let o=t[1].length===3?t[1].replace(/./g,"$&$&"):t[1],n=[0,2,4].map(i=>{let r=parseInt(o.slice(i,i+2),16)/255;return r<=.03928?r/12.92:Math.pow((r+.055)/1.055,2.4)});return .2126*n[0]+.7152*n[1]+.0722*n[2]>.179?"#111":"#fff"}function Tt(e){let{options:t,locale:o}=e,n=(a,d)=>at(o,a,d),i=t.features||{},r=a=>i[a]!==!1,s=!!(window.matchMedia&&window.matchMedia("(pointer: coarse)").matches),c=e.state,b=!1,y=null,T=!1,z=null,A=[],L=[],p=l("nagishon-widget",{"data-nagishon-root":!0,lang:o,dir:e.dir,"data-pos":e.position}),v=p.attachShadow({mode:"open"}),u=p.style,f=t.theme||{},Te=t.offset||{};if((f.preset==="light"||f.preset==="dark")&&p.setAttribute("data-theme",f.preset),p.setAttribute("data-size",t.launcher?.size==="lg"?"lg":"md"),p.setAttribute("data-lstyle",t.launcher?.style==="neutral"?"neutral":"accent"),u.setProperty("--ob",(Te.block??20)+"px"),u.setProperty("--oi",(Te.inline??20)+"px"),f.accent){u.setProperty("--nagishon-u-accent",f.accent);let a=cn(f.accent);a&&u.setProperty("--nagishon-u-on",a)}f.background&&(u.setProperty("--nagishon-u-bg",f.background),u.setProperty("--nagishon-u-surf","color-mix(in srgb,var(--fg) 5%,var(--bg))")),f.foreground&&u.setProperty("--nagishon-u-fg",f.foreground),f.radius&&u.setProperty("--nagishon-u-radius",f.radius),f.zIndex!==void 0&&u.setProperty("--nagishon-z",String(f.zIndex));let ze=l("div",{"aria-live":"polite",class:"sr"}),j=a=>{T=!T,ze.textContent=a+(T?"\u200B":"")},R=t.launcher||{},oe=R.showText!==!1&&R.shape!=="circle",Ae=R.label||n("launcher"),Ne=l("span",{"aria-hidden":"true",class:"ico"});Ne.innerHTML=R.icon==="outline"?sn:wt;let w=R.hidden?null:l("button",{type:"button",class:oe?"launcher":"launcher icon","data-action":"open","aria-haspopup":"dialog","aria-expanded":"false","aria-controls":"nagishon-dialog","aria-label":oe?void 0:Ae},Ne,oe?l("span",{},Ae):""),W=l("h2",{id:"nagishon-title",tabindex:"-1"},n("title")),Ce=l("button",{type:"button",class:"close","data-action":"close","aria-label":n("close")},ne("close")),He=l("span",{class:"badge","aria-hidden":"true"});He.innerHTML=wt;let k=l("div",{role:"dialog","aria-modal":"true","aria-labelledby":"nagishon-title",id:"nagishon-dialog",class:"panel",hidden:!0},l("div",{class:"head"},He,l("div",{class:"heading"},W,l("p",{class:"sub"},n("subtitle"))),Ce)),V=l("div",{class:"backdrop",hidden:!0}),ie=a=>Math.round(a*100)+"%",Oe=(a,d,g,h,S,F)=>{let J=l("button",{type:"button","data-key":a,"data-value":d,"aria-pressed":"false",dir:"ltr"},...g);return a==="contrast"&&J.removeAttribute("dir"),J.addEventListener("click",()=>{e.onSet(S),j(F())}),L.push(()=>J.setAttribute("aria-pressed",String(h()))),J};if(r("textScale")){let a=g=>{let h=O[g];h!==void 0&&(e.onSet({textScale:h}),j(n("announceTextSize",{value:ie(h)})))},d=(g,h,S)=>{let F=l("button",{type:"button",class:"step","data-action":g,"aria-label":n(g)},h);return F.addEventListener("click",()=>a(O.indexOf(c.textScale)+S)),L.push(()=>F.setAttribute("aria-disabled",String(O[O.indexOf(c.textScale)+S]===void 0))),F};k.append(l("fieldset",{},l("legend",{},n("textSize")),l("div",{class:"seg sizes",role:"group","aria-label":n("textSize")},d("decrease","\u2212",-1),...O.map(g=>Oe("textScale",String(g),[ie(g)],()=>c.textScale===g,{textScale:g},()=>n("announceTextSize",{value:ie(g)}))),d("increase","+",1))))}r("contrast")&&k.append(l("fieldset",{},l("legend",{},n("contrast")),l("div",{class:"seg",role:"group","aria-label":n("contrast")},...rn.map(([a,d])=>Oe("contrast",a,[a==="none"?"":ne(a==="dark"?"darkGlyph":"lightGlyph"),l("span",{},n(d))],()=>c.contrast===a,{contrast:a},()=>n("contrast")+": "+n(d))))));let ae=l("div",{class:"list"});for(let[a,d]of an){if(!r(a)||a==="readingGuide"&&s)continue;let g=l("button",{type:"button",role:"switch","aria-checked":"false","data-key":a,class:"sw"},ne(a),l("span",{class:"lbl"},n(d)),l("span",{class:"track","aria-hidden":"true"},l("span",{class:"thumb"},"\u2713")));g.addEventListener("click",()=>{let h=!c[a];e.onSet({[a]:h}),j(n(h?"announceOn":"announceOff",{feature:n(d)}))}),L.push(()=>g.setAttribute("aria-checked",String(!!c[a]))),ae.append(g)}ae.childElementCount&&k.append(ae);let $=l("div",{class:"foot"}),Pe=l("button",{type:"button",class:"reset","data-action":"reset"},ne("undo"),l("span",{},n("reset")));Pe.addEventListener("click",()=>{e.onReset(),j(n("resetDone"))}),$.append(Pe);let Y=l("div",{class:"links"});t.statementUrl&&Y.append(l("a",{href:t.statementUrl},n("statement"))),t.contactUrl&&Y.append(l("a",{href:t.contactUrl},n("contact"))),Y.childElementCount&&$.append(Y);let re=l("div",{class:"meta"});if(t.hotkey!==!1){let a=n("hotkeyHint",{hotkey:"\0"}).split("\0");re.append(l("p",{class:"hint"},a[0],l("kbd",{dir:"ltr"},Et(t.hotkey||"Alt+Shift+A")),a[1]||""))}re.append(l("a",{class:"credit",href:"https://github.com/Roizlotolov/nagishon",rel:"noopener",target:"_blank"},n("poweredBy"))),$.append(re),k.append($),v.append(l("style",{},Lt),V,k,ze),w&&v.append(w);let Nt=()=>Array.from(k.querySelectorAll("button, a[href]")).filter(a=>!a.closest("[hidden]"));k.addEventListener("keydown",a=>{if(a.key!=="Tab")return;let d=Nt(),g=d[0],h=d[d.length-1],S=v.activeElement;a.shiftKey&&(S===g||S===W||!S)?(a.preventDefault(),h.focus()):!a.shiftKey&&S===h&&(a.preventDefault(),g.focus())});let Re=a=>{a.key==="Escape"&&(a.preventDefault(),I())},Ie=a=>{a.target!==p&&W.focus()};V.addEventListener("click",()=>I()),Ce.addEventListener("click",()=>I()),w?.addEventListener("click",()=>b?I():Fe());function Ct(){let a="inert"in HTMLElement.prototype;for(let d of Array.from(document.body.children))d!==p&&(a?d.inert||(d.inert=!0,A.push([d,"inert",null])):(A.push([d,"aria-hidden",d.getAttribute("aria-hidden")]),d.setAttribute("aria-hidden","true")));window.matchMedia&&window.matchMedia("(max-width: 479.98px)").matches&&(z=document.body.style.overflow,document.body.style.overflow="hidden")}function Ht(){for(let[a,d,g]of A.splice(0))d==="inert"?a.inert=!1:g===null?a.removeAttribute("aria-hidden"):a.setAttribute("aria-hidden",g);z!==null&&(document.body.style.overflow=z,z=null)}function Fe(){if(b)return;b=!0;let a=document.activeElement;y=a&&a!==p&&a!==document.body?a:w,k.hidden=V.hidden=!1,p.setAttribute("data-open",""),w?.setAttribute("aria-expanded","true"),Ct(),W.focus(),document.addEventListener("keydown",Re),document.addEventListener("focusin",Ie),e.onOpen()}function De(){b=!1,k.hidden=V.hidden=!0,p.removeAttribute("data-open"),w?.setAttribute("aria-expanded","false"),document.removeEventListener("keydown",Re),document.removeEventListener("focusin",Ie),Ht()}function I(){if(!b)return;De();let a=y&&y.isConnected?y:w;y=null,a?.focus(),e.onClose()}function Ge(a){c=a,p.setAttribute("data-contrast",a.contrast),L.forEach(d=>d())}return Ge(c),document.body.append(p),{host:p,open:Fe,close:I,isOpen:()=>b,update:Ge,destroy(){b&&De(),p.remove()}}}var P=null;function we(e={}){if(P)return typeof console<"u"&&console.warn("nagishon: already initialized; returning the existing instance. Call destroy() first to re-init."),P;let t=xe(e.locale),o={...e,locale:t,dir:e.dir||it(t),position:e.position||"start"},n=kt(e.storageKey||B,e.initialState),i={change:new Set,open:new Set,close:new Set},r=u=>i[u].forEach(f=>f(n.get())),s=null,c=null,b=!1,y=!1,T=()=>{mt(n.get(),c,{textScaling:e.textScaling,skipLink:e.skipLink,locale:t}),c=n.get()},z=n.subscribe(u=>{s&&(T(),s.update(u)),window.dispatchEvent(new CustomEvent("nagishon:change",{detail:u})),e.onChange?.(u),r("change")}),A=e.hotkey===!1?null:St(e.hotkey||"Alt+Shift+A"),L=u=>{A&&A(u)&&(u.preventDefault(),v.toggle())};document.addEventListener("keydown",L);let p=()=>{b||(document.removeEventListener("DOMContentLoaded",p),s=Tt({options:e,locale:t,dir:o.dir,position:o.position,state:n.get(),onSet:u=>{n.set(u)},onReset:()=>{n.reset()},onOpen:()=>r("open"),onClose:()=>r("close")}),T(),window.dispatchEvent(new CustomEvent("nagishon:ready",{detail:n.get()})),y&&s.open())};document.body?p():document.addEventListener("DOMContentLoaded",p);let v={open(){s?s.open():y=!0},close(){y=!1,s?.close()},toggle(){s?.isOpen()?s.close():v.open()},getState:()=>n.get(),set:(u,f)=>{n.set({[u]:f})},setState:u=>{n.set(u)},reset:()=>{n.reset()},on(u,f){return i[u].add(f),()=>i[u].delete(f)},destroy(){b||(b=!0,document.removeEventListener("DOMContentLoaded",p),document.removeEventListener("keydown",L),z(),n.destroy(),s?.destroy(),s=null,bt(),i.change.clear(),i.open.clear(),i.close.clear(),P===v&&(P=null))},options:o};return P=v,v}function zt(){return P}var dn=["textScale","contrast","grayscale","underlineLinks","highlightHeadings","readableFont","textSpacing","stopMotion","bigCursor","readingGuide"];function At(e){let t={};if(e.locale&&(t.locale=e.locale),(e.position==="start"||e.position==="end")&&(t.position=e.position),e.statementUrl&&(t.statementUrl=e.statementUrl),e.contactUrl&&(t.contactUrl=e.contactUrl),e.hotkey!==void 0){let r=e.hotkey.trim();r==="false"||r==="off"||r==="none"?t.hotkey=!1:r&&(t.hotkey=r)}(e.textScaling==="elements"||e.textScaling==="root")&&(t.textScaling=e.textScaling),e.skipLink&&(t.skipLink={target:e.skipLink});let o=r=>r!==void 0&&r.trim()!==""&&Number.isFinite(Number(r))?Number(r):void 0,n=o(e.offsetBlock),i=o(e.offsetInline);if((n!==void 0||i!==void 0)&&(t.offset={},n!==void 0&&(t.offset.block=n),i!==void 0&&(t.offset.inline=i)),(e.launcherShape==="pill"||e.launcherShape==="circle")&&(t.launcher={...t.launcher,shape:e.launcherShape}),(e.launcherSize==="md"||e.launcherSize==="lg")&&(t.launcher={...t.launcher,size:e.launcherSize}),e.launcherLabel&&(t.launcher={...t.launcher,label:e.launcherLabel}),(e.launcherIcon==="solid"||e.launcherIcon==="outline")&&(t.launcher={...t.launcher,icon:e.launcherIcon}),(e.launcherStyle==="accent"||e.launcherStyle==="neutral")&&(t.launcher={...t.launcher,style:e.launcherStyle}),(e.theme==="auto"||e.theme==="light"||e.theme==="dark")&&(t.theme={...t.theme,preset:e.theme}),e.background&&(t.theme={...t.theme,background:e.background}),e.foreground&&(t.theme={...t.theme,foreground:e.foreground}),e.radius&&(t.theme={...t.theme,radius:e.radius}),e.accent&&(t.theme={...t.theme,accent:e.accent}),e.zIndex!==void 0&&e.zIndex.trim()!==""&&Number.isFinite(Number(e.zIndex))&&(t.theme={...t.theme,zIndex:Number(e.zIndex)}),e.features){let r=e.features.split(",").map(c=>c.trim()),s={};for(let c of dn)s[c]=r.indexOf(c)!==-1;t.features=s}return t}var un="1.0.0";var Me=document.currentScript||document.querySelector("script[data-nagishon]");if(Me&&!("nagishonManual"in Me.dataset)){let e=Me.dataset;("nagishon"in e||Object.keys(e).length)&&we(At(e))}return Dt(gn);})();
