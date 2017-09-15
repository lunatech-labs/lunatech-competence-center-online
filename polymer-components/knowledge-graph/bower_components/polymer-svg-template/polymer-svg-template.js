(function (root, factory) {

  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], function () {
      return (root.PolymerSvgTemplate = factory());
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals
    root.PolymerSvgTemplate = factory();
  }

}(this, function () {
// UMD Definition above, do not remove this line

// To get to know more about the Universal Module Definition
// visit: https://github.com/umdjs/umd

  'use strict';
  return function templateInSvg(name) {
    var ua = window.navigator.userAgent;

    // IE10-11 does not need this fix.
    if (/MSIE /.test(ua) || /Trident\//.test(ua)) {
      return;
    }

    // owner document of this import module
    var doc = window.currentImport;
    var ns = doc.body.namespaceURI;

    var template = Polymer.DomModule.import(name, 'template');
    if (template) {
      walkTemplate(template._content || template.content);
    }

    function upgradeTemplate(el) {
      var attribs, attrib, count, child, content;
      var tmpl = el.ownerDocument.createElement('template');
      el.parentNode.insertBefore(tmpl, el);
      attribs = el.attributes;
      count = attribs.length;
      while (count-- > 0) {
        attrib = attribs[count];
        tmpl.setAttribute(attrib.name, attrib.value);
        el.removeAttribute(attrib.name);
      }
      el.parentNode.removeChild(el);
      content = tmpl.content;
      while ((
        child = el.firstChild
      )) {
        content.appendChild(child);
      }
      return tmpl;
    }

    function walkTemplate(root) {
      var treeWalker = doc.createTreeWalker(
        root,
        NodeFilter.SHOW_ELEMENT,
        {acceptNode: function(node) { return NodeFilter.FILTER_ACCEPT; }},
        false
      );
      var nodeList = [], node;
      while (treeWalker.nextNode()) {
        node = treeWalker.currentNode;
        if (node.localName === 'svg') {
          walkTemplate(node);
        } else if (node.localName === 'template' && !node.hasAttribute('preserve-content') &&
          node.namespaceURI !== ns) {
          node = upgradeTemplate(node);
          walkTemplate(node._content || node.content);
          treeWalker.currentNode = node;
        }
      }
    }
  }
}));
