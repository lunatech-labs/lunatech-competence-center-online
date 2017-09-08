-- Table: public.passports

CREATE TABLE passports
(
  id         UUID                                                NOT NULL,
  created_on TIMESTAMP WITH TIME ZONE                            NOT NULL,
  modified_on TIMESTAMP WITH TIME ZONE                            NOT NULL,
  passport   JSON                                                NOT NULL,
  person     CHARACTER VARYING(255)                              NOT NULL,
  CONSTRAINT passports_pkey PRIMARY KEY (person)
)

--  def saveQuery(email: String, passport: Json) =
--      sql"INSERT INTO passports (person, passport, created_on, modified_on) VALUES ($email, $passport, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) ON CONFLICT (person) DO UPDATE SET passport = EXCLUDED.passport,last_modified_on = CURRENT_TIMESTAMP".update
