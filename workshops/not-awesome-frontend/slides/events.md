## jQuery: Events

Like most UI models, HTML works with Events as a way of handling user interaction (https://goo.gl/UQleqM).

Being Javascript asynchronous, we handle events with callback functions (ie. Event Listeners).

Note:
Event's names are inspired by [Hypercard](https://en.wikipedia.org/wiki/HyperCard), that why they start with **on** (onclick, onload, etc).

---

## jQuery: Events

With a selected element we can attach listeners by using `on`:

```js
$(selector).on(eventType, handler);
```

---

## jQuery: Events

There are several shorthand functions to the most common used events, like `click`:

```js
$(selector).click(handler);
```

Note:
blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove
mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu

---

## jQuery: Events - Anatomy of an Event (properties)

An event is just an object that's passed to a listener (callback):

|HTML Event||
|---|---|
|`target`|The element that dispatched the event (eg. the button that was clicked)|
|`type`|The type of the event, useful when grouping several event types in one handler (eg. click, change, focus, etc.)|

---

## jQuery: Events - Anatomy of an Event (methods)

An event is just an object that's passed to a listener (callback):

|HTML Event||
|---|---|
|`preventDefault()`|If the element has default behaviour, won't execute it (eg. form submit, go to URL on click)|
|`stopPropagation()`|Won't execute the listeners on the propagation chain, if there are any.|
|And others|See: https://developer.mozilla.org/en/docs/Web/API/Event|

---
## jQuery: Event propagation

HTML supports two types of event propagation:<sup>[1](https://goo.gl/TQpdTb)</sup>
- Bubbling: bottom up
- Capturing: top down

We can leverage this to enhance performance, structure our event flow and reduce complexity.

Note:
- For historical reasons jQuery only supports Bubbling, not Capturing (http://codepen.io/nmoncho/pen/peNYVW).
- Bubbling and Capturing are event propagation models, defined by HTML and are not jQuery specific.
- Since capturing was only supported in IE the jQuery team decided not to support it. The default is bubbling.

---

## jQuery: Event Exercise

Time for an _exercise_, **fork** the following pen:

[Exercise](http://codepen.io/nmoncho/pen/MpbdPe)

---

## jQuery: Event delegation

jQuery takes event bubbling one step further letting you _filter_ by the event's target

Note:
Event delegation works almost the same way as propagation, it attaches a single listener to a parent element. Then when events bubble up this handler is executed, the only difference is that delegation checks if the target is the specified selector.

---

## jQuery: Event delegation

```js
$('.container').on('click', '.item-sale', handler);
```
```html
<ul class="shopping-list container">
  <li class="normal-item">Mouse RX3000</li>
  <li class="sale-item">Dell Screen 4K</li>
  <li class="normal-item">Keyboard ZS-3</li>
  <li class="sale-item">Acer Screen 4K 120hz</li>
  <li class="normal-item">Intel i7 CPU</li>
</li>
```

---

## jQuery: Event delegation exercise

Time for an _exercise_, **fork** the following pen:

[Exercise](http://codepen.io/nmoncho/pen/evBwrM)

---

## jQuery: Event propagation and default

Some elements have default behaviours, we can prevent this from happening by calling
`.preventDefault` on the event. And if for some reason we wish to stop bubbling
we invoke `.stopPropagation`

Note:
- `preventDefault`: This is also useful to prevent form submit if we want to submit it through ajax.
- `stopPropagation`/`stopImmediatePropagation` differences.

---

## jQuery: Event propagation and default

The following will make every anchor element (link) useless:

```js
$('a').click(function (event) {
    event.preventDefault();
});
```

---

## jQuery: Event - Tips & Pitfalls

- Use only one `$(document).ready` per page.
- Understand event propagation and delegation, use it to your advantage.
- Events are a great way to decouple, but also makes the code harder to understand if overused.
- Don't use event binding inside inline scripts, ever!

Note:
Give the example of event binding on a `<c:forEach>` at Southwest.
