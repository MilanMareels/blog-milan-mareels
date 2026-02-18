---
title: "Waarom 'Function Arguments' de stille moordenaar zijn van je teststrategie"
excerpt: "Als developers denken we bij testen vaak direct aan unit tests. Maar de échte testbaarheid van je code begint al bij je function design."
coverImage: "/assets/blog/function-arguments/function-arguments.webp"
date: "2026-02-18T14:54:51.000Z"
author:
  name: Milan Mareels
  picture: "/assets/blog/authors/milan-mareels.webp"
ogImage:
  url: "/assets/blog/function-arguments/function-arguments.webp"
---

Als developers denken we bij "testen" vaak meteen aan unit tests, frameworks en coverage percentages. Maar echte testbaarheid begint veel eerder: bij je function signatures.

Slecht functie-design vooral functies met veel losse argumenten heeft een directe impact op:

- test stabiliteit
- debugging snelheid
- uitbreidbaarheid van features
- mockbaarheid van dependencies

Met andere woorden: **slechte argument-structuur creëert verborgen test debt.**

---

## 1. Het probleem: de "Domino-update"

Stel je hebt een functie:

```js
createUser(name, email, age);
```

Je hebt hier 50 tests voor geschreven verspreid over je applicatie.

Nu komt er een wijziging:

"We moeten ook weten of iemand ingeschreven is voor de nieuwsbrief."

---

### Oude situatie - losse argumenten

Je verandert de functie naar:

```js
createUser(name, email, age, newsletterOptIn);
```

**Gevolg**

- 50 tests breken
- je moet overal parameters toevoegen
- je test failures zeggen niets over echte regressions

Dit is geen testen. Dit is bezigheidstherapie.

---

### Nieuwe situatie - parameter object

Je functie was:

```js
createUser({ name, email, age, newsletterOptIn });
```

Je voegt enkel logica toe.

**Gevolg**

- 0 tests breken
- bestaande tests blijven werken
- je schrijft alleen tests voor de nieuwe feature

Je tests falen alleen wanneer er echt gedrag verandert, en dat is precies wat je wil.

---

## 2. Leesbaarheid van tests en logs

Tests moeten in één oogopslag begrijpelijk zijn.

Losse parameters:

```text
Error in getUserData: invalid argument. Arguments: (456, true, null)
```

Je moet documentatie of code opzoeken om te weten wat dit betekent.

Met object parameters:

```json
Error in getUserData. Arguments: {
  "userId": 456,
  "includePermissions": true,
  "filter": null
}
```

Nu zie je meteen:

- wat getest werd
- welke input gebruikt werd
- wat de intentie van de test was

Dit verkort debugging-tijd drastisch, iets wat elke tester en developer onmiddellijk voelt.

---

## 3. Code Tips voor robuustere tests

### Tip 1 - Destructuring + defaults

Laat tests enkel invullen wat relevant is.

Slechte versie:

```js
setupScreen(1920, 1080, false, false, "Home");
```

Goede versie:

```js
function setupScreen({ width = 800, height = 600, fullScreen = false, darkMode = false, title = "Untitled" } = {}) {}
```

Tests:

```js
setupScreen({ title: "Home" });
setupScreen({ darkMode: true });
```

Focus op intentie, niet op boilerplate.

---

### Tip 2 - Test Object Factory

Voor complexe testdata:

```js
export const createFakeUser = (overrides = {}) => ({
  id: 1,
  name: "Test User",
  email: "test@example.com",
  role: "ADMIN",
  status: "ACTIVE",
  lastLogin: new Date(),
  ...overrides,
});
```

Gebruik:

```js
const bannedUser = createFakeUser({ status: "BANNED" });
```

Tests blijven leesbaar én onderhoudbaar.

---

## 5. Wanneer je dit NIET moet doen

Zoals elk pattern is dit geen silver bullet.

Gebruik geen parameter object wanneer:

- je functie maar 1-2 parameters heeft
- performance extreem kritisch is
- je een publieke API hebt waarvan signature stabiliteit contractueel vastligt

Goede engineering is context-afhankelijk.

---

## Conclusie

_"Arguments carry mental weight."_

Elke extra parameter vergroot de cognitieve load van iedereen die je code leest, test of debugt.

Door parameters in objecten te groeperen maak je je code:

- robuuster
- leesbaarder
- uitbreidbaarder
- testvriendelijker

Stop dus met argumenten jongleren.
Stop ze in een object en geef dat door.

Je toekomstige zelf en je test suite zullen je dankbaar zijn.

---

_Opmerking: voorbeelden zijn in JavaScript, maar het principe geldt voor elke taal. In TypeScript wordt het voordeel nog groter dankzij compile-time validatie van input shapes._
