## jQuery: DOM (query)

The _first step_ into working with jQuery is selecting (or querying) elements
through CSS selectors, if you know CSS you can leverage:

```
tag(#id)?(.class+)?([attr="value"]+)?(:pseudo)?
```

Note:
Have anyone worked with XPath? You can be very accurate on your path, but if
structure changes you're screwed.

Through selection we begin the usage of jQuery, some people call this the "Ajax Monad"
because you can compose and chain functions with it, some may call this fluent API.

---

## jQuery: DOM Examples (query)

|||||
|---|---|---|---|
|Selecting all **form** elements|`$('form')`|
|Select element by id **user-pic**|`$('#user-pic')`|
|Select element by id that's a **div**|`$('div#user-profile')`|

Note:
Selectors usually result in a collection of elements, the only one that returns
a single element is the **ID** selector. A common pitfall is to have several elements
with the same ID and expect to get all of them selecting by that ID.

---

## jQuery: DOM Examples (query)

|||
|---|---|
|Select all **active-tab** elements|`$('.active-tab')`|
|Select all **div** and **active-tab** elements|`$('div.active-tab')`|
|Select all **active-tag** and **fancy-tab** elements|`$('.active-tab.fancy-tab')`|

Note:
When selecting multiple classes if common to forget concatenating classes with `.`
(period), like we would write in the `class` attribute. You have to remember this
is a _CSS selector_.

---

## jQuery: DOM Examples (query)

Or combine them all:
```
$('div#user-profile.active-tab.fancy-tag')
```

---

## jQuery: DOM Exercise (query)

Time for an _exercise_, **fork** the following pen:

[Exercise](http://codepen.io/nmoncho/pen/JWbYBV)

---

## jQuery: DOM (query)

This are all CSS selectors, so remember you can get more complex selector using combinators:

- Adjacent Sibling (+): **selectorA + selectorB**
- Child (>): **selectorA > selectorB**
- General Sibling (~): **selectorA ~ selectorB**
- Descendant (' '): **selectorA selectorB**

---

## CSS selectors

[CSS3 selectors](http://api.jquery.com/category/selectors/) have a rich collection of different types:
- Basic
- Hierarchy
- Attributes
- Filtering
- Form

jQuery offer _Extensions_, which looks like we're creating new CSS syntax.

Note:
- Basic are those presented in the slide 10 (element, id, class)
- Hierarchy are those presented in the slide 10 (child, descendant, adjacent, sibling)
- Filtering is kind of a stupid name since every piece of the selector is intended
to filter based on some criteria, and in some way Form could be included in the same
category. Mostly they are **_is_** tests, is Empty? Is Checked? And so on.

---

## jQuery: DOM (query) - Filtering

### Content based <sup>[1](http://codepen.io/nmoncho/pen/RpooPM)</sup>

```js
$('li:contains("Buy")')
$('li:empty')
$('li:parent')
```

```html
<ul id="my-todos">
  <li>Buy milk</li>
  <li>Pay Netflix</li>
  <li></li>  
  <li>Finish course</li>
  <li>Buy steak</li>
</ul>
```

Note:
**Contains** search for text inside the nodes
**Empty** and **parent**, you could think of the as _is_ test, is _empty?_ Is a _parent?_

---

## jQuery: DOM (query) - Filtering

### Attribute based <sup>[1](http://codepen.io/nmoncho/pen/ZeBVRN)</sup>

```js
$('li[done]')
$('li[done="today"]')
$('li[done!="today"]')
```

```html
<ul>
  <li done>Buy milk</li>
  <li>Pay Netflix</li>
  <li done="today">Buy bread</li>
  <li>Finish course</li>
  <li done="02-03-2017">Buy steak</li>
</ul>
```

---

## jQuery: DOM (query) - Form

||||
|---|---|---|
|`:button`|`:input`|`:file`|
|`:checkbox`|`:password`|`:submit`|
|`:checked`|`:radio`|`:focus`|
|`:disabled`|`:reset`|`:text`|
|`:enabled`|`:selected`|`:image`|

Note:
- Most of the selectors work pretty much like `[type="foo"]`, some have slightly different results.
- These selectors can have performance hit

---

## jQuery: DOM (query) - Extensions

You can also extend jQuery selection:

```js
$.extend($.expr[':'],{
    todo: function(el) {
        return $(el).hasClass('todo-item');
    }
});
```

See live demo [here](http://codepen.io/nmoncho/pen/ryWPvW)

Note:
This kind of selectors can have a performance hit.

---

## jQuery: DOM (query) - Tips & Pitfalls

- Cache queries in variables.
- Understand performance.
- Use `.filter`, `.find`, `.children`
- The REPL/Console is your friend.
- Prefer and standardize class selectors (e.g. prefix with `js-`).
- Use all but child, adjacent and sibling selector sparingly (brittle).
- Don’t expect more than one element when querying by ID.
