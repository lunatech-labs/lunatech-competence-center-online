# Core curriculum
What is the core curriculum?
The core curriculum's goal is to provide a body of knowledge (or a place to find that) about what we feel defines a subject.

A subject can be:
- A programming language, such as Scala or Java.
- A tool, such as Play! Framework.
- A technology, such as HTML.

## Schema
Knowledge graphs are based on a schema to provide a shared and common structure, we decided on JSON schema since it will allow us to use `git` as a means to contribute.

## Contributing
Please feel free to contribute to this project, the easiest way to get started is to take a look at the schema and some instances of such. At this present moment gathering material should be our focus and the most welcomed contribution.

Each subject's knowledge graph is defined in a separate file, in which is stated:
- Id: A unique string identifier for the subject.
- Name and description: Subject's name and description.
- Topics: Each subject is composed of several topics, each forming the knowledge graph of that subject. Which is stated also as:
    - Id: An unique string identified
    - Name and description: Topic's name and description.
    - Resources: A book, article, video teaching or explaining the topic.

### Contributing resources
When adding a resource to a subject you need to submit a pull request following the corresponding schema so we can review the uploaded content.
Please consider the following, and add this to the PR comments:
- How is this new resource different than the already present?
- Does it improve the explaination of the concept?
- Should it remove an old resource?

## Subjects
The contributed subjects so far are:

- Scala
- SBT (or Scala Build Tool)

### Subject tags
Each *subject* can be annotated to describe it, if the subject is related to a particular programming language, environment or knowledge base.

So far, the defined tags are:

- scala: This subject is related to the Scala programming language (eg. SBT).
- java: This subject is related to the Java programming language (eg. Maven).
- frontend: This subject is related to frontend techonlogies (eg. Polymer).
- backend: This subject is related to backend technologies (eg. SQL).
- big-data: This subject is related to BigData (eg. Cassandra).
- dev-ops: This subject is related to DevOps (eg. Jenkins).
- tool: Use this tag when the subject is a tool (eg. SBT or Maven).


### Topic tags
Also, *topics* can be annotated, describing if such topic is required, or if it belongs to a certain specialisation.

- required-for-trainee: This topic should be known by a Trainee Developer.
- required-for-junior: This topic should be known by a Junior Software Engineer.
- required-for-medior: This topic should be known by a Software Engineer, whether she or he intends to specialize in Java or Scala.
- required-for-medior: This topic should be known by a Scala Software Engineer.
- required-for-medior: This topic should be known by a Java Software Engineer.
- required-for-senior: This topic should be known by a Senior Software Engineer, whether she or he is specialized in Java or Scala.
- required-for-senior: This topic should be known by a Scala Senior Software Engineer.
- required-for-senior: This topic should be known by a Java Senior Software Engineer.



- required-for-scala-medior: This topic should be known by a Medior Scala Engineer.
- required-for-scala-senior: This topic should be known by a Senior Scala Engineer.
- required-for-java-medior: This topic should be known by a Medior Java Engineer.
- required-for-java-senior: This topic should be known by a Senior Java Engineer.
- fp: for Functional Programming.
