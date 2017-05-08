-- Table: public.cvs

-- DROP TABLE public.cvs;

CREATE TABLE public.cvs
(
  id         UUID                                                NOT NULL,
  created_on TIMESTAMP WITH TIME ZONE                            NOT NULL,
  cv         JSON                                                NOT NULL,
  person     CHARACTER VARYING(255) COLLATE pg_catalog."default" NOT NULL,
  CONSTRAINT cvs_pkey PRIMARY KEY (id)
)
WITH (
OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.cvs
  OWNER TO postgres;