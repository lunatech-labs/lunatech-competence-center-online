## this, that & self

The _this_ keyword is one of the most confusing things in JS, specially coming from
another language like Java or Scala.

The key point is to understand its semantics, to what's bound on each particular
context, once you got this everything becomes simple and evident.

---

## JS: This, that & self exercise

Time for some _fun_, **fork** the following pen:

[Exercise](https://codepen.io/nmoncho/pen/bYENVz)

---

## this, that & self (strict mode)

```js
var obj = {
  bar: 'Hello this is: "obj"',
  foo: function (arg){
    console.log(this.bar, arg);
  }
};

var foo = obj.foo;        // HERE we extract the 'foo' method into a function.
```

---

## this, that & self (strict mode)

```js
obj.foo('bar');           // :=> Hello this is “obj”
foo('bar');               // :=> Uncaught TypeError: Cannot read property 'bar' of undefined
setTimeout(obj.foo, 500); // :=> Same error here
setTimeout(foo, 500);     // :=> And here
```

Note:
In the example _this_ is determined at runtime, at call time. Using _obj.foo()_ JS
know which object to bind to this, but when it's extracted it doesn't know what to use.

Another error is to use _this_ inside a callback, like the one you hand to _setTimeout_.

---

## this, that & self rationale

The best way to think about methods in JS is that they don't **exist**, we only have
functions, and these **always** have an implicit _this_.

This implicit argument is determined when it's **called**, there is no hard binding.
Which coming from other languages can cause a lot of head scratching.

---

## this, that & self (explicit)

```js
var bindedFoo = foo.bind(obj);

foo.call(obj, 'baz');
foo.apply(obj, ['bar']);
lexicalFoo('bar');
```

Note:
With **lexicalFoo** we hard-binded which object is going to use, and there is
no way back (you can't bind/apply/call with other object).

Lexical binding it's helpful and usually what we want, ES6 added the fat arrow
for this purpose, but you need to understand what's going on under the covers.

---

## JS: This, that & self exercise 2

Time for some _fun_, **fork** the following pen:

[Exercise](http://codepen.io/nmoncho/pen/wJyyZv)

---

## Partial application

The _bind_ function also performs partial application:

```js
function add (a, b, c) { return a + b + c; }

var add3_10 = add.bind(null, 3, 10);
add3_10(5);  // :=> 18
add3_10(23); // :=> 36
```

---

## this, that & self - Tips & Pitfalls

- Remember, every _function_ has an implicit _this_.
- Understand where does it come from.
- Lexical scope makes the reference obvious, although it's not needed always, you
should rely on _apply_, _call_ & _bind_.
