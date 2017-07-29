--
-- PostgreSQL database dump
--

-- Dumped from database version 9.2.8
-- Dumped by pg_dump version 9.6.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: btree_gist; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS btree_gist WITH SCHEMA public;


--
-- Name: EXTENSION btree_gist; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION btree_gist IS 'support for indexing common datatypes in GiST';


--
-- Name: hstore; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS hstore WITH SCHEMA public;


--
-- Name: EXTENSION hstore; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION hstore IS 'data type for storing sets of (key, value) pairs';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: cvs; Type: TABLE; Schema: public; Owner: ul3rd8gpvpa8p9oqjk2c
--

CREATE TABLE cvs (
    id uuid NOT NULL,
    created_on timestamp with time zone NOT NULL,
    cv json NOT NULL,
    person character varying(255) NOT NULL
);


ALTER TABLE cvs OWNER TO ul3rd8gpvpa8p9oqjk2c;

--
-- Name: passports; Type: TABLE; Schema: public; Owner: ul3rd8gpvpa8p9oqjk2c
--

CREATE TABLE passports (
    person character varying(255) NOT NULL,
    created_on timestamp with time zone NOT NULL,
    last_modified_on timestamp with time zone NOT NULL,
    passport json NOT NULL
);


ALTER TABLE passports OWNER TO ul3rd8gpvpa8p9oqjk2c;

--
-- Name: schema_version; Type: TABLE; Schema: public; Owner: ul3rd8gpvpa8p9oqjk2c
--

CREATE TABLE schema_version (
    installed_rank integer NOT NULL,
    version character varying(50),
    description character varying(200) NOT NULL,
    type character varying(20) NOT NULL,
    script character varying(1000) NOT NULL,
    checksum integer,
    installed_by character varying(100) NOT NULL,
    installed_on timestamp without time zone DEFAULT now() NOT NULL,
    execution_time integer NOT NULL,
    success boolean NOT NULL
);


ALTER TABLE schema_version OWNER TO ul3rd8gpvpa8p9oqjk2c;

--
-- Data for Name: cvs; Type: TABLE DATA; Schema: public; Owner: ul3rd8gpvpa8p9oqjk2c
--

