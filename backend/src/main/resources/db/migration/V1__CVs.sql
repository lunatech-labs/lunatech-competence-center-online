-- Table: public.cvs

CREATE TABLE cvs
(
  id         UUID                                                NOT NULL,
  created_on TIMESTAMP WITH TIME ZONE                            NOT NULL,
  cv         JSON                                                NOT NULL,
  person     CHARACTER VARYING(255)                              NOT NULL,
  CONSTRAINT cvs_pkey PRIMARY KEY (id)
)
