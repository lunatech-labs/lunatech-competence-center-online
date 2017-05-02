package com.lunatech.cc.models

case class Contact(name: String,
                   address: String,
                   postalCode: String,
                   city: String,
                   phone: String,
                   email: String,
                   countryCode: String)

case class BasicDetails(name: String,
                        label: String,
                        startYear: String,
                        email: String,
                        image: String,
                        profile: String,
                        contact: Contact)

case class Employee(basics: BasicDetails,
                    skills: Seq[Skill],
                    achievements: Seq[String],
                    projects: Seq[Project],
                    educations: Seq[Education],
                    keyType: String)

case class Skill(category: String,
                 name: String,
                 level: Int)

case class Project(client: String,
                   startDate: String,
                   endDate: String,
                   role: String,
                   summary: String)

case class Education(institution: String,
                     country: String,
                     studyType: String,
                     startDate: String,
                     endDate: String,
                     description: String)

case class Meta(client: String,
                creationDate: String,
                language: String)

case class CV(employee: Employee,
              meta: Meta)

case class Error(internalCode: Int,
                 errorMessage: String,
                 httpStatusCode: Integer,
                 timestamp: Int)