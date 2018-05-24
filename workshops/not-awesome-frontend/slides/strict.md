## JS: Strict Exercise

Time for some _fun_, **fork** the following pen:

[Exercise](https://codepen.io/nmoncho/pen/GOpeKN)

---

## Strict mode

Strict mode was introduced in ES5 to make the language more "stable" or "safer"
to use.

---

## Strict mode

- Variables have to be declared before using them.
- Function's `this` parameters is undefined by default.
- `with`, `arguments.callee` are prohibited.
- And more...

Note:
- Always prefer to use **strict** mode, prevents stupid mistakes from happening.
- **This** to `undefined` is very useful to avoid clobbering the global object,
specially in constructors.

---

## Strict mode (how to use it)

```js
'use strict'; // a. first line of file

function bar() {
  'use strict'; // b. first line of function (mainly used when refactoring)
  ...
}

(function () {
  'use strict'; // c. first line of function expression (IIFE)
  ...
}());
```

Note:
You can also mix _strict_ and _non-strict_ mode.
