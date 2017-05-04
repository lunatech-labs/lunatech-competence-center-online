<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xlink="http://www.w3.org/1999/xlink"
                xmlns:r="http://lunatech.com/2017/03/31/resume"
                version="1.0">
    <xsl:variable name="red" select="'#CC0033'"/>
    <xsl:template match="/">
        <fo:root xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xlink="http://www.w3.org/1999/xlink"
                 xsl:use-attribute-sets="document">
            <fo:layout-master-set>
                <fo:simple-page-master xsl:use-attribute-sets="page">
                    <fo:region-body xsl:use-attribute-sets="body" background-position-horizontal="center"
                                    background-repeat="repeat-y" background-image='url("images/line.svg")'/>
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
                <fo:table table-layout="fixed">
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
                                    <fo:external-graphic src="images/lunatech-logo.svg" content-width="75%"
                                                         content-height="75%"/>
                                </fo:block>
                            </fo:table-cell>
                            <fo:table-cell column-number="2" xsl:use-attribute-sets="column-right">
                                <xsl:apply-templates select="r:contact" mode="left"/>
                            </fo:table-cell>
                            <fo:table-cell column-number="3">
                                <xsl:apply-templates select="r:contact" mode="right"/>
                            </fo:table-cell>
                        </fo:table-row>
                    </fo:table-body>
                </fo:table>
            </fo:block-container>
        </fo:static-content>
    </xsl:template>

    <xsl:template match="r:basics" mode="left">
        <fo:block text-align-last="center">
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
                    <fo:block text-align-last="justify" font-weight="200" font-size="18pt" letter-spacing="2pt">
                        <fo:leader leader-pattern="rule" alignment-baseline="middle" padding-left="0.1em"
                                   padding-right="0.5em"/>
                        <xsl:value-of
                                select="r:givenName"/>
                        <fo:leader leader-pattern="rule" alignment-baseline="middle" padding-left="0.5em"
                                   padding-right="0.1em"/>
                    </fo:block>
                    <fo:block font-size="18pt" font-weight="700" letter-spacing="2pt" padding-bottom="4pt">
                        <xsl:value-of
                                select="r:familyName"/>
                    </fo:block>
                    <fo:block xsl:use-attribute-sets="basics-label">
                        <xsl:value-of
                                select="r:label"/>
                    </fo:block>
                    <fo:block text-transform="uppercase" font-size="8pt" padding-top="8pt" letter-spacing="1pt">
                        <xsl:value-of select="r:startYear"/>
                    </fo:block>
                </fo:block>
            </fo:block-container>
        </fo:block>
    </xsl:template>

    <xsl:template match="r:skills">
        <xsl:call-template name="section-heading">
            <xsl:with-param name="logo">images/key_skills.svg</xsl:with-param>
            <xsl:with-param name="heading">Key Skills</xsl:with-param>
        </xsl:call-template>
        <fo:block>
            <xsl:apply-templates select="r:skill[r:category!='fun']"/>
        </fo:block>
        <fo:block xsl:use-attribute-sets="fun-skills">
            <xsl:apply-templates select="r:skill[r:category='fun']"/>
        </fo:block>
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
        <xsl:call-template name="section-heading">
            <xsl:with-param name="logo">images/other.svg</xsl:with-param>
            <xsl:with-param name="heading">Other</xsl:with-param>
        </xsl:call-template>
        <fo:list-block>
            <xsl:apply-templates/>
        </fo:list-block>
    </xsl:template>

    <xsl:template match="r:achievement">
        <fo:list-item>
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
        <xsl:call-template name="section-heading">
            <xsl:with-param name="logo">images/profile.svg</xsl:with-param>
            <xsl:with-param name="heading">Profile</xsl:with-param>
        </xsl:call-template>
        <fo:block>
            <xsl:apply-templates/>
        </fo:block>
    </xsl:template>

    <xsl:template match="r:projects">
        <xsl:call-template name="section-heading">
            <xsl:with-param name="logo">images/key_experience.svg</xsl:with-param>
            <xsl:with-param name="heading">Key Experience</xsl:with-param>
        </xsl:call-template>
        <fo:list-block>
            <xsl:apply-templates/>
        </fo:list-block>
    </xsl:template>

    <xsl:template match="r:project">
        <fo:list-item>
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
                    <fo:inline>
                        <xsl:call-template name="formattableText"/>
                    </fo:inline>
                </fo:block>
            </fo:list-item-body>
        </fo:list-item>
    </xsl:template>

    <xsl:template match="r:summary|r:description" name="formattableText">
        <xsl:apply-templates/>
    </xsl:template>

    <xsl:template match="r:educations">
        <xsl:call-template name="section-heading">
            <xsl:with-param name="logo">images/education.svg</xsl:with-param>
            <xsl:with-param name="heading">Education</xsl:with-param>
        </xsl:call-template>
        <fo:list-block>
            <xsl:apply-templates/>
        </fo:list-block>
    </xsl:template>

    <xsl:template match="r:education">
        <fo:list-item>
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
                    <xsl:call-template name="formattableText"/>
                </fo:block>
            </fo:list-item-body>
        </fo:list-item>
    </xsl:template>


    <xsl:template match="r:contact" mode="left">
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

    <xsl:template match="r:contact" mode="right">
        <fo:block-container text-align="right" text-align-last="right" font-size="8pt" letter-spacing="1pt"
                            text-transform="uppercase" padding-top="5pt">
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
        <xsl:param name="heading"/>
        <xsl:param name="logo"/>
        <fo:block xsl:use-attribute-sets="heading">
            <fo:block-container xsl:use-attribute-sets="image" padding-bottom="5mm">
                <fo:block text-align-last="center">
                    <fo:instream-foreign-object>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.1289cm" height="1.1289cm">
                            <circle cx="0.56445cm" cy="0.56445cm" r="0.56445cm" fill="white" stroke="black"
                                    stroke-width="1"/>
                            <defs>
                                <clipPath id="round-photo">
                                    <circle cx="0.56445cm" cy="0.56445cm" r="0.56445cm"/>
                                </clipPath>
                            </defs>
                            <image xlink:href="{$logo}" x="30%" y="30%" width="0.4544cm" height="0.4544cm"
                                   clip-path="url(#round-photo)"/>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="{213 div 256}in" height="{7 div 128}in">
                    <rect x="0" y="0" width="{213 div 256}in" height="{7 div 128}in" rx="1mm" ry="1mm" fill="none"
                          stroke="{$color}"/>
                    <xsl:if test="$level &gt; 0">
                        <rect x="0" y="0" width="{213 div 256*($level div 10.0)}in" height="{7 div 128}in" rx="1mm"
                              ry="1mm" fill="{$color}" stroke="{$color}"/>
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