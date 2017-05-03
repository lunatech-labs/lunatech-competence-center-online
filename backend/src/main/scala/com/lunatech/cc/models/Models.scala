package com.lunatech.cc.models

import scala.language.implicitConversions

case class Contact(name: String,
                   address: String,
                   postalCode: String,
                   city: String,
                   phone: String,
                   email: String,
                   countryCode: String)

case class BasicDetails(givenName: String,
                        familyName: String,
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
                    educations: Seq[Education])

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

package object Models {

  implicit def toXML(cv: CV): xml.Resume = xml.Resume(
    basics = Some(cv.employee.basics),
    educations = Some(cv.employee.educations),
    skills = Some(cv.employee.skills),
    achievements = Some(cv.employee.achievements),
    projects = Some(cv.employee.projects),
    meta = Some(cv.meta))

  implicit def toXML(basicDetails: BasicDetails): xml.Basics = xml.Basics(
    givenName = Some(basicDetails.givenName),
    familyName = Some(basicDetails.familyName),
    label = Some(basicDetails.label),
    startYear = Some(basicDetails.startYear),
    image = Some(basicDetails.image),
    email = Some(basicDetails.email),
    profile = Some(basicDetails.profile),
    contact = Some(basicDetails.contact))

  implicit def toXML(contact: Contact): xml.Contact = xml.Contact(
    name = Some(contact.name),
    address = Some(contact.address),
    postalCode = Some(contact.postalCode),
    city = Some(contact.city),
    phone = Some(contact.phone),
    email = Some(contact.email),
    countryCode = Some(contact.countryCode))

  implicit def toXML(education: Education): xml.Education = xml.Education(
    institution = Some(education.institution),
    studyType = Some(education.studyType),
    startDate = Some(education.startDate),
    endDate = Some(education.endDate),
    description = Some(education.description))

  implicit def toXML(educations: Seq[Education]): xml.Educations = xml.Educations(educations.map(toXML))

  implicit def toXML(skill: Skill): xml.Skill = xml.Skill(
    name = Some(skill.name),
    level = Some(skill.level),
    category = Some(skill.category))

  implicit def toXML(skills: Seq[Skill]): xml.Skills = xml.Skills(skills.map(toXML))

  implicit def toXML(description: String): xml.Achievement = xml.Achievement(Some(description))

  implicit def toXML(achievements: Seq[String]): xml.Achievements = xml.Achievements(achievements.map(toXML))

  implicit def toXML(project: Project): xml.Project = xml.Project(
    client = Some(project.client),
    startDate = Some(project.startDate),
    endDate = Some(project.endDate),
    role = Some(project.role),
    summary = Some(project.summary))

  implicit def toXML(projects: Seq[Project]): xml.Projects = xml.Projects(projects.map(toXML))

  implicit def toXML(meta: Meta): xml.Meta = xml.Meta(
    version = Some(meta.client),
    created = Some(meta.creationDate)
  )
}