COPY cvs (id, created_on, cv, person) FROM stdin;
174c0180-771d-4f61-995f-e844e7019426	2017-07-13 06:56:14.165312+00	{"employee":{"basics":{"givenName":"Erik","familyName":"Janssen","label":"Developer","startYear":"October 2015","email":"erik.janssen@lunatech.com","image":"","profile":"Lakalaka Boo","contact":{"name":"LUNATECH ROTTERDAM","address":"","postalCode":"","city":"","phone":"","email":"","countryCode":""}},"skills":[{"foo":"bar","name":"Scala","category":"tech","level":5},{"foo":"bar","name":"Finch","category":"tech","level":4},{"foo":"bar","name":"Play","category":"tech","level":4}],"achievements":[],"projects":[],"educations":[{"foo":"bar","institution":"University of Amsterdam","startDate":"2017-08-01","endDate":"2017-07-27","description":"Work & Organisational Psychology","studyType":"University","country":"Netherlands"}],"education":[]},"meta":{"client":"","creationDate":"","office":"","language":""}}	erik.janssen@lunatech.com
b1b15217-457b-4083-b30c-60074eeb5d24	2017-05-21 21:18:10.694193+00	{"employee":{"basics":{"givenName":"Erik","familyName":"Bakker","label":"Senior Software Engineer","startYear":"Employee since 2007","email":"erik.bakker@lunatech.com","image":"https://avatars2.githubusercontent.com/u/332784","profile":"Erik is an all-round software creator, who will lead your project to success. With more than ten years of commercial software experience under the belt, varying from very small projects with tight budget and time constraints, to multi-year projects for global enterprises, he knows how to make a project succeed. Erik is an early adopter of Scala, and has deep Scala knowledge. \\n\\nHe’s a certified trainer for an Advanced Scala course, wrote a book on Scala and gave a talk on the worlds biggest Scala conference. He has many years of experience teaching teams how to benefit from Scala and how to avoid the pitfalls. A keen understanding of business needs in combination with his technical skills make Erik frequently a key player in bridging business, enterprise architecture and engineering. He is strong at execution, and strikes the right balance between urgent and important tasks.\\n","contact":{"name":"LUNATECH PARIS","address":"Baan 74","postalCode":"3011 CD","city":"Rotterdam","phone":"+31 10 750 2600","email":"info@lunatech.com","countryCode":"NL"}},"skills":[{"category":"tech","name":"SCALA","level":9},{"category":"tech","name":"KAFKA","level":8},{"category":"tech","name":"AKKA","level":10},{"category":"tech","name":"PLAY FRAMEWORK","level":0},{"category":"tech","name":"FINCH","level":5},{"category":"tech","name":"FINAGLE","level":5},{"category":"fun","name":"FORMULA-1 TALK","level":5},{"category":"fun","name":"RASPBERRY PI","level":7}],"achievements":["Co-authored the book “Play for Scala”, published by Manning with more than 7000 copies sold.","Presented a talk on Monad Transformers at Scala Days Amsterdam in 2015"],"projects":[{"client":"ING","startDate":"","endDate":"","role":"Tech lead and Product Owner","summary":"Training a team of Junior Scala developers to become proficient in Scala and leading the design of crucial parts of INGs new global Authentication Platform. Also the Product Owner of the team and responsible for alignment with other teams of the Platform and teams and other stakeholders in the organization. Frequently the point of contact for other programs and part of the team traveling to other countries for on-boarding. Technologies include Scala, Finch, functional programming, RESTful APIs."},{"client":"Malmberg","startDate":"","endDate":"","role":"Tech lead and Scala coach","summary":"Tech lead of a team to transition development of a key Malmberg project from an external supplier to being developed in house by Malmberg. Responsible for ensuring knowledge transfer between old and new development team, setting development standard for the new team and continued development of the platform. Scala, Play framework and AngularJS."},{"client":"Belastingdienst","startDate":"","endDate":"","role":"Scala developer and coach","summary":"Developer and Scala coach on a team working on an internal job board for De Belastingdienst. Responsible for training new developers to use Scala, architecture of the application and delivery of features. Scala, Play framework, Marionette.js."}],"educations":[{"institution":"Utrecht University College","country":"The Netherlands","studyType":"Master of Science in Physics and Climate Science","startDate":"","endDate":"","description":"Program Nanomaterials: \\"Chemistry and Physics\\", thesis titled \\"Generation of optical vortices with spiral phase plates\\""},{"institution":"Utrecht University","country":"The Netherlands","studyType":"Bachelor of Science in Physics and Astronomy","startDate":"","endDate":"","description":"Program \\"Nanomaterials: Chemistry and Physics\\", thesis titled \\"Simulations on Rubidium Laser Cooling\\"."}],"education":[]},"meta":{"client":"","creationDate":"","office":"","language":""}}	erik.bakker@lunatech.com
39b19f39-e6df-4fba-8b32-3bd42729f9f5	2017-07-14 05:30:54.858287+00	{"employee":{"basics":{"givenName":"Erik","familyName":"Janssen","label":"Developer","startYear":"Employee since October 2015","email":"erik.janssen@lunatech.com","image":"","profile":"Lakalaka Boo","contact":{"name":"LUNATECH ROTTERDAM","address":"","postalCode":"","city":"","phone":"","email":"","countryCode":""}},"skills":[{"foo":"bar","name":"Scala","category":"tech","level":5},{"foo":"bar","name":"Finch","category":"tech","level":4},{"foo":"bar","name":"Play","category":"tech","level":4}],"achievements":[],"projects":[],"educations":[{"foo":"bar","institution":"University of Amsterdam","startDate":"2017-08-01","endDate":"2017-07-27","description":"Work & Organisational Psychology","studyType":"University","country":"Netherlands"}],"education":[]},"meta":{"client":"","creationDate":"","office":"","language":""}}	erik.janssen@lunatech.com
9d863476-70a5-452d-a03b-e8445af47a90	2017-07-21 12:25:00.373106+00	{"employee":{"basics":{"givenName":"Andrea","familyName":"Giugliano","label":"","startYear":"","email":"andrea.giugliano@lunatech.com","image":"https://avatars3.githubusercontent.com/u/6580039?v=4&s=460","profile":"","contact":{"name":"LUNATECH ROTTERDAM","address":"","postalCode":"","city":"","phone":"","email":"","countryCode":""}},"skills":[{"foo":"bar","name":"bla","category":"tech","level":6}],"achievements":[],"projects":[],"educations":[],"education":[]},"meta":{"client":"","creationDate":"","office":"","language":""}}	andrea.giugliano@lunatech.com
972aafac-e5e2-4564-87b6-48c62b5f19d2	2017-07-21 12:25:16.340975+00	{"employee":{"basics":{"givenName":"Andrea","familyName":"Giugliano","label":"","startYear":"","email":"andrea.giugliano@lunatech.com","image":"https://avatars3.githubusercontent.com/u/6580039?v=4&s=460","profile":"","contact":{"name":"LUNATECH ROTTERDAM","address":"","postalCode":"","city":"","phone":"","email":"","countryCode":""}},"skills":[{"foo":"bar","name":"bla","category":"tech","level":6}],"achievements":[],"projects":[],"educations":[],"education":[]},"meta":{"client":"","creationDate":"","office":"","language":""}}	andrea.giugliano@lunatech.com
\.

