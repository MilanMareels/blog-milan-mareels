---
title: "Mijn Stage bij Brightest: Bugs Bouwen, Code Kloppen en... Kickeren!"
excerpt: "Tijdens mijn stage bij Brightest ontwikkel ik de 'BrightSwagShop', een webshop vol met opzettelijke bugs om testautomatisering te demonstreren. Lees over mijn fullstack avontuur en de strijd aan de kickertafel!"
coverImage: "/assets/blog/bright-swag-shop/bright-swag-shop.webp"
date: "2026-03-11T14:17:48.000Z"
author:
  name: Milan Mareels
  picture: "/assets/blog/authors/milan-mareels.webp"
ogImage:
  url: "/assets/blog/bright-swag-shop/bright-swag-shop.webp"
---

Hallo allemaal!

De afgelopen tijd ben ik volop in de wondere wereld van IT gedoken tijdens mijn stage bij Brightest. In deze blog neem ik jullie graag mee in mijn project, de toffe tech-stack die ik gebruik, én mijn avonturen aan de kickertafel!

## Het Project: Welkom in de BrightSwagShop!

Normaal proberen developers fouten in hun code krampachtig te vermijden, maar ik doe precies het tegenovergestelde! Mijn stageopdracht is de ontwikkeling van de "BrightSwagShop", een neppe webshop waar je "fictief" Brightest promo-spullen kunt bestellen.

**Het échte doel? Deze app wordt gebruikt als ultiem testobject voor trainingen, demo's en rekrutering.**

Het geheime wapen van deze shop is dat er opzettelijk bugs zijn ingebouwd, die we via een handig adminpaneel met een druk op de knop aan en uit kunnen zetten! Zo kunnen we klanten tijdens demo's perfect laten zien hoe krachtig testautomatisering is op een applicatie die zich bewust misdraagt. Dankzij een slimme multi-tenancy architectuur kan elke trainer of tester bovendien in zijn eigen, volledig afgeschermde omgeving prutsen zonder de testdata van anderen in de war te sturen.

## Mijn Rol: Van Plannen naar Typen en Testen!

Je bouwt zoiets natuurlijk niet blind. Voor de eerste regel code werd getypt, heb ik het project tot in de puntjes uitgedacht met een uitgebreide blueprint en een waterdicht testplan.

Daarna was het tijd voor het echte werk: fullstack development! Onze gereedschapskist ziet er zo uit:

- **Frontend:** We toveren de schermen tevoorschijn met Next.js en houden onze code superstrak en typeveilig door middel van TypeScript.
- **Backend:** Onder de motorkap draait een stevige REST API, gebouwd met Express en Node.js.
- **Database:** Alle testbestellingen (en bug-configuraties) parkeren we in een PostgreSQL database, en we praten met die database via Prisma ORM.

Maar het bouwen is maar de helft van het verhaal. Daarna moet alles natuurlijk geautomatiseerd getest worden! Voor de backend gebruiken we **Jest** om razendsnel onze tests te draaien, die via GitHub Actions automatisch afgaan bij elke codewijziging (CI/CD). Voor de snelle API-checks klik ik vrolijk rond in de Swagger UI. En als kers op de taart gaan we voor de UI de volledige flows automatiseren en testen met **Playwright**!

## Tijd voor Ontspanning (en Frustratie aan de Tafel)

Natuurlijk bestaat een stage bij Brightest uit meer dan alleen naar schermen staren. Er hangt een geweldige sfeer op kantoor, en als ik even vastzit met mijn code, vind je me aan de kickertafel!

Ik zal eerlijk bekennen: ik ben er momenteel nog he-le-maal niet goed in. Mijn reflexen hebben duidelijk nog een paar 'updates' nodig. Maar net zoals met programmeren geldt: oefening baart kunst!

**Mijn ultieme stage-doel?** Een perfect werkende en bewust falende webshop opleveren, én tijdens een potje tafelvoetbal gewoon eens meerdere keren kunnen scoren!
