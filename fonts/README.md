# fonts subproject

This project is only needed if new fonts are needed in for the PDF generation. The built artifact is already part of the backend project.

If a new font is needed:
- add it to `src/main/resources/font`
- add it to `build.sbt`
- run `sbt package`
- copy the resulting jar file to `backend/lib`
