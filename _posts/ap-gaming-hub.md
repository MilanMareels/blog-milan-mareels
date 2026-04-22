---
title: "Hoe we het hart van de AP Gaming Hub bouwden: Van snelle solo-MVP tot robuuste, self-hosted architectuur"
excerpt: "Wat begon als een solo-MVP is uitgegroeid tot een strakke samenwerking met een volwassen architectuur. Een kijkje achter de schermen bij de ontwikkeling van de AP Gaming Hub."
coverImage: "/assets/blog/ap-gaming-hub/ap-gaming-hub.webp"
date: "2026-04-23T12:00:00.000Z"
author:
  name: Milan Mareels
  picture: "/assets/blog/authors/milan-mareels.webp"
ogImage:
  url: "/assets/blog/ap-gaming-hub/ap-gaming-hub.webp"
---

Toen AP Hogeschool onlangs [de deuren opende van de gloednieuwe, fysieke Gaming Hub](https://www.ap.be/artikel/ap-hogeschool-opent-gaming-hub-voor-en-door-studenten) op de campus, was de boodschap direct duidelijk: dit wordt een plek vóór en dóór studenten. Als software developer ben je tijdens je studie vaak op zoek naar projecten die de theorie overstijgen. Je wilt iets bouwen dat er echt toe doet en daadwerkelijk in de echte wereld gebruikt wordt. De opening van de Hub was voor mij de perfecte kans.

Als Lead Software Developer (op vrijwillige basis) voor de AP Gaming Community kreeg ik de verantwoordelijkheid om het digitale fundament van deze indrukwekkende ruimte te bouwen. Wat begon als een soloproject dat ik volledig vanaf nul heb opgezet, is inmiddels uitgegroeid tot een strakke samenwerking.

In deze blog neem ik je mee in het proces: van de initiële chaos en het lanceren van een MVP, tot het opschalen naar een _two-man team_, een ingrijpende database-migratie, en de harde realiteit van gebruikersstatistieken.

---

## Het Probleem: Van fysieke chaos naar digitaal systeem

De Gaming Hub is een fantastische plek waar studenten tussen de lessen door kunnen ontspannen. Maar iedereen die wel eens een gedeelde gamingruimte heeft beheerd, weet: zodra er high-end pc's en consoles in het spel zijn, is eerlijke verdeling een flinke uitdaging.

We hadden dringend behoefte aan een platform dat méér deed dan puur een agenda bijhouden. Het systeem bedient twee cruciale doelgroepen:

- **Voor de community:** Een interface om razendsnel gear te reserveren, het rooster te checken, events te bekijken.
- **Voor de admins:** Een krachtig dashboard om gebruikers, reservaties, evenementen en hardware achter de schermen soepel te beheren.

---

## Fase 1: De Solo-MVP en de pijnlijke "Security Leak"

Om de community zo snel mogelijk te voorzien van een werkend systeem, bouwde ik in eerste instantie solo een Minimum Viable Product (MVP). De originele tech stack bestond uit Next.js voor de frontend en Firebase voor een snelle real-time database en authenticatie.

De MVP ging live en de reserveringen stroomden binnen, maar op dag één liepen we al tegen de lamp. Een pientere IT-student ontdekte een security leak. In de haast had ik de datavalidatie (bijv. checken op onmogelijke reserveringstijden) alleen client-side in de browser geïmplementeerd. Hierdoor konden slimme studenten de frontend omzeilen en via directe API-calls ongeldige data naar de database sturen.

> **De les:** Never trust the client! Validatie op de frontend is voor UX, server-side validatie is je enige echte beveiliging.

Dit heb ik direct gepatcht, maar het zette me wel aan het denken over de toekomst en schaalbaarheid van onze architectuur.

---

## Fase 2: Mijn stage, een snelle migratie en bugfixing

Naarmate de applicatie groeide, merkten we dat de MVP zijn limieten bereikte. Een NoSQL database zoals Firebase is fantastisch om snel te starten, maar met complexe relaties werd het lastig. Het was tijd voor een volwassen architectuur.

Precies op dat moment zat ik fulltime op stage en had ik simpelweg geen tijd om zo'n gigantische migratie uit te voeren. Hier is **[Stijn Voeten](https://www.linkedin.com/in/stijn-voeten-237941103/)** aan boord gekomen. Om te zorgen dat we toch stappen konden maken, heeft hij in korte tijd een flinke transitie doorgevoerd. Hij bouwde snel een nieuwe backend in NestJS en zette een PostgreSQL database op met Prisma ORM.

Maar zoals dat in software development vaak gaat met snelle migraties: het werkte, maar het was nog niet kogelvrij. Toen ik terugkwam van mijn stage en weer tijd had, bleken er nog de nodige bugs in de nieuwe codebase te zitten. Ik ben er toen direct weer ingedoken, heb de bugs eruit gehaald, en ben begonnen met het echt robuust maken van het systeem aan de hand van Unit testen met test coverage.

---

## Volledig in eigen beheer met een strakke CI/CD Pipeline

Een andere enorme upgrade is onze infrastructuur. We hosten de volledige applicatie nu volledig in eigen beheer op een server van de school.

Om dit professioneel aan te pakken, hebben we een volwaardige CI/CD pipeline via GitHub Actions opgezet. Ook hier hebben we de taken strak verdeeld:

- **Continuous Deployment (CD):** [Stijn](https://www.linkedin.com/in/stijn-voeten-237941103/) heeft het beheer van de server en de CD geconfigureerd. Zodra code is goedgekeurd, wordt alles automatisch gebouwd en naar de schoolserver gepusht.
- **Continuous Integration (CI):** Ikzelf heb de CI kant voor de testen ingericht. Zodra er een Pull Request (PR) wordt aangemaakt, triggert dit automatisch een workflow die al onze unit tests draait om te kijken of de nieuwe code niets breekt.

---

## Samen bouwen aan nieuwe features & een nieuwe UI

Nu de basis staat als een huis, werken [Stijn](https://www.linkedin.com/in/stijn-voeten-237941103/) en ik samen om de applicatie continu te verbeteren. We hebben inmiddels een reeks nieuwe features uitgerold die de Hub naar een hoger niveau tillen:

- **Een volledige UI Make-over:** We hebben het design onlangs al volledig op de schop genomen voor een strakkere, intuïtievere 'gamer' look-and-feel. Dit hebben we efficiënt gedaan met behulp van AI - want waarom ook niet, dat is super makkelijk natuurlijk! :)
- **E-mailnotificaties:** Studenten ontvangen nu automatisch bevestigingen en updates over hun boeking.
- **Reserveringen annuleren:** Gebruikers kunnen nu zelf hun reservering annuleren via de website, waardoor hardware weer vrijkomt voor anderen.
- **Check-in Scanners:** Dit is misschien wel de coolste toevoeging. We hebben een systeem gebouwd waarbij je bij binnenkomst in de fysieke Hub gescand wordt. Het systeem checkt direct met onze database of alles klopt, of je daadwerkelijk een geldige reservering hebt, en op welke pc of console je bent ingedeeld.

---

## De Impact: Het verschil tussen Hype en Retentie

Als je een applicatie bouwt, leer je al snel de realiteit van gebruikersstatistieken kennen. Toen we de Hub openden, zaten we in een enorme 'hype-fase'. In de piekmaand februari zagen we een gigantische toestroom van maar liefst 600 tot 700 actieve gebruikers. Het systeem draaide overuren.

Inmiddels is de initiële nieuwigheid er een beetje af en zitten we in een stabiele fase met zo'n 300 actieve gebruikers per maand. Aanvankelijk voelde die daling als een tegenslag, maar als developer besef je snel dat dit de normale levenscyclus van software is. 300 studenten die maandelijks structureel jullie app gebruiken is een fantastische metric.

---

## Wat brengt de toekomst?

Een applicatie is zelden 100% af. Het design en de architectuur staan nu strak, maar we blijven de lat hoger leggen achter de schermen:

- **Test Coverage vergroten:** Onze CI pipeline runt momenteel netjes de unit tests per PR, maar de testdekking moet omhoog. Integratietests staan hoog op de planning, zodat we zeker weten dat de frontend, NestJS backend en PostgreSQL perfect blijven samenwerken. Later willen we dit aanvullen met geautomatiseerde end-to-end testen.
- **Nieuwe features & Stabiliteit:** We blijven luisteren naar de feedback van de studenten en admins om extra features te bouwen die de workflow nog makkelijker maken, met als absolute prioriteit de betrouwbaarheid en stabiliteit van onze self-hosted server.

Meebouwen aan een project vóór en dóór studenten, het opschalen van een codebase, en effectief leren samenwerken in een team van twee, het is zonder twijfel een van de meest leerzame ervaringen uit mijn studie.

---

**Benieuwd naar wat we gebouwd hebben? Bekijk het platform live op [apgaming.be](https://apgaming.be/)!**

_Een speciale dank gaat uit naar [Ilyas Narli](https://www.linkedin.com/in/ilyas-narli-726792232/) voor het bieden van deze waardevolle kans en het gestelde vertrouwen in dit project._
