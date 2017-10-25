-- Table: public.person_knowledge

CREATE TABLE public.person_knowledge
(
    id uuid NOT NULL,
    person character varying(255) NOT NULL,
    created_on date NOT NULL,
    subject character varying(255) NOT NULL,
    topic character varying(255) NOT NULL,
    assessed_on date,
    assessed_by character varying(255),
    assessment_notes text,
    CONSTRAINT person_knowledge_pkey PRIMARY KEY (id),
    CONSTRAINT person_knowledge_person_subject_topic UNIQUE (person, subject, topic)
);

CREATE INDEX idx_person_knowledge_person
    ON public.person_knowledge (person);