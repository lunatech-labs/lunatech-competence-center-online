-- Table: public.passports
--
CREATE TABLE passports (
  id         UUID                                                NOT NULL,
  created_on TIMESTAMP WITH TIME ZONE                            NOT NULL,
  modified_on TIMESTAMP WITH TIME ZONE                           NOT NULL,
  passport   JSON                                                NOT NULL,
  person     CHARACTER VARYING(255)                              NOT NULL,
  CONSTRAINT passports_pkey PRIMARY KEY (person)
)

--CREATE INDEX idx_person_passport ON passports (person);