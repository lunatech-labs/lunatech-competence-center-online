## Prototype based Object-Orientation

Javascript implements OO using prototypes, there are no classes just objects.
Objects “inherit” from other objects, building what’s called the _**prototype chain**_.

Note: Prototype based OO works in a different way of Class based. With classes
you think how all instances are equal or related, only data changes. But with
prototypes you think in how they are similar/different and how to delegate to
other objects (hope that with examples this becomes clear).

---

## Classless Object-Orientation… kind of

But the way to do OO in JS is awkward to say the least:

```js
function Person(firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
};

Person.prototype.sayHello = function () {
  console.log(this.firstName + ‘ ’ + this.lastName);
}

var brendan = new Person(‘Brendan’, ‘Eich’);
var john = new Person(‘John’, ‘Resig’);
```

Note:
Only _function_ objects get the **prototype** property.
This was to appeal Java programmers, you can see that javascript is conflicted by
its own approach to OO.

ES6 goes into this direction, Classes as a way to OO, steering away from prototypes
through syntactic sugar.

---

## Classless Object-Orientation… kind of

```js
function Person(firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
};

Person.prototype.sayHello = function () {
  console.log(this.firstName + ‘ ’ + this.lastName);
}

function Employee(id, firstName, lastName) {
  Person.call(this, firstName, lastName); // call “Parent class” constructor.
  this.id = id;
}

Employee.prototype = Object.create(Person.prototype); // a.k.a. extends

Employee.prototype.sayHello = function () {
  console.log(‘Employee #’, this.id, ‘reporting’);
  Person.prototype.sayHello.call(this); // a.k.a. super
}
```

---

## JS: Prototype OO Exercise

Time for an exercise, fork the following pen:

[Exercise](http://codepen.io/nmoncho/pen/gmKdWb)

---

## Prototype based Object-Orientation

A simple example of _Prototype_ OO inheritance:

```js
var brendan = {
  name: ‘Brendan Eich’,
  say: function () {console.log(this.name);}
};

var john = {
  name: ‘John McCarthy’
};

// extend magic here, john extends brendan (more on next slide).

john.say(); // :=> ‘John McCarthy’ (we didn’t use apply or call)
```

---

## Classless Object-Orientation… kind of

A more prototypal way of OO would be like this (but also tedious).

```js
var brendan = {
  name: ‘Brendan Eich’,
  say: function () {console.log(this.name);}
};

var john = Object.create(brendan);
john.name = ‘John Resig’;
var fileOutputTask = Object.create(brendan);
fileOutputTask.name = ‘Reading file...’;

john.say(); // :=> ‘John Resig’
fileOutputTask.say(); // :=> ‘Reading file...’
```

Note:
Here the benefic doesn’t appear evident, what we’re really doing is doing _delegation_
among object. This can be really powerful in the way that we mixin behavior
through _delegation_. It’s also important to realize that JS follows the duck
typing system.

---

## Prototype OO - Tips & Pitfalls

- OO in JS is a mess, there is no way around it. But one of the biggest problems
is thinking with classes/inheritance.
- If you can, use ES6 classes, ES5 delegation patterns or use libraries like _**jsclass**_.
- Regretfully ES6 could have gone in a Prototype fashion but decided to go with
classes (for multiple reasons).
