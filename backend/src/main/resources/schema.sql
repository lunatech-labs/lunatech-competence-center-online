-- Table: public.cvs

-- DROP TABLE public.cvs;

CREATE TABLE public.cvs
(
  id uuid NOT NULL,
  created_on timestamp with time zone NOT NULL,
  cv json NOT NULL,
  person character varying(255) COLLATE pg_catalog."default" NOT NULL,
  CONSTRAINT cvs_pkey PRIMARY KEY (id)
)
WITH (
OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.cvs
  OWNER to postgres;