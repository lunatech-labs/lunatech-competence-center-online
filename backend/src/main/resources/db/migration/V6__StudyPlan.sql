-- Table: public.study_plan

CREATE TABLE public.study_plan
(
    id uuid NOT NULL,
    goal_number integer NOT NULL,
    student character varying(255) NOT NULL,
    goal_title text NOT NULL,
    goal_description text,
    created_on date NOT NULL DEFAULT now(),
    created_by character varying(255) NOT NULL,
    started_on date,
    done_on date,
    deadline date,
    result text,
    subject character varying(255),
    retro text,
    assessed_on date,
    assessed_by character varying(255),
    assessment_notes text,
    CONSTRAINT study_plan_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_study_plan_student
    ON public.study_plan (student);