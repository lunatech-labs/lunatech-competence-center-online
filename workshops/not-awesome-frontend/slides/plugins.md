## jQuery: Plugins

Since the start jQuery provided a way to develop plugins in a simple manner,
this made the library thrive and create an ecosystem.

```js
$.fn.awesomePlugin = function () {
      // Insert magic here
}
```

---

## jQuery: Plugin example

```js
$.fn.blueify = function () {
  this.each(function () {
    $(this).css('color', 'blue');
  });
};
```

---

## jQuery: Plugin example

```html
<ul>
  <li>Foo</li>
  <li>Bar</li>
</ul>
<span class=”baz”>Baz</span>

```

---

## jQuery: Plugin example

```js
$('li:eq(1), .baz').blueify();
```

---

## jQuery: Plugin exercise

Time for an _exercise_, **fork** the following pen:

[Exercise](https://codepen.io/nmoncho/pen/RLeXJa)

---

## Things not covered

- More complex attribute selectors.
- Sequence/Index selectors.
- Event namespacing.

---

## Homework

- [Douglas Crockford on Javascript](https://youtu.be/JxAXlJEmNMg?list=PLgEN6Yip8UBKt4j7_KJhhAMnggkA-5svC)
- [Annotated jQuery](https://goo.gl/nO3zr4)
- [Things learned from jQuery source](https://youtu.be/i_qE1iAmjFg)
- [John Resig Interview](https://youtu.be/5SzUDgDvCzc)