--
-- Data for Name: passports; Type: TABLE DATA; Schema: public; Owner: ul3rd8gpvpa8p9oqjk2c
--

COPY passports (created_on, passport, person, last_modified_on) FROM stdin;
2017-05-21 21:18:10.694193+00	{"basics":{"givenName":"Erik","familyName":"Bakker","label":"Senior Software Engineer","startYear":"Employee since 2007","email":"erik.bakker@lunatech.com","image":"https://avatars2.githubusercontent.com/u/332784","profile":"Erik is an all-round software creator, who will lead your project to success. With more than ten years of commercial software experience under the belt, varying from very small projects with tight budget and time constraints, to multi-year projects for global enterprises, he knows how to make a project succeed. Erik is an early adopter of Scala, and has deep Scala knowledge. \\n\\nHe’s a certified trainer for an Advanced Scala course, wrote a book on Scala and gave a talk on the worlds biggest Scala conference. He has many years of experience teaching teams how to benefit from Scala and how to avoid the pitfalls. A keen understanding of business needs in combination with his technical skills make Erik frequently a key player in bridging business, enterprise architecture and engineering. He is strong at execution, and strikes the right balance between urgent and important tasks.\\n","contact":{"name":"LUNATECH PARIS","address":"Baan 74","postalCode":"3011 CD","city":"Rotterdam","phone":"+31 10 750 2600","email":"info@lunatech.com","countryCode":"NL"}},"skills":[{"category":"tech","name":"SCALA","level":9},{"category":"tech","name":"KAFKA","level":8},{"category":"tech","name":"AKKA","level":10},{"category":"tech","name":"PLAY FRAMEWORK","level":0},{"category":"tech","name":"FINCH","level":5},{"category":"tech","name":"FINAGLE","level":5},{"category":"fun","name":"FORMULA-1 TALK","level":5},{"category":"fun","name":"RASPBERRY PI","level":7}],"achievements":["Co-authored the book “Play for Scala”, published by Manning with more than 7000 copies sold.","Presented a talk on Monad Transformers at Scala Days Amsterdam in 2015"],"projects":[{"client":"ING","startDate":"","endDate":"","role":"Tech lead and Product Owner","summary":"Training a team of Junior Scala developers to become proficient in Scala and leading the design of crucial parts of INGs new global Authentication Platform. Also the Product Owner of the team and responsible for alignment with other teams of the Platform and teams and other stakeholders in the organization. Frequently the point of contact for other programs and part of the team traveling to other countries for on-boarding. Technologies include Scala, Finch, functional programming, RESTful APIs."},{"client":"Malmberg","startDate":"","endDate":"","role":"Tech lead and Scala coach","summary":"Tech lead of a team to transition development of a key Malmberg project from an external supplier to being developed in house by Malmberg. Responsible for ensuring knowledge transfer between old and new development team, setting development standard for the new team and continued development of the platform. Scala, Play framework and AngularJS."},{"client":"Belastingdienst","startDate":"","endDate":"","role":"Scala developer and coach","summary":"Developer and Scala coach on a team working on an internal job board for De Belastingdienst. Responsible for training new developers to use Scala, architecture of the application and delivery of features. Scala, Play framework, Marionette.js."}],"educations":[{"institution":"Utrecht University College","country":"The Netherlands","studyType":"Master of Science in Physics and Climate Science","startDate":"","endDate":"","description":"Program Nanomaterials: \\"Chemistry and Physics\\", thesis titled \\"Generation of optical vortices with spiral phase plates\\""},{"institution":"Utrecht University","country":"The Netherlands","studyType":"Bachelor of Science in Physics and Astronomy","startDate":"","endDate":"","description":"Program \\"Nanomaterials: Chemistry and Physics\\", thesis titled \\"Simulations on Rubidium Laser Cooling\\"."}],"education":[]}	erik.bakker@lunatech.com	2017-07-21 12:25:16.340975+00
2017-07-14 05:30:54.858287+00	{"basics":{"givenName":"Erik","familyName":"Janssen","label":"Developer","startYear":"Employee since October 2015","email":"erik.janssen@lunatech.com","image":"","profile":"Lakalaka Boo","contact":{"name":"LUNATECH ROTTERDAM","address":"","postalCode":"","city":"","phone":"","email":"","countryCode":""}},"skills":[{"foo":"bar","name":"Scala","category":"tech","level":5},{"foo":"bar","name":"Finch","category":"tech","level":4},{"foo":"bar","name":"Play","category":"tech","level":4}],"achievements":[],"projects":[],"educations":[{"foo":"bar","institution":"University of Amsterdam","startDate":"2017-08-01","endDate":"2017-07-27","description":"Work & Organisational Psychology","studyType":"University","country":"Netherlands"}],"education":[]}	erik.janssen@lunatech.com	2017-07-21 12:25:16.340975+00
2017-07-21 12:25:16.340975+00	{"basics":{"givenName":"Andrea","familyName":"Giugliano","label":"","startYear":"","email":"andrea.giugliano@lunatech.com","image":"https://avatars3.githubusercontent.com/u/6580039?v=4&s=460","profile":"","contact":{"name":"LUNATECH ROTTERDAM","address":"","postalCode":"","city":"","phone":"","email":"","countryCode":""}},"skills":[{"foo":"bar","name":"bla","category":"tech","level":6}],"achievements":[],"projects":[],"educations":[],"education":[]}	andrea.giugliano@lunatech.com	2017-07-21 12:25:16.340975+00
\.


