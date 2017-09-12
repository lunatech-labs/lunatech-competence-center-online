package com.lunatech.cc.models

import com.lunatech.cc.api.GoogleUser
import com.lunatech.cc.api.services.Person
import io.circe.{Decoder, Encoder, Json}

import scala.language.implicitConversions
import io.circe.generic.semiauto._


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

object Employee {
  def apply(user:GoogleUser): Employee = {
    val bd: BasicDetails = BasicDetails(user.givenName,user.familyName,"","",user.email,"","",Contact("","","","","","",""))
    basicEmployee(bd)
  }

  def apply(person: Person): Employee = {
    val bd: BasicDetails = BasicDetails(person.name.givenName,person.name.familyName,"","",person.email,"","",Contact("","","","","","",""))
    basicEmployee(bd)
  }

  private def basicEmployee(bd: BasicDetails) = {
    Employee(bd,Seq(),Seq(),Seq(),Seq())
  }
}

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
                office: String,
                language: String)


case class CVData(email: String, cv: Json)
case class CVS(email: String, cvs: List[Json])

object CVData {

  import io.circe.generic.semiauto._
  implicit val enc: Encoder[CVData] = deriveEncoder[CVData]
  implicit val dec: Decoder[CVData] = deriveDecoder[CVData]
  implicit val enccvs: Encoder[CVS] = deriveEncoder[CVS]
  implicit val deccvs: Decoder[CVS] = deriveDecoder[CVS]

}

case class CV(employee: Employee,
              meta: Meta)

object CV {
  def apply(user:GoogleUser): CV = {
    val bd: BasicDetails = BasicDetails(user.givenName,user.familyName,"","",user.email,"","",Contact("","","","","","",""))
    basicCV(bd)
  }

  def apply(person: Person): CV = {
    val bd: BasicDetails = BasicDetails(person.name.givenName,person.name.familyName,"","",person.email,"","",Contact("","","","","","",""))
    basicCV(bd)
  }

  def apply(employee: Employee): CV = CV(employee,Meta("","","",""))

  private def basicCV(bd: BasicDetails) = {
    val employee = Employee(bd,Seq(),Seq(),Seq(),Seq())
    val meta = Meta("","","","")
    new CV(employee, meta)
  }
}

case class Error(internalCode: Int,
                 errorMessage: String,
                 httpStatusCode: Integer,
                 timestamp: Int)

package object Models {

  implicit def toXML(cv: CV): xml.Resume = xml.Resume(
    basics = cv.employee.basics,
    educations = cv.employee.educations,
    skills = cv.employee.skills,
    achievements = cv.employee.achievements,
    projects = cv.employee.projects,
    meta = cv.meta)



  implicit def toXML(basicDetails: BasicDetails): xml.Basics = xml.Basics(
    givenName = basicDetails.givenName,
    familyName = basicDetails.familyName,
    label = basicDetails.label,
    startYear = basicDetails.startYear,
    image = basicDetails.image,
    email = basicDetails.email,
    profile = basicDetails.profile,
    contact = basicDetails.contact)

  implicit val ctEncoder = deriveEncoder[Contact]
  implicit val ctDecoder = deriveDecoder[Contact]

  implicit val bdEncoder = deriveEncoder[BasicDetails]
  implicit val bdDecoder = deriveDecoder[BasicDetails]

  implicit def toXML(contact: Contact): xml.Contact = xml.Contact(
    name = contact.name,
    address = contact.address,
    postalCode = contact.postalCode,
    city = contact.city,
    phone = contact.phone,
    email = contact.email,
    countryCode = contact.countryCode)


  implicit def toXML(education: Education): xml.Education = xml.Education(
    country = education.country,
    institution = education.institution,
    studyType = education.studyType,
    startDate = education.startDate,
    endDate = education.endDate,
    description = education.description)

  implicit val edEncoder = deriveEncoder[Education]
  implicit val edDecoder = deriveDecoder[Education]


  implicit def toXML(educations: Seq[Education]): xml.Educations = xml.Educations(educations.map(toXML))

  implicit def toXML(skill: Skill): xml.Skill = xml.Skill(
    name = skill.name,
    level = skill.level,
    category = skill.category)

  implicit val skEncoder = deriveEncoder[Skill]
  implicit val skDecoder = deriveDecoder[Skill]


  implicit def toXML(skills: Seq[Skill]): xml.Skills = xml.Skills(skills.map(toXML))

  implicit def toXML(description: String): xml.Achievement = xml.Achievement(description)

  implicit def toXML(achievements: Seq[String]): xml.Achievements = xml.Achievements(achievements.map(toXML))

  implicit def toXML(project: Project): xml.Project = xml.Project(
    client = project.client,
    startDate = project.startDate,
    endDate = project.endDate,
    role = project.role,
    summary = project.summary)

  implicit val pjEncoder = deriveEncoder[Project]
  implicit val pjDecoder = deriveDecoder[Project]



  implicit def toXML(projects: Seq[Project]): xml.Projects = xml.Projects(projects.map(toXML))

  implicit def toXML(meta: Meta): xml.Meta = xml.Meta(
    version = meta.client,
    created = meta.creationDate,
    office = xml.OfficeType.fromString(meta.office, xml.defaultScope),
    language = xml.LanguageType.fromString(meta.language, xml.defaultScope)
  )

  implicit val emEncoder = deriveEncoder[Employee]
  implicit val emDecoder = deriveDecoder[Employee]
  implicit val mtEncoder = deriveEncoder[Meta]
  implicit val mtDecoder = deriveDecoder[Meta]


  implicit val cvEncoder = deriveEncoder[CV]
  implicit val cvDecoder = deriveDecoder[CV]


}