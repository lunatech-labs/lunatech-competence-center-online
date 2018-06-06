
## Javascript, an acquired taste

Javascript was developed by Netscape on '95, designed and implemented by Brendan
Eich (prototyped in 10 days), would become the dominant language of the web

![Fernet Branca](images/branca.png)

Note:
- Yes, now you can transpile from other languages, but still JS underneath.
- JS would compete with JScript (Microsoft) and Actionscript (Adobe) for supremacy.
- Fernet Branca taste like cough medicine, when you first try it it’s hideous but
after a couple of times you start liking it. Like any acquired taste you need to
know how to prepare it (or in this case use it).

---

## Javascript, the ugliest X-Men… ever

Eich initially wanted to build a version of Scheme for the Web, but a Lisp could
be too controversial for it and eventually settled for a C/C++/Java Syntax.

Note:
Javascript, like any language, draws inspiration from lots of other languages.
But unlike most of them, where you can recognize a dominant archetype, with JS
you can see that’s an amorphous blob of concepts. And this make it complicated to
learn/use, given the baggage that we’ll have.

---

## Syntax in a nutshell

### Assignment
```js
var myInt = 0;
var myFloat = 2.5;
var myBoolean = true;
var myString = "This is a string";
var myArray = [1,2,3];
var myObject = {
    myField : "Some value"
};

// Object instantiation using new
var myDate = new Date();
```

Note:
Let’s skim quickly through the syntax, which will be familiar to almost every
programmer. The hard thing to grasp is actually the semantics of that syntax.

---

## Syntax in a nutshell

### Flow control

```js
// Conditionals
if (some_boolean_expression) {
  // evaluated if truthy
} else {
  // evaluated if falsy
}

// Loops
for (init; cond; post) {
  // evaluated while cond is true
}

while (cond) {
  // evaluated while cond is true
}
```

---

## Syntax in a nutshell

### Functions

```js
function myFun (x) {
    return x + 1;
}

myFun(3); // :=> function call: 4
```

---

## Syntax in a nutshell

### Exceptions
```js
try {
  // some operation that may fail
} catch (e) {
  // evaluated if exception happen
} finally {
  // evaluated always
}
```

---

## ECMAScript 5

In 2009 ECMAScript 5 was released bringing the following:

- Strict mode
- Meta programming
- Native JSON and functional helpers (map, fold, filter…)
