# So you want to create a workshop

## Getting started

1. Create a new folder which will act as a container for your workshop.
2. Copy-Paste the contents of the `template` folder on your workshop's folder.
3. Start filling the content! _(keep reading)_

## Manifest

Each workshop should have a descriptor which is defined in a `manifest.json` file.
This file makes possible to query data about it and present it to the students:

- **id**: The workshop's unique identifier.
- **name**: The workshop's name.
- **description**: The workshop's description.
- **author**: Your name here.
- **image**: Path to workshop's main image.
- **tags**: Important tags or qualifiers for the workshop (e.g. `frontend`, `backend`,
  `scala`, `java`, `devops`).
- **core-curriculum**: List of Core Curriculum's subject IDs that are related to
  this workshop (can be empty).
- **teachers**: List of teacher's names, initially is just the authors.
- **contributors**: List of people's name that contributed to this workshop over time.
- **prerequisites**: What is the knowledge required to take this workshop (e.g.
  type classes if you're teaching monads).
- **preparations**: What are the students required do before the first session
  (e.g. install `npm` if the workshop is about `Node.js`).
- **schedule**: A list of schedule sessions, which are encoded as objects:
    - **block-name**: The name of the block (e.g. session, day).
    - **description**: What is the content or description of that block.

## Slides

The template comes with an instance of [reveal.js](https://revealjs.com/) to make
the slides. Within the `slides` folder you'll find:
- **index.html**: This is the entry point of you slides, here can jump right away
 and start making slides with [markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet).
- **slides.md**: You can add more than one slide in a single `md` file, the current
horizontal separator is `---`, the vertical separator is `\n\n\n` and the notes
separator is `Note:`.

```markdown
## Slide 1

Slide 1 content


## Vertical Slide 1A

Slide 1A content

---

## Slide 2 (horizontal)

Slide 2 content
```

To execute the templates, go to the `slides` folder and run in a shell:

```
python -m SimpleHTTPServer 8000
```

This will serve the slides at [localhost:8000](http://localhost:8000)

### Styling

Styles are defined with two files:
- **core.css**: This should provide the same styles for every workshop given on Lunatech.
- **local.css**: This are styles used solely on your project, that you define to make
  your workshop look more pritty.
