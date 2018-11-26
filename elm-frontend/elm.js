(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === elm$core$Basics$EQ ? 0 : ord === elm$core$Basics$LT ? -1 : 1;
	}));
});



// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = elm$core$Set$toList(x);
		y = elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = elm$core$Dict$toList(x);
		y = elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = elm$core$Dict$toList(x);
		y = elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (!x.$)
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? elm$core$Basics$LT : n ? elm$core$Basics$GT : elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[94m' + string + '\x1b[0m' : string;
}



// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.cp.ah === region.cQ.ah)
	{
		return 'on line ' + region.cp.ah;
	}
	return 'on lines ' + region.cp.ah + ' through ' + region.cQ.ah;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800)
			+
			String.fromCharCode(code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return word
		? elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? elm$core$Maybe$Nothing
		: elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? elm$core$Maybe$Just(n) : elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




/**_UNUSED/
function _Json_errorToString(error)
{
	return elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

var _Json_decodeInt = { $: 2 };
var _Json_decodeBool = { $: 3 };
var _Json_decodeFloat = { $: 4 };
var _Json_decodeValue = { $: 5 };
var _Json_decodeString = { $: 6 };

function _Json_decodeList(decoder) { return { $: 7, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 8, b: decoder }; }

function _Json_decodeNull(value) { return { $: 9, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 10,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 11,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 12,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 13,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 14,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 15,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return elm$core$Result$Err(A2(elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 3:
			return (typeof value === 'boolean')
				? elm$core$Result$Ok(value)
				: _Json_expecting('a BOOL', value);

		case 2:
			if (typeof value !== 'number') {
				return _Json_expecting('an INT', value);
			}

			if (-2147483647 < value && value < 2147483647 && (value | 0) === value) {
				return elm$core$Result$Ok(value);
			}

			if (isFinite(value) && !(value % 1)) {
				return elm$core$Result$Ok(value);
			}

			return _Json_expecting('an INT', value);

		case 4:
			return (typeof value === 'number')
				? elm$core$Result$Ok(value)
				: _Json_expecting('a FLOAT', value);

		case 6:
			return (typeof value === 'string')
				? elm$core$Result$Ok(value)
				: (value instanceof String)
					? elm$core$Result$Ok(value + '')
					: _Json_expecting('a STRING', value);

		case 9:
			return (value === null)
				? elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 5:
			return elm$core$Result$Ok(_Json_wrap(value));

		case 7:
			if (!Array.isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 8:
			if (!Array.isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 10:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return (elm$core$Result$isOk(result)) ? result : elm$core$Result$Err(A2(elm$json$Json$Decode$Field, field, result.a));

		case 11:
			var index = decoder.e;
			if (!Array.isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return (elm$core$Result$isOk(result)) ? result : elm$core$Result$Err(A2(elm$json$Json$Decode$Index, index, result.a));

		case 12:
			if (typeof value !== 'object' || value === null || Array.isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!elm$core$Result$isOk(result))
					{
						return elm$core$Result$Err(A2(elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return elm$core$Result$Ok(elm$core$List$reverse(keyValuePairs));

		case 13:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return elm$core$Result$Ok(answer);

		case 14:
			var result = _Json_runHelp(decoder.b, value);
			return (!elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 15:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if (elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return elm$core$Result$Err(elm$json$Json$Decode$OneOf(elm$core$List$reverse(errors)));

		case 1:
			return elm$core$Result$Err(A2(elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!elm$core$Result$isOk(result))
		{
			return elm$core$Result$Err(A2(elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return elm$core$Result$Ok(toElmValue(array));
}

function _Json_toElmArray(array)
{
	return A2(elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return elm$core$Result$Err(A2(elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 3:
		case 2:
		case 4:
		case 6:
		case 5:
			return true;

		case 9:
			return x.c === y.c;

		case 7:
		case 8:
		case 12:
			return _Json_equality(x.b, y.b);

		case 10:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 11:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 13:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 14:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 15:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.dZ,
		impl.ed,
		impl.d7,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	result = init(result.a);
	var model = result.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		result = A2(update, msg, model);
		stepper(model = result.a, viewMetadata);
		_Platform_dispatchEffects(managers, result.b, subscriptions(model));
	}

	_Platform_dispatchEffects(managers, result.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				p: bag.n,
				q: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.q)
		{
			x = temp.p(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		r: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		r: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2(elm$json$Json$Decode$map, func, handler.a)
				:
			A3(elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		t: func(record.t),
		cr: record.cr,
		ck: record.ck
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.t;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.cr;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.ck) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// VIRTUAL-DOM WIDGETS


var _Markdown_toHtml = F3(function(options, factList, rawMarkdown)
{
	return _VirtualDom_custom(
		factList,
		{
			a: options,
			b: rawMarkdown
		},
		_Markdown_render,
		_Markdown_diff
	);
});



// WIDGET IMPLEMENTATION


function _Markdown_render(model)
{
	return A2(_Markdown_replace, model, _VirtualDom_doc.createElement('div'));
}


function _Markdown_diff(x, y)
{
	return x.b === y.b && x.a === y.a
		? false
		: _Markdown_replace(y);
}


var _Markdown_replace = F2(function(model, div)
{
	div.innerHTML = _Markdown_marked(model.b, _Markdown_formatOptions(model.a));
	return div;
});



// ACTUAL MARKDOWN PARSER


var _Markdown_marked = function() {
	// catch the `marked` object regardless of the outer environment.
	// (ex. a CommonJS module compatible environment.)
	// note that this depends on marked's implementation of environment detection.
	var module = {};
	var exports = module.exports = {};

	/**
	 * marked - a markdown parser
	 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
	 * https://github.com/chjj/marked
	 * commit cd2f6f5b7091154c5526e79b5f3bfb4d15995a51
	 */
	(function(){var block={newline:/^\n+/,code:/^( {4}[^\n]+\n*)+/,fences:noop,hr:/^( *[-*_]){3,} *(?:\n+|$)/,heading:/^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,nptable:noop,lheading:/^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,blockquote:/^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,list:/^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,html:/^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,table:noop,paragraph:/^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,text:/^[^\n]+/};block.bullet=/(?:[*+-]|\d+\.)/;block.item=/^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;block.item=replace(block.item,"gm")(/bull/g,block.bullet)();block.list=replace(block.list)(/bull/g,block.bullet)("hr","\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))")("def","\\n+(?="+block.def.source+")")();block.blockquote=replace(block.blockquote)("def",block.def)();block._tag="(?!(?:"+"a|em|strong|small|s|cite|q|dfn|abbr|data|time|code"+"|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo"+"|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b";block.html=replace(block.html)("comment",/<!--[\s\S]*?-->/)("closed",/<(tag)[\s\S]+?<\/\1>/)("closing",/<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g,block._tag)();block.paragraph=replace(block.paragraph)("hr",block.hr)("heading",block.heading)("lheading",block.lheading)("blockquote",block.blockquote)("tag","<"+block._tag)("def",block.def)();block.normal=merge({},block);block.gfm=merge({},block.normal,{fences:/^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,paragraph:/^/,heading:/^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/});block.gfm.paragraph=replace(block.paragraph)("(?!","(?!"+block.gfm.fences.source.replace("\\1","\\2")+"|"+block.list.source.replace("\\1","\\3")+"|")();block.tables=merge({},block.gfm,{nptable:/^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,table:/^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/});function Lexer(options){this.tokens=[];this.tokens.links={};this.options=options||marked.defaults;this.rules=block.normal;if(this.options.gfm){if(this.options.tables){this.rules=block.tables}else{this.rules=block.gfm}}}Lexer.rules=block;Lexer.lex=function(src,options){var lexer=new Lexer(options);return lexer.lex(src)};Lexer.prototype.lex=function(src){src=src.replace(/\r\n|\r/g,"\n").replace(/\t/g,"    ").replace(/\u00a0/g," ").replace(/\u2424/g,"\n");return this.token(src,true)};Lexer.prototype.token=function(src,top,bq){var src=src.replace(/^ +$/gm,""),next,loose,cap,bull,b,item,space,i,l;while(src){if(cap=this.rules.newline.exec(src)){src=src.substring(cap[0].length);if(cap[0].length>1){this.tokens.push({type:"space"})}}if(cap=this.rules.code.exec(src)){src=src.substring(cap[0].length);cap=cap[0].replace(/^ {4}/gm,"");this.tokens.push({type:"code",text:!this.options.pedantic?cap.replace(/\n+$/,""):cap});continue}if(cap=this.rules.fences.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"code",lang:cap[2],text:cap[3]||""});continue}if(cap=this.rules.heading.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"heading",depth:cap[1].length,text:cap[2]});continue}if(top&&(cap=this.rules.nptable.exec(src))){src=src.substring(cap[0].length);item={type:"table",header:cap[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:cap[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:cap[3].replace(/\n$/,"").split("\n")};for(i=0;i<item.align.length;i++){if(/^ *-+: *$/.test(item.align[i])){item.align[i]="right"}else if(/^ *:-+: *$/.test(item.align[i])){item.align[i]="center"}else if(/^ *:-+ *$/.test(item.align[i])){item.align[i]="left"}else{item.align[i]=null}}for(i=0;i<item.cells.length;i++){item.cells[i]=item.cells[i].split(/ *\| */)}this.tokens.push(item);continue}if(cap=this.rules.lheading.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"heading",depth:cap[2]==="="?1:2,text:cap[1]});continue}if(cap=this.rules.hr.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"hr"});continue}if(cap=this.rules.blockquote.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"blockquote_start"});cap=cap[0].replace(/^ *> ?/gm,"");this.token(cap,top,true);this.tokens.push({type:"blockquote_end"});continue}if(cap=this.rules.list.exec(src)){src=src.substring(cap[0].length);bull=cap[2];this.tokens.push({type:"list_start",ordered:bull.length>1});cap=cap[0].match(this.rules.item);next=false;l=cap.length;i=0;for(;i<l;i++){item=cap[i];space=item.length;item=item.replace(/^ *([*+-]|\d+\.) +/,"");if(~item.indexOf("\n ")){space-=item.length;item=!this.options.pedantic?item.replace(new RegExp("^ {1,"+space+"}","gm"),""):item.replace(/^ {1,4}/gm,"")}if(this.options.smartLists&&i!==l-1){b=block.bullet.exec(cap[i+1])[0];if(bull!==b&&!(bull.length>1&&b.length>1)){src=cap.slice(i+1).join("\n")+src;i=l-1}}loose=next||/\n\n(?!\s*$)/.test(item);if(i!==l-1){next=item.charAt(item.length-1)==="\n";if(!loose)loose=next}this.tokens.push({type:loose?"loose_item_start":"list_item_start"});this.token(item,false,bq);this.tokens.push({type:"list_item_end"})}this.tokens.push({type:"list_end"});continue}if(cap=this.rules.html.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:this.options.sanitize?"paragraph":"html",pre:!this.options.sanitizer&&(cap[1]==="pre"||cap[1]==="script"||cap[1]==="style"),text:cap[0]});continue}if(!bq&&top&&(cap=this.rules.def.exec(src))){src=src.substring(cap[0].length);this.tokens.links[cap[1].toLowerCase()]={href:cap[2],title:cap[3]};continue}if(top&&(cap=this.rules.table.exec(src))){src=src.substring(cap[0].length);item={type:"table",header:cap[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:cap[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:cap[3].replace(/(?: *\| *)?\n$/,"").split("\n")};for(i=0;i<item.align.length;i++){if(/^ *-+: *$/.test(item.align[i])){item.align[i]="right"}else if(/^ *:-+: *$/.test(item.align[i])){item.align[i]="center"}else if(/^ *:-+ *$/.test(item.align[i])){item.align[i]="left"}else{item.align[i]=null}}for(i=0;i<item.cells.length;i++){item.cells[i]=item.cells[i].replace(/^ *\| *| *\| *$/g,"").split(/ *\| */)}this.tokens.push(item);continue}if(top&&(cap=this.rules.paragraph.exec(src))){src=src.substring(cap[0].length);this.tokens.push({type:"paragraph",text:cap[1].charAt(cap[1].length-1)==="\n"?cap[1].slice(0,-1):cap[1]});continue}if(cap=this.rules.text.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"text",text:cap[0]});continue}if(src){throw new Error("Infinite loop on byte: "+src.charCodeAt(0))}}return this.tokens};var inline={escape:/^\\([\\`*{}\[\]()#+\-.!_>])/,autolink:/^<([^ >]+(@|:\/)[^ >]+)>/,url:noop,tag:/^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,link:/^!?\[(inside)\]\(href\)/,reflink:/^!?\[(inside)\]\s*\[([^\]]*)\]/,nolink:/^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,strong:/^_\_([\s\S]+?)_\_(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,em:/^\b_((?:[^_]|_\_)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,code:/^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,br:/^ {2,}\n(?!\s*$)/,del:noop,text:/^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/};inline._inside=/(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;inline._href=/\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;inline.link=replace(inline.link)("inside",inline._inside)("href",inline._href)();inline.reflink=replace(inline.reflink)("inside",inline._inside)();inline.normal=merge({},inline);inline.pedantic=merge({},inline.normal,{strong:/^_\_(?=\S)([\s\S]*?\S)_\_(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,em:/^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/});inline.gfm=merge({},inline.normal,{escape:replace(inline.escape)("])","~|])")(),url:/^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,del:/^~~(?=\S)([\s\S]*?\S)~~/,text:replace(inline.text)("]|","~]|")("|","|https?://|")()});inline.breaks=merge({},inline.gfm,{br:replace(inline.br)("{2,}","*")(),text:replace(inline.gfm.text)("{2,}","*")()});function InlineLexer(links,options){this.options=options||marked.defaults;this.links=links;this.rules=inline.normal;this.renderer=this.options.renderer||new Renderer;this.renderer.options=this.options;if(!this.links){throw new Error("Tokens array requires a `links` property.")}if(this.options.gfm){if(this.options.breaks){this.rules=inline.breaks}else{this.rules=inline.gfm}}else if(this.options.pedantic){this.rules=inline.pedantic}}InlineLexer.rules=inline;InlineLexer.output=function(src,links,options){var inline=new InlineLexer(links,options);return inline.output(src)};InlineLexer.prototype.output=function(src){var out="",link,text,href,cap;while(src){if(cap=this.rules.escape.exec(src)){src=src.substring(cap[0].length);out+=cap[1];continue}if(cap=this.rules.autolink.exec(src)){src=src.substring(cap[0].length);if(cap[2]==="@"){text=cap[1].charAt(6)===":"?this.mangle(cap[1].substring(7)):this.mangle(cap[1]);href=this.mangle("mailto:")+text}else{text=escape(cap[1]);href=text}out+=this.renderer.link(href,null,text);continue}if(!this.inLink&&(cap=this.rules.url.exec(src))){src=src.substring(cap[0].length);text=escape(cap[1]);href=text;out+=this.renderer.link(href,null,text);continue}if(cap=this.rules.tag.exec(src)){if(!this.inLink&&/^<a /i.test(cap[0])){this.inLink=true}else if(this.inLink&&/^<\/a>/i.test(cap[0])){this.inLink=false}src=src.substring(cap[0].length);out+=this.options.sanitize?this.options.sanitizer?this.options.sanitizer(cap[0]):escape(cap[0]):cap[0];continue}if(cap=this.rules.link.exec(src)){src=src.substring(cap[0].length);this.inLink=true;out+=this.outputLink(cap,{href:cap[2],title:cap[3]});this.inLink=false;continue}if((cap=this.rules.reflink.exec(src))||(cap=this.rules.nolink.exec(src))){src=src.substring(cap[0].length);link=(cap[2]||cap[1]).replace(/\s+/g," ");link=this.links[link.toLowerCase()];if(!link||!link.href){out+=cap[0].charAt(0);src=cap[0].substring(1)+src;continue}this.inLink=true;out+=this.outputLink(cap,link);this.inLink=false;continue}if(cap=this.rules.strong.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.strong(this.output(cap[2]||cap[1]));continue}if(cap=this.rules.em.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.em(this.output(cap[2]||cap[1]));continue}if(cap=this.rules.code.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.codespan(escape(cap[2],true));continue}if(cap=this.rules.br.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.br();continue}if(cap=this.rules.del.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.del(this.output(cap[1]));continue}if(cap=this.rules.text.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.text(escape(this.smartypants(cap[0])));continue}if(src){throw new Error("Infinite loop on byte: "+src.charCodeAt(0))}}return out};InlineLexer.prototype.outputLink=function(cap,link){var href=escape(link.href),title=link.title?escape(link.title):null;return cap[0].charAt(0)!=="!"?this.renderer.link(href,title,this.output(cap[1])):this.renderer.image(href,title,escape(cap[1]))};InlineLexer.prototype.smartypants=function(text){if(!this.options.smartypants)return text;return text.replace(/---/g,"—").replace(/--/g,"–").replace(/(^|[-\u2014\/(\[{"\s])'/g,"$1‘").replace(/'/g,"’").replace(/(^|[-\u2014\/(\[{\u2018\s])"/g,"$1“").replace(/"/g,"”").replace(/\.{3}/g,"…")};InlineLexer.prototype.mangle=function(text){if(!this.options.mangle)return text;var out="",l=text.length,i=0,ch;for(;i<l;i++){ch=text.charCodeAt(i);if(Math.random()>.5){ch="x"+ch.toString(16)}out+="&#"+ch+";"}return out};function Renderer(options){this.options=options||{}}Renderer.prototype.code=function(code,lang,escaped){if(this.options.highlight){var out=this.options.highlight(code,lang);if(out!=null&&out!==code){escaped=true;code=out}}if(!lang){return"<pre><code>"+(escaped?code:escape(code,true))+"\n</code></pre>"}return'<pre><code class="'+this.options.langPrefix+escape(lang,true)+'">'+(escaped?code:escape(code,true))+"\n</code></pre>\n"};Renderer.prototype.blockquote=function(quote){return"<blockquote>\n"+quote+"</blockquote>\n"};Renderer.prototype.html=function(html){return html};Renderer.prototype.heading=function(text,level,raw){return"<h"+level+' id="'+this.options.headerPrefix+raw.toLowerCase().replace(/[^\w]+/g,"-")+'">'+text+"</h"+level+">\n"};Renderer.prototype.hr=function(){return this.options.xhtml?"<hr/>\n":"<hr>\n"};Renderer.prototype.list=function(body,ordered){var type=ordered?"ol":"ul";return"<"+type+">\n"+body+"</"+type+">\n"};Renderer.prototype.listitem=function(text){return"<li>"+text+"</li>\n"};Renderer.prototype.paragraph=function(text){return"<p>"+text+"</p>\n"};Renderer.prototype.table=function(header,body){return"<table>\n"+"<thead>\n"+header+"</thead>\n"+"<tbody>\n"+body+"</tbody>\n"+"</table>\n"};Renderer.prototype.tablerow=function(content){return"<tr>\n"+content+"</tr>\n"};Renderer.prototype.tablecell=function(content,flags){var type=flags.header?"th":"td";var tag=flags.align?"<"+type+' style="text-align:'+flags.align+'">':"<"+type+">";return tag+content+"</"+type+">\n"};Renderer.prototype.strong=function(text){return"<strong>"+text+"</strong>"};Renderer.prototype.em=function(text){return"<em>"+text+"</em>"};Renderer.prototype.codespan=function(text){return"<code>"+text+"</code>"};Renderer.prototype.br=function(){return this.options.xhtml?"<br/>":"<br>"};Renderer.prototype.del=function(text){return"<del>"+text+"</del>"};Renderer.prototype.link=function(href,title,text){if(this.options.sanitize){try{var prot=decodeURIComponent(unescape(href)).replace(/[^\w:]/g,"").toLowerCase()}catch(e){return""}if(prot.indexOf("javascript:")===0||prot.indexOf("vbscript:")===0||prot.indexOf("data:")===0){return""}}var out='<a href="'+href+'"';if(title){out+=' title="'+title+'"'}out+=">"+text+"</a>";return out};Renderer.prototype.image=function(href,title,text){var out='<img src="'+href+'" alt="'+text+'"';if(title){out+=' title="'+title+'"'}out+=this.options.xhtml?"/>":">";return out};Renderer.prototype.text=function(text){return text};function Parser(options){this.tokens=[];this.token=null;this.options=options||marked.defaults;this.options.renderer=this.options.renderer||new Renderer;this.renderer=this.options.renderer;this.renderer.options=this.options}Parser.parse=function(src,options,renderer){var parser=new Parser(options,renderer);return parser.parse(src)};Parser.prototype.parse=function(src){this.inline=new InlineLexer(src.links,this.options,this.renderer);this.tokens=src.reverse();var out="";while(this.next()){out+=this.tok()}return out};Parser.prototype.next=function(){return this.token=this.tokens.pop()};Parser.prototype.peek=function(){return this.tokens[this.tokens.length-1]||0};Parser.prototype.parseText=function(){var body=this.token.text;while(this.peek().type==="text"){body+="\n"+this.next().text}return this.inline.output(body)};Parser.prototype.tok=function(){switch(this.token.type){case"space":{return""}case"hr":{return this.renderer.hr()}case"heading":{return this.renderer.heading(this.inline.output(this.token.text),this.token.depth,this.token.text)}case"code":{return this.renderer.code(this.token.text,this.token.lang,this.token.escaped)}case"table":{var header="",body="",i,row,cell,flags,j;cell="";for(i=0;i<this.token.header.length;i++){flags={header:true,align:this.token.align[i]};cell+=this.renderer.tablecell(this.inline.output(this.token.header[i]),{header:true,align:this.token.align[i]})}header+=this.renderer.tablerow(cell);for(i=0;i<this.token.cells.length;i++){row=this.token.cells[i];cell="";for(j=0;j<row.length;j++){cell+=this.renderer.tablecell(this.inline.output(row[j]),{header:false,align:this.token.align[j]})}body+=this.renderer.tablerow(cell)}return this.renderer.table(header,body)}case"blockquote_start":{var body="";while(this.next().type!=="blockquote_end"){body+=this.tok()}return this.renderer.blockquote(body)}case"list_start":{var body="",ordered=this.token.ordered;while(this.next().type!=="list_end"){body+=this.tok()}return this.renderer.list(body,ordered)}case"list_item_start":{var body="";while(this.next().type!=="list_item_end"){body+=this.token.type==="text"?this.parseText():this.tok()}return this.renderer.listitem(body)}case"loose_item_start":{var body="";while(this.next().type!=="list_item_end"){body+=this.tok()}return this.renderer.listitem(body)}case"html":{var html=!this.token.pre&&!this.options.pedantic?this.inline.output(this.token.text):this.token.text;return this.renderer.html(html)}case"paragraph":{return this.renderer.paragraph(this.inline.output(this.token.text))}case"text":{return this.renderer.paragraph(this.parseText())}}};function escape(html,encode){return html.replace(!encode?/&(?!#?\w+;)/g:/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function unescape(html){return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/g,function(_,n){n=n.toLowerCase();if(n==="colon")return":";if(n.charAt(0)==="#"){return n.charAt(1)==="x"?String.fromCharCode(parseInt(n.substring(2),16)):String.fromCharCode(+n.substring(1))}return""})}function replace(regex,opt){regex=regex.source;opt=opt||"";return function self(name,val){if(!name)return new RegExp(regex,opt);val=val.source||val;val=val.replace(/(^|[^\[])\^/g,"$1");regex=regex.replace(name,val);return self}}function noop(){}noop.exec=noop;function merge(obj){var i=1,target,key;for(;i<arguments.length;i++){target=arguments[i];for(key in target){if(Object.prototype.hasOwnProperty.call(target,key)){obj[key]=target[key]}}}return obj}function marked(src,opt,callback){if(callback||typeof opt==="function"){if(!callback){callback=opt;opt=null}opt=merge({},marked.defaults,opt||{});var highlight=opt.highlight,tokens,pending,i=0;try{tokens=Lexer.lex(src,opt)}catch(e){return callback(e)}pending=tokens.length;var done=function(err){if(err){opt.highlight=highlight;return callback(err)}var out;try{out=Parser.parse(tokens,opt)}catch(e){err=e}opt.highlight=highlight;return err?callback(err):callback(null,out)};if(!highlight||highlight.length<3){return done()}delete opt.highlight;if(!pending)return done();for(;i<tokens.length;i++){(function(token){if(token.type!=="code"){return--pending||done()}return highlight(token.text,token.lang,function(err,code){if(err)return done(err);if(code==null||code===token.text){return--pending||done()}token.text=code;token.escaped=true;--pending||done()})})(tokens[i])}return}try{if(opt)opt=merge({},marked.defaults,opt);return Parser.parse(Lexer.lex(src,opt),opt)}catch(e){e.message+="\nPlease report this to https://github.com/chjj/marked.";if((opt||marked.defaults).silent){return"<p>An error occured:</p><pre>"+escape(e.message+"",true)+"</pre>"}throw e}}marked.options=marked.setOptions=function(opt){merge(marked.defaults,opt);return marked};marked.defaults={gfm:true,tables:true,breaks:false,pedantic:false,sanitize:false,sanitizer:null,mangle:true,smartLists:false,silent:false,highlight:null,langPrefix:"lang-",smartypants:false,headerPrefix:"",renderer:new Renderer,xhtml:false};marked.Parser=Parser;marked.parser=Parser.parse;marked.Renderer=Renderer;marked.Lexer=Lexer;marked.lexer=Lexer.lex;marked.InlineLexer=InlineLexer;marked.inlineLexer=InlineLexer.output;marked.parse=marked;if(typeof module!=="undefined"&&typeof exports==="object"){module.exports=marked}else if(typeof define==="function"&&define.amd){define(function(){return marked})}else{this.marked=marked}}).call(function(){return this||(typeof window!=="undefined"?window:global)}());

	return module.exports;
}();


// FORMAT OPTIONS FOR MARKED IMPLEMENTATION

function _Markdown_formatOptions(options)
{
	function toHighlight(code, lang)
	{
		if (!lang && elm$core$Maybe$isJust(options.cL))
		{
			lang = options.cL.a;
		}

		if (typeof hljs !== 'undefined' && lang && hljs.listLanguages().indexOf(lang) >= 0)
		{
			return hljs.highlight(lang, code, true).value;
		}

		return code;
	}

	var gfm = options.cT.a;

	return {
		highlight: toHighlight,
		gfm: gfm,
		tables: gfm && gfm.d8,
		breaks: gfm && gfm.dH,
		sanitize: options.$7,
		smartypants: options.dt
	};
}



// SEND REQUEST

var _Http_toTask = F2(function(request, maybeProgress)
{
	return _Scheduler_binding(function(callback)
	{
		var xhr = new XMLHttpRequest();

		_Http_configureProgress(xhr, maybeProgress);

		xhr.addEventListener('error', function() {
			callback(_Scheduler_fail(elm$http$Http$NetworkError));
		});
		xhr.addEventListener('timeout', function() {
			callback(_Scheduler_fail(elm$http$Http$Timeout));
		});
		xhr.addEventListener('load', function() {
			callback(_Http_handleResponse(xhr, request.b1.a));
		});

		try
		{
			xhr.open(request.cd, request.cy, true);
		}
		catch (e)
		{
			return callback(_Scheduler_fail(elm$http$Http$BadUrl(request.cy)));
		}

		_Http_configureRequest(xhr, request);

		var body = request.cG;
		xhr.send(elm$http$Http$Internal$isStringBody(body)
			? (xhr.setRequestHeader('Content-Type', body.a), body.b)
			: body.a
		);

		return function() { xhr.abort(); };
	});
});

function _Http_configureProgress(xhr, maybeProgress)
{
	if (!elm$core$Maybe$isJust(maybeProgress))
	{
		return;
	}

	xhr.addEventListener('progress', function(event) {
		if (!event.lengthComputable)
		{
			return;
		}
		_Scheduler_rawSpawn(maybeProgress.a({
			dI: event.loaded,
			dJ: event.total
		}));
	});
}

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.b5; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}

	xhr.responseType = request.b1.b;
	xhr.withCredentials = request.cz;

	elm$core$Maybe$isJust(request.cv) && (xhr.timeout = request.cv.a);
}


// RESPONSES

function _Http_handleResponse(xhr, responseToResult)
{
	var response = _Http_toResponse(xhr);

	if (xhr.status < 200 || 300 <= xhr.status)
	{
		response.body = xhr.responseText;
		return _Scheduler_fail(elm$http$Http$BadStatus(response));
	}

	var result = responseToResult(response);

	if (elm$core$Result$isOk(result))
	{
		return _Scheduler_succeed(result.a);
	}
	else
	{
		response.body = xhr.responseText;
		return _Scheduler_fail(A2(elm$http$Http$BadPayload, result.a, response));
	}
}

function _Http_toResponse(xhr)
{
	return {
		cy: xhr.responseURL,
		d6: { dM: xhr.status, t: xhr.statusText },
		b5: _Http_parseHeaders(xhr.getAllResponseHeaders()),
		cG: xhr.response
	};
}

function _Http_parseHeaders(rawHeaders)
{
	var headers = elm$core$Dict$empty;

	if (!rawHeaders)
	{
		return headers;
	}

	var headerPairs = rawHeaders.split('\u000d\u000a');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf('\u003a\u0020');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3(elm$core$Dict$update, key, function(oldValue) {
				return elm$core$Maybe$Just(elm$core$Maybe$isJust(oldValue)
					? value + ', ' + oldValue.a
					: value
				);
			}, headers);
		}
	}

	return headers;
}


// EXPECTORS

function _Http_expectStringResponse(responseToResult)
{
	return {
		$: 0,
		b: 'text',
		a: responseToResult
	};
}

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		b: expect.b,
		a: function(response) {
			var convertedResponse = expect.a(response);
			return A2(elm$core$Result$map, func, convertedResponse);
		}
	};
});


// BODY

function _Http_multipart(parts)
{


	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}

	return elm$http$Http$Internal$FormDataBody(formData);
}


function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return elm$core$Maybe$Nothing;
	}
}



// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.dZ,
		impl.ed,
		impl.d7,
		function(sendToApp, initialModel) {
			var view = impl.ee;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.dZ,
		impl.ed,
		impl.d7,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.am && impl.am(sendToApp)
			var view = impl.ee;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.cG);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.dy) && (_VirtualDom_doc.title = title = doc.dy);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.d0;
	var onUrlRequest = impl.d1;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		am: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.dk === next.dk
							&& curr.cV === next.cV
							&& curr.df.a === next.df.a
						)
							? elm$browser$Browser$Internal(next)
							: elm$browser$Browser$External(href)
					));
				}
			});
		},
		dZ: function(flags)
		{
			return A3(impl.dZ, flags, _Browser_getUrl(), key);
		},
		ee: impl.ee,
		ed: impl.ed,
		d7: impl.d7
	});
}

function _Browser_getUrl()
{
	return elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return elm$core$Result$isOk(result) ? elm$core$Maybe$Just(result.a) : elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { dX: 'hidden', dK: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { dX: 'mozHidden', dK: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { dX: 'msHidden', dK: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { dX: 'webkitHidden', dK: 'webkitvisibilitychange' }
		: { dX: 'hidden', dK: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail(elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		dq: _Browser_getScene(),
		dE: {
			eh: _Browser_window.pageXOffset,
			ei: _Browser_window.pageYOffset,
			ef: _Browser_doc.documentElement.clientWidth,
			dV: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		ef: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		dV: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			dq: {
				ef: node.scrollWidth,
				dV: node.scrollHeight
			},
			dE: {
				eh: node.scrollLeft,
				ei: node.scrollTop,
				ef: node.clientWidth,
				dV: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			dq: _Browser_getScene(),
			dE: {
				eh: x,
				ei: y,
				ef: _Browser_doc.documentElement.clientWidth,
				dV: _Browser_doc.documentElement.clientHeight
			},
			dP: {
				eh: x + rect.left,
				ei: y + rect.top,
				ef: rect.width,
				dV: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}
var author$project$Main$LinkClicked = function (a) {
	return {$: 0, a: a};
};
var author$project$Main$UrlChanged = function (a) {
	return {$: 1, a: a};
};
var author$project$Main$Page = function (a) {
	return {$: 1, a: a};
};
var author$project$Main$UniversityMsg = function (a) {
	return {$: 3, a: a};
};
var author$project$Main$PageLoaded = function (a) {
	return {$: 2, a: a};
};
var author$project$Main$StaticPage = F3(
	function (name, markdown, html) {
		return {cX: html, d$: markdown, c8: name};
	});
var elm$core$Array$branchFactor = 32;
var elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var elm$core$Basics$EQ = 1;
var elm$core$Basics$GT = 2;
var elm$core$Basics$LT = 0;
var elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3(elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var elm$core$List$cons = _List_cons;
var elm$core$Dict$toList = function (dict) {
	return A3(
		elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var elm$core$Dict$keys = function (dict) {
	return A3(
		elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2(elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var elm$core$Set$toList = function (_n0) {
	var dict = _n0;
	return elm$core$Dict$keys(dict);
};
var elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var elm$core$Array$foldr = F3(
	function (func, baseCase, _n0) {
		var tree = _n0.c;
		var tail = _n0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3(elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3(elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			elm$core$Elm$JsArray$foldr,
			helper,
			A3(elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var elm$core$Array$toList = function (array) {
	return A3(elm$core$Array$foldr, elm$core$List$cons, _List_Nil, array);
};
var elm$core$Basics$ceiling = _Basics_ceiling;
var elm$core$Basics$fdiv = _Basics_fdiv;
var elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var elm$core$Basics$toFloat = _Basics_toFloat;
var elm$core$Array$shiftStep = elm$core$Basics$ceiling(
	A2(elm$core$Basics$logBase, 2, elm$core$Array$branchFactor));
var elm$core$Elm$JsArray$empty = _JsArray_empty;
var elm$core$Array$empty = A4(elm$core$Array$Array_elm_builtin, 0, elm$core$Array$shiftStep, elm$core$Elm$JsArray$empty, elm$core$Elm$JsArray$empty);
var elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var elm$core$List$reverse = function (list) {
	return A3(elm$core$List$foldl, elm$core$List$cons, _List_Nil, list);
};
var elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _n0 = A2(elm$core$Elm$JsArray$initializeFromList, elm$core$Array$branchFactor, nodes);
			var node = _n0.a;
			var remainingNodes = _n0.b;
			var newAcc = A2(
				elm$core$List$cons,
				elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var elm$core$Basics$eq = _Utils_equal;
var elm$core$Tuple$first = function (_n0) {
	var x = _n0.a;
	return x;
};
var elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = elm$core$Basics$ceiling(nodeListSize / elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2(elm$core$Elm$JsArray$initializeFromList, elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2(elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var elm$core$Basics$add = _Basics_add;
var elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var elm$core$Basics$floor = _Basics_floor;
var elm$core$Basics$gt = _Utils_gt;
var elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var elm$core$Basics$mul = _Basics_mul;
var elm$core$Basics$sub = _Basics_sub;
var elm$core$Elm$JsArray$length = _JsArray_length;
var elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.a) {
			return A4(
				elm$core$Array$Array_elm_builtin,
				elm$core$Elm$JsArray$length(builder.c),
				elm$core$Array$shiftStep,
				elm$core$Elm$JsArray$empty,
				builder.c);
		} else {
			var treeLen = builder.a * elm$core$Array$branchFactor;
			var depth = elm$core$Basics$floor(
				A2(elm$core$Basics$logBase, elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? elm$core$List$reverse(builder.d) : builder.d;
			var tree = A2(elm$core$Array$treeFromBuilder, correctNodeList, builder.a);
			return A4(
				elm$core$Array$Array_elm_builtin,
				elm$core$Elm$JsArray$length(builder.c) + treeLen,
				A2(elm$core$Basics$max, 5, depth * elm$core$Array$shiftStep),
				tree,
				builder.c);
		}
	});
var elm$core$Basics$False = 1;
var elm$core$Basics$idiv = _Basics_idiv;
var elm$core$Basics$lt = _Utils_lt;
var elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					elm$core$Array$builderToArray,
					false,
					{d: nodeList, a: (len / elm$core$Array$branchFactor) | 0, c: tail});
			} else {
				var leaf = elm$core$Array$Leaf(
					A3(elm$core$Elm$JsArray$initialize, elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2(elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var elm$core$Basics$le = _Utils_le;
var elm$core$Basics$remainderBy = _Basics_remainderBy;
var elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return elm$core$Array$empty;
		} else {
			var tailLen = len % elm$core$Array$branchFactor;
			var tail = A3(elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - elm$core$Array$branchFactor;
			return A5(elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var elm$core$Maybe$Nothing = {$: 1};
var elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var elm$core$Basics$True = 0;
var elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var elm$core$Basics$and = _Basics_and;
var elm$core$Basics$append = _Utils_append;
var elm$core$Basics$or = _Basics_or;
var elm$core$Char$toCode = _Char_toCode;
var elm$core$Char$isLower = function (_char) {
	var code = elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var elm$core$Char$isUpper = function (_char) {
	var code = elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var elm$core$Char$isAlpha = function (_char) {
	return elm$core$Char$isLower(_char) || elm$core$Char$isUpper(_char);
};
var elm$core$Char$isDigit = function (_char) {
	var code = elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var elm$core$Char$isAlphaNum = function (_char) {
	return elm$core$Char$isLower(_char) || (elm$core$Char$isUpper(_char) || elm$core$Char$isDigit(_char));
};
var elm$core$List$length = function (xs) {
	return A3(
		elm$core$List$foldl,
		F2(
			function (_n0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var elm$core$List$map2 = _List_map2;
var elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2(elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var elm$core$List$range = F2(
	function (lo, hi) {
		return A3(elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			elm$core$List$map2,
			f,
			A2(
				elm$core$List$range,
				0,
				elm$core$List$length(xs) - 1),
			xs);
	});
var elm$core$String$all = _String_all;
var elm$core$String$fromInt = _String_fromNumber;
var elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var elm$core$String$uncons = _String_uncons;
var elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var elm$json$Json$Decode$indent = function (str) {
	return A2(
		elm$core$String$join,
		'\n    ',
		A2(elm$core$String$split, '\n', str));
};
var elm$json$Json$Encode$encode = _Json_encode;
var elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + (elm$core$String$fromInt(i + 1) + (') ' + elm$json$Json$Decode$indent(
			elm$json$Json$Decode$errorToString(error))));
	});
var elm$json$Json$Decode$errorToString = function (error) {
	return A2(elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _n1 = elm$core$String$uncons(f);
						if (_n1.$ === 1) {
							return false;
						} else {
							var _n2 = _n1.a;
							var _char = _n2.a;
							var rest = _n2.b;
							return elm$core$Char$isAlpha(_char) && A2(elm$core$String$all, elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2(elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + (elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2(elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									elm$core$String$join,
									'',
									elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										elm$core$String$join,
										'',
										elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + (elm$core$String$fromInt(
								elm$core$List$length(errors)) + ' ways:'));
							return A2(
								elm$core$String$join,
								'\n\n',
								A2(
									elm$core$List$cons,
									introduction,
									A2(elm$core$List$indexedMap, elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								elm$core$String$join,
								'',
								elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + (elm$json$Json$Decode$indent(
						A2(elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var elm$json$Json$Encode$string = _Json_wrap;
var elm$core$Basics$identity = function (x) {
	return x;
};
var elm$json$Json$Decode$map = _Json_map1;
var elm$json$Json$Decode$map2 = _Json_map2;
var elm$json$Json$Decode$succeed = _Json_succeed;
var elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			elm$json$Json$Encode$string(string));
	});
var elm$html$Html$Attributes$class = elm$html$Html$Attributes$stringProperty('className');
var elm_explorations$markdown$Markdown$defaultOptions = {
	cL: elm$core$Maybe$Nothing,
	cT: elm$core$Maybe$Just(
		{dH: false, d8: false}),
	$7: true,
	dt: false
};
var elm$core$Maybe$isJust = function (maybe) {
	if (!maybe.$) {
		return true;
	} else {
		return false;
	}
};
var elm_explorations$markdown$Markdown$toHtmlWith = _Markdown_toHtml;
var elm_explorations$markdown$Markdown$toHtml = elm_explorations$markdown$Markdown$toHtmlWith(elm_explorations$markdown$Markdown$defaultOptions);
var author$project$Main$mkStaticPage = F2(
	function (name, markdown) {
		return A3(
			author$project$Main$StaticPage,
			name,
			markdown,
			A2(
				elm_explorations$markdown$Markdown$toHtml,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('md')
					]),
				markdown));
	});
var elm$core$Result$map = F2(
	function (func, ra) {
		if (!ra.$) {
			var a = ra.a;
			return elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return elm$core$Result$Err(e);
		}
	});
var elm$http$Http$Internal$EmptyBody = {$: 0};
var elm$http$Http$emptyBody = elm$http$Http$Internal$EmptyBody;
var elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var elm$core$Dict$empty = elm$core$Dict$RBEmpty_elm_builtin;
var elm$core$Basics$compare = _Utils_compare;
var elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _n1 = A2(elm$core$Basics$compare, targetKey, key);
				switch (_n1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var elm$core$Dict$Black = 1;
var elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var elm$core$Dict$Red = 0;
var elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _n1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _n3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5(elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5(elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _n5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _n6 = left.d;
				var _n7 = _n6.a;
				var llK = _n6.b;
				var llV = _n6.c;
				var llLeft = _n6.d;
				var llRight = _n6.e;
				var lRight = left.e;
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5(elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5(elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5(elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5(elm$core$Dict$RBNode_elm_builtin, 0, key, value, elm$core$Dict$RBEmpty_elm_builtin, elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _n1 = A2(elm$core$Basics$compare, key, nKey);
			switch (_n1) {
				case 0:
					return A5(
						elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3(elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5(elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3(elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _n0 = A3(elm$core$Dict$insertHelp, key, value, dict);
		if ((_n0.$ === -1) && (!_n0.a)) {
			var _n1 = _n0.a;
			var k = _n0.b;
			var v = _n0.c;
			var l = _n0.d;
			var r = _n0.e;
			return A5(elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _n0;
			return x;
		}
	});
var elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _n1 = dict.d;
			var lClr = _n1.a;
			var lK = _n1.b;
			var lV = _n1.c;
			var lLeft = _n1.d;
			var lRight = _n1.e;
			var _n2 = dict.e;
			var rClr = _n2.a;
			var rK = _n2.b;
			var rV = _n2.c;
			var rLeft = _n2.d;
			var _n3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _n2.e;
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5(elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _n4 = dict.d;
			var lClr = _n4.a;
			var lK = _n4.b;
			var lV = _n4.c;
			var lLeft = _n4.d;
			var lRight = _n4.e;
			var _n5 = dict.e;
			var rClr = _n5.a;
			var rK = _n5.b;
			var rV = _n5.c;
			var rLeft = _n5.d;
			var rRight = _n5.e;
			if (clr === 1) {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _n1 = dict.d;
			var lClr = _n1.a;
			var lK = _n1.b;
			var lV = _n1.c;
			var _n2 = _n1.d;
			var _n3 = _n2.a;
			var llK = _n2.b;
			var llV = _n2.c;
			var llLeft = _n2.d;
			var llRight = _n2.e;
			var lRight = _n1.e;
			var _n4 = dict.e;
			var rClr = _n4.a;
			var rK = _n4.b;
			var rV = _n4.c;
			var rLeft = _n4.d;
			var rRight = _n4.e;
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5(elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5(elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _n5 = dict.d;
			var lClr = _n5.a;
			var lK = _n5.b;
			var lV = _n5.c;
			var lLeft = _n5.d;
			var lRight = _n5.e;
			var _n6 = dict.e;
			var rClr = _n6.a;
			var rK = _n6.b;
			var rV = _n6.c;
			var rLeft = _n6.d;
			var rRight = _n6.e;
			if (clr === 1) {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _n1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5(elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_n2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _n3 = right.a;
							var _n4 = right.d;
							var _n5 = _n4.a;
							return elm$core$Dict$moveRedRight(dict);
						} else {
							break _n2$2;
						}
					} else {
						var _n6 = right.a;
						var _n7 = right.d;
						return elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _n2$2;
				}
			}
			return dict;
		}
	});
var elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _n3 = lLeft.a;
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					elm$core$Dict$removeMin(left),
					right);
			} else {
				var _n4 = elm$core$Dict$moveRedLeft(dict);
				if (_n4.$ === -1) {
					var nColor = _n4.a;
					var nKey = _n4.b;
					var nValue = _n4.c;
					var nLeft = _n4.d;
					var nRight = _n4.e;
					return A5(
						elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _n4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _n6 = lLeft.a;
						return A5(
							elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2(elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _n7 = elm$core$Dict$moveRedLeft(dict);
						if (_n7.$ === -1) {
							var nColor = _n7.a;
							var nKey = _n7.b;
							var nValue = _n7.c;
							var nLeft = _n7.d;
							var nRight = _n7.e;
							return A5(
								elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2(elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2(elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7(elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _n1 = elm$core$Dict$getMin(right);
				if (_n1.$ === -1) {
					var minKey = _n1.b;
					var minValue = _n1.c;
					return A5(
						elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						elm$core$Dict$removeMin(right));
				} else {
					return elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2(elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var elm$core$Dict$remove = F2(
	function (key, dict) {
		var _n0 = A2(elm$core$Dict$removeHelp, key, dict);
		if ((_n0.$ === -1) && (!_n0.a)) {
			var _n1 = _n0.a;
			var k = _n0.b;
			var v = _n0.c;
			var l = _n0.d;
			var r = _n0.e;
			return A5(elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _n0;
			return x;
		}
	});
var elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _n0 = alter(
			A2(elm$core$Dict$get, targetKey, dictionary));
		if (!_n0.$) {
			var value = _n0.a;
			return A3(elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2(elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var elm$http$Http$BadPayload = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var elm$http$Http$BadStatus = function (a) {
	return {$: 3, a: a};
};
var elm$http$Http$BadUrl = function (a) {
	return {$: 0, a: a};
};
var elm$http$Http$NetworkError = {$: 2};
var elm$http$Http$Timeout = {$: 1};
var elm$http$Http$Internal$FormDataBody = function (a) {
	return {$: 2, a: a};
};
var elm$http$Http$Internal$isStringBody = function (body) {
	if (body.$ === 1) {
		return true;
	} else {
		return false;
	}
};
var elm$http$Http$expectStringResponse = _Http_expectStringResponse;
var elm$http$Http$expectString = elm$http$Http$expectStringResponse(
	function (response) {
		return elm$core$Result$Ok(response.cG);
	});
var elm$http$Http$Internal$Request = elm$core$Basics$identity;
var elm$http$Http$request = elm$core$Basics$identity;
var elm$http$Http$getString = function (url) {
	return elm$http$Http$request(
		{cG: elm$http$Http$emptyBody, b1: elm$http$Http$expectString, b5: _List_Nil, cd: 'GET', cv: elm$core$Maybe$Nothing, cy: url, cz: false});
};
var elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var elm$core$Task$Perform = elm$core$Basics$identity;
var elm$core$Task$andThen = _Scheduler_andThen;
var elm$core$Task$succeed = _Scheduler_succeed;
var elm$core$Task$init = elm$core$Task$succeed(0);
var elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							elm$core$List$foldl,
							fn,
							acc,
							elm$core$List$reverse(r4)) : A4(elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4(elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			elm$core$Task$andThen,
			function (a) {
				return elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			elm$core$Task$andThen,
			function (a) {
				return A2(
					elm$core$Task$andThen,
					function (b) {
						return elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var elm$core$Task$sequence = function (tasks) {
	return A3(
		elm$core$List$foldr,
		elm$core$Task$map2(elm$core$List$cons),
		elm$core$Task$succeed(_List_Nil),
		tasks);
};
var elm$core$Platform$sendToApp = _Platform_sendToApp;
var elm$core$Task$spawnCmd = F2(
	function (router, _n0) {
		var task = _n0;
		return _Scheduler_spawn(
			A2(
				elm$core$Task$andThen,
				elm$core$Platform$sendToApp(router),
				task));
	});
var elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			elm$core$Task$map,
			function (_n0) {
				return 0;
			},
			elm$core$Task$sequence(
				A2(
					elm$core$List$map,
					elm$core$Task$spawnCmd(router),
					commands)));
	});
var elm$core$Task$onSelfMsg = F3(
	function (_n0, _n1, _n2) {
		return elm$core$Task$succeed(0);
	});
var elm$core$Task$cmdMap = F2(
	function (tagger, _n0) {
		var task = _n0;
		return A2(elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager(elm$core$Task$init, elm$core$Task$onEffects, elm$core$Task$onSelfMsg, elm$core$Task$cmdMap);
var elm$core$Task$command = _Platform_leaf('Task');
var elm$core$Task$onError = _Scheduler_onError;
var elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return elm$core$Task$command(
			A2(
				elm$core$Task$onError,
				A2(
					elm$core$Basics$composeL,
					A2(elm$core$Basics$composeL, elm$core$Task$succeed, resultToMessage),
					elm$core$Result$Err),
				A2(
					elm$core$Task$andThen,
					A2(
						elm$core$Basics$composeL,
						A2(elm$core$Basics$composeL, elm$core$Task$succeed, resultToMessage),
						elm$core$Result$Ok),
					task)));
	});
var elm$http$Http$toTask = function (_n0) {
	var request_ = _n0;
	return A2(_Http_toTask, request_, elm$core$Maybe$Nothing);
};
var elm$http$Http$send = F2(
	function (resultToMessage, request_) {
		return A2(
			elm$core$Task$attempt,
			resultToMessage,
			elm$http$Http$toTask(request_));
	});
var author$project$Main$loadPage = function (page) {
	return A2(
		elm$http$Http$send,
		function (r) {
			return author$project$Main$PageLoaded(
				A2(
					elm$core$Result$map,
					author$project$Main$mkStaticPage(page),
					r));
		},
		elm$http$Http$getString('/data/pages/' + (page + '.md')));
};
var author$project$University$Home = {$: 0};
var author$project$University$ShowSubject = function (a) {
	return {$: 1, a: a};
};
var elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			elm$core$List$foldl,
			F2(
				function (_n0, obj) {
					var k = _n0.a;
					var v = _n0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var author$project$Graphs$computeGraphLayout = _Platform_outgoingPort(
	'computeGraphLayout',
	function ($) {
		return elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'edges',
					elm$json$Json$Encode$list(
						function ($) {
							return elm$json$Json$Encode$object(
								_List_fromArray(
									[
										_Utils_Tuple2(
										'from',
										elm$json$Json$Encode$string($.dT)),
										_Utils_Tuple2(
										'to',
										elm$json$Json$Encode$string($.ea))
									]));
						})($.b0)),
					_Utils_Tuple2(
					'subjectId',
					elm$json$Json$Encode$string($.ct)),
					_Utils_Tuple2(
					'topics',
					elm$json$Json$Encode$list(elm$json$Json$Encode$string)($.ec))
				]));
	});
var author$project$University$computeGraphLayoutCmd = function (subjectDetails) {
	return author$project$Graphs$computeGraphLayout(
		{
			b0: subjectDetails.b0,
			ct: subjectDetails.c$,
			ec: A2(
				elm$core$List$map,
				function ($) {
					return $.c$;
				},
				subjectDetails.ec)
		});
};
var author$project$University$AjaxErrorMsg = function (a) {
	return {$: 4, a: a};
};
var author$project$University$MyStudentDetailsLoadedMsg = function (a) {
	return {$: 2, a: a};
};
var author$project$University$handleMyStudentDetailsResponse = function (result) {
	if (!result.$) {
		var value = result.a;
		return author$project$University$MyStudentDetailsLoadedMsg(value);
	} else {
		return author$project$University$AjaxErrorMsg('It\'s broken.');
	}
};
var NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom = elm$json$Json$Decode$map2(elm$core$Basics$apR);
var elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded = A2(elm$core$Basics$composeR, elm$json$Json$Decode$succeed, NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom);
var author$project$University$MyStudentDetails = function (foo) {
	return {dS: foo};
};
var author$project$University$myStudentDetailsDecoder = A2(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded,
	'foo',
	elm$json$Json$Decode$succeed(author$project$University$MyStudentDetails));
var elm$json$Json$Decode$decodeString = _Json_runOnString;
var elm$http$Http$expectJson = function (decoder) {
	return elm$http$Http$expectStringResponse(
		function (response) {
			var _n0 = A2(elm$json$Json$Decode$decodeString, decoder, response.cG);
			if (_n0.$ === 1) {
				var decodeError = _n0.a;
				return elm$core$Result$Err(
					elm$json$Json$Decode$errorToString(decodeError));
			} else {
				var value = _n0.a;
				return elm$core$Result$Ok(value);
			}
		});
};
var author$project$University$loadMyStudentDetails = function () {
	var req = elm$http$Http$request(
		{
			cG: elm$http$Http$emptyBody,
			b1: elm$http$Http$expectJson(author$project$University$myStudentDetailsDecoder),
			b5: _List_Nil,
			cd: 'GET',
			cv: elm$core$Maybe$Nothing,
			cy: '/api/students/me',
			cz: false
		});
	return A2(elm$http$Http$send, author$project$University$handleMyStudentDetailsResponse, req);
}();
var author$project$University$SubjectDetailsLoadedMsg = function (a) {
	return {$: 1, a: a};
};
var author$project$University$handleSubjectDetailsResponse = function (result) {
	if (!result.$) {
		var value = result.a;
		return author$project$University$SubjectDetailsLoadedMsg(value);
	} else {
		var e = result.a;
		return author$project$University$AjaxErrorMsg('It\'s broken.');
	}
};
var elm$json$Json$Decode$andThen = _Json_andThen;
var elm$json$Json$Decode$decodeValue = _Json_run;
var elm$json$Json$Decode$fail = _Json_fail;
var elm$json$Json$Decode$null = _Json_decodeNull;
var elm$json$Json$Decode$oneOf = _Json_oneOf;
var elm$json$Json$Decode$value = _Json_decodeValue;
var NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalDecoder = F3(
	function (pathDecoder, valDecoder, fallback) {
		var nullOr = function (decoder) {
			return elm$json$Json$Decode$oneOf(
				_List_fromArray(
					[
						decoder,
						elm$json$Json$Decode$null(fallback)
					]));
		};
		var handleResult = function (input) {
			var _n0 = A2(elm$json$Json$Decode$decodeValue, pathDecoder, input);
			if (!_n0.$) {
				var rawValue = _n0.a;
				var _n1 = A2(
					elm$json$Json$Decode$decodeValue,
					nullOr(valDecoder),
					rawValue);
				if (!_n1.$) {
					var finalResult = _n1.a;
					return elm$json$Json$Decode$succeed(finalResult);
				} else {
					var finalErr = _n1.a;
					return elm$json$Json$Decode$fail(
						elm$json$Json$Decode$errorToString(finalErr));
				}
			} else {
				return elm$json$Json$Decode$succeed(fallback);
			}
		};
		return A2(elm$json$Json$Decode$andThen, handleResult, elm$json$Json$Decode$value);
	});
var elm$json$Json$Decode$field = _Json_decodeField;
var NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional = F4(
	function (key, valDecoder, fallback, decoder) {
		return A2(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A3(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalDecoder,
				A2(elm$json$Json$Decode$field, key, elm$json$Json$Decode$value),
				valDecoder,
				fallback),
			decoder);
	});
var NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required = F3(
	function (key, valDecoder, decoder) {
		return A2(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A2(elm$json$Json$Decode$field, key, valDecoder),
			decoder);
	});
var author$project$University$SubjectDetails = function (id) {
	return function (name) {
		return function (description) {
			return function (headmaster) {
				return function (teachers) {
					return function (tags) {
						return function (image) {
							return function (primary) {
								return function (topics) {
									return function (edges) {
										return function (projects) {
											return function (graphLayout) {
												return {J: description, b0: edges, aX: graphLayout, dU: headmaster, c$: id, b6: image, c8: name, cl: primary, dj: projects, V: tags, d9: teachers, ec: topics};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3(elm$core$List$foldr, elm$core$List$cons, ys, xs);
		}
	});
var elm$core$List$concat = function (lists) {
	return A3(elm$core$List$foldr, elm$core$List$append, _List_Nil, lists);
};
var elm$core$List$concatMap = F2(
	function (f, list) {
		return elm$core$List$concat(
			A2(elm$core$List$map, f, list));
	});
var author$project$University$computeEdges = elm$core$List$concatMap(
	function (topicDetails) {
		return A2(
			elm$core$List$map,
			function (dependency) {
				return {dT: dependency, ea: topicDetails.c$};
			},
			topicDetails.cM);
	});
var author$project$University$Project = F4(
	function (id, name, description, tags) {
		return {J: description, c$: id, c8: name, V: tags};
	});
var elm$json$Json$Decode$list = _Json_decodeList;
var elm$json$Json$Decode$string = _Json_decodeString;
var author$project$University$projectDecoder = A4(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'tags',
	elm$json$Json$Decode$list(elm$json$Json$Decode$string),
	_List_Nil,
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'description',
		elm$json$Json$Decode$string,
		A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'name',
			elm$json$Json$Decode$string,
			A3(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'id',
				elm$json$Json$Decode$string,
				elm$json$Json$Decode$succeed(author$project$University$Project)))));
var author$project$University$TopicDetails = function (id) {
	return function (name) {
		return function (description) {
			return function (tags) {
				return function (dependencies) {
					return function (resources) {
						return function (abilities) {
							return function (assessmentQuestions) {
								return function (tabState) {
									return function (assessmentQuestionsHintPopoverState) {
										return {cB: abilities, cF: assessmentQuestions, aK: assessmentQuestionsHintPopoverState, cM: dependencies, J: description, c$: id, c8: name, co: resources, bK: tabState, V: tags};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var author$project$University$AssessmentQuestion = F2(
	function (question, answerHint) {
		return {cE: answerHint, bC: question};
	});
var author$project$University$assessmentQuestionDecoder = A4(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'answer-hint',
	A2(elm$json$Json$Decode$map, elm$core$Maybe$Just, elm$json$Json$Decode$string),
	elm$core$Maybe$Nothing,
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'question',
		elm$json$Json$Decode$string,
		elm$json$Json$Decode$succeed(author$project$University$AssessmentQuestion)));
var author$project$University$Resource = F4(
	function (name, typ, url, tags) {
		return {c8: name, V: tags, cx: typ, cy: url};
	});
var author$project$University$resourceDecoder = A4(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'tags',
	elm$json$Json$Decode$list(elm$json$Json$Decode$string),
	_List_Nil,
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'url',
		elm$json$Json$Decode$string,
		A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'type',
			elm$json$Json$Decode$string,
			A3(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'name',
				elm$json$Json$Decode$string,
				elm$json$Json$Decode$succeed(author$project$University$Resource)))));
var rundis$elm_bootstrap$Bootstrap$Tab$Showing = 2;
var rundis$elm_bootstrap$Bootstrap$Tab$State = elm$core$Basics$identity;
var rundis$elm_bootstrap$Bootstrap$Tab$initialState = {aC: elm$core$Maybe$Nothing, e: 2};
var author$project$University$topicDetailsDecoder = A2(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded,
	elm$core$Dict$empty,
	A2(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded,
		rundis$elm_bootstrap$Bootstrap$Tab$initialState,
		A4(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
			'assessment-questions',
			elm$json$Json$Decode$list(author$project$University$assessmentQuestionDecoder),
			_List_Nil,
			A4(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
				'abilities',
				elm$json$Json$Decode$list(elm$json$Json$Decode$string),
				_List_Nil,
				A4(
					NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
					'resources',
					elm$json$Json$Decode$list(author$project$University$resourceDecoder),
					_List_Nil,
					A4(
						NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
						'dependencies',
						elm$json$Json$Decode$list(elm$json$Json$Decode$string),
						_List_Nil,
						A4(
							NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
							'tags',
							elm$json$Json$Decode$list(elm$json$Json$Decode$string),
							_List_Nil,
							A3(
								NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
								'description',
								elm$json$Json$Decode$string,
								A3(
									NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
									'name',
									elm$json$Json$Decode$string,
									A3(
										NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
										'id',
										elm$json$Json$Decode$string,
										elm$json$Json$Decode$succeed(author$project$University$TopicDetails)))))))))));
var elm$json$Json$Decode$bool = _Json_decodeBool;
var elm$json$Json$Decode$nullable = function (decoder) {
	return elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				elm$json$Json$Decode$null(elm$core$Maybe$Nothing),
				A2(elm$json$Json$Decode$map, elm$core$Maybe$Just, decoder)
			]));
};
var author$project$University$subjectDetailsDecoder = A2(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded,
	elm$core$Maybe$Nothing,
	A4(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
		'projects',
		elm$json$Json$Decode$list(author$project$University$projectDecoder),
		_List_Nil,
		A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'topics',
			A2(
				elm$json$Json$Decode$map,
				author$project$University$computeEdges,
				elm$json$Json$Decode$list(author$project$University$topicDetailsDecoder)),
			A3(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'topics',
				elm$json$Json$Decode$list(author$project$University$topicDetailsDecoder),
				A4(
					NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
					'primary',
					elm$json$Json$Decode$bool,
					false,
					A3(
						NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'image',
						elm$json$Json$Decode$string,
						A4(
							NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
							'tags',
							elm$json$Json$Decode$list(elm$json$Json$Decode$string),
							_List_Nil,
							A4(
								NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
								'teachers',
								elm$json$Json$Decode$list(elm$json$Json$Decode$string),
								_List_Nil,
								A3(
									NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
									'headmaster',
									elm$json$Json$Decode$nullable(elm$json$Json$Decode$string),
									A3(
										NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
										'description',
										elm$json$Json$Decode$string,
										A3(
											NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
											'name',
											elm$json$Json$Decode$string,
											A3(
												NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
												'id',
												elm$json$Json$Decode$string,
												elm$json$Json$Decode$succeed(author$project$University$SubjectDetails)))))))))))));
var author$project$University$loadSubjectDetails = function (subjectId) {
	var req = elm$http$Http$request(
		{
			cG: elm$http$Http$emptyBody,
			b1: elm$http$Http$expectJson(author$project$University$subjectDetailsDecoder),
			b5: _List_Nil,
			cd: 'GET',
			cv: elm$core$Maybe$Nothing,
			cy: '/data/core-curriculum/knowledge/' + (subjectId + '.json'),
			cz: false
		});
	return A2(elm$http$Http$send, author$project$University$handleSubjectDetailsResponse, req);
};
var author$project$University$SubjectSummariesLoadedMsg = function (a) {
	return {$: 0, a: a};
};
var author$project$University$handleSubjectSummariesResponse = function (result) {
	if (!result.$) {
		var value = result.a;
		return author$project$University$SubjectSummariesLoadedMsg(value);
	} else {
		return author$project$University$AjaxErrorMsg('It\'s broken.');
	}
};
var author$project$University$SubjectSummary = F7(
	function (id, name, description, tags, topics, image, primary) {
		return {J: description, c$: id, b6: image, c8: name, cl: primary, V: tags, ec: topics};
	});
var author$project$University$TopicSummary = F3(
	function (id, name, tags) {
		return {c$: id, c8: name, V: tags};
	});
var elm$json$Json$Decode$map3 = _Json_map3;
var author$project$University$topicSummaryDecoder = A4(
	elm$json$Json$Decode$map3,
	author$project$University$TopicSummary,
	A2(elm$json$Json$Decode$field, 'id', elm$json$Json$Decode$string),
	A2(elm$json$Json$Decode$field, 'name', elm$json$Json$Decode$string),
	A2(
		elm$json$Json$Decode$field,
		'tags',
		elm$json$Json$Decode$list(elm$json$Json$Decode$string)));
var elm$json$Json$Decode$map7 = _Json_map7;
var author$project$University$subjectSummaryDecoder = A8(
	elm$json$Json$Decode$map7,
	author$project$University$SubjectSummary,
	A2(elm$json$Json$Decode$field, 'id', elm$json$Json$Decode$string),
	A2(elm$json$Json$Decode$field, 'name', elm$json$Json$Decode$string),
	A2(elm$json$Json$Decode$field, 'description', elm$json$Json$Decode$string),
	A2(
		elm$json$Json$Decode$field,
		'tags',
		elm$json$Json$Decode$list(elm$json$Json$Decode$string)),
	A2(
		elm$json$Json$Decode$field,
		'topics',
		elm$json$Json$Decode$list(author$project$University$topicSummaryDecoder)),
	A2(elm$json$Json$Decode$field, 'image', elm$json$Json$Decode$string),
	A2(elm$json$Json$Decode$field, 'primary', elm$json$Json$Decode$bool));
var author$project$University$subjectSummariesDecoder = elm$json$Json$Decode$list(author$project$University$subjectSummaryDecoder);
var author$project$University$loadSubjectSummaries = function () {
	var req = elm$http$Http$request(
		{
			cG: elm$http$Http$emptyBody,
			b1: elm$http$Http$expectJson(author$project$University$subjectSummariesDecoder),
			b5: _List_Nil,
			cd: 'GET',
			cv: elm$core$Maybe$Nothing,
			cy: '/api/core-curriculum',
			cz: false
		});
	return A2(elm$http$Http$send, author$project$University$handleSubjectSummariesResponse, req);
}();
var elm$core$Platform$Cmd$batch = _Platform_batch;
var elm$core$Platform$Cmd$none = elm$core$Platform$Cmd$batch(_List_Nil);
var author$project$University$routeLoadCmd = F2(
	function (model, r) {
		routeLoadCmd:
		while (true) {
			switch (r.$) {
				case 0:
					return elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								function () {
								var _n1 = model.an;
								if (_n1.$ === 1) {
									return author$project$University$loadSubjectSummaries;
								} else {
									return elm$core$Platform$Cmd$none;
								}
							}(),
								function () {
								var _n2 = model.ba;
								if (_n2.$ === 1) {
									return author$project$University$loadMyStudentDetails;
								} else {
									return elm$core$Platform$Cmd$none;
								}
							}()
							]));
				case 1:
					var subjectId = r.a;
					return elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								A2(author$project$University$routeLoadCmd, model, author$project$University$Home),
								function () {
								var _n3 = A2(elm$core$Dict$get, subjectId, model.k);
								if (_n3.$ === 1) {
									return author$project$University$loadSubjectDetails(subjectId);
								} else {
									var subjectDetails = _n3.a;
									var _n4 = subjectDetails.aX;
									if (_n4.$ === 1) {
										return author$project$University$computeGraphLayoutCmd(subjectDetails);
									} else {
										return elm$core$Platform$Cmd$none;
									}
								}
							}()
							]));
				default:
					var subject = r.a;
					var $temp$model = model,
						$temp$r = author$project$University$ShowSubject(subject);
					model = $temp$model;
					r = $temp$r;
					continue routeLoadCmd;
			}
		}
	});
var elm$core$Platform$Cmd$map = _Platform_map;
var author$project$Main$routeLoadCmd = F2(
	function (model, r) {
		routeLoadCmd:
		while (true) {
			switch (r.$) {
				case 0:
					var $temp$model = model,
						$temp$r = author$project$Main$Page('home');
					model = $temp$model;
					r = $temp$r;
					continue routeLoadCmd;
				case 1:
					var page = r.a;
					var _n1 = A2(elm$core$Dict$get, page, model.U);
					if (_n1.$ === 1) {
						return author$project$Main$loadPage(page);
					} else {
						var p = _n1.a;
						return elm$core$Platform$Cmd$none;
					}
				case 2:
					var ur = r.a;
					return A2(
						elm$core$Platform$Cmd$map,
						author$project$Main$UniversityMsg,
						A2(author$project$University$routeLoadCmd, model.W, ur));
				default:
					return elm$core$Platform$Cmd$none;
			}
		}
	});
var author$project$Main$NotFound = {$: 5};
var author$project$Main$GuildsRoute = function (a) {
	return {$: 3, a: a};
};
var author$project$Main$Home = {$: 0};
var author$project$Main$UniversityRoute = function (a) {
	return {$: 2, a: a};
};
var author$project$Main$Workshops = {$: 4};
var author$project$Main$Details = function (a) {
	return {$: 1, a: a};
};
var author$project$Main$Listing = {$: 0};
var elm$url$Url$Parser$Parser = elm$core$Basics$identity;
var elm$url$Url$Parser$State = F5(
	function (visited, unvisited, params, frag, value) {
		return {B: frag, D: params, x: unvisited, o: value, E: visited};
	});
var elm$url$Url$Parser$mapState = F2(
	function (func, _n0) {
		var visited = _n0.E;
		var unvisited = _n0.x;
		var params = _n0.D;
		var frag = _n0.B;
		var value = _n0.o;
		return A5(
			elm$url$Url$Parser$State,
			visited,
			unvisited,
			params,
			frag,
			func(value));
	});
var elm$url$Url$Parser$map = F2(
	function (subValue, _n0) {
		var parseArg = _n0;
		return function (_n1) {
			var visited = _n1.E;
			var unvisited = _n1.x;
			var params = _n1.D;
			var frag = _n1.B;
			var value = _n1.o;
			return A2(
				elm$core$List$map,
				elm$url$Url$Parser$mapState(value),
				parseArg(
					A5(elm$url$Url$Parser$State, visited, unvisited, params, frag, subValue)));
		};
	});
var elm$url$Url$Parser$oneOf = function (parsers) {
	return function (state) {
		return A2(
			elm$core$List$concatMap,
			function (_n0) {
				var parser = _n0;
				return parser(state);
			},
			parsers);
	};
};
var elm$url$Url$Parser$s = function (str) {
	return function (_n0) {
		var visited = _n0.E;
		var unvisited = _n0.x;
		var params = _n0.D;
		var frag = _n0.B;
		var value = _n0.o;
		if (!unvisited.b) {
			return _List_Nil;
		} else {
			var next = unvisited.a;
			var rest = unvisited.b;
			return _Utils_eq(next, str) ? _List_fromArray(
				[
					A5(
					elm$url$Url$Parser$State,
					A2(elm$core$List$cons, next, visited),
					rest,
					params,
					frag,
					value)
				]) : _List_Nil;
		}
	};
};
var elm$url$Url$Parser$slash = F2(
	function (_n0, _n1) {
		var parseBefore = _n0;
		var parseAfter = _n1;
		return function (state) {
			return A2(
				elm$core$List$concatMap,
				parseAfter,
				parseBefore(state));
		};
	});
var elm$url$Url$Parser$custom = F2(
	function (tipe, stringToSomething) {
		return function (_n0) {
			var visited = _n0.E;
			var unvisited = _n0.x;
			var params = _n0.D;
			var frag = _n0.B;
			var value = _n0.o;
			if (!unvisited.b) {
				return _List_Nil;
			} else {
				var next = unvisited.a;
				var rest = unvisited.b;
				var _n2 = stringToSomething(next);
				if (!_n2.$) {
					var nextValue = _n2.a;
					return _List_fromArray(
						[
							A5(
							elm$url$Url$Parser$State,
							A2(elm$core$List$cons, next, visited),
							rest,
							params,
							frag,
							value(nextValue))
						]);
				} else {
					return _List_Nil;
				}
			}
		};
	});
var elm$url$Url$Parser$string = A2(elm$url$Url$Parser$custom, 'STRING', elm$core$Maybe$Just);
var author$project$Main$guildsRoute = elm$url$Url$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			elm$url$Url$Parser$map,
			author$project$Main$Listing,
			elm$url$Url$Parser$s('guilds')),
			A2(
			elm$url$Url$Parser$map,
			author$project$Main$Details,
			A2(
				elm$url$Url$Parser$slash,
				elm$url$Url$Parser$s('guilds'),
				elm$url$Url$Parser$string))
		]));
var author$project$University$ShowTopic = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var author$project$University$route = elm$url$Url$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			elm$url$Url$Parser$map,
			author$project$University$Home,
			elm$url$Url$Parser$s('university')),
			A2(
			elm$url$Url$Parser$map,
			author$project$University$ShowSubject,
			A2(
				elm$url$Url$Parser$slash,
				elm$url$Url$Parser$s('university'),
				elm$url$Url$Parser$string)),
			A2(
			elm$url$Url$Parser$map,
			author$project$University$ShowTopic,
			A2(
				elm$url$Url$Parser$slash,
				elm$url$Url$Parser$s('university'),
				A2(elm$url$Url$Parser$slash, elm$url$Url$Parser$string, elm$url$Url$Parser$string)))
		]));
var elm$url$Url$Parser$top = function (state) {
	return _List_fromArray(
		[state]);
};
var author$project$Main$route = elm$url$Url$Parser$oneOf(
	_List_fromArray(
		[
			A2(elm$url$Url$Parser$map, author$project$Main$Home, elm$url$Url$Parser$top),
			A2(
			elm$url$Url$Parser$map,
			author$project$Main$Page,
			A2(
				elm$url$Url$Parser$slash,
				elm$url$Url$Parser$s('page'),
				elm$url$Url$Parser$string)),
			A2(elm$url$Url$Parser$map, author$project$Main$UniversityRoute, author$project$University$route),
			A2(elm$url$Url$Parser$map, author$project$Main$GuildsRoute, author$project$Main$guildsRoute),
			A2(
			elm$url$Url$Parser$map,
			author$project$Main$Workshops,
			elm$url$Url$Parser$s('workshops'))
		]));
var elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var elm$url$Url$Parser$getFirstMatch = function (states) {
	getFirstMatch:
	while (true) {
		if (!states.b) {
			return elm$core$Maybe$Nothing;
		} else {
			var state = states.a;
			var rest = states.b;
			var _n1 = state.x;
			if (!_n1.b) {
				return elm$core$Maybe$Just(state.o);
			} else {
				if ((_n1.a === '') && (!_n1.b.b)) {
					return elm$core$Maybe$Just(state.o);
				} else {
					var $temp$states = rest;
					states = $temp$states;
					continue getFirstMatch;
				}
			}
		}
	}
};
var elm$url$Url$Parser$removeFinalEmpty = function (segments) {
	if (!segments.b) {
		return _List_Nil;
	} else {
		if ((segments.a === '') && (!segments.b.b)) {
			return _List_Nil;
		} else {
			var segment = segments.a;
			var rest = segments.b;
			return A2(
				elm$core$List$cons,
				segment,
				elm$url$Url$Parser$removeFinalEmpty(rest));
		}
	}
};
var elm$url$Url$Parser$preparePath = function (path) {
	var _n0 = A2(elm$core$String$split, '/', path);
	if (_n0.b && (_n0.a === '')) {
		var segments = _n0.b;
		return elm$url$Url$Parser$removeFinalEmpty(segments);
	} else {
		var segments = _n0;
		return elm$url$Url$Parser$removeFinalEmpty(segments);
	}
};
var elm$url$Url$percentDecode = _Url_percentDecode;
var elm$url$Url$Parser$addToParametersHelp = F2(
	function (value, maybeList) {
		if (maybeList.$ === 1) {
			return elm$core$Maybe$Just(
				_List_fromArray(
					[value]));
		} else {
			var list = maybeList.a;
			return elm$core$Maybe$Just(
				A2(elm$core$List$cons, value, list));
		}
	});
var elm$url$Url$Parser$addParam = F2(
	function (segment, dict) {
		var _n0 = A2(elm$core$String$split, '=', segment);
		if ((_n0.b && _n0.b.b) && (!_n0.b.b.b)) {
			var rawKey = _n0.a;
			var _n1 = _n0.b;
			var rawValue = _n1.a;
			var _n2 = elm$url$Url$percentDecode(rawKey);
			if (_n2.$ === 1) {
				return dict;
			} else {
				var key = _n2.a;
				var _n3 = elm$url$Url$percentDecode(rawValue);
				if (_n3.$ === 1) {
					return dict;
				} else {
					var value = _n3.a;
					return A3(
						elm$core$Dict$update,
						key,
						elm$url$Url$Parser$addToParametersHelp(value),
						dict);
				}
			}
		} else {
			return dict;
		}
	});
var elm$url$Url$Parser$prepareQuery = function (maybeQuery) {
	if (maybeQuery.$ === 1) {
		return elm$core$Dict$empty;
	} else {
		var qry = maybeQuery.a;
		return A3(
			elm$core$List$foldr,
			elm$url$Url$Parser$addParam,
			elm$core$Dict$empty,
			A2(elm$core$String$split, '&', qry));
	}
};
var elm$url$Url$Parser$parse = F2(
	function (_n0, url) {
		var parser = _n0;
		return elm$url$Url$Parser$getFirstMatch(
			parser(
				A5(
					elm$url$Url$Parser$State,
					_List_Nil,
					elm$url$Url$Parser$preparePath(url.dd),
					elm$url$Url$Parser$prepareQuery(url.dl),
					url.cS,
					elm$core$Basics$identity)));
	});
var author$project$Main$toRoute = function (url) {
	return A2(
		elm$core$Maybe$withDefault,
		author$project$Main$NotFound,
		A2(elm$url$Url$Parser$parse, author$project$Main$route, url));
};
var author$project$University$emptyModel = {ba: elm$core$Maybe$Nothing, k: elm$core$Dict$empty, an: elm$core$Maybe$Nothing};
var author$project$Main$init = F3(
	function (flags, url, key) {
		var initialRoute = author$project$Main$toRoute(url);
		var initialModel = {Z: elm$core$Maybe$Nothing, ca: key, al: initialRoute, U: elm$core$Dict$empty, W: author$project$University$emptyModel, cy: url};
		return _Utils_Tuple2(
			initialModel,
			A2(author$project$Main$routeLoadCmd, initialModel, initialRoute));
	});
var author$project$Authentication$nobodyAuthenticated = _Platform_incomingPort(
	'nobodyAuthenticated',
	elm$json$Json$Decode$null(0));
var author$project$Authentication$userAuthenticated = _Platform_incomingPort(
	'userAuthenticated',
	A2(
		elm$json$Json$Decode$andThen,
		function (name) {
			return A2(
				elm$json$Json$Decode$andThen,
				function (imageUrl) {
					return A2(
						elm$json$Json$Decode$andThen,
						function (idToken) {
							return A2(
								elm$json$Json$Decode$andThen,
								function (id) {
									return A2(
										elm$json$Json$Decode$andThen,
										function (email) {
											return elm$json$Json$Decode$succeed(
												{cP: email, c$: id, c0: idToken, c1: imageUrl, c8: name});
										},
										A2(elm$json$Json$Decode$field, 'email', elm$json$Json$Decode$string));
								},
								A2(elm$json$Json$Decode$field, 'id', elm$json$Json$Decode$string));
						},
						A2(elm$json$Json$Decode$field, 'idToken', elm$json$Json$Decode$string));
				},
				A2(elm$json$Json$Decode$field, 'imageUrl', elm$json$Json$Decode$string));
		},
		A2(elm$json$Json$Decode$field, 'name', elm$json$Json$Decode$string)));
var elm$json$Json$Decode$float = _Json_decodeFloat;
var author$project$Graphs$graphLayout = _Platform_incomingPort(
	'graphLayout',
	A2(
		elm$json$Json$Decode$andThen,
		function (subjectId) {
			return A2(
				elm$json$Json$Decode$andThen,
				function (nodes) {
					return A2(
						elm$json$Json$Decode$andThen,
						function (graphDimensions) {
							return A2(
								elm$json$Json$Decode$andThen,
								function (edges) {
									return elm$json$Json$Decode$succeed(
										{b0: edges, cU: graphDimensions, da: nodes, ct: subjectId});
								},
								A2(
									elm$json$Json$Decode$field,
									'edges',
									elm$json$Json$Decode$list(
										A2(
											elm$json$Json$Decode$andThen,
											function (points) {
												return elm$json$Json$Decode$succeed(
													{d3: points});
											},
											A2(
												elm$json$Json$Decode$field,
												'points',
												elm$json$Json$Decode$list(
													A2(
														elm$json$Json$Decode$andThen,
														function (y) {
															return A2(
																elm$json$Json$Decode$andThen,
																function (x) {
																	return elm$json$Json$Decode$succeed(
																		{eh: x, ei: y});
																},
																A2(elm$json$Json$Decode$field, 'x', elm$json$Json$Decode$float));
														},
														A2(elm$json$Json$Decode$field, 'y', elm$json$Json$Decode$float))))))));
						},
						A2(
							elm$json$Json$Decode$field,
							'graphDimensions',
							A2(
								elm$json$Json$Decode$andThen,
								function (width) {
									return A2(
										elm$json$Json$Decode$andThen,
										function (height) {
											return elm$json$Json$Decode$succeed(
												{dV: height, ef: width});
										},
										A2(elm$json$Json$Decode$field, 'height', elm$json$Json$Decode$float));
								},
								A2(elm$json$Json$Decode$field, 'width', elm$json$Json$Decode$float))));
				},
				A2(
					elm$json$Json$Decode$field,
					'nodes',
					elm$json$Json$Decode$list(
						A2(
							elm$json$Json$Decode$andThen,
							function (top) {
								return A2(
									elm$json$Json$Decode$andThen,
									function (left) {
										return A2(
											elm$json$Json$Decode$andThen,
											function (id) {
												return elm$json$Json$Decode$succeed(
													{c$: id, d_: left, eb: top});
											},
											A2(elm$json$Json$Decode$field, 'id', elm$json$Json$Decode$string));
									},
									A2(elm$json$Json$Decode$field, 'left', elm$json$Json$Decode$float));
							},
							A2(elm$json$Json$Decode$field, 'top', elm$json$Json$Decode$float)))));
		},
		A2(elm$json$Json$Decode$field, 'subjectId', elm$json$Json$Decode$string)));
var author$project$Main$NobodyAuthenticated = {$: 5};
var author$project$Main$UserAuthenticated = function (a) {
	return {$: 4, a: a};
};
var author$project$University$GraphLayoutComputed = function (a) {
	return {$: 3, a: a};
};
var elm$core$Basics$always = F2(
	function (a, _n0) {
		return a;
	});
var elm$core$Platform$Sub$batch = _Platform_batch;
var author$project$Main$subscriptions = function (_n0) {
	return elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				author$project$Graphs$graphLayout(
				function (m) {
					return author$project$Main$UniversityMsg(
						author$project$University$GraphLayoutComputed(m));
				}),
				author$project$Authentication$userAuthenticated(author$project$Main$UserAuthenticated),
				author$project$Authentication$nobodyAuthenticated(
				elm$core$Basics$always(author$project$Main$NobodyAuthenticated))
			]));
};
var elm$json$Json$Encode$null = _Json_encodeNull;
var author$project$Authentication$requestAuthentication = _Platform_outgoingPort(
	'requestAuthentication',
	function ($) {
		return elm$json$Json$Encode$null;
	});
var author$project$Authentication$requestLogout = _Platform_outgoingPort(
	'requestLogout',
	function ($) {
		return elm$json$Json$Encode$null;
	});
var arturopala$elm_monocle$Monocle$Common$dict = function (key) {
	return {
		aW: elm$core$Dict$get(key),
		ds: elm$core$Dict$insert(key)
	};
};
var arturopala$elm_monocle$Monocle$Lens$modify = F2(
	function (lens, f) {
		var mf = function (a) {
			return function (b) {
				return A2(lens.ds, b, a);
			}(
				f(
					lens.b3(a)));
		};
		return mf;
	});
var arturopala$elm_monocle$Monocle$Optional$Optional = F2(
	function (getOption, set) {
		return {aW: getOption, ds: set};
	});
var arturopala$elm_monocle$Monocle$Compose$lensWithOptional = F2(
	function (inner, outer) {
		var set = function (c) {
			return A2(
				arturopala$elm_monocle$Monocle$Lens$modify,
				outer,
				inner.ds(c));
		};
		var getOption = A2(elm$core$Basics$composeR, outer.b3, inner.aW);
		return A2(arturopala$elm_monocle$Monocle$Optional$Optional, getOption, set);
	});
var arturopala$elm_monocle$Monocle$Optional$flip = F3(
	function (f, b, a) {
		return A2(f, a, b);
	});
var elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return elm$core$Maybe$Just(
				f(value));
		} else {
			return elm$core$Maybe$Nothing;
		}
	});
var arturopala$elm_monocle$Monocle$Optional$modifyOption = F2(
	function (opt, fx) {
		var mf = function (a) {
			return A2(
				elm$core$Maybe$map,
				A2(
					elm$core$Basics$composeR,
					fx,
					A2(arturopala$elm_monocle$Monocle$Optional$flip, opt.ds, a)),
				opt.aW(a));
		};
		return mf;
	});
var arturopala$elm_monocle$Monocle$Optional$modify = F2(
	function (opt, fx) {
		var mf = function (a) {
			return A2(
				elm$core$Maybe$withDefault,
				a,
				A3(arturopala$elm_monocle$Monocle$Optional$modifyOption, opt, fx, a));
		};
		return mf;
	});
var arturopala$elm_monocle$Monocle$Compose$optionalWithLens = F2(
	function (inner, outer) {
		var set = function (c) {
			return A2(
				arturopala$elm_monocle$Monocle$Optional$modify,
				outer,
				inner.ds(c));
		};
		var getOption = A2(
			elm$core$Basics$composeR,
			outer.aW,
			elm$core$Maybe$map(inner.b3));
		return A2(arturopala$elm_monocle$Monocle$Optional$Optional, getOption, set);
	});
var arturopala$elm_monocle$Monocle$Optional$compose = F2(
	function (outer, inner) {
		var set = F2(
			function (c, a) {
				return A2(
					elm$core$Maybe$withDefault,
					a,
					A2(
						elm$core$Maybe$map,
						A2(
							elm$core$Basics$composeR,
							inner.ds(c),
							A2(arturopala$elm_monocle$Monocle$Optional$flip, outer.ds, a)),
						outer.aW(a)));
			});
		var getOption = function (a) {
			var _n0 = outer.aW(a);
			if (!_n0.$) {
				var x = _n0.a;
				return inner.aW(x);
			} else {
				return elm$core$Maybe$Nothing;
			}
		};
		return A2(arturopala$elm_monocle$Monocle$Optional$Optional, getOption, set);
	});
var arturopala$elm_monocle$Monocle$Compose$optionalWithOptional = F2(
	function (inner, outer) {
		return A2(arturopala$elm_monocle$Monocle$Optional$compose, outer, inner);
	});
var arturopala$elm_monocle$Monocle$Lens$Lens = F2(
	function (get, set) {
		return {b3: get, ds: set};
	});
var author$project$University$assessmentQuestionsHintPopoverStateInTopicDetails = A2(
	arturopala$elm_monocle$Monocle$Lens$Lens,
	function ($) {
		return $.aK;
	},
	F2(
		function (assessmentQuestionsHintPopoverState, topicDetails) {
			return _Utils_update(
				topicDetails,
				{aK: assessmentQuestionsHintPopoverState});
		}));
var elm$core$Basics$neq = _Utils_notEqual;
var elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2(elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return elm$core$Maybe$Just(x);
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var author$project$University$byIdInList = function (id) {
	return A2(
		arturopala$elm_monocle$Monocle$Optional$Optional,
		function (list) {
			return elm$core$List$head(
				A2(
					elm$core$List$filter,
					function (elem) {
						return _Utils_eq(elem.c$, id);
					},
					list));
		},
		F2(
			function (newElem, list) {
				return A2(
					elm$core$List$cons,
					newElem,
					A2(
						elm$core$List$filter,
						function (elem) {
							return !_Utils_eq(elem.c$, id);
						},
						list));
			}));
};
var author$project$University$modelSubjectDetailsDict = A2(
	arturopala$elm_monocle$Monocle$Lens$Lens,
	function ($) {
		return $.k;
	},
	F2(
		function (subjectDetails, model) {
			return _Utils_update(
				model,
				{k: subjectDetails});
		}));
var author$project$University$subjectDetailsTopicDetailsList = A2(
	arturopala$elm_monocle$Monocle$Lens$Lens,
	function ($) {
		return $.ec;
	},
	F2(
		function (topicDetails, subjectDetails) {
			return _Utils_update(
				subjectDetails,
				{ec: topicDetails});
		}));
var author$project$University$tabStateInTopicDetails = A2(
	arturopala$elm_monocle$Monocle$Lens$Lens,
	function ($) {
		return $.bK;
	},
	F2(
		function (tabState, topicDetails) {
			return _Utils_update(
				topicDetails,
				{bK: tabState});
		}));
var author$project$University$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 4:
				var err = msg.a;
				return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
			case 3:
				var graphLayout = msg.a;
				var subjectDetails = A3(
					elm$core$Dict$update,
					graphLayout.ct,
					elm$core$Maybe$map(
						function (sd) {
							return _Utils_update(
								sd,
								{
									aX: elm$core$Maybe$Just(graphLayout)
								});
						}),
					model.k);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{k: subjectDetails}),
					elm$core$Platform$Cmd$none);
			case 0:
				var subjects = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							an: elm$core$Maybe$Just(subjects)
						}),
					elm$core$Platform$Cmd$none);
			case 2:
				var myStudentDetails = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							ba: elm$core$Maybe$Just(myStudentDetails)
						}),
					elm$core$Platform$Cmd$none);
			case 1:
				var subjectDetails = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							k: A3(elm$core$Dict$insert, subjectDetails.c$, subjectDetails, model.k)
						}),
					author$project$University$computeGraphLayoutCmd(subjectDetails));
			case 5:
				var subjectId = msg.a;
				var topicId = msg.b;
				var state = msg.c;
				var lens = A2(
					arturopala$elm_monocle$Monocle$Compose$optionalWithLens,
					author$project$University$tabStateInTopicDetails,
					A2(
						arturopala$elm_monocle$Monocle$Compose$optionalWithOptional,
						author$project$University$byIdInList(topicId),
						A2(
							arturopala$elm_monocle$Monocle$Compose$optionalWithLens,
							author$project$University$subjectDetailsTopicDetailsList,
							A2(
								arturopala$elm_monocle$Monocle$Compose$lensWithOptional,
								arturopala$elm_monocle$Monocle$Common$dict(subjectId),
								author$project$University$modelSubjectDetailsDict))));
				return _Utils_Tuple2(
					A2(lens.ds, state, model),
					elm$core$Platform$Cmd$none);
			default:
				var subjectId = msg.a;
				var topicId = msg.b;
				var question = msg.c;
				var state = msg.d;
				var lens = A2(
					arturopala$elm_monocle$Monocle$Compose$optionalWithOptional,
					arturopala$elm_monocle$Monocle$Common$dict(question),
					A2(
						arturopala$elm_monocle$Monocle$Compose$optionalWithLens,
						author$project$University$assessmentQuestionsHintPopoverStateInTopicDetails,
						A2(
							arturopala$elm_monocle$Monocle$Compose$optionalWithOptional,
							author$project$University$byIdInList(topicId),
							A2(
								arturopala$elm_monocle$Monocle$Compose$optionalWithLens,
								author$project$University$subjectDetailsTopicDetailsList,
								A2(
									arturopala$elm_monocle$Monocle$Compose$lensWithOptional,
									arturopala$elm_monocle$Monocle$Common$dict(subjectId),
									author$project$University$modelSubjectDetailsDict)))));
				return _Utils_Tuple2(
					A2(lens.ds, state, model),
					elm$core$Platform$Cmd$none);
		}
	});
var elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var elm$browser$Browser$Dom$NotFound = elm$core$Basics$identity;
var elm$core$Basics$never = function (_n0) {
	never:
	while (true) {
		var nvr = _n0;
		var $temp$_n0 = nvr;
		_n0 = $temp$_n0;
		continue never;
	}
};
var elm$core$Task$perform = F2(
	function (toMessage, task) {
		return elm$core$Task$command(
			A2(elm$core$Task$map, toMessage, task));
	});
var elm$core$String$length = _String_length;
var elm$core$String$slice = _String_slice;
var elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			elm$core$String$slice,
			n,
			elm$core$String$length(string),
			string);
	});
var elm$core$String$startsWith = _String_startsWith;
var elm$url$Url$Http = 0;
var elm$url$Url$Https = 1;
var elm$core$String$indexes = _String_indexes;
var elm$core$String$isEmpty = function (string) {
	return string === '';
};
var elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3(elm$core$String$slice, 0, n, string);
	});
var elm$core$String$contains = _String_contains;
var elm$core$String$toInt = _String_toInt;
var elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {cS: fragment, cV: host, dd: path, df: port_, dk: protocol, dl: query};
	});
var elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if (elm$core$String$isEmpty(str) || A2(elm$core$String$contains, '@', str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, ':', str);
			if (!_n0.b) {
				return elm$core$Maybe$Just(
					A6(elm$url$Url$Url, protocol, str, elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_n0.b.b) {
					var i = _n0.a;
					var _n1 = elm$core$String$toInt(
						A2(elm$core$String$dropLeft, i + 1, str));
					if (_n1.$ === 1) {
						return elm$core$Maybe$Nothing;
					} else {
						var port_ = _n1;
						return elm$core$Maybe$Just(
							A6(
								elm$url$Url$Url,
								protocol,
								A2(elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return elm$core$Maybe$Nothing;
				}
			}
		}
	});
var elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if (elm$core$String$isEmpty(str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, '/', str);
			if (!_n0.b) {
				return A5(elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _n0.a;
				return A5(
					elm$url$Url$chompBeforePath,
					protocol,
					A2(elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2(elm$core$String$left, i, str));
			}
		}
	});
var elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if (elm$core$String$isEmpty(str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, '?', str);
			if (!_n0.b) {
				return A4(elm$url$Url$chompBeforeQuery, protocol, elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _n0.a;
				return A4(
					elm$url$Url$chompBeforeQuery,
					protocol,
					elm$core$Maybe$Just(
						A2(elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2(elm$core$String$left, i, str));
			}
		}
	});
var elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if (elm$core$String$isEmpty(str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, '#', str);
			if (!_n0.b) {
				return A3(elm$url$Url$chompBeforeFragment, protocol, elm$core$Maybe$Nothing, str);
			} else {
				var i = _n0.a;
				return A3(
					elm$url$Url$chompBeforeFragment,
					protocol,
					elm$core$Maybe$Just(
						A2(elm$core$String$dropLeft, i + 1, str)),
					A2(elm$core$String$left, i, str));
			}
		}
	});
var elm$url$Url$fromString = function (str) {
	return A2(elm$core$String$startsWith, 'http://', str) ? A2(
		elm$url$Url$chompAfterProtocol,
		0,
		A2(elm$core$String$dropLeft, 7, str)) : (A2(elm$core$String$startsWith, 'https://', str) ? A2(
		elm$url$Url$chompAfterProtocol,
		1,
		A2(elm$core$String$dropLeft, 8, str)) : elm$core$Maybe$Nothing);
};
var elm$browser$Browser$Navigation$load = _Browser_load;
var elm$browser$Browser$Navigation$pushUrl = _Browser_pushUrl;
var elm$url$Url$addPort = F2(
	function (maybePort, starter) {
		if (maybePort.$ === 1) {
			return starter;
		} else {
			var port_ = maybePort.a;
			return starter + (':' + elm$core$String$fromInt(port_));
		}
	});
var elm$url$Url$addPrefixed = F3(
	function (prefix, maybeSegment, starter) {
		if (maybeSegment.$ === 1) {
			return starter;
		} else {
			var segment = maybeSegment.a;
			return _Utils_ap(
				starter,
				_Utils_ap(prefix, segment));
		}
	});
var elm$url$Url$toString = function (url) {
	var http = function () {
		var _n0 = url.dk;
		if (!_n0) {
			return 'http://';
		} else {
			return 'https://';
		}
	}();
	return A3(
		elm$url$Url$addPrefixed,
		'#',
		url.cS,
		A3(
			elm$url$Url$addPrefixed,
			'?',
			url.dl,
			_Utils_ap(
				A2(
					elm$url$Url$addPort,
					url.df,
					_Utils_ap(http, url.cV)),
				url.dd)));
};
var author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var urlRequest = msg.a;
				if (!urlRequest.$) {
					var url = urlRequest.a;
					return _Utils_Tuple2(
						model,
						A2(
							elm$browser$Browser$Navigation$pushUrl,
							model.ca,
							elm$url$Url$toString(url)));
				} else {
					var href = urlRequest.a;
					return _Utils_Tuple2(
						model,
						elm$browser$Browser$Navigation$load(href));
				}
			case 1:
				var url = msg.a;
				var newRoute = author$project$Main$toRoute(url);
				var newModel = _Utils_update(
					model,
					{al: newRoute, cy: url});
				return _Utils_Tuple2(
					newModel,
					A2(author$project$Main$routeLoadCmd, newModel, newRoute));
			case 2:
				if (msg.a.$ === 1) {
					return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
				} else {
					var staticPage = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								U: A3(elm$core$Dict$insert, staticPage.c8, staticPage, model.U)
							}),
						elm$core$Platform$Cmd$none);
				}
			case 3:
				var umsg = msg.a;
				var _n2 = A2(author$project$University$update, umsg, model.W);
				var updatedUniversity = _n2.a;
				var cmds = _n2.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{W: updatedUniversity}),
					A2(elm$core$Platform$Cmd$map, author$project$Main$UniversityMsg, cmds));
			case 6:
				return _Utils_Tuple2(
					model,
					author$project$Authentication$requestAuthentication(0));
			case 7:
				return _Utils_Tuple2(
					model,
					author$project$Authentication$requestLogout(0));
			case 4:
				var authenticatedUser = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							Z: elm$core$Maybe$Just(authenticatedUser)
						}),
					elm$core$Platform$Cmd$none);
			default:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{Z: elm$core$Maybe$Nothing}),
					elm$core$Platform$Cmd$none);
		}
	});
var elm$html$Html$div = _VirtualDom_node('div');
var elm$html$Html$Attributes$id = elm$html$Html$Attributes$stringProperty('id');
var author$project$Main$fluid = function (content) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('container-fluid'),
				elm$html$Html$Attributes$id('content')
			]),
		_List_fromArray(
			[content]));
};
var elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var elm$html$Html$text = elm$virtual_dom$VirtualDom$text;
var author$project$Main$viewPage = F2(
	function (model, page) {
		var _n0 = A2(elm$core$Dict$get, page, model.U);
		if (_n0.$ === 1) {
			return author$project$Main$fluid(
				elm$html$Html$text('Loading...'));
		} else {
			var staticPage = _n0.a;
			return author$project$Main$fluid(staticPage.cX);
		}
	});
var author$project$Main$viewRoute = function (r) {
	switch (r.$) {
		case 0:
			return 'Home';
		case 1:
			var p = r.a;
			return 'Page ' + p;
		case 2:
			var ur = r.a;
			return 'University';
		case 3:
			var gr = r.a;
			return 'Guilds';
		case 5:
			return '404';
		default:
			return 'Workshops';
	}
};
var elm$html$Html$a = _VirtualDom_node('a');
var elm$html$Html$Attributes$href = function (url) {
	return A2(
		elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var elm$html$Html$nav = _VirtualDom_node('nav');
var elm$html$Html$ol = _VirtualDom_node('ol');
var elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var elm$html$Html$Attributes$attribute = elm$virtual_dom$VirtualDom$attribute;
var elm$html$Html$li = _VirtualDom_node('li');
var rundis$elm_bootstrap$Bootstrap$Breadcrumb$toListItems = function (items) {
	if (!items.b) {
		return _List_Nil;
	} else {
		if (!items.b.b) {
			var _n1 = items.a;
			var attributes = _n1.a;
			var children = _n1.b;
			return _List_fromArray(
				[
					A2(
					elm$html$Html$li,
					_Utils_ap(
						attributes,
						_List_fromArray(
							[
								A2(elm$html$Html$Attributes$attribute, 'aria-current', 'page'),
								elm$html$Html$Attributes$class('breadcrumb-item active')
							])),
					children)
				]);
		} else {
			var _n2 = items.a;
			var attributes = _n2.a;
			var children = _n2.b;
			var rest = items.b;
			return _Utils_ap(
				_List_fromArray(
					[
						A2(
						elm$html$Html$li,
						_Utils_ap(
							attributes,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('breadcrumb-item')
								])),
						children)
					]),
				rundis$elm_bootstrap$Bootstrap$Breadcrumb$toListItems(rest));
		}
	}
};
var rundis$elm_bootstrap$Bootstrap$Breadcrumb$container = function (items) {
	if (!items.b) {
		return elm$html$Html$text('');
	} else {
		return A2(
			elm$html$Html$nav,
			_List_fromArray(
				[
					A2(elm$html$Html$Attributes$attribute, 'aria-label', 'breadcrumb'),
					A2(elm$html$Html$Attributes$attribute, 'role', 'navigation')
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$ol,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('breadcrumb')
						]),
					rundis$elm_bootstrap$Bootstrap$Breadcrumb$toListItems(items))
				]));
	}
};
var rundis$elm_bootstrap$Bootstrap$Breadcrumb$Item = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var rundis$elm_bootstrap$Bootstrap$Breadcrumb$item = F2(
	function (attributes, children) {
		return A2(rundis$elm_bootstrap$Bootstrap$Breadcrumb$Item, attributes, children);
	});
var author$project$University$viewBreadCrumbs = function (crumbs) {
	var singleItem = function (_n0) {
		var title = _n0.a;
		var maybeHref = _n0.b;
		return A2(
			rundis$elm_bootstrap$Bootstrap$Breadcrumb$item,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					elm$core$Maybe$withDefault,
					elm$html$Html$text(title),
					A2(
						elm$core$Maybe$map,
						function (s) {
							return A2(
								elm$html$Html$a,
								_List_fromArray(
									[
										elm$html$Html$Attributes$href(s)
									]),
								_List_fromArray(
									[
										elm$html$Html$text(title)
									]));
						},
						maybeHref))
				]));
	};
	return rundis$elm_bootstrap$Bootstrap$Breadcrumb$container(
		A2(elm$core$List$map, singleItem, crumbs));
};
var elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2(elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var elm$core$List$takeTailRec = F2(
	function (n, list) {
		return elm$core$List$reverse(
			A3(elm$core$List$takeReverse, n, list, _List_Nil));
	});
var elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _n0 = _Utils_Tuple2(n, list);
			_n0$1:
			while (true) {
				_n0$5:
				while (true) {
					if (!_n0.b.b) {
						return list;
					} else {
						if (_n0.b.b.b) {
							switch (_n0.a) {
								case 1:
									break _n0$1;
								case 2:
									var _n2 = _n0.b;
									var x = _n2.a;
									var _n3 = _n2.b;
									var y = _n3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_n0.b.b.b.b) {
										var _n4 = _n0.b;
										var x = _n4.a;
										var _n5 = _n4.b;
										var y = _n5.a;
										var _n6 = _n5.b;
										var z = _n6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _n0$5;
									}
								default:
									if (_n0.b.b.b.b && _n0.b.b.b.b.b) {
										var _n7 = _n0.b;
										var x = _n7.a;
										var _n8 = _n7.b;
										var y = _n8.a;
										var _n9 = _n8.b;
										var z = _n9.a;
										var _n10 = _n9.b;
										var w = _n10.a;
										var tl = _n10.b;
										return (ctr > 1000) ? A2(
											elm$core$List$cons,
											x,
											A2(
												elm$core$List$cons,
												y,
												A2(
													elm$core$List$cons,
													z,
													A2(
														elm$core$List$cons,
														w,
														A2(elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											elm$core$List$cons,
											x,
											A2(
												elm$core$List$cons,
												y,
												A2(
													elm$core$List$cons,
													z,
													A2(
														elm$core$List$cons,
														w,
														A3(elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _n0$5;
									}
							}
						} else {
							if (_n0.a === 1) {
								break _n0$1;
							} else {
								break _n0$5;
							}
						}
					}
				}
				return list;
			}
			var _n1 = _n0.b;
			var x = _n1.a;
			return _List_fromArray(
				[x]);
		}
	});
var elm$core$List$take = F2(
	function (n, list) {
		return A3(elm$core$List$takeFast, 0, n, list);
	});
var author$project$University$grouped = F2(
	function (size, list) {
		return (_Utils_cmp(
			elm$core$List$length(list),
			size) < 1) ? _List_fromArray(
			[list]) : A2(
			elm$core$List$cons,
			A2(elm$core$List$take, size, list),
			A2(
				author$project$University$grouped,
				size,
				A2(elm$core$List$drop, size, list)));
	});
var elm$html$Html$h5 = _VirtualDom_node('h5');
var elm$html$Html$img = _VirtualDom_node('img');
var elm$html$Html$p = _VirtualDom_node('p');
var elm$html$Html$Attributes$src = function (url) {
	return A2(
		elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var author$project$University$viewSubjectCard = F2(
	function (colCount, subject) {
		var colWidth = (colCount === 2) ? 6 : 4;
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class(
					'col-md-' + (elm$core$String$fromInt(colWidth) + ' d-flex'))
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('card')
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$img,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('card-img-top'),
									elm$html$Html$Attributes$src(subject.b6)
								]),
							_List_Nil),
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('card-body')
								]),
							_List_fromArray(
								[
									A2(
									elm$html$Html$h5,
									_List_fromArray(
										[
											elm$html$Html$Attributes$class('card-title')
										]),
									_List_fromArray(
										[
											elm$html$Html$text(subject.c8)
										])),
									A2(
									elm$html$Html$p,
									_List_fromArray(
										[
											elm$html$Html$Attributes$class('card-text')
										]),
									_List_fromArray(
										[
											elm$html$Html$text(subject.J)
										]))
								])),
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('card-footer')
								]),
							_List_fromArray(
								[
									A2(
									elm$html$Html$a,
									_List_fromArray(
										[
											elm$html$Html$Attributes$class('card-link'),
											elm$html$Html$Attributes$href('/university/' + subject.c$)
										]),
									_List_fromArray(
										[
											elm$html$Html$text('Details')
										]))
								]))
						]))
				]));
	});
var author$project$University$subjectCardRow = F2(
	function (colCount, subjects) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('row mb-4 row-eq-height')
				]),
			A2(
				elm$core$List$map,
				author$project$University$viewSubjectCard(colCount),
				subjects));
	});
var elm$core$List$partition = F2(
	function (pred, list) {
		var step = F2(
			function (x, _n0) {
				var trues = _n0.a;
				var falses = _n0.b;
				return pred(x) ? _Utils_Tuple2(
					A2(elm$core$List$cons, x, trues),
					falses) : _Utils_Tuple2(
					trues,
					A2(elm$core$List$cons, x, falses));
			});
		return A3(
			elm$core$List$foldr,
			step,
			_Utils_Tuple2(_List_Nil, _List_Nil),
			list);
	});
var author$project$University$viewSubjectCards = function (subjects) {
	var _n0 = A2(
		elm$core$List$partition,
		function ($) {
			return $.cl;
		},
		subjects);
	var primary = _n0.a;
	var secondary = _n0.b;
	var primaryPairs = A2(author$project$University$grouped, 2, primary);
	var secondaryTriplets = A2(author$project$University$grouped, 3, secondary);
	return A2(
		elm$html$Html$div,
		_List_Nil,
		elm$core$List$concat(
			_List_fromArray(
				[
					A2(
					elm$core$List$map,
					author$project$University$subjectCardRow(2),
					primaryPairs),
					A2(
					elm$core$List$map,
					author$project$University$subjectCardRow(3),
					secondaryTriplets)
				])));
};
var author$project$University$viewHome = function (subjectSummaries) {
	return A2(
		elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				author$project$University$viewBreadCrumbs(
				_List_fromArray(
					[
						_Utils_Tuple2('University', elm$core$Maybe$Nothing)
					])),
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('mt-4')
					]),
				_List_fromArray(
					[
						author$project$University$viewSubjectCards(subjectSummaries)
					]))
			]));
};
var elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _n0 = f(mx);
		if (!_n0.$) {
			var x = _n0.a;
			return A2(elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			elm$core$List$foldr,
			elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var author$project$University$nodePosition = F2(
	function (graphLayout, topicDetails) {
		return A2(
			elm$core$Maybe$withDefault,
			{d_: 0, eb: 0},
			elm$core$List$head(
				A2(
					elm$core$List$filterMap,
					function (n) {
						return _Utils_eq(n.c$, topicDetails.c$) ? elm$core$Maybe$Just(
							{d_: n.d_, eb: n.eb}) : elm$core$Maybe$Nothing;
					},
					graphLayout.da)));
	});
var elm$core$String$fromFloat = _String_fromNumber;
var author$project$University$edgePath = function (points) {
	var pointPairs = function (pairs) {
		if (pairs.b && pairs.b.b) {
			var first = pairs.a;
			var _n1 = pairs.b;
			var second = _n1.a;
			var remainder = _n1.b;
			return ' Q' + (elm$core$String$fromFloat(first.eh) + (',' + (elm$core$String$fromFloat(first.ei) + (' ' + (elm$core$String$fromFloat(second.eh) + (',' + (elm$core$String$fromFloat(second.ei) + pointPairs(remainder))))))));
		} else {
			return '';
		}
	};
	if (points.b) {
		var point = points.a;
		var remainder = points.b;
		return 'M' + (elm$core$String$fromFloat(point.eh) + (',' + (elm$core$String$fromFloat(point.ei) + pointPairs(remainder))));
	} else {
		return '';
	}
};
var elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var elm$svg$Svg$defs = elm$svg$Svg$trustedNode('defs');
var elm$svg$Svg$marker = elm$svg$Svg$trustedNode('marker');
var elm$svg$Svg$path = elm$svg$Svg$trustedNode('path');
var elm$svg$Svg$svg = elm$svg$Svg$trustedNode('svg');
var elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var elm$svg$Svg$Attributes$id = _VirtualDom_attribute('id');
var elm$svg$Svg$Attributes$markerHeight = _VirtualDom_attribute('markerHeight');
var elm$svg$Svg$Attributes$markerWidth = _VirtualDom_attribute('markerWidth');
var elm$svg$Svg$Attributes$orient = _VirtualDom_attribute('orient');
var elm$svg$Svg$Attributes$refX = _VirtualDom_attribute('refX');
var elm$svg$Svg$Attributes$refY = _VirtualDom_attribute('refY');
var elm$svg$Svg$Attributes$style = _VirtualDom_attribute('style');
var author$project$University$viewEdges = function (graphLayout) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('knowledge-edges')
			]),
		_List_fromArray(
			[
				A2(
				elm$svg$Svg$svg,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$id('edges'),
						elm$svg$Svg$Attributes$style(
						'width: ' + (elm$core$String$fromFloat(graphLayout.cU.ef) + ('px;height: ' + (elm$core$String$fromFloat(graphLayout.cU.dV) + 'px'))))
					]),
				A2(
					elm$core$List$cons,
					A2(
						elm$svg$Svg$defs,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								elm$svg$Svg$marker,
								_List_fromArray(
									[
										elm$svg$Svg$Attributes$id('markerArrow'),
										elm$svg$Svg$Attributes$markerWidth('13'),
										elm$svg$Svg$Attributes$markerHeight('13'),
										elm$svg$Svg$Attributes$refX('2'),
										elm$svg$Svg$Attributes$refY('6'),
										elm$svg$Svg$Attributes$orient('auto')
									]),
								_List_Nil)
							])),
					A2(
						elm$core$List$map,
						function (points) {
							return A2(
								elm$svg$Svg$path,
								_List_fromArray(
									[
										elm$svg$Svg$Attributes$d(
										author$project$University$edgePath(points))
									]),
								_List_Nil);
						},
						A2(
							elm$core$List$map,
							function ($) {
								return $.d3;
							},
							graphLayout.b0))))
			]));
};
var elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var elm$html$Html$span = _VirtualDom_node('span');
var elm$core$Tuple$second = function (_n0) {
	var y = _n0.b;
	return y;
};
var elm$html$Html$Attributes$classList = function (classes) {
	return elm$html$Html$Attributes$class(
		A2(
			elm$core$String$join,
			' ',
			A2(
				elm$core$List$map,
				elm$core$Tuple$first,
				A2(elm$core$List$filter, elm$core$Tuple$second, classes))));
};
var elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var elm$html$Html$Attributes$style = elm$virtual_dom$VirtualDom$style;
var elm$html$Html$Attributes$title = elm$html$Html$Attributes$stringProperty('title');
var author$project$University$viewTopicNode = F3(
	function (subjectId, position, topicDetails) {
		var _n0 = A2(
			elm$core$List$partition,
			function (r) {
				return r.cx === 'video';
			},
			topicDetails.co);
		var videoResources = _n0.a;
		var otherResources = _n0.b;
		return A2(
			elm$html$Html$a,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('knowledge-node'),
					A2(
					elm$html$Html$Attributes$style,
					'left',
					elm$core$String$fromFloat(position.d_) + 'px'),
					A2(
					elm$html$Html$Attributes$style,
					'top',
					elm$core$String$fromFloat(position.eb) + 'px'),
					A2(elm$html$Html$Attributes$attribute, 'data-topic-id', topicDetails.c$),
					elm$html$Html$Attributes$href('/university/' + (subjectId + ('/' + topicDetails.c$)))
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('label')
						]),
					_List_Nil),
					A2(
					elm$html$Html$span,
					_List_Nil,
					_List_fromArray(
						[
							elm$html$Html$text(topicDetails.c8)
						])),
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('resources')
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$span,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('resource'),
									elm$html$Html$Attributes$class('fi-video'),
									elm$html$Html$Attributes$classList(
									_List_fromArray(
										[
											_Utils_Tuple2(
											'hidden',
											elm$core$List$isEmpty(videoResources))
										])),
									elm$html$Html$Attributes$title('Video Resources'),
									A2(elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
								]),
							_List_Nil),
							A2(
							elm$html$Html$span,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('resource'),
									elm$html$Html$Attributes$class('fi-document'),
									elm$html$Html$Attributes$classList(
									_List_fromArray(
										[
											_Utils_Tuple2(
											'hidden',
											elm$core$List$isEmpty(otherResources))
										])),
									elm$html$Html$Attributes$title('Document Resources'),
									A2(elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
								]),
							_List_Nil)
						]))
				]));
	});
var author$project$University$viewKnowledgeGraph = function (subjectDetails) {
	var _n0 = subjectDetails.aX;
	if (_n0.$ === 1) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('knowledge-nodes'),
					elm$html$Html$Attributes$class('hidden')
				]),
			A2(
				elm$core$List$map,
				function (s) {
					return A3(
						author$project$University$viewTopicNode,
						subjectDetails.c$,
						{d_: 0, eb: 0},
						s);
				},
				subjectDetails.ec));
	} else {
		var graphLayout = _n0.a;
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('knowledge-graph-container')
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('knowledge-graph')
						]),
					_List_fromArray(
						[
							author$project$University$viewEdges(graphLayout),
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('knowledge-nodes')
								]),
							A2(
								elm$core$List$map,
								function (s) {
									return A3(
										author$project$University$viewTopicNode,
										subjectDetails.c$,
										A2(author$project$University$nodePosition, graphLayout, s),
										s);
								},
								subjectDetails.ec))
						]))
				]));
	}
};
var author$project$University$viewProjects = function (projects) {
	return A2(
		elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				elm$html$Html$text('TODO PROJECTS')
			]));
};
var elm$html$Html$h1 = _VirtualDom_node('h1');
var author$project$University$viewSubject = function (subjectDetails) {
	return A2(
		elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				author$project$University$viewBreadCrumbs(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'University',
						elm$core$Maybe$Just('/university')),
						_Utils_Tuple2(subjectDetails.c8, elm$core$Maybe$Nothing)
					])),
				A2(
				elm$html$Html$h1,
				_List_Nil,
				_List_fromArray(
					[
						elm$html$Html$text(subjectDetails.c8)
					])),
				author$project$University$viewKnowledgeGraph(subjectDetails),
				author$project$University$viewProjects(subjectDetails.dj)
			]));
};
var author$project$University$TabMsg = F3(
	function (a, b, c) {
		return {$: 5, a: a, b: b, c: c};
	});
var rundis$elm_bootstrap$Bootstrap$Internal$ListGroup$Item = elm$core$Basics$identity;
var rundis$elm_bootstrap$Bootstrap$ListGroup$li = F2(
	function (options, children) {
		return {dL: children, c3: elm$html$Html$li, cg: options};
	});
var elm$html$Html$ul = _VirtualDom_node('ul');
var rundis$elm_bootstrap$Bootstrap$Internal$ListGroup$applyModifier = F2(
	function (modifier, options) {
		switch (modifier.$) {
			case 0:
				var role = modifier.a;
				return _Utils_update(
					options,
					{
						bE: elm$core$Maybe$Just(role)
					});
			case 3:
				return _Utils_update(
					options,
					{aA: true});
			case 2:
				return _Utils_update(
					options,
					{aV: true});
			case 1:
				return _Utils_update(
					options,
					{aB: true});
			default:
				var attrs = modifier.a;
				return _Utils_update(
					options,
					{
						aL: _Utils_ap(options.aL, attrs)
					});
		}
	});
var rundis$elm_bootstrap$Bootstrap$Internal$ListGroup$defaultOptions = {aA: false, aB: false, aL: _List_Nil, aV: false, bE: elm$core$Maybe$Nothing};
var elm$json$Json$Encode$bool = _Json_wrap;
var elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			elm$json$Json$Encode$bool(bool));
	});
var elm$html$Html$Attributes$disabled = elm$html$Html$Attributes$boolProperty('disabled');
var rundis$elm_bootstrap$Bootstrap$Internal$Role$toClass = F2(
	function (prefix, role) {
		return elm$html$Html$Attributes$class(
			prefix + ('-' + function () {
				switch (role) {
					case 0:
						return 'primary';
					case 1:
						return 'secondary';
					case 2:
						return 'success';
					case 3:
						return 'info';
					case 4:
						return 'warning';
					case 5:
						return 'danger';
					case 6:
						return 'light';
					default:
						return 'dark';
				}
			}()));
	});
var rundis$elm_bootstrap$Bootstrap$Internal$ListGroup$itemAttributes = function (options) {
	return _Utils_ap(
		_List_fromArray(
			[
				elm$html$Html$Attributes$classList(
				_List_fromArray(
					[
						_Utils_Tuple2('list-group-item', true),
						_Utils_Tuple2('disabled', options.aV),
						_Utils_Tuple2('active', options.aB),
						_Utils_Tuple2('list-group-item-action', options.aA)
					]))
			]),
		_Utils_ap(
			_List_fromArray(
				[
					elm$html$Html$Attributes$disabled(options.aV)
				]),
			_Utils_ap(
				A2(
					elm$core$Maybe$withDefault,
					_List_Nil,
					A2(
						elm$core$Maybe$map,
						function (r) {
							return _List_fromArray(
								[
									A2(rundis$elm_bootstrap$Bootstrap$Internal$Role$toClass, 'list-group-item', r)
								]);
						},
						options.bE)),
				options.aL)));
};
var rundis$elm_bootstrap$Bootstrap$Internal$ListGroup$renderItem = function (_n0) {
	var itemFn = _n0.c3;
	var options = _n0.cg;
	var children = _n0.dL;
	return A2(
		itemFn,
		rundis$elm_bootstrap$Bootstrap$Internal$ListGroup$itemAttributes(
			A3(elm$core$List$foldl, rundis$elm_bootstrap$Bootstrap$Internal$ListGroup$applyModifier, rundis$elm_bootstrap$Bootstrap$Internal$ListGroup$defaultOptions, options)),
		children);
};
var rundis$elm_bootstrap$Bootstrap$ListGroup$ul = function (items) {
	return A2(
		elm$html$Html$ul,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('list-group')
			]),
		A2(elm$core$List$map, rundis$elm_bootstrap$Bootstrap$Internal$ListGroup$renderItem, items));
};
var author$project$University$viewAbilities = function (abilities) {
	return elm$core$List$isEmpty(abilities) ? A2(elm$html$Html$div, _List_Nil, _List_Nil) : A2(
		elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				rundis$elm_bootstrap$Bootstrap$ListGroup$ul(
				A2(
					elm$core$List$map,
					function (ability) {
						return A2(
							rundis$elm_bootstrap$Bootstrap$ListGroup$li,
							_List_Nil,
							_List_fromArray(
								[
									elm$html$Html$text(ability)
								]));
					},
					abilities))
			]));
};
var author$project$University$AssessmentQuestionHintPopoverMsg = F4(
	function (a, b, c, d) {
		return {$: 6, a: a, b: b, c: c, d: d};
	});
var rundis$elm_bootstrap$Bootstrap$Internal$Button$Attrs = function (a) {
	return {$: 4, a: a};
};
var rundis$elm_bootstrap$Bootstrap$Button$attrs = function (attrs_) {
	return rundis$elm_bootstrap$Bootstrap$Internal$Button$Attrs(attrs_);
};
var elm$html$Html$button = _VirtualDom_node('button');
var elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return elm$core$Maybe$Nothing;
		}
	});
var rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption = function (size) {
	switch (size) {
		case 0:
			return elm$core$Maybe$Nothing;
		case 1:
			return elm$core$Maybe$Just('sm');
		case 2:
			return elm$core$Maybe$Just('md');
		case 3:
			return elm$core$Maybe$Just('lg');
		default:
			return elm$core$Maybe$Just('xl');
	}
};
var rundis$elm_bootstrap$Bootstrap$Internal$Button$applyModifier = F2(
	function (modifier, options) {
		switch (modifier.$) {
			case 0:
				var size = modifier.a;
				return _Utils_update(
					options,
					{
						bI: elm$core$Maybe$Just(size)
					});
			case 1:
				var coloring = modifier.a;
				return _Utils_update(
					options,
					{
						r: elm$core$Maybe$Just(coloring)
					});
			case 2:
				return _Utils_update(
					options,
					{aN: true});
			case 3:
				var val = modifier.a;
				return _Utils_update(
					options,
					{aV: val});
			default:
				var attrs = modifier.a;
				return _Utils_update(
					options,
					{
						aL: _Utils_ap(options.aL, attrs)
					});
		}
	});
var rundis$elm_bootstrap$Bootstrap$Internal$Button$defaultOptions = {aL: _List_Nil, aN: false, r: elm$core$Maybe$Nothing, aV: false, bI: elm$core$Maybe$Nothing};
var rundis$elm_bootstrap$Bootstrap$Internal$Button$roleClass = function (role) {
	switch (role) {
		case 0:
			return 'primary';
		case 1:
			return 'secondary';
		case 2:
			return 'success';
		case 3:
			return 'info';
		case 4:
			return 'warning';
		case 5:
			return 'danger';
		case 6:
			return 'dark';
		case 7:
			return 'light';
		default:
			return 'link';
	}
};
var rundis$elm_bootstrap$Bootstrap$Internal$Button$buttonAttributes = function (modifiers) {
	var options = A3(elm$core$List$foldl, rundis$elm_bootstrap$Bootstrap$Internal$Button$applyModifier, rundis$elm_bootstrap$Bootstrap$Internal$Button$defaultOptions, modifiers);
	return _Utils_ap(
		_List_fromArray(
			[
				elm$html$Html$Attributes$classList(
				_List_fromArray(
					[
						_Utils_Tuple2('btn', true),
						_Utils_Tuple2('btn-block', options.aN),
						_Utils_Tuple2('disabled', options.aV)
					])),
				elm$html$Html$Attributes$disabled(options.aV)
			]),
		_Utils_ap(
			function () {
				var _n0 = A2(elm$core$Maybe$andThen, rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption, options.bI);
				if (!_n0.$) {
					var s = _n0.a;
					return _List_fromArray(
						[
							elm$html$Html$Attributes$class('btn-' + s)
						]);
				} else {
					return _List_Nil;
				}
			}(),
			_Utils_ap(
				function () {
					var _n1 = options.r;
					if (!_n1.$) {
						if (!_n1.a.$) {
							var role = _n1.a.a;
							return _List_fromArray(
								[
									elm$html$Html$Attributes$class(
									'btn-' + rundis$elm_bootstrap$Bootstrap$Internal$Button$roleClass(role))
								]);
						} else {
							var role = _n1.a.a;
							return _List_fromArray(
								[
									elm$html$Html$Attributes$class(
									'btn-outline-' + rundis$elm_bootstrap$Bootstrap$Internal$Button$roleClass(role))
								]);
						}
					} else {
						return _List_Nil;
					}
				}(),
				options.aL)));
};
var rundis$elm_bootstrap$Bootstrap$Button$button = F2(
	function (options, children) {
		return A2(
			elm$html$Html$button,
			rundis$elm_bootstrap$Bootstrap$Internal$Button$buttonAttributes(options),
			children);
	});
var rundis$elm_bootstrap$Bootstrap$Internal$Button$Coloring = function (a) {
	return {$: 1, a: a};
};
var rundis$elm_bootstrap$Bootstrap$Internal$Button$Info = 3;
var rundis$elm_bootstrap$Bootstrap$Internal$Button$Roled = function (a) {
	return {$: 0, a: a};
};
var rundis$elm_bootstrap$Bootstrap$Button$info = rundis$elm_bootstrap$Bootstrap$Internal$Button$Coloring(
	rundis$elm_bootstrap$Bootstrap$Internal$Button$Roled(3));
var rundis$elm_bootstrap$Bootstrap$General$Internal$SM = 1;
var rundis$elm_bootstrap$Bootstrap$Internal$Button$Size = function (a) {
	return {$: 0, a: a};
};
var rundis$elm_bootstrap$Bootstrap$Button$small = rundis$elm_bootstrap$Bootstrap$Internal$Button$Size(1);
var rundis$elm_bootstrap$Bootstrap$Internal$ListGroup$Attrs = function (a) {
	return {$: 4, a: a};
};
var rundis$elm_bootstrap$Bootstrap$ListGroup$attrs = function (attrs_) {
	return rundis$elm_bootstrap$Bootstrap$Internal$ListGroup$Attrs(attrs_);
};
var rundis$elm_bootstrap$Bootstrap$Popover$Config = elm$core$Basics$identity;
var rundis$elm_bootstrap$Bootstrap$Popover$Top = 0;
var rundis$elm_bootstrap$Bootstrap$Popover$config = function (triggerElement) {
	return {dO: elm$core$Maybe$Nothing, s: 0, dy: elm$core$Maybe$Nothing, dD: triggerElement};
};
var rundis$elm_bootstrap$Bootstrap$Popover$Content = elm$core$Basics$identity;
var rundis$elm_bootstrap$Bootstrap$Popover$content = F3(
	function (attributes, children, _n0) {
		var conf = _n0;
		return _Utils_update(
			conf,
			{
				dO: elm$core$Maybe$Just(
					A2(
						elm$html$Html$div,
						A2(
							elm$core$List$cons,
							elm$html$Html$Attributes$class('popover-body'),
							attributes),
						children))
			});
	});
var rundis$elm_bootstrap$Bootstrap$Popover$State = elm$core$Basics$identity;
var rundis$elm_bootstrap$Bootstrap$Popover$initialState = {
	b$: {
		ce: 0,
		be: 0,
		cm: {dV: 0, d_: 0, eb: 0, ef: 0}
	},
	N: false
};
var elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			elm$virtual_dom$VirtualDom$on,
			event,
			elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var rundis$elm_bootstrap$Bootstrap$Popover$forceClose = F2(
	function (_n0, toMsg) {
		var state = _n0;
		return elm$json$Json$Decode$succeed(
			toMsg(
				_Utils_update(
					state,
					{N: false})));
	});
var elm$core$Basics$not = _Basics_not;
var rundis$elm_bootstrap$Bootstrap$Popover$DOMState = F3(
	function (rect, offsetWidth, offsetHeight) {
		return {ce: offsetHeight, be: offsetWidth, cm: rect};
	});
var elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3(elm$core$List$foldr, elm$json$Json$Decode$field, decoder, fields);
	});
var rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$className = A2(
	elm$json$Json$Decode$at,
	_List_fromArray(
		['className']),
	elm$json$Json$Decode$string);
var rundis$elm_bootstrap$Bootstrap$Popover$isPopover = A2(
	elm$json$Json$Decode$andThen,
	function (_class) {
		return A2(elm$core$String$contains, 'popover', _class) ? elm$json$Json$Decode$succeed(true) : elm$json$Json$Decode$succeed(false);
	},
	rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$className);
var rundis$elm_bootstrap$Bootstrap$Popover$popper = F2(
	function (path, decoder) {
		return elm$json$Json$Decode$oneOf(
			_List_fromArray(
				[
					A2(
					elm$json$Json$Decode$andThen,
					function (res) {
						return res ? A2(
							elm$json$Json$Decode$at,
							_Utils_ap(
								path,
								_List_fromArray(
									['nextSibling'])),
							decoder) : elm$json$Json$Decode$fail('');
					},
					A2(
						elm$json$Json$Decode$at,
						_Utils_ap(
							path,
							_List_fromArray(
								['nextSibling'])),
						rundis$elm_bootstrap$Bootstrap$Popover$isPopover)),
					A2(
					elm$json$Json$Decode$andThen,
					function (_n0) {
						return A2(
							rundis$elm_bootstrap$Bootstrap$Popover$popper,
							_Utils_ap(
								path,
								_List_fromArray(
									['parentElement'])),
							decoder);
					},
					A2(
						elm$json$Json$Decode$at,
						_Utils_ap(
							path,
							_List_fromArray(
								['parentElement'])),
						rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$className)),
					elm$json$Json$Decode$fail('No popover found')
				]));
	});
var rundis$elm_bootstrap$Bootstrap$Popover$isTrigger = A2(
	elm$json$Json$Decode$andThen,
	function (_class) {
		return A2(elm$core$String$contains, 'popover-trigger', _class) ? elm$json$Json$Decode$succeed(true) : elm$json$Json$Decode$succeed(false);
	},
	rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$className);
var rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$offsetHeight = A2(elm$json$Json$Decode$field, 'offsetHeight', elm$json$Json$Decode$float);
var rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$offsetWidth = A2(elm$json$Json$Decode$field, 'offsetWidth', elm$json$Json$Decode$float);
var elm$json$Json$Decode$map4 = _Json_map4;
var rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$offsetLeft = A2(elm$json$Json$Decode$field, 'offsetLeft', elm$json$Json$Decode$float);
var rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$offsetParent = F2(
	function (x, decoder) {
		return elm$json$Json$Decode$oneOf(
			_List_fromArray(
				[
					A2(
					elm$json$Json$Decode$field,
					'offsetParent',
					elm$json$Json$Decode$null(x)),
					A2(elm$json$Json$Decode$field, 'offsetParent', decoder)
				]));
	});
var rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$offsetTop = A2(elm$json$Json$Decode$field, 'offsetTop', elm$json$Json$Decode$float);
var rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$scrollLeft = A2(elm$json$Json$Decode$field, 'scrollLeft', elm$json$Json$Decode$float);
var rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$scrollTop = A2(elm$json$Json$Decode$field, 'scrollTop', elm$json$Json$Decode$float);
var rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$position = F2(
	function (x, y) {
		return A2(
			elm$json$Json$Decode$andThen,
			function (_n0) {
				var x_ = _n0.a;
				var y_ = _n0.b;
				return A2(
					rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$offsetParent,
					_Utils_Tuple2(x_, y_),
					A2(rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$position, x_, y_));
			},
			A5(
				elm$json$Json$Decode$map4,
				F4(
					function (scrollLeft_, scrollTop_, offsetLeft_, offsetTop_) {
						return _Utils_Tuple2((x + offsetLeft_) - scrollLeft_, (y + offsetTop_) - scrollTop_);
					}),
				rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$scrollLeft,
				rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$scrollTop,
				rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$offsetLeft,
				rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$offsetTop));
	});
var rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$boundingArea = A4(
	elm$json$Json$Decode$map3,
	F3(
		function (_n0, width, height) {
			var x = _n0.a;
			var y = _n0.b;
			return {dV: height, d_: x, eb: y, ef: width};
		}),
	A2(rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$position, 0, 0),
	rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$offsetWidth,
	rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$offsetHeight);
var rundis$elm_bootstrap$Bootstrap$Popover$trigger = function (path) {
	return elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(
				elm$json$Json$Decode$andThen,
				function (res) {
					return res ? A2(elm$json$Json$Decode$at, path, rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$boundingArea) : elm$json$Json$Decode$fail('');
				},
				A2(elm$json$Json$Decode$at, path, rundis$elm_bootstrap$Bootstrap$Popover$isTrigger)),
				A2(
				elm$json$Json$Decode$andThen,
				function (_n0) {
					return rundis$elm_bootstrap$Bootstrap$Popover$trigger(
						_Utils_ap(
							path,
							_List_fromArray(
								['parentElement'])));
				},
				A2(
					elm$json$Json$Decode$at,
					_Utils_ap(
						path,
						_List_fromArray(
							['parentElement'])),
					rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$className)),
				elm$json$Json$Decode$fail('No trigger found')
			]));
};
var rundis$elm_bootstrap$Bootstrap$Popover$stateDecoder = A4(
	elm$json$Json$Decode$map3,
	rundis$elm_bootstrap$Bootstrap$Popover$DOMState,
	rundis$elm_bootstrap$Bootstrap$Popover$trigger(
		_List_fromArray(
			['target'])),
	A2(
		rundis$elm_bootstrap$Bootstrap$Popover$popper,
		_List_fromArray(
			['target']),
		rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$offsetWidth),
	A2(
		rundis$elm_bootstrap$Bootstrap$Popover$popper,
		_List_fromArray(
			['target']),
		rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$offsetHeight));
var rundis$elm_bootstrap$Bootstrap$Popover$toggleState = F2(
	function (_n0, toMsg) {
		var state = _n0;
		var isActive = state.N;
		return A2(
			elm$json$Json$Decode$andThen,
			function (v) {
				return elm$json$Json$Decode$succeed(
					toMsg(
						(!isActive) ? {b$: v, N: true} : _Utils_update(
							state,
							{N: false})));
			},
			rundis$elm_bootstrap$Bootstrap$Popover$stateDecoder);
	});
var rundis$elm_bootstrap$Bootstrap$Popover$onHover = F2(
	function (state, toMsg) {
		return _List_fromArray(
			[
				elm$html$Html$Attributes$class('popover-trigger'),
				A2(
				elm$html$Html$Events$on,
				'mouseenter',
				A2(rundis$elm_bootstrap$Bootstrap$Popover$toggleState, state, toMsg)),
				A2(
				elm$html$Html$Events$on,
				'mouseleave',
				A2(rundis$elm_bootstrap$Bootstrap$Popover$forceClose, state, toMsg))
			]);
	});
var rundis$elm_bootstrap$Bootstrap$Popover$top = function (_n0) {
	var conf = _n0;
	return _Utils_update(
		conf,
		{s: 0});
};
var elm$core$Basics$negate = function (n) {
	return -n;
};
var rundis$elm_bootstrap$Bootstrap$Popover$calculatePos = F2(
	function (pos, _n0) {
		var rect = _n0.cm;
		var offsetWidth = _n0.be;
		var offsetHeight = _n0.ce;
		switch (pos) {
			case 3:
				return {
					H: elm$core$Maybe$Nothing,
					I: elm$core$Maybe$Just((offsetHeight / 2) - 12),
					d_: (-offsetWidth) - 10,
					eb: (rect.dV / 2) - (offsetHeight / 2)
				};
			case 1:
				return {
					H: elm$core$Maybe$Nothing,
					I: elm$core$Maybe$Just((offsetHeight / 2) - 12),
					d_: rect.ef,
					eb: (rect.dV / 2) - (offsetHeight / 2)
				};
			case 0:
				return {
					H: elm$core$Maybe$Just((offsetWidth / 2) - 12),
					I: elm$core$Maybe$Nothing,
					d_: (rect.ef / 2) - (offsetWidth / 2),
					eb: (-offsetHeight) - 10
				};
			default:
				return {
					H: elm$core$Maybe$Just((offsetWidth / 2) - 12),
					I: elm$core$Maybe$Nothing,
					d_: (rect.ef / 2) - (offsetWidth / 2),
					eb: rect.dV
				};
		}
	});
var rundis$elm_bootstrap$Bootstrap$Popover$directionAttr = function (position) {
	return A2(
		elm$html$Html$Attributes$attribute,
		'x-placement',
		function () {
			switch (position) {
				case 3:
					return 'left';
				case 1:
					return 'right';
				case 0:
					return 'top';
				default:
					return 'bottom';
			}
		}());
};
var rundis$elm_bootstrap$Bootstrap$Popover$positionClass = function (position) {
	switch (position) {
		case 3:
			return _Utils_Tuple2('bs-popover-left', true);
		case 1:
			return _Utils_Tuple2('bs-popover-right', true);
		case 0:
			return _Utils_Tuple2('bs-popover-top', true);
		default:
			return _Utils_Tuple2('bs-popover-bottom', true);
	}
};
var rundis$elm_bootstrap$Bootstrap$Popover$popoverView = F2(
	function (_n0, _n1) {
		var isActive = _n0.N;
		var domState = _n0.b$;
		var conf = _n1;
		var px = function (f) {
			return elm$core$String$fromFloat(f) + 'px';
		};
		var pos = A2(rundis$elm_bootstrap$Bootstrap$Popover$calculatePos, conf.s, domState);
		var styles = isActive ? _List_fromArray(
			[
				A2(
				elm$html$Html$Attributes$style,
				'left',
				px(pos.d_)),
				A2(
				elm$html$Html$Attributes$style,
				'top',
				px(pos.eb)),
				A2(elm$html$Html$Attributes$style, 'display', 'inline-block'),
				A2(
				elm$html$Html$Attributes$style,
				'width',
				px(domState.be))
			]) : _List_fromArray(
			[
				A2(elm$html$Html$Attributes$style, 'left', '-5000px'),
				A2(elm$html$Html$Attributes$style, 'top', '-5000px')
			]);
		var arrowStyles = A2(
			elm$core$List$filterMap,
			elm$core$Basics$identity,
			_List_fromArray(
				[
					A2(
					elm$core$Maybe$map,
					function (t) {
						return A2(
							elm$html$Html$Attributes$style,
							'top',
							px(t));
					},
					pos.I),
					A2(
					elm$core$Maybe$map,
					function (l) {
						return A2(
							elm$html$Html$Attributes$style,
							'left',
							px(l));
					},
					pos.H)
				]));
		return A2(
			elm$html$Html$div,
			_Utils_ap(
				_List_fromArray(
					[
						elm$html$Html$Attributes$classList(
						_List_fromArray(
							[
								_Utils_Tuple2('popover', true),
								_Utils_Tuple2('fade', true),
								_Utils_Tuple2('show', isActive),
								rundis$elm_bootstrap$Bootstrap$Popover$positionClass(conf.s)
							])),
						rundis$elm_bootstrap$Bootstrap$Popover$directionAttr(conf.s)
					]),
				styles),
			A2(
				elm$core$List$filterMap,
				elm$core$Basics$identity,
				_List_fromArray(
					[
						elm$core$Maybe$Just(
						A2(
							elm$html$Html$div,
							A2(
								elm$core$List$cons,
								elm$html$Html$Attributes$class('arrow'),
								arrowStyles),
							_List_Nil)),
						A2(
						elm$core$Maybe$map,
						function (_n2) {
							var t = _n2;
							return t;
						},
						conf.dy),
						A2(
						elm$core$Maybe$map,
						function (_n3) {
							var c = _n3;
							return c;
						},
						conf.dO)
					])));
	});
var rundis$elm_bootstrap$Bootstrap$Popover$view = F2(
	function (state, conf) {
		var triggerElement = conf.dD;
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					A2(elm$html$Html$Attributes$style, 'position', 'relative'),
					A2(elm$html$Html$Attributes$style, 'display', 'inline-block')
				]),
			_List_fromArray(
				[
					triggerElement,
					A2(rundis$elm_bootstrap$Bootstrap$Popover$popoverView, state, conf)
				]));
	});
var author$project$University$viewAssessmentQuestions = F4(
	function (subjectId, topicId, assessmentQuestions, hintStateDict) {
		return elm$core$List$isEmpty(assessmentQuestions) ? A2(
			elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					elm$html$Html$text('No questions')
				])) : A2(
			elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					rundis$elm_bootstrap$Bootstrap$ListGroup$ul(
					A2(
						elm$core$List$map,
						function (assessmentQuestion) {
							var popoverState = A2(
								elm$core$Maybe$withDefault,
								rundis$elm_bootstrap$Bootstrap$Popover$initialState,
								A2(elm$core$Dict$get, assessmentQuestion.bC, hintStateDict));
							var maybeAnswerHint = A2(
								elm$core$Maybe$withDefault,
								_List_Nil,
								A2(
									elm$core$Maybe$map,
									function (answerHintText) {
										return _List_fromArray(
											[
												A2(
												rundis$elm_bootstrap$Bootstrap$Popover$view,
												popoverState,
												A3(
													rundis$elm_bootstrap$Bootstrap$Popover$content,
													_List_Nil,
													_List_fromArray(
														[
															elm$html$Html$text(answerHintText)
														]),
													rundis$elm_bootstrap$Bootstrap$Popover$top(
														rundis$elm_bootstrap$Bootstrap$Popover$config(
															A2(
																rundis$elm_bootstrap$Bootstrap$Button$button,
																_List_fromArray(
																	[
																		rundis$elm_bootstrap$Bootstrap$Button$info,
																		rundis$elm_bootstrap$Bootstrap$Button$small,
																		rundis$elm_bootstrap$Bootstrap$Button$attrs(
																		A2(
																			rundis$elm_bootstrap$Bootstrap$Popover$onHover,
																			popoverState,
																			A3(author$project$University$AssessmentQuestionHintPopoverMsg, subjectId, topicId, assessmentQuestion.bC)))
																	]),
																_List_fromArray(
																	[
																		elm$html$Html$text('Hint')
																	]))))))
											]);
									},
									assessmentQuestion.cE));
							return A2(
								rundis$elm_bootstrap$Bootstrap$ListGroup$li,
								_List_fromArray(
									[
										rundis$elm_bootstrap$Bootstrap$ListGroup$attrs(
										_List_fromArray(
											[
												elm$html$Html$Attributes$class('d-flex'),
												elm$html$Html$Attributes$class('justify-content-between'),
												elm$html$Html$Attributes$class('align-items-center')
											]))
									]),
								A2(
									elm$core$List$cons,
									A2(elm_explorations$markdown$Markdown$toHtml, _List_Nil, assessmentQuestion.bC),
									maybeAnswerHint));
						},
						assessmentQuestions))
				]));
	});
var elm$html$Html$h6 = _VirtualDom_node('h6');
var author$project$University$viewResources = function (resources) {
	var icon = function (resourceType) {
		if (resourceType === 'video') {
			return A2(
				elm$html$Html$span,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('resource'),
						elm$html$Html$Attributes$class('fi-video'),
						elm$html$Html$Attributes$title('Video Resource'),
						A2(elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
					]),
				_List_Nil);
		} else {
			return A2(
				elm$html$Html$span,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('resource'),
						elm$html$Html$Attributes$class('fi-document'),
						elm$html$Html$Attributes$title('Document Resource'),
						A2(elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
					]),
				_List_Nil);
		}
	};
	var item = function (resource) {
		return A2(
			rundis$elm_bootstrap$Bootstrap$ListGroup$li,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					elm$html$Html$a,
					_List_fromArray(
						[
							elm$html$Html$Attributes$href(resource.cy)
						]),
					_List_fromArray(
						[
							icon(resource.cx),
							elm$html$Html$text(resource.c8)
						]))
				]));
	};
	return elm$core$List$isEmpty(resources) ? A2(elm$html$Html$div, _List_Nil, _List_Nil) : A2(
		elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				elm$html$Html$h6,
				_List_Nil,
				_List_fromArray(
					[
						elm$html$Html$text('Resources')
					])),
				rundis$elm_bootstrap$Bootstrap$ListGroup$ul(
				A2(elm$core$List$map, item, resources))
			]));
};
var rundis$elm_bootstrap$Bootstrap$Tab$Config = elm$core$Basics$identity;
var rundis$elm_bootstrap$Bootstrap$Tab$config = function (toMsg) {
	return {aL: _List_Nil, O: false, c4: _List_Nil, P: elm$core$Maybe$Nothing, cw: toMsg, bO: false, F: false};
};
var rundis$elm_bootstrap$Bootstrap$Tab$Item = elm$core$Basics$identity;
var rundis$elm_bootstrap$Bootstrap$Tab$item = function (rec) {
	return {c$: rec.c$, cb: rec.cb, ch: rec.ch};
};
var rundis$elm_bootstrap$Bootstrap$Tab$items = F2(
	function (items_, _n0) {
		var configRec = _n0;
		return _Utils_update(
			configRec,
			{c4: items_});
	});
var rundis$elm_bootstrap$Bootstrap$Tab$Link = elm$core$Basics$identity;
var rundis$elm_bootstrap$Bootstrap$Tab$link = F2(
	function (attributes, children) {
		return {aL: attributes, dL: children};
	});
var rundis$elm_bootstrap$Bootstrap$Tab$Pane = elm$core$Basics$identity;
var rundis$elm_bootstrap$Bootstrap$Tab$pane = F2(
	function (attributes, children) {
		return {aL: attributes, dL: children};
	});
var rundis$elm_bootstrap$Bootstrap$Tab$useHash = F2(
	function (use, _n0) {
		var configRec = _n0;
		return _Utils_update(
			configRec,
			{bO: use});
	});
var rundis$elm_bootstrap$Bootstrap$Tab$getActiveItem = F2(
	function (_n0, configRec) {
		var activeTab = _n0.aC;
		if (activeTab.$ === 1) {
			return elm$core$List$head(configRec.c4);
		} else {
			var id = activeTab.a;
			return function (found) {
				if (!found.$) {
					var f = found.a;
					return elm$core$Maybe$Just(f);
				} else {
					return elm$core$List$head(configRec.c4);
				}
			}(
				elm$core$List$head(
					A2(
						elm$core$List$filter,
						function (_n2) {
							var item_ = _n2;
							return _Utils_eq(item_.c$, id);
						},
						configRec.c4)));
		}
	});
var elm$html$Html$Events$onClick = function (msg) {
	return A2(
		elm$html$Html$Events$on,
		'click',
		elm$json$Json$Decode$succeed(msg));
};
var rundis$elm_bootstrap$Bootstrap$Tab$Hidden = 0;
var rundis$elm_bootstrap$Bootstrap$Tab$Start = 1;
var rundis$elm_bootstrap$Bootstrap$Tab$visibilityTransition = F2(
	function (withAnimation_, visibility) {
		var _n0 = _Utils_Tuple2(withAnimation_, visibility);
		_n0$2:
		while (true) {
			if (_n0.a) {
				switch (_n0.b) {
					case 0:
						var _n1 = _n0.b;
						return 1;
					case 1:
						var _n2 = _n0.b;
						return 2;
					default:
						break _n0$2;
				}
			} else {
				break _n0$2;
			}
		}
		return 2;
	});
var rundis$elm_bootstrap$Bootstrap$Tab$renderLink = F4(
	function (id, active, _n0, configRec) {
		var attributes = _n0.aL;
		var children = _n0.dL;
		var commonClasses = _List_fromArray(
			[
				_Utils_Tuple2('nav-link', true),
				_Utils_Tuple2('active', active)
			]);
		var clickHandler = elm$html$Html$Events$onClick(
			configRec.cw(
				{
					aC: elm$core$Maybe$Just(id),
					e: A2(rundis$elm_bootstrap$Bootstrap$Tab$visibilityTransition, configRec.F && (!active), 0)
				}));
		var linkItem = configRec.bO ? A2(
			elm$html$Html$a,
			_Utils_ap(
				_List_fromArray(
					[
						elm$html$Html$Attributes$classList(commonClasses),
						clickHandler,
						elm$html$Html$Attributes$href('#' + id)
					]),
				attributes),
			children) : A2(
			elm$html$Html$button,
			_Utils_ap(
				_List_fromArray(
					[
						elm$html$Html$Attributes$classList(
						_Utils_ap(
							commonClasses,
							_List_fromArray(
								[
									_Utils_Tuple2('btn', true),
									_Utils_Tuple2('btn-link', true)
								]))),
						clickHandler
					]),
				attributes),
			children);
		return A2(
			elm$html$Html$li,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('nav-item')
				]),
			_List_fromArray(
				[linkItem]));
	});
var rundis$elm_bootstrap$Bootstrap$Tab$transitionStyles = function (opacity) {
	return _List_fromArray(
		[
			A2(
			elm$html$Html$Attributes$style,
			'opacity',
			elm$core$String$fromInt(opacity)),
			A2(elm$html$Html$Attributes$style, '-webkit-transition', 'opacity 0.15s linear'),
			A2(elm$html$Html$Attributes$style, '-o-transition', 'opacity 0.15s linear'),
			A2(elm$html$Html$Attributes$style, 'transition', 'opacity 0.15s linear')
		]);
};
var rundis$elm_bootstrap$Bootstrap$Tab$activeTabAttributes = F2(
	function (_n0, configRec) {
		var visibility = _n0.e;
		switch (visibility) {
			case 0:
				return _List_fromArray(
					[
						A2(elm$html$Html$Attributes$style, 'display', 'none')
					]);
			case 1:
				return _List_fromArray(
					[
						A2(elm$html$Html$Attributes$style, 'display', 'block'),
						A2(elm$html$Html$Attributes$style, 'opacity', '0')
					]);
			default:
				return _Utils_ap(
					_List_fromArray(
						[
							A2(elm$html$Html$Attributes$style, 'display', 'block')
						]),
					rundis$elm_bootstrap$Bootstrap$Tab$transitionStyles(1));
		}
	});
var rundis$elm_bootstrap$Bootstrap$Tab$renderTabPane = F5(
	function (id, active, _n0, state, configRec) {
		var attributes = _n0.aL;
		var children = _n0.dL;
		var displayAttrs = active ? A2(rundis$elm_bootstrap$Bootstrap$Tab$activeTabAttributes, state, configRec) : _List_fromArray(
			[
				A2(elm$html$Html$Attributes$style, 'display', 'none')
			]);
		return A2(
			elm$html$Html$div,
			_Utils_ap(
				_List_fromArray(
					[
						elm$html$Html$Attributes$id(id),
						elm$html$Html$Attributes$class('tab-pane')
					]),
				_Utils_ap(displayAttrs, attributes)),
			children);
	});
var rundis$elm_bootstrap$Bootstrap$Tab$tabAttributes = function (configRec) {
	return _Utils_ap(
		_List_fromArray(
			[
				elm$html$Html$Attributes$classList(
				_List_fromArray(
					[
						_Utils_Tuple2('nav', true),
						_Utils_Tuple2('nav-tabs', !configRec.O),
						_Utils_Tuple2('nav-pills', configRec.O)
					]))
			]),
		_Utils_ap(
			function () {
				var _n0 = configRec.P;
				if (!_n0.$) {
					switch (_n0.a) {
						case 3:
							var _n1 = _n0.a;
							return _List_fromArray(
								[
									elm$html$Html$Attributes$class('nav-justified')
								]);
						case 2:
							var _n2 = _n0.a;
							return _List_fromArray(
								[
									elm$html$Html$Attributes$class('nav-fill')
								]);
						case 0:
							var _n3 = _n0.a;
							return _List_fromArray(
								[
									elm$html$Html$Attributes$class('justify-content-center')
								]);
						default:
							var _n4 = _n0.a;
							return _List_fromArray(
								[
									elm$html$Html$Attributes$class('justify-content-end')
								]);
					}
				} else {
					return _List_Nil;
				}
			}(),
			configRec.aL));
};
var rundis$elm_bootstrap$Bootstrap$Tab$view = F2(
	function (state, _n0) {
		var configRec = _n0;
		var _n1 = A2(rundis$elm_bootstrap$Bootstrap$Tab$getActiveItem, state, configRec);
		if (_n1.$ === 1) {
			return A2(
				elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						elm$html$Html$ul,
						rundis$elm_bootstrap$Bootstrap$Tab$tabAttributes(configRec),
						_List_Nil),
						A2(
						elm$html$Html$div,
						_List_fromArray(
							[
								elm$html$Html$Attributes$class('tab-content')
							]),
						_List_Nil)
					]));
		} else {
			var currentItem = _n1.a;
			return A2(
				elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						elm$html$Html$ul,
						rundis$elm_bootstrap$Bootstrap$Tab$tabAttributes(configRec),
						A2(
							elm$core$List$map,
							function (_n2) {
								var item_ = _n2;
								return A4(
									rundis$elm_bootstrap$Bootstrap$Tab$renderLink,
									item_.c$,
									_Utils_eq(item_.c$, currentItem.c$),
									item_.cb,
									configRec);
							},
							configRec.c4)),
						A2(
						elm$html$Html$div,
						_List_fromArray(
							[
								elm$html$Html$Attributes$class('tab-content')
							]),
						A2(
							elm$core$List$map,
							function (_n3) {
								var item_ = _n3;
								return A5(
									rundis$elm_bootstrap$Bootstrap$Tab$renderTabPane,
									item_.c$,
									_Utils_eq(item_.c$, currentItem.c$),
									item_.ch,
									state,
									configRec);
							},
							configRec.c4))
					]));
		}
	});
var rundis$elm_bootstrap$Bootstrap$Utilities$Spacing$mt3 = elm$html$Html$Attributes$class('mt-3');
var author$project$University$viewTopicTabs = F2(
	function (subjectDetails, topicDetails) {
		return A2(
			rundis$elm_bootstrap$Bootstrap$Tab$view,
			topicDetails.bK,
			A2(
				rundis$elm_bootstrap$Bootstrap$Tab$items,
				_List_fromArray(
					[
						rundis$elm_bootstrap$Bootstrap$Tab$item(
						{
							c$: 'description',
							cb: A2(
								rundis$elm_bootstrap$Bootstrap$Tab$link,
								_List_Nil,
								_List_fromArray(
									[
										elm$html$Html$text('Description')
									])),
							ch: A2(
								rundis$elm_bootstrap$Bootstrap$Tab$pane,
								_List_fromArray(
									[rundis$elm_bootstrap$Bootstrap$Utilities$Spacing$mt3]),
								_List_fromArray(
									[
										A2(elm_explorations$markdown$Markdown$toHtml, _List_Nil, topicDetails.J),
										author$project$University$viewResources(topicDetails.co)
									]))
						}),
						rundis$elm_bootstrap$Bootstrap$Tab$item(
						{
							c$: 'abilities',
							cb: A2(
								rundis$elm_bootstrap$Bootstrap$Tab$link,
								_List_Nil,
								_List_fromArray(
									[
										elm$html$Html$text('Abilities')
									])),
							ch: A2(
								rundis$elm_bootstrap$Bootstrap$Tab$pane,
								_List_fromArray(
									[rundis$elm_bootstrap$Bootstrap$Utilities$Spacing$mt3]),
								_List_fromArray(
									[
										author$project$University$viewAbilities(topicDetails.cB)
									]))
						}),
						rundis$elm_bootstrap$Bootstrap$Tab$item(
						{
							c$: 'self-test',
							cb: A2(
								rundis$elm_bootstrap$Bootstrap$Tab$link,
								_List_Nil,
								_List_fromArray(
									[
										elm$html$Html$text('Test Yourself')
									])),
							ch: A2(
								rundis$elm_bootstrap$Bootstrap$Tab$pane,
								_List_fromArray(
									[rundis$elm_bootstrap$Bootstrap$Utilities$Spacing$mt3]),
								_List_fromArray(
									[
										A4(author$project$University$viewAssessmentQuestions, subjectDetails.c$, topicDetails.c$, topicDetails.cF, topicDetails.aK)
									]))
						})
					]),
				A2(
					rundis$elm_bootstrap$Bootstrap$Tab$useHash,
					true,
					rundis$elm_bootstrap$Bootstrap$Tab$config(
						A2(author$project$University$TabMsg, subjectDetails.c$, topicDetails.c$)))));
	});
var author$project$University$viewTopic = F2(
	function (subjectDetails, topicDetails) {
		return A2(
			elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					author$project$University$viewBreadCrumbs(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'University',
							elm$core$Maybe$Just('/university')),
							_Utils_Tuple2(
							subjectDetails.c8,
							elm$core$Maybe$Just('/university/' + subjectDetails.c$)),
							_Utils_Tuple2(topicDetails.c8, elm$core$Maybe$Nothing)
						])),
					A2(
					elm$html$Html$h1,
					_List_Nil,
					_List_fromArray(
						[
							elm$html$Html$text(topicDetails.c8)
						])),
					A2(author$project$University$viewTopicTabs, subjectDetails, topicDetails)
				]));
	});
var author$project$University$view = F2(
	function (r, model) {
		var _n0 = model.an;
		if (_n0.$ === 1) {
			return elm$html$Html$text('Loading!');
		} else {
			var subjectSummaries = _n0.a;
			switch (r.$) {
				case 0:
					return author$project$University$viewHome(subjectSummaries);
				case 1:
					var subjectId = r.a;
					var _n2 = A2(elm$core$Dict$get, subjectId, model.k);
					if (_n2.$ === 1) {
						return elm$html$Html$text('Loading!');
					} else {
						var subjectDetails = _n2.a;
						return author$project$University$viewSubject(subjectDetails);
					}
				default:
					var subjectId = r.a;
					var topicId = r.b;
					var _n3 = A2(elm$core$Dict$get, subjectId, model.k);
					if (_n3.$ === 1) {
						return elm$html$Html$text('Loading!');
					} else {
						var subjectDetails = _n3.a;
						var _n4 = elm$core$List$head(
							A2(
								elm$core$List$filter,
								function (td) {
									return _Utils_eq(td.c$, topicId);
								},
								subjectDetails.ec));
						if (_n4.$ === 1) {
							return elm$html$Html$text('Loading!');
						} else {
							var topicDetails = _n4.a;
							return A2(author$project$University$viewTopic, subjectDetails, topicDetails);
						}
					}
			}
		}
	});
var elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var elm$html$Html$map = elm$virtual_dom$VirtualDom$map;
var author$project$Main$viewContent = function (model) {
	var _n0 = model.al;
	switch (_n0.$) {
		case 0:
			return A2(
				elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						elm$html$Html$div,
						_List_fromArray(
							[
								elm$html$Html$Attributes$class('img-fluid'),
								elm$html$Html$Attributes$class('banner'),
								A2(elm$html$Html$Attributes$style, 'background-image', 'url(\'/images/photography/banner-desk-computer.jpg\')')
							]),
						_List_Nil),
						A2(author$project$Main$viewPage, model, 'home')
					]));
		case 2:
			var ur = _n0.a;
			return author$project$Main$fluid(
				A2(
					elm$html$Html$map,
					author$project$Main$UniversityMsg,
					A2(author$project$University$view, ur, model.W)));
		default:
			return author$project$Main$fluid(
				elm$html$Html$text(
					'The current route is: ' + author$project$Main$viewRoute(model.al)));
	}
};
var author$project$Main$LoginRequest = {$: 6};
var rundis$elm_bootstrap$Bootstrap$Internal$Button$Primary = 0;
var rundis$elm_bootstrap$Bootstrap$Button$primary = rundis$elm_bootstrap$Bootstrap$Internal$Button$Coloring(
	rundis$elm_bootstrap$Bootstrap$Internal$Button$Roled(0));
var rundis$elm_bootstrap$Bootstrap$Card$Internal$Aligned = function (a) {
	return {$: 0, a: a};
};
var rundis$elm_bootstrap$Bootstrap$Card$align = function (hAlign) {
	return rundis$elm_bootstrap$Bootstrap$Card$Internal$Aligned(hAlign);
};
var rundis$elm_bootstrap$Bootstrap$Card$Config = elm$core$Basics$identity;
var rundis$elm_bootstrap$Bootstrap$Card$Internal$CardBlock = function (a) {
	return {$: 0, a: a};
};
var rundis$elm_bootstrap$Bootstrap$Card$Internal$applyBlockModifier = F2(
	function (option, options) {
		switch (option.$) {
			case 0:
				var align = option.a;
				return _Utils_update(
					options,
					{
						p: elm$core$Maybe$Just(align)
					});
			case 1:
				var role = option.a;
				return _Utils_update(
					options,
					{
						r: elm$core$Maybe$Just(role)
					});
			case 2:
				var color = option.a;
				return _Utils_update(
					options,
					{
						w: elm$core$Maybe$Just(color)
					});
			default:
				var attrs = option.a;
				return _Utils_update(
					options,
					{
						aL: _Utils_ap(options.aL, attrs)
					});
		}
	});
var rundis$elm_bootstrap$Bootstrap$Card$Internal$defaultBlockOptions = {p: elm$core$Maybe$Nothing, aL: _List_Nil, r: elm$core$Maybe$Nothing, w: elm$core$Maybe$Nothing};
var rundis$elm_bootstrap$Bootstrap$Internal$Text$textAlignDirOption = function (dir) {
	switch (dir) {
		case 1:
			return 'center';
		case 0:
			return 'left';
		default:
			return 'right';
	}
};
var rundis$elm_bootstrap$Bootstrap$Internal$Text$textAlignClass = function (_n0) {
	var dir = _n0.cN;
	var size = _n0.bI;
	return elm$html$Html$Attributes$class(
		'text' + (A2(
			elm$core$Maybe$withDefault,
			'-',
			A2(
				elm$core$Maybe$map,
				function (s) {
					return '-' + (s + '-');
				},
				rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption(size))) + rundis$elm_bootstrap$Bootstrap$Internal$Text$textAlignDirOption(dir)));
};
var rundis$elm_bootstrap$Bootstrap$Internal$Text$textColorClass = function (color) {
	if (color.$ === 1) {
		return elm$html$Html$Attributes$class('text-white');
	} else {
		var role = color.a;
		return A2(rundis$elm_bootstrap$Bootstrap$Internal$Role$toClass, 'text', role);
	}
};
var rundis$elm_bootstrap$Bootstrap$Card$Internal$blockAttributes = function (modifiers) {
	var options = A3(elm$core$List$foldl, rundis$elm_bootstrap$Bootstrap$Card$Internal$applyBlockModifier, rundis$elm_bootstrap$Bootstrap$Card$Internal$defaultBlockOptions, modifiers);
	return _Utils_ap(
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('card-body')
			]),
		_Utils_ap(
			function () {
				var _n0 = options.p;
				if (!_n0.$) {
					var align = _n0.a;
					return _List_fromArray(
						[
							rundis$elm_bootstrap$Bootstrap$Internal$Text$textAlignClass(align)
						]);
				} else {
					return _List_Nil;
				}
			}(),
			_Utils_ap(
				function () {
					var _n1 = options.r;
					if (!_n1.$) {
						var role = _n1.a;
						return _List_fromArray(
							[
								A2(rundis$elm_bootstrap$Bootstrap$Internal$Role$toClass, 'bg', role)
							]);
					} else {
						return _List_Nil;
					}
				}(),
				_Utils_ap(
					function () {
						var _n2 = options.w;
						if (!_n2.$) {
							var color = _n2.a;
							return _List_fromArray(
								[
									rundis$elm_bootstrap$Bootstrap$Internal$Text$textColorClass(color)
								]);
						} else {
							return _List_Nil;
						}
					}(),
					options.aL))));
};
var rundis$elm_bootstrap$Bootstrap$Card$Internal$block = F2(
	function (options, items) {
		return rundis$elm_bootstrap$Bootstrap$Card$Internal$CardBlock(
			A2(
				elm$html$Html$div,
				rundis$elm_bootstrap$Bootstrap$Card$Internal$blockAttributes(options),
				A2(
					elm$core$List$map,
					function (_n0) {
						var e = _n0;
						return e;
					},
					items)));
	});
var rundis$elm_bootstrap$Bootstrap$Card$block = F3(
	function (options, items, _n0) {
		var conf = _n0;
		return _Utils_update(
			conf,
			{
				bX: _Utils_ap(
					conf.bX,
					_List_fromArray(
						[
							A2(rundis$elm_bootstrap$Bootstrap$Card$Internal$block, options, items)
						]))
			});
	});
var rundis$elm_bootstrap$Bootstrap$Card$config = function (options) {
	return {bX: _List_Nil, b2: elm$core$Maybe$Nothing, a3: elm$core$Maybe$Nothing, b7: elm$core$Maybe$Nothing, b8: elm$core$Maybe$Nothing, cg: options};
};
var rundis$elm_bootstrap$Bootstrap$Card$Internal$applyModifier = F2(
	function (option, options) {
		switch (option.$) {
			case 0:
				var align = option.a;
				return _Utils_update(
					options,
					{
						p: elm$core$Maybe$Just(align)
					});
			case 1:
				var coloring = option.a;
				return _Utils_update(
					options,
					{
						r: elm$core$Maybe$Just(coloring)
					});
			case 2:
				var coloring = option.a;
				return _Utils_update(
					options,
					{
						w: elm$core$Maybe$Just(coloring)
					});
			default:
				var attrs = option.a;
				return _Utils_update(
					options,
					{
						aL: _Utils_ap(options.aL, attrs)
					});
		}
	});
var rundis$elm_bootstrap$Bootstrap$Card$Internal$defaultOptions = {p: elm$core$Maybe$Nothing, aL: _List_Nil, r: elm$core$Maybe$Nothing, w: elm$core$Maybe$Nothing};
var rundis$elm_bootstrap$Bootstrap$Card$Internal$cardAttributes = function (modifiers) {
	var options = A3(elm$core$List$foldl, rundis$elm_bootstrap$Bootstrap$Card$Internal$applyModifier, rundis$elm_bootstrap$Bootstrap$Card$Internal$defaultOptions, modifiers);
	return _Utils_ap(
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('card')
			]),
		_Utils_ap(
			function () {
				var _n0 = options.r;
				if (!_n0.$) {
					if (!_n0.a.$) {
						var role = _n0.a.a;
						return _List_fromArray(
							[
								A2(rundis$elm_bootstrap$Bootstrap$Internal$Role$toClass, 'bg', role)
							]);
					} else {
						var role = _n0.a.a;
						return _List_fromArray(
							[
								A2(rundis$elm_bootstrap$Bootstrap$Internal$Role$toClass, 'border', role)
							]);
					}
				} else {
					return _List_Nil;
				}
			}(),
			_Utils_ap(
				function () {
					var _n1 = options.w;
					if (!_n1.$) {
						var color = _n1.a;
						return _List_fromArray(
							[
								rundis$elm_bootstrap$Bootstrap$Internal$Text$textColorClass(color)
							]);
					} else {
						return _List_Nil;
					}
				}(),
				_Utils_ap(
					function () {
						var _n2 = options.p;
						if (!_n2.$) {
							var align = _n2.a;
							return _List_fromArray(
								[
									rundis$elm_bootstrap$Bootstrap$Internal$Text$textAlignClass(align)
								]);
						} else {
							return _List_Nil;
						}
					}(),
					options.aL))));
};
var rundis$elm_bootstrap$Bootstrap$Card$Internal$renderBlocks = function (blocks) {
	return A2(
		elm$core$List$map,
		function (block_) {
			if (!block_.$) {
				var e = block_.a;
				return e;
			} else {
				var e = block_.a;
				return e;
			}
		},
		blocks);
};
var rundis$elm_bootstrap$Bootstrap$Card$view = function (_n0) {
	var conf = _n0;
	return A2(
		elm$html$Html$div,
		rundis$elm_bootstrap$Bootstrap$Card$Internal$cardAttributes(conf.cg),
		_Utils_ap(
			A2(
				elm$core$List$filterMap,
				elm$core$Basics$identity,
				_List_fromArray(
					[
						A2(
						elm$core$Maybe$map,
						function (_n1) {
							var e = _n1;
							return e;
						},
						conf.a3),
						A2(
						elm$core$Maybe$map,
						function (_n2) {
							var e = _n2;
							return e;
						},
						conf.b8)
					])),
			_Utils_ap(
				rundis$elm_bootstrap$Bootstrap$Card$Internal$renderBlocks(conf.bX),
				A2(
					elm$core$List$filterMap,
					elm$core$Basics$identity,
					_List_fromArray(
						[
							A2(
							elm$core$Maybe$map,
							function (_n3) {
								var e = _n3;
								return e;
							},
							conf.b2),
							A2(
							elm$core$Maybe$map,
							function (_n4) {
								var e = _n4;
								return e;
							},
							conf.b7)
						])))));
};
var rundis$elm_bootstrap$Bootstrap$Card$Internal$BlockItem = elm$core$Basics$identity;
var rundis$elm_bootstrap$Bootstrap$Card$Block$custom = function (element) {
	return element;
};
var rundis$elm_bootstrap$Bootstrap$Card$Block$text = F2(
	function (attributes, children) {
		return A2(
			elm$html$Html$p,
			_Utils_ap(
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('card-text')
					]),
				attributes),
			children);
	});
var elm$html$Html$h3 = _VirtualDom_node('h3');
var rundis$elm_bootstrap$Bootstrap$Card$Block$title = F3(
	function (elemFn, attributes, children) {
		return A2(
			elemFn,
			A2(
				elm$core$List$cons,
				elm$html$Html$Attributes$class('card-title'),
				attributes),
			children);
	});
var rundis$elm_bootstrap$Bootstrap$Card$Block$titleH3 = rundis$elm_bootstrap$Bootstrap$Card$Block$title(elm$html$Html$h3);
var rundis$elm_bootstrap$Bootstrap$Internal$Text$Center = 1;
var rundis$elm_bootstrap$Bootstrap$General$Internal$XS = 0;
var rundis$elm_bootstrap$Bootstrap$Text$alignXs = function (dir) {
	return {cN: dir, bI: 0};
};
var rundis$elm_bootstrap$Bootstrap$Text$alignXsCenter = rundis$elm_bootstrap$Bootstrap$Text$alignXs(1);
var author$project$Main$viewLoginScreen = A2(
	elm$html$Html$div,
	_List_fromArray(
		[
			elm$html$Html$Attributes$class('login-screen')
		]),
	_List_fromArray(
		[
			A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('signin')
				]),
			_List_fromArray(
				[
					rundis$elm_bootstrap$Bootstrap$Card$view(
					A3(
						rundis$elm_bootstrap$Bootstrap$Card$block,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								rundis$elm_bootstrap$Bootstrap$Card$Block$titleH3,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										elm$html$Html$img,
										_List_fromArray(
											[
												elm$html$Html$Attributes$class('logo'),
												elm$html$Html$Attributes$src('/images/competence-center-logo.png')
											]),
										_List_Nil)
									])),
								A2(
								rundis$elm_bootstrap$Bootstrap$Card$Block$text,
								_List_Nil,
								_List_fromArray(
									[
										elm$html$Html$text('Welcome to the Lunatech Online Training Center')
									])),
								rundis$elm_bootstrap$Bootstrap$Card$Block$custom(
								A2(
									rundis$elm_bootstrap$Bootstrap$Button$button,
									_List_fromArray(
										[
											rundis$elm_bootstrap$Bootstrap$Button$primary,
											rundis$elm_bootstrap$Bootstrap$Button$attrs(
											_List_fromArray(
												[
													elm$html$Html$Events$onClick(author$project$Main$LoginRequest)
												]))
										]),
									_List_fromArray(
										[
											elm$html$Html$text('Sign in with Google')
										])))
							]),
						rundis$elm_bootstrap$Bootstrap$Card$config(
							_List_fromArray(
								[
									rundis$elm_bootstrap$Bootstrap$Card$align(rundis$elm_bootstrap$Bootstrap$Text$alignXsCenter)
								]))))
				]))
		]));
var author$project$Main$Menu = elm$core$Basics$identity;
var author$project$Main$MenuItem = F4(
	function (name, href, icon, children) {
		return {dL: children, cW: href, c_: icon, c8: name};
	});
var author$project$Main$noChildren = _List_Nil;
var author$project$Main$menu = _List_fromArray(
	[
		A4(author$project$Main$MenuItem, 'University', '/university', 'images/university-icon.png', author$project$Main$noChildren),
		A4(author$project$Main$MenuItem, 'Workshops', '/workshops', 'images/workshops-icon.png', author$project$Main$noChildren),
		A4(
		author$project$Main$MenuItem,
		'Guilds',
		'/guilds',
		'images/guilds-icon.png',
		_List_fromArray(
			[
				A4(author$project$Main$MenuItem, 'Quality Guild', '/guilds/quality-guild', 'images/quality-guild-icon.png', author$project$Main$noChildren)
			]))
	]);
var author$project$Main$viewMenu = function (model) {
	var viewEntry = function (menuItem) {
		return A2(
			elm$html$Html$li,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					elm$html$Html$a,
					_List_fromArray(
						[
							elm$html$Html$Attributes$href(menuItem.cW)
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$img,
							_List_fromArray(
								[
									elm$html$Html$Attributes$src(menuItem.c_),
									elm$html$Html$Attributes$class('icon')
								]),
							_List_Nil),
							A2(
							elm$html$Html$span,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('label')
								]),
							_List_fromArray(
								[
									elm$html$Html$text(menuItem.c8)
								]))
						]))
				]));
	};
	var viewMenuLevel = F2(
		function (n, _n1) {
			var children = _n1;
			if (!children.b) {
				return A2(elm$html$Html$div, _List_Nil, _List_Nil);
			} else {
				var chilren = children;
				return A2(
					elm$html$Html$ul,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('list-unstyled components')
						]),
					A2(elm$core$List$map, viewEntry, children));
			}
		});
	return A2(viewMenuLevel, 0, author$project$Main$menu);
};
var author$project$Main$LogoutRequest = {$: 7};
var author$project$Main$viewProfileSection = function (authenticatedUser) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('authentication')
			]),
		_List_fromArray(
			[
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('user')
					]),
				_List_fromArray(
					[
						A2(
						elm$html$Html$img,
						_List_fromArray(
							[
								elm$html$Html$Attributes$class('rounded-circle'),
								elm$html$Html$Attributes$class('icon'),
								elm$html$Html$Attributes$src(authenticatedUser.c1)
							]),
						_List_Nil),
						A2(
						elm$html$Html$span,
						_List_fromArray(
							[
								elm$html$Html$Attributes$class('label')
							]),
						_List_fromArray(
							[
								elm$html$Html$text(authenticatedUser.c8)
							]))
					])),
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Events$onClick(author$project$Main$LogoutRequest),
						elm$html$Html$Attributes$class('logout'),
						elm$html$Html$Attributes$class('fi-account-logout'),
						elm$html$Html$Attributes$title('Log Out'),
						A2(elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
					]),
				_List_Nil)
			]));
};
var elm$html$Html$Attributes$width = function (n) {
	return A2(
		_VirtualDom_attribute,
		'width',
		elm$core$String$fromInt(n));
};
var author$project$Main$viewSideBar = F2(
	function (authenticatedUser, model) {
		return A2(
			elm$html$Html$nav,
			_List_fromArray(
				[
					elm$html$Html$Attributes$id('sidebar')
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$a,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('sidebar-header'),
							elm$html$Html$Attributes$href('/')
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$h3,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									elm$html$Html$img,
									_List_fromArray(
										[
											elm$html$Html$Attributes$class('icon'),
											elm$html$Html$Attributes$src('images/sidebar-icon.png')
										]),
									_List_Nil),
									A2(
									elm$html$Html$span,
									_List_fromArray(
										[
											elm$html$Html$Attributes$class('label')
										]),
									_List_fromArray(
										[
											A2(
											elm$html$Html$img,
											_List_fromArray(
												[
													elm$html$Html$Attributes$src('images/sidebar-lunatech.png'),
													elm$html$Html$Attributes$width(150)
												]),
											_List_Nil)
										]))
								]))
						])),
					author$project$Main$viewMenu(model),
					author$project$Main$viewProfileSection(authenticatedUser)
				]));
	});
var author$project$Main$view = function (model) {
	var _n0 = model.Z;
	if (_n0.$ === 1) {
		return {
			cG: _List_fromArray(
				[author$project$Main$viewLoginScreen]),
			dy: 'Lunatech Learn'
		};
	} else {
		var authenticatedUser = _n0.a;
		return {
			cG: _List_fromArray(
				[
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('wrapper')
						]),
					_List_fromArray(
						[
							A2(author$project$Main$viewSideBar, authenticatedUser, model),
							author$project$Main$viewContent(model)
						]))
				]),
			dy: 'Lunatech Learn'
		};
	}
};
var elm$browser$Browser$application = _Browser_application;
var author$project$Main$main = elm$browser$Browser$application(
	{dZ: author$project$Main$init, d0: author$project$Main$UrlChanged, d1: author$project$Main$LinkClicked, d7: author$project$Main$subscriptions, ed: author$project$Main$update, ee: author$project$Main$view});
_Platform_export({'Main':{'init':author$project$Main$main(
	elm$json$Json$Decode$succeed(0))(0)}});}(this));