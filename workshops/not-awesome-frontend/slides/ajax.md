## jQuery: Ajax

Ajax revolutionized the way we think about dynamic web application, it enable us
to fetch data without refreshing the page or performing a `GET-POST-REDIRECT` flow.

Note:
- Introduced by IE 5 was later supported for other major browsers years later.
- With the caveat that ajax request must be within the same domain (CORS).

---

## jQuery: Ajax comparison

### Vanilla Javascript

```js
var xhr = new XMLHttpRequest();
xhr.open('get', 'send-ajax-data.php');

xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) { // Done
        if (xhr.status === 200) { // HTTP OK
            // Do something with the response
        } else {
            // Do something with the error.
        }
    }
};

xhr.send(null);
```

---

## jQuery: Ajax comparison

### jQuery

```js
$.get('send-ajax-data.php')
  .done(function (data) {
    // Handle response
  })
  .fail(function (error) {
    // Handle Error
  });
```

Note:
- For those familiar with promises, since jQuery 1.8 made Deferreds more promise compliant.
- `$.ajax` most of the time can correctly parse response with MIME types.

---

## jQuery: Ajax methods

### Get or Post

```js
$.get     // shorthand
$.post
```

```js
$.ajax('www.some_url.com', {    // $.get expanded
  method: 'get'
});

$.ajax('www.some_url.com', {    // $.post expanded
  method: 'post',
  data: '{"some": value}'
});

```

---

## jQuery: Ajax methods

### Load

```js
$('.my-el').load('www.some_url.com');    // shorthand
```

```js
var $myEl = $('.my-el');      // $.load expanded

$.ajax('www.some_url.com', {
  method: 'get'
}).done(function (html) {
  $myEl.html(html);
});
```

---

## jQuery: Ajax methods

### getJSON

```js
$.getJSON('www.some_url.com')    // shorthand
```

```js
$.ajax('www.some_url.com', {     // $.getJSON expanded
  method: 'get',
  dataType: 'json'
});
```

---

## jQuery: Ajax exercise

Time for an _exercise_, **fork** the following pen:

[Exercise](http://codepen.io/nmoncho/pen/vxgYqO)

---

## jQuery: Ajax features

`$.ajax` behavior is configured through the `settings` object

|||
|---|---|
|`dataType`|The type of data you are getting from the server (eg. json or html)|
|`contentType`|The type of data you are sending to the server (MIME)|
|`data`|The actual data you'll send to the server|
|`method`|HTTP method used in the request (eg. GET or POST)|
|... and many others|(Cross-domain, data conversion, HTTP headers, timeout, etc)|
