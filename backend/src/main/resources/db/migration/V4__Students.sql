-- Table: public.student_mentors

CREATE TABLE public.student_mentors
(
    id uuid NOT NULL,
    student character varying(255) NOT NULL,
    mentor character varying(255) NOT NULL,
    "from" date NOT NULL,
    "to" date,
    CONSTRAINT student_mentors_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_student_mentors_student
    ON public.student_mentors (student);

CREATE INDEX idx_student_mentors_mentor
    ON public.student_mentors (mentor);