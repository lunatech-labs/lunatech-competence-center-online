package com.lunatech.cc.api

import com.lunatech.cc.models._
import io.circe.Json
import io.circe.generic.auto._
import io.circe.syntax._

package object services {


  object TestData {

    val peopleApiResponseString = """[{"email":"developer@lunatech.com","name":{"fullName":"Developer Lunatech","familyName":"Lunatech","givenName":"Developer"},"thumbnail":"https://plus.google.com/_/focus/photos/private/AIcEiAIAAABECKCz8IKIrZzV8AEiC3ZjYXJkX3Bob3RvKihjYTgwMjVkOGZjNmFmNzRkZGU2YTMxNzMxMDA4OWZkMjZlZjI1ZWI5MAF3uRt2Iqwrbmxt8viCItKJ30J1Yw","managers":["vincent.grente@lunatech.com"],"currentProjects":[],"roles":["developer"],"github":"lunatechie"},{"email":"adrien.haxaire@lunatech.com","name":{"fullName":"Adrien Haxaire","familyName":"Haxaire","givenName":"Adrien"},"thumbnail":"https://plus.google.com/_/focus/photos/private/AIbEiAIAAABECKCz8IKIrZzV8AEiC3ZjYXJkX3Bob3RvKihjYTgwMjVkOGZjNmFmNzRkZGU2YTMxNzMxMDA4OWZkMjZlZjI1ZWI5MAF3uRt2Iqwrbmxt8viCItKJ30J1Yw","managers":["vincent.grente@lunatech.com"],"currentProjects":[],"roles":["developer","development manager"],"github":"adrienhaxaire"},{"email":"aleksandar.gjorgjevich@lunatech.com","name":{"fullName":"Aleksandar Gjorgjevich","familyName":"Gjorgjevich","givenName":"Aleksandar"},"thumbnail":null,"managers":["erik.bakker@lunatech.com"],"currentProjects":[],"roles":["developer"],"github":"daltonito"},{"email":"anastasiia.pushkina@lunatech.com","name":{"fullName":"Anastasiia Pushkina","familyName":"Pushkina","givenName":"Anastasiia"},"thumbnail":"https://plus.google.com/_/focus/photos/private/AIbEiAIAAABECLeM2JLHytuznQEiC3ZjYXJkX3Bob3RvKihmNGYzMzMwMTIxYjI4MTIxYTQzMTMyM2Q3NGY4ODM3MmRhZjM2N2I3MAEvlwsdzC3V1SQEZt0erNDJtsomEg","managers":["harry.laoulakos@lunatech.com"],"currentProjects":[],"roles":["developer"],"github":"AnastasiiaL"},{"email":"andrea.giugliano@lunatech.com","name":{"fullName":"Andrea Giugliano","familyName":"Giugliano","givenName":"Andrea"},"thumbnail":null,"managers":["gustavo.de.micheli@lunatech.com"],"currentProjects":[],"roles":["developer"],"github":"ag91"},{"email":"andrew.korshny@lunatech.com","name":{"fullName":"Andrew Korshny","familyName":"Korshny","givenName":"Andrew"},"thumbnail":null,"managers":["sietse.de.kaper@lunatech.com"],"currentProjects":[],"roles":["developer"],"github":null},{"email":"aniket.kakde@lunatech.com","name":{"fullName":"Aniket Kakde","familyName":"Kakde","givenName":"Aniket"},"thumbnail":null,"managers":["vladimir.bodnartchouk@lunatech.com"],"currentProjects":[],"roles":["developer"],"github":"aniketkakde"},{"email":"antoine.laffez@lunatech.com","name":{"fullName":"Antoine Laffez","familyName":"Laffez","givenName":"Antoine"},"thumbnail":"https://plus.google.com/_/focus/photos/public/AIbEiAIAAABECIP-37bL0KOEogEiC3ZjYXJkX3Bob3RvKihkODUwMTAzMWIyZDQ0ZTRkZWI4ZTFmZDBiY2VmZjQ0OGZhZjU2MWFhMAF6Xim9Db7zHpXB5dQEmq3nYW31BQ","managers":["nicolas.leroux@lunatech.com","ray.kemp@lunatech.com"],"currentProjects":[],"roles":["administrative"],"github":null},{"email":"antria.kkousii@lunatech.com","name":{"fullName":"Antria Kkousii","familyName":"Kkousii","givenName":"Antria"},"thumbnail":null,"managers":["inaki.de.tejada@lunatech.com"],"currentProjects":[],"roles":["developer"],"github":"akkous01"},{"email":"arjun.dhawan@lunatech.com","name":{"fullName":"Arjun Dhawan","familyName":"Dhawan","givenName":"Arjun"},"thumbnail":null,"managers":["harry.laoulakos@lunatech.com"],"currentProjects":[],"roles":["developer"],"github":null},{"email":"bart.honing@lunatech.com","name":{"fullName":"Bart Honing","familyName":"Honing","givenName":"Bart"},"thumbnail":"https://plus.google.com/_/focus/photos/private/AIbEiAIAAABECO22nYz5wqDB6AEiC3ZjYXJkX3Bob3RvKihjYTNhYjAwM2U5ZGViYTZmNjMyMzY4N2M2MjkzMmJlMjE1NzczNDQxMAFdNXu246oUf62Z5gLya2imFFsaBg","managers":["sietse.de.kaper@lunatech.com"],"currentProjects":[],"roles":["developer"],"github":null},{"email":"bart.schuller@lunatech.com","name":{"fullName":"Bart Schuller","familyName":"Schuller","givenName":"Bart"},"thumbnail":"https://plus.google.com/_/focus/photos/private/AIbEiAIAAABECLro8_mnkOKf7QEiC3ZjYXJkX3Bob3RvKihhMTEzY2M2Y2UxNTlkYmM0NDQzYTUwMDMzZmFjOTMzYmJmYjYzODYwMAHR3gfYY-YgeKQrp_96tGSpUyuEjg","managers":["gustavo.de.micheli@lunatech.com"],"currentProjects":[],"roles":["developer"],"github":"bartschuller"},{"email":"benoit.montuelle@lunatech.com","name":{"fullName":"Benoit Montuelle","familyName":"Montuelle","givenName":"Benoit"},"thumbnail":null,"managers":["vladimir.bodnartchouk@lunatech.com"],"currentProjects":[],"roles":["developer","external"],"github":"bmontuelle"},{"email":"bogdan.suierica@lunatech.com","name":{"fullName":"Bogdan Suierica","familyName":"Suierica","givenName":"Bogdan"},"thumbnail":null,"managers":["inaki.de.tejada@lunatech.com"],"currentProjects":[],"roles":["developer"],"github":null},{"email":"bruno.visioli@lunatech.com","name":{"fullName":"Bruno Visioli","familyName":"Visioli","givenName":"Bruno"},"thumbnail":null,"managers":["francisco.canedo@lunatech.com"],"currentProjects":[],"roles":["developer"],"github":null},{"email":"daan.hoogenboezem@lunatech.com","name":{"fullName":"Daan Hoogenboezem","familyName":"Hoogenboezem","givenName":"Daan"},"thumbnail":null,"managers":["erik.janssen@lunatech.com"],"currentProjects":[],"roles":["developer"],"github":"daanhoogenboezem"},{"email":"daniel.alarcao@lunatech.com","name":{"fullName":"Daniel Alarcao","familyName":"Alarcao","givenName":"Daniel"},"thumbnail":null,"managers":["adrien.haxaire@lunatech.com"],"currentProjects":[],"roles":["developer"],"github":"Drakan42"},{"email":"daniel.eisenberg@lunatech.com","name":{"fullName":"Daniel Eisenberg","familyName":"Eisenberg","givenName":"Daniel"},"thumbnail":null,"managers":["francisco.canedo@lunatech.com"],"currentProjects":[],"roles":["developer"],"github":null},{"email":"dimitrios.charoulis@lunatech.com","name":{"fullName":"Dimitrios Charoulis","familyName":"Charoulis","givenName":"Dimitrios"},"thumbnail":null,"managers":["erik.janssen@lunatech.com"],"currentProjects":[],"roles":["developer"],"github":"dcharoulis"},{"email":"dionysios.ntaouros@lunatech.com","name":{"fullName":"Dionysios Ntaouros","familyName":"Ntaouros","givenName":"Dionysios"},"thumbnail":null,"managers":["gustavo.de.micheli@lunatech.com"],"currentProjects":[],"roles":["developer"],"github":"ntaouros"},{"email":"dirk.jonker@lunatech.com","name":{"fullName":"Dirk Jonker","familyName":"Jonker","givenName":"Dirk"},"thumbnail":"https://plus.google.com/_/focus/photos/private/AIbEiAIAAABECIXHgdSJoL2zxQEiC3ZjYXJkX3Bob3RvKigyYTg0YmFmOTNmYTgzY2ViMzdmZGRiNTAwYmJiYTY0YmQ1MDg1NTMyMAEYvwePO6ideKxg1N2jZdLjSUXY4A","managers":["adrien.haxaire@lunatech.com"],"currentProjects":[],"roles":["developer"],"github":"dirkjonker"},{"email":"elham.ghanbaryfar@lunatech.com","name":{"fullName":"Elham Ghanbaryfar","familyName":"Ghanbaryfar","givenName":"Elham"},"thumbnail":null,"managers":["sietse.de.kaper@lunatech.com"],"currentProjects":[],"roles":["developer"],"github":"elhamGhanbarifar"},{"email":"erik.bakker@lunatech.com","name":{"fullName":"Erik Bakker","familyName":"Bakker","givenName":"Erik"},"thumbnail":"https://plus.google.com/_/focus/photos/public/AIbEiAIAAABDCLiN3M7u2OqCViILdmNhcmRfcGhvdG8qKGI1ZjNiYWJjOTc2ZjRkMTliZTczZDcxMjIwNmIxYzY3ZjI2ODQ3NWMwARDi3BJ2Fk9yCJx2Y54E7RCN50Du","managers":["nicolas.leroux@lunatech.com","ray.kemp@lunatech.com"],"currentProjects":[],"roles":["development manager","developer","techmatrix-admin"],"github":"eamelink"},{"email":"erik.janssen@lunatech.com","name":{"fullName":"Erik Janssen","familyName":"Janssen","givenName":"Erik"},"thumbnail":"https://plus.google.com/_/focus/photos/public/AIbEiAIAAABECOKnxYOZj7jk3AEiC3ZjYXJkX3Bob3RvKihmZTU3NTliMTVjY2Y2MTk0NTRjNTk2NTJhZGMzNDI2MWZhMjI0YTU1MAHhOlUptW98g6GsrmH3PkxVGVmNaQ","managers":["vincent.grente@lunatech.com"],"currentProjects":[],"roles":["developer","development manager"],"github":"erikwj"}]"""

    val employee = Employee(
      basics = BasicDetails(
        givenName = "Developer",
        familyName = "Lunatech",
        label = "Software Engineer",
        startYear = "Employee since 1992",
        email = "erik.janssen@lunatech.com",
        image = "developer.jpg",
        profile = "Awesome developer",
        contact = Contact(
          name = "Lunatech Labs",
          address = "Baan 74",
          postalCode = "3011 CD",
          city = "Rotterdam",
          phone = "010",
          email = "info@lunatech.com",
          countryCode = "NL"
        )
      ),
      skills = Nil,
      achievements = Nil,
      projects = Nil,
      educations = Nil
    )
    val manager = Employee(
      basics = BasicDetails(
        givenName = "Manager",
        familyName = "Lunatech",
        label = "Managing Software Engineers",
        startYear = "Employee since 1992",
        email = "manager@lunatech.com",
        image = "manager.jpg",
        profile = "Awesome manager",
        contact = Contact(
          name = "Lunatech Labs",
          address = "Baan 74",
          postalCode = "3011 CD",
          city = "Rotterdam",
          phone = "010",
          email = "info@lunatech.com",
          countryCode = "NL"
        )
      ),
      skills = Nil,
      achievements = Nil,
      projects = Nil,
      educations = Nil
    )
    val employeeJson: Json = employee.asJson
    val managerJson: Json = manager.asJson
    val cv: CV = CV(employee, Meta("test", "today", "Rotterdam", "EN"))
    val cvJson: Json = cv.asJson
  }


}