--
-- Data for Name: schema_version; Type: TABLE DATA; Schema: public; Owner: ul3rd8gpvpa8p9oqjk2c
--

COPY schema_version (installed_rank, version, description, type, script, checksum, installed_by, installed_on, execution_time, success) FROM stdin;
1	1	<< Flyway Baseline >>	BASELINE	<< Flyway Baseline >>	\N	ul3rd8gpvpa8p9oqjk2c	2017-07-21 15:28:31.981786	0	t
\.


--
-- Name: cvs cvs_pkey; Type: CONSTRAINT; Schema: public; Owner: ul3rd8gpvpa8p9oqjk2c
--

ALTER TABLE ONLY cvs
    ADD CONSTRAINT cvs_pkey PRIMARY KEY (id);


--
-- Name: cvs cvs_pkey; Type: CONSTRAINT; Schema: public; Owner: ul3rd8gpvpa8p9oqjk2c
--

ALTER TABLE ONLY passports
    ADD CONSTRAINT passports_pkey PRIMARY KEY (person);


--
-- Name: schema_version schema_version_pk; Type: CONSTRAINT; Schema: public; Owner: ul3rd8gpvpa8p9oqjk2c
--

ALTER TABLE ONLY schema_version
    ADD CONSTRAINT schema_version_pk PRIMARY KEY (installed_rank);


--
-- Name: schema_version_s_idx; Type: INDEX; Schema: public; Owner: ul3rd8gpvpa8p9oqjk2c
--

CREATE INDEX schema_version_s_idx ON schema_version USING btree (success);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

