-- Table: public.person_projects

CREATE TABLE public.person_projects
(
    id uuid NOT NULL,
    person character varying(255) NOT NULL,
    started_on date NOT NULL,
    done_on date,
    subject character varying(255) NOT NULL,
    project character varying(255) NOT NULL,
    url text,
    assessed_on date,
    assessed_by character varying(255),
    assessment_notes text,
    CONSTRAINT person_projects_pkey PRIMARY KEY (id),
    CONSTRAINT person_projects_person_subject_project UNIQUE (person, subject, project)
);

CREATE INDEX idx_person_projects_person
    ON public.person_projects (person);