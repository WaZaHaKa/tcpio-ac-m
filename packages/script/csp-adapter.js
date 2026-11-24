/* tcpio-ac-m CSP adapter. The unmodified upstream build follows this preamble.
   The toolbar inserts <style> elements. Under default-src 'self' those are
   blocked. This preamble turns them into constructable stylesheets instead. */
(function () {
  "use strict";

  function supportsAdopted() {
    try {
      return typeof CSSStyleSheet !== "undefined" && typeof new CSSStyleSheet().replaceSync === "function";
    } catch {
      return false;
    }
  }

  if (!supportsAdopted()) return;

  var origAppendChild = Node.prototype.appendChild;
  var origElementAppend = Element.prototype.append;
  var origFragmentAppend = DocumentFragment.prototype.append;
  var origDocumentAppend = Document.prototype.append;

  function isStyle(node) {
    return !!node && node.nodeType === 1 && String(node.tagName).toLowerCase() === "style";
  }

  function isHead(parent) {
    return parent === document.head || parent === document.documentElement;
  }

  function isShadow(parent) {
    return typeof ShadowRoot !== "undefined" && parent instanceof ShadowRoot;
  }

  function adopt(parent, css) {
    var sheet = new CSSStyleSheet();
    sheet.replaceSync(css || "");
    var root = isShadow(parent) ? parent : document;
    root.adoptedStyleSheets = root.adoptedStyleSheets.concat([sheet]);
    return sheet;
  }

  function track(id, sheet) {
    var el = document.createElement("meta");
    el.id = id;
    el.setAttribute("data-tcpio-ac-m-style", "");
    el.remove = function () {
      document.adoptedStyleSheets = document.adoptedStyleSheets.filter(function (item) {
        return item !== sheet;
      });
      HTMLElement.prototype.remove.call(el);
    };
    origAppendChild.call(document.head || document.documentElement, el);
  }

  function divert(parent, node) {
    if (!isStyle(node) || (!isHead(parent) && !isShadow(parent))) return false;
    var sheet = adopt(parent, node.textContent || "");
    if (isHead(parent) && node.id) track(node.id, sheet);
    return true;
  }

  Node.prototype.appendChild = function (node) {
    if (divert(this, node)) return node;
    return origAppendChild.call(this, node);
  };

  function wrap(orig) {
    return function () {
      var keep = [];
      var index;
      for (index = 0; index < arguments.length; index += 1) {
        if (!divert(this, arguments[index])) keep.push(arguments[index]);
      }
      if (keep.length) orig.apply(this, keep);
    };
  }

  if (typeof origElementAppend === "function") Element.prototype.append = wrap(origElementAppend);
  if (typeof origFragmentAppend === "function" && origFragmentAppend !== origElementAppend) {
    DocumentFragment.prototype.append = wrap(origFragmentAppend);
  }
  if (
    typeof origDocumentAppend === "function" &&
    origDocumentAppend !== origElementAppend &&
    origDocumentAppend !== origFragmentAppend
  ) {
    Document.prototype.append = wrap(origDocumentAppend);
  }
})();
