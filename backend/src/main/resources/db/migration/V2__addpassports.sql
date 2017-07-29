--
-- Name: passports; Type: TABLE; Schema: public; Owner: ul3rd8gpvpa8p9oqjk2c
--

CREATE TABLE IF NOT EXISTS passports (
    person character varying(255) NOT NULL,
    created_on timestamp with time zone NOT NULL,
    last_modified_on timestamp with time zone NOT NULL,
    passport json NOT NULL
);

--ALTER TABLE passports OWNER TO ul3rd8gpvpa8p9oqjk2c;
--
--
--ALTER TABLE ONLY passports
--    ADD CONSTRAINT passports_pkey PRIMARY KEY (person);

