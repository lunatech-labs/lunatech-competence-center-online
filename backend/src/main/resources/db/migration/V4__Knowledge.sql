---- Table: public.person_knowledge
--
CREATE TABLE person_knowledge
(
    id UUID NOT NULL,
    person character varying(255) NOT NULL,
    created_on TIMESTAMP WITH TIME ZONE NOT NULL,
    subject character varying(255) NOT NULL,
    topic character varying(255) NOT NULL,
    assessed_on TIMESTAMP WITH TIME ZONE,
    assessed_by character varying(255),
    assessment_notes text,
    CONSTRAINT person_knowledge_pkey PRIMARY KEY (id),
    CONSTRAINT person_knowledge_person_subject_topic UNIQUE (person, subject, topic)
);

CREATE INDEX idx_person_knowledge_person ON person_knowledge (person);