<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns:r="http://lunatech.com/2017/03/31/resume"
    xmlns:conf="urn:lunatech-resume-internal-configuration" version="1.0">

    <!-- Addresses to put in the top-right of the PDF -->
    <conf:office code="Amsterdam">
        <r:name>Lunatech Labs</r:name>
        <r:address>Van Leijenberghlaan 197A</r:address>
        <r:postalCode>1082 GG</r:postalCode>
        <r:city>Amsterdam</r:city>
        <r:phone>+31 (0)10 750 2600</r:phone>
        <r:email>info@lunatech.com</r:email>
    </conf:office>
    <conf:office code="Paris">
        <r:name>Lunatech Labs</r:name>
        <r:address>3, Rue de la Galmy</r:address>
        <r:postalCode>77700</r:postalCode>
        <r:city>Chessy</r:city>
        <r:phone>+33 (0)1 82 88 56 64</r:phone>
        <r:email>info@lunatech.com</r:email>
    </conf:office>
    <conf:office code="Rotterdam">
        <r:name>Lunatech Labs</r:name>
        <r:address>Baan 74</r:address>
        <r:postalCode>3011 CD</r:postalCode>
        <r:city>Rotterdam</r:city>
        <r:phone>+31 (0)10 750 2600</r:phone>
        <r:email>info@lunatech.com</r:email>
    </conf:office>

    <!-- Heading texts -->
    <conf:heading code="key_skills" language="EN">Key Skills</conf:heading>
    <conf:heading code="key_skills" language="FR">Compétences</conf:heading>
    <conf:heading code="other" language="EN">Other</conf:heading>
    <conf:heading code="other" language="FR">Extras</conf:heading>
    <conf:heading code="profile" language="EN">Profile</conf:heading>
    <conf:heading code="profile" language="FR">Introduction</conf:heading>
    <conf:heading code="key_experience" language="EN">Key Experience</conf:heading>
    <conf:heading code="key_experience" language="FR">Expérience Professionelle</conf:heading>
    <conf:heading code="education" language="EN">Education</conf:heading>
    <conf:heading code="education" language="FR">Formation</conf:heading>

    <xsl:variable name="red" select="'#CC0033'"/>

    <xsl:template match="/">
        <fo:root xmlns:fo="http://www.w3.org/1999/XSL/Format"
            xmlns:xlink="http://www.w3.org/1999/xlink" xsl:use-attribute-sets="document">
            <fo:layout-master-set>
                <fo:simple-page-master xsl:use-attribute-sets="page">
                    <fo:region-body xsl:use-attribute-sets="body"
                        background-position-horizontal="center" background-repeat="repeat-y"
                        background-image='url("images/line.svg")'/>
                    <fo:region-before/>
                    <fo:region-after/>
                </fo:simple-page-master>
            </fo:layout-master-set>
            <xsl:apply-templates/>
        </fo:root>
    </xsl:template>

    <xsl:template match="r:resume">
        <fo:page-sequence master-reference="A4">
            <xsl:apply-templates select="r:basics" mode="heading"/>
            <fo:flow flow-name="xsl-region-body">
                <fo:table table-layout="fixed" width="100%">
                    <fo:table-column column-width="proportional-column-width(9)"/>
                    <fo:table-column column-width="proportional-column-width(13)"/>
                    <fo:table-body>
                        <fo:table-row>
                            <fo:table-cell column-number="1" xsl:use-attribute-sets="column-left">
                                <xsl:apply-templates select="r:basics" mode="left"/>
                                <xsl:apply-templates select="r:skills"/>
                                <xsl:apply-templates select="r:achievements"/>
                            </fo:table-cell>
                            <fo:table-cell column-number="2" xsl:use-attribute-sets="column-right">
                                <xsl:apply-templates select="r:basics"/>
                                <xsl:apply-templates select="r:projects"/>
                                <xsl:apply-templates select="r:educations"/>
                            </fo:table-cell>
                        </fo:table-row>
                    </fo:table-body>
                </fo:table>
            </fo:flow>
        </fo:page-sequence>
    </xsl:template>

    <xsl:template match="r:basics" mode="heading">
        <xsl:variable name="officeCode" select="/r:resume/r:meta/r:office"/>
        <xsl:variable name="officeDetails" select="document('')/*/conf:office[@code=$officeCode]"/>
        <fo:static-content flow-name="xsl-region-before">
            <fo:block-container xsl:use-attribute-sets="basics-contact">
                <fo:table table-layout="fixed" width="100%">
                    <fo:table-column column-width="proportional-column-width(9)"/>
                    <fo:table-column column-width="proportional-column-width(7)"/>
                    <fo:table-column column-width="proportional-column-width(6)"/>
                    <fo:table-body>
                        <fo:table-row>
                            <fo:table-cell column-number="1">
                                <fo:block padding-top="5mm">
                                    <fo:external-graphic src="images/lunatech-logo.svg"
                                        content-width="75%" content-height="75%"/>
                                </fo:block>
                            </fo:table-cell>
                            <fo:table-cell column-number="2" xsl:use-attribute-sets="column-right">
                                <xsl:apply-templates select="$officeDetails" mode="left"/>
                            </fo:table-cell>
                            <fo:table-cell column-number="3">
                                <xsl:apply-templates select="$officeDetails" mode="right"/>
                            </fo:table-cell>
                        </fo:table-row>
                    </fo:table-body>
                </fo:table>
            </fo:block-container>
        </fo:static-content>
    </xsl:template>

    <xsl:template match="r:basics" mode="left">
        <fo:block text-align-last="center" keep-together.within-page="5">
            <fo:block-container>
                <fo:block xsl:use-attribute-sets="basics-image image">
                    <fo:instream-foreign-object>
                        <svg xmlns="http://www.w3.org/2000/svg" width="3.5cm" height="3.5cm">
                            <defs>
                                <clipPath id="round-photo">
                                    <circle cx="1.75cm" cy="1.75cm" r="1.7cm"/>
                                </clipPath>
                            </defs>
                            <circle cx="1.75cm" cy="1.75cm" r="1.75cm" fill="black"/>
                            <image xlink:href="{r:image}" x="0" y="0" width="3.5cm" height="3.5cm"
                                clip-path="url(#round-photo)"/>
                        </svg>
                    </fo:instream-foreign-object>
                </fo:block>
            </fo:block-container>
            <fo:block-container>
                <fo:block text-align-last="center" line-height="1.2" text-transform="uppercase">
                    <fo:block text-align-last="justify" font-weight="200" font-size="18pt"
                        letter-spacing="2pt">
                        <fo:leader leader-pattern="rule" alignment-baseline="middle"
                            padding-left="0.1em" padding-right="0.5em"/>
                        <xsl:value-of select="r:givenName"/>
                        <fo:leader leader-pattern="rule" alignment-baseline="middle"
                            padding-left="0.5em" padding-right="0.1em"/>
                    </fo:block>
                    <fo:block font-size="18pt" font-weight="700" letter-spacing="2pt"
                        padding-bottom="4pt">
                        <xsl:value-of select="r:familyName"/>
                    </fo:block>
                    <fo:block xsl:use-attribute-sets="basics-label">
                        <xsl:value-of select="r:label"/>
                    </fo:block>
                    <fo:block text-transform="uppercase" font-size="8pt" padding-top="8pt"
                        letter-spacing="1pt">
                        <xsl:value-of select="r:startYear"/>
                    </fo:block>
                </fo:block>
            </fo:block-container>
        </fo:block>
    </xsl:template>

    <xsl:template match="r:skills">
        <fo:block-container keep-together.within-page="5">
            <xsl:call-template name="section-heading">
                <xsl:with-param name="code">key_skills</xsl:with-param>
            </xsl:call-template>
            <fo:block>
                <xsl:apply-templates select="r:skill[r:category!='fun']"/>
            </fo:block>
            <fo:block xsl:use-attribute-sets="fun-skills">
                <xsl:apply-templates select="r:skill[r:category='fun']"/>
            </fo:block>
        </fo:block-container>
    </xsl:template>

    <xsl:template match="r:skill">
        <xsl:call-template name="skill">
            <xsl:with-param name="name">
                <xsl:value-of select="r:name"/>
            </xsl:with-param>
            <xsl:with-param name="level">
                <xsl:value-of select="r:level"/>
            </xsl:with-param>
            <xsl:with-param name="color">black</xsl:with-param>
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="r:skill[r:category='fun']">
        <xsl:call-template name="skill">
            <xsl:with-param name="name">
                <xsl:value-of select="r:name"/>
            </xsl:with-param>
            <xsl:with-param name="level">
                <xsl:value-of select="r:level"/>
            </xsl:with-param>
            <xsl:with-param name="color">
                <xsl:value-of select="$red"/>
            </xsl:with-param>
        </xsl:call-template>
    </xsl:template>


    <xsl:template match="r:achievements">
        <fo:block-container keep-together.within-page="5">
            <xsl:call-template name="section-heading">
                <xsl:with-param name="code">other</xsl:with-param>
            </xsl:call-template>
            <fo:list-block>
                <xsl:apply-templates/>
            </fo:list-block>
        </fo:block-container>
    </xsl:template>

    <xsl:template match="r:achievement">
        <fo:list-item keep-together.within-page="always">
            <fo:list-item-label end-indent="label-end(  )">
                <fo:block>O</fo:block>
            </fo:list-item-label>
            <fo:list-item-body start-indent="body-start(  )">
                <fo:block xsl:use-attribute-sets="achievement">
                    <xsl:apply-templates/>
                </fo:block>
            </fo:list-item-body>
        </fo:list-item>
    </xsl:template>

    <xsl:template match="r:basics/r:profile">
        <fo:block-container keep-together.within-page="5">
           <xsl:call-template name="section-heading">
               <xsl:with-param name="code">profile</xsl:with-param>
           </xsl:call-template>
           <fo:block>
               <xsl:apply-templates/>
           </fo:block>
        </fo:block-container>
    </xsl:template>

    <xsl:template match="r:projects">
        <fo:block-container keep-together.within-page="5">
           <xsl:call-template name="section-heading">
               <xsl:with-param name="code">key_experience</xsl:with-param>
           </xsl:call-template>
           <fo:list-block>
               <xsl:apply-templates/>
           </fo:list-block>
        </fo:block-container>
    </xsl:template>

    <xsl:template match="r:project">
        <fo:list-item keep-together.within-page="always">
            <fo:list-item-label end-indent="label-end(  )">
                <fo:block>O</fo:block>
            </fo:list-item-label>
            <fo:list-item-body start-indent="body-start(  )">
                <fo:block letter-spacing="1pt">
                    <fo:inline font-weight="600" padding-right="5px">
                        <xsl:value-of select="r:client"/>
                        <xsl:text> </xsl:text>
                    </fo:inline>
                    <fo:inline>
                        <xsl:value-of select="r:startDate"/>
                        <xsl:text> - </xsl:text>
                        <xsl:value-of select="r:endDate"/>
                    </fo:inline>
                </fo:block>
                <fo:block>
                    <fo:inline font-weight="600">
                        <xsl:value-of select="r:role"/>
                        <xsl:text>: </xsl:text>
                    </fo:inline>
                    <xsl:apply-templates select="r:summary"/>
                </fo:block>
            </fo:list-item-body>
        </fo:list-item>
    </xsl:template>

    <xsl:template match="r:summary|r:description">
        <xsl:apply-templates/>
    </xsl:template>

    <xsl:template match="r:educations">
        <fo:block-container keep-together.within-page="5">
            <xsl:call-template name="section-heading">
                <xsl:with-param name="code">education</xsl:with-param>
            </xsl:call-template>
            <fo:list-block>
                <xsl:apply-templates/>
            </fo:list-block>
        </fo:block-container>
    </xsl:template>

    <xsl:template match="r:education">
        <fo:list-item keep-together.within-page="always">
            <fo:list-item-label end-indent="label-end(  )">
                <fo:block>O</fo:block>
            </fo:list-item-label>
            <fo:list-item-body start-indent="body-start(  )" line-height="1.5">
                <fo:block>
                    <fo:inline font-weight="600" letter-spacing="1pt">
                        <xsl:value-of select="r:studyType"/>
                    </fo:inline>
                </fo:block>
                <fo:block letter-spacing="1pt" text-transform="uppercase">
                    <fo:inline font-size="6">
                        <xsl:value-of select="r:institution"/>
                        <xsl:text> / </xsl:text>
                        <xsl:value-of select="r:country"/>
                        <xsl:text> / </xsl:text>
                        <xsl:value-of select="r:startDate"/>
                        <xsl:text> - </xsl:text>
                        <xsl:value-of select="r:endDate"/>
                    </fo:inline>
                </fo:block>
                <fo:block>
                    <xsl:apply-templates select="r:description"/>
                </fo:block>
            </fo:list-item-body>
        </fo:list-item>
    </xsl:template>


    <xsl:template match="conf:office" mode="left">
        <fo:block-container xsl:use-attribute-sets="contact">
            <fo:block>
                <xsl:value-of select="r:name"/>
            </fo:block>
            <fo:block>
                <xsl:value-of select="r:email"/>
            </fo:block>
            <fo:block>
                <xsl:value-of select="r:phone"/>
            </fo:block>
            <fo:block/>
        </fo:block-container>
    </xsl:template>

    <xsl:template match="conf:office" mode="right">
        <fo:block-container text-align="right" text-align-last="right" font-size="8pt"
            letter-spacing="1pt" text-transform="uppercase" padding-top="5pt">
            <fo:block>
                <xsl:value-of select="r:address"/>
            </fo:block>
            <fo:block>
                <xsl:value-of select="r:postalCode"/>
            </fo:block>
            <fo:block>
                <xsl:value-of select="r:city"/>
            </fo:block>
        </fo:block-container>
    </xsl:template>

    <xsl:template name="section-heading">
        <xsl:param name="code"/>
        <xsl:variable name="language" select="/r:resume/r:meta/r:language"/>
        <xsl:variable name="heading"
            select="document('')/*/conf:heading[@code=$code and @language=$language]"/>
        <xsl:variable name="logo" select="concat('images/', $code, '.svg')"/>
        <fo:block xsl:use-attribute-sets="heading" keep-together.within-page="always">
            <fo:block-container xsl:use-attribute-sets="image" padding-bottom="5mm">
                <fo:block text-align-last="center">
                    <fo:instream-foreign-object>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.1289cm" height="1.1289cm">
                            <image xlink:href="{$logo}" x="30%" y="30%" width="0.4544cm"
                                height="0.4544cm"/>
                            <circle cx="0.56445cm" cy="0.56445cm" r="0.5cm" fill="none"
                                stroke="black" stroke-width="1"/>
                        </svg>
                    </fo:instream-foreign-object>
                </fo:block>
            </fo:block-container>

            <fo:leader leader-pattern="rule" alignment-baseline="middle" padding-left="0.1em"
                padding-right="0.5em"/>
            <fo:inline text-transform="uppercase">
                <xsl:value-of select="$heading"/>
            </fo:inline>
            <fo:leader leader-pattern="rule" alignment-baseline="middle" padding-left="0.5em"
                padding-right="0.1em"/>
        </fo:block>
    </xsl:template>

    <xsl:template name="date">
        <xsl:param name="date"/>
        <xsl:choose>
            <xsl:when test="string($date) = ''">current</xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="$date"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template name="skill">
        <xsl:param name="name"/>
        <xsl:param name="level"/>
        <xsl:param name="color"/>
        <fo:block text-align-last="justify" line-height="2" font-size="8pt" letter-spacing="1pt">
            <fo:inline>
                <xsl:value-of select="$name"/>
            </fo:inline>
            <fo:leader leader-pattern="space"/>
            <fo:instream-foreign-object>
                <svg xmlns="http://www.w3.org/2000/svg" width="{217 div 256}in"
                    height="{9 div 128}in">
                    <rect x="{1 div 128}in" y="{1 div 128}in" width="{213 div 256}in"
                        height="{7 div 128}in" rx="0.69mm" ry="0.69mm" fill="none" stroke="{$color}"/>
                    <xsl:if test="$level &gt; 0">
                        <rect x="{1 div 128}in" y="{1 div 128}in"
                            width="{213 div 256*($level div 10.0)}in" height="{7 div 128}in"
                            rx="0.69mm" ry="0.69mm" fill="{$color}" stroke="{$color}"/>
                    </xsl:if>
                </svg>
            </fo:instream-foreign-object>
        </fo:block>
    </xsl:template>

    <xsl:template match="r:p">
        <fo:block padding-bottom="5pt">
            <xsl:apply-templates/>
        </fo:block>
    </xsl:template>

    <xsl:template match="r:strong">
        <fo:inline font-weight="bold">
            <xsl:apply-templates/>
        </fo:inline>
    </xsl:template>

    <xsl:template match="r:i">
        <fo:inline font-style="italic">
            <xsl:apply-templates/>
        </fo:inline>
    </xsl:template>

    <xsl:attribute-set name="document">
        <xsl:attribute name="font-family">Avenir Next</xsl:attribute>
        <xsl:attribute name="font-size">7pt</xsl:attribute>
        <xsl:attribute name="line-height">1.5</xsl:attribute>
    </xsl:attribute-set>

    <xsl:attribute-set name="page">
        <xsl:attribute name="page-height">297mm</xsl:attribute>
        <xsl:attribute name="page-width">210mm</xsl:attribute>
        <xsl:attribute name="margin-top">0mm</xsl:attribute>
        <xsl:attribute name="margin-left">0mm</xsl:attribute>
        <xsl:attribute name="margin-bottom">0mm</xsl:attribute>
        <xsl:attribute name="margin-right">0mm</xsl:attribute>
        <xsl:attribute name="master-name">A4</xsl:attribute>
    </xsl:attribute-set>

    <xsl:attribute-set name="body">
        <xsl:attribute name="margin-top">2cm</xsl:attribute>
        <xsl:attribute name="margin-left">0.8952cm</xsl:attribute>
        <xsl:attribute name="margin-right">1.5cm</xsl:attribute>
        <xsl:attribute name="margin-bottom">1cm</xsl:attribute>
    </xsl:attribute-set>

    <xsl:attribute-set name="heading">
        <xsl:attribute name="font-size">11pt</xsl:attribute>
        <xsl:attribute name="font-weight">regular</xsl:attribute>
        <xsl:attribute name="letter-spacing">3pt</xsl:attribute>
        <xsl:attribute name="margin-top">4mm</xsl:attribute>
        <xsl:attribute name="margin-bottom">4mm</xsl:attribute>
        <xsl:attribute name="text-align-last">justify</xsl:attribute>
    </xsl:attribute-set>

    <xsl:attribute-set name="column-left">
        <xsl:attribute name="padding-right">1cm</xsl:attribute>
    </xsl:attribute-set>

    <xsl:attribute-set name="column-right">
        <xsl:attribute name="padding-left">1cm</xsl:attribute>
    </xsl:attribute-set>

    <xsl:attribute-set name="contact">
        <xsl:attribute name="text-align">left</xsl:attribute>
        <xsl:attribute name="text-align-last">left</xsl:attribute>
        <xsl:attribute name="font-size">8pt</xsl:attribute>
        <xsl:attribute name="letter-spacing">1pt</xsl:attribute>
        <xsl:attribute name="text-transform">uppercase</xsl:attribute>
        <xsl:attribute name="padding-top">5pt</xsl:attribute>
    </xsl:attribute-set>

    <xsl:attribute-set name="basics-contact">
        <xsl:attribute name="font-size">0pt</xsl:attribute>
        <xsl:attribute name="absolute-position">absolute</xsl:attribute>
        <xsl:attribute name="left">0.8952cm</xsl:attribute>
        <xsl:attribute name="top">0.35cm</xsl:attribute>
        <xsl:attribute name="right">1.7cm</xsl:attribute>
    </xsl:attribute-set>


    <xsl:attribute-set name="image">
        <xsl:attribute name="font-size">0pt</xsl:attribute>
    </xsl:attribute-set>

    <xsl:attribute-set name="basics-image">
        <xsl:attribute name="padding-top">0.75cm</xsl:attribute>
        <xsl:attribute name="padding-bottom">0.5cm</xsl:attribute>
    </xsl:attribute-set>

    <xsl:attribute-set name="basics-label">
        <xsl:attribute name="padding-top">3pt</xsl:attribute>
        <xsl:attribute name="font-weight">400</xsl:attribute>
        <xsl:attribute name="font-size">11pt</xsl:attribute>
        <xsl:attribute name="letter-spacing">2pt</xsl:attribute>
        <xsl:attribute name="line-height">1.7</xsl:attribute>
        <xsl:attribute name="color">
            <xsl:value-of select="$red"/>
        </xsl:attribute>
        <xsl:attribute name="text-align">center</xsl:attribute>
        <xsl:attribute name="text-align-last">center</xsl:attribute>
    </xsl:attribute-set>

    <xsl:attribute-set name="fun-skills">
        <xsl:attribute name="padding-top">10pt</xsl:attribute>
    </xsl:attribute-set>

    <xsl:attribute-set name="achievement">
        <xsl:attribute name="line-height">1.5</xsl:attribute>
    </xsl:attribute-set>

</xsl:stylesheet>
