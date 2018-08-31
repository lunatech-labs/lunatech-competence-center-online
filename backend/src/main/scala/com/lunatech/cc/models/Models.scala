package com.lunatech.cc.models

import com.lunatech.cc.api.EnrichedGoogleUser
import com.lunatech.cc.api.services.Person
import io.circe.{Decoder, Encoder, Json, ObjectEncoder}

import scala.language.implicitConversions
import io.circe.generic.semiauto._
import shapeless.{Generic, HNil}


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
                    educations: Seq[Education]) {

  def updateSkills(matrix: Seq[Skill]): Employee =
    {
      val filtered: Seq[Skill] = skills.filterNot(s => matrix.exists(t => t.name == s.name))
      this.copy(skills = matrix ++ filtered )
    }
}

object Employee {
  def apply(user:EnrichedGoogleUser): Employee = {
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

sealed trait SkillLevel {
  def level: Int
}

object SkillLevel {
  implicit def encodeCaseObject[A <: Product](implicit
                                              gen: Generic.Aux[A, HNil]
                                             ): Encoder[A] = Encoder[String].contramap[A](_.productPrefix)

  //TODO replace with shapeless magic
  def stringToLevel(json: String): SkillLevel = json match {
    case "NOVICE" => NOVICE
    case "ADVANCED_BEGINNER" => ADVANCED_BEGINNER
    case "COMPETENT" => COMPETENT
    case "PROFICIENT" => PROFICIENT
    case "EXPERT" => EXPERT
  }
}

case object NOVICE extends SkillLevel { val level = 2}
case object ADVANCED_BEGINNER extends SkillLevel { val level = 4}
case object COMPETENT extends SkillLevel { val level = 6}
case object PROFICIENT extends SkillLevel { val level = 8}
case object EXPERT extends SkillLevel { val level = 10}

case class Tech(id:Int, name: String, techType: String)
case class MatrixSkill(tech: Tech, skillLevel: String, id:Int) {

  def toSkill: Skill = Skill(tech.techType, tech.name,SkillLevel.stringToLevel(skillLevel).level)
}

case class MatrixSkills(skills: Seq[MatrixSkill])

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

case class CV(employee: Employee,
              meta: Meta)

case class CVData(id:String, cv: Json)

object CVData {
  implicit val cdEncoder: ObjectEncoder[CVData] = deriveEncoder[CVData]
  implicit val cdDecoder: Decoder[CVData] = deriveDecoder[CVData]

}

case class CVS(person: Person, cvs: List[CVData])


case class Skills(interpersonal: List[String], leadership: List[String], managerial: List[String])
case class Specialization(name: String, requiredCurriculum: String, optionalCurriculum: String)
case class CareerLevel(name: String, shortName: String, description: String, curriculum: Option[String], workableLevel: Option[String], yearsOfExperience: Option[Int], specialized: Option[Boolean], canBeOa: Option[Boolean], canBePl: Option[Boolean], requiredCurriculum: Option[String], optionalCurriculum: Option[String], specializations: Option[List[Specialization]], skills: Skills)

object CV {
  def apply(user:EnrichedGoogleUser): CV = {
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

  implicit val ctEncoder: ObjectEncoder[Contact] = deriveEncoder[Contact]
  implicit val ctDecoder: Decoder[Contact] = deriveDecoder[Contact]

  implicit val bdEncoder: ObjectEncoder[BasicDetails] = deriveEncoder[BasicDetails]
  implicit val bdDecoder: Decoder[BasicDetails] = deriveDecoder[BasicDetails]

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

  implicit val edEncoder: ObjectEncoder[Education] = deriveEncoder[Education]
  implicit val edDecoder: Decoder[Education] = deriveDecoder[Education]


  implicit def toXML(educations: Seq[Education]): xml.Educations = xml.Educations(educations.map(toXML))

  implicit def toXML(skill: Skill): xml.Skill = xml.Skill(
    name = skill.name,
    level = skill.level,
    category = skill.category)

  implicit val skEncoder: ObjectEncoder[Skill] = deriveEncoder[Skill]
  implicit val skDecoder: Decoder[Skill] = deriveDecoder[Skill]


  implicit def toXML(skills: Seq[Skill]): xml.Skills = xml.Skills(skills.map(toXML))

  implicit def toXML(description: String): xml.Achievement = xml.Achievement(description)

  implicit def toXML(achievements: Seq[String]): xml.Achievements = xml.Achievements(achievements.map(toXML))

  implicit def toXML(project: Project): xml.Project = xml.Project(
    client = project.client,
    startDate = project.startDate,
    endDate = project.endDate,
    role = project.role,
    summary = project.summary)

  implicit val pjEncoder: ObjectEncoder[Project] = deriveEncoder[Project]
  implicit val pjDecoder: Decoder[Project] = deriveDecoder[Project]



  implicit def toXML(projects: Seq[Project]): xml.Projects = xml.Projects(projects.map(toXML))

  implicit def toXML(meta: Meta): xml.Meta = xml.Meta(
    version = meta.client,
    created = meta.creationDate,
    office = xml.OfficeType.fromString(meta.office, xml.defaultScope),
    language = xml.LanguageType.fromString(meta.language, xml.defaultScope)
  )

  implicit val emEncoder: ObjectEncoder[Employee] = deriveEncoder[Employee]
  implicit val emDecoder: Decoder[Employee] = deriveDecoder[Employee]
  implicit val mtEncoder: ObjectEncoder[Meta] = deriveEncoder[Meta]
  implicit val mtDecoder: Decoder[Meta] = deriveDecoder[Meta]


  implicit val cvEncoder: ObjectEncoder[CV] = deriveEncoder[CV]
  implicit val cvDecoder: Decoder[CV] = deriveDecoder[CV]


  implicit val skillsEncoder: ObjectEncoder[Skills] = deriveEncoder[Skills]
  implicit val skillsDecoder: Decoder[Skills] = deriveDecoder[Skills]

  implicit val specializationEncoder: ObjectEncoder[Specialization] = deriveEncoder[Specialization]
  implicit val specializationDecoder: Decoder[Specialization] = deriveDecoder[Specialization]

  implicit val careerLevelEncoder: ObjectEncoder[CareerLevel] = deriveEncoder[CareerLevel]
  implicit val careerLevelDecoder: Decoder[CareerLevel] = deriveDecoder[CareerLevel]


}