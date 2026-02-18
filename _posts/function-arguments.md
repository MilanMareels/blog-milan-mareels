---
title: "Waarom 'Function Arguments' de stille moordenaar zijn van je teststrategie"
excerpt: "Als developers denken we bij 'testen' vaak direct aan Unit Tests. Maar de pijn van slecht functie-design voel je veel breder. Ontdek waarom het Parameter Object Pattern je redding is."
coverImage: "/assets/blog/function-arguments/function-arguments.webp"
date: "2026-02-18T14:54:51.000Z"
author:
  name: Milan Mareels
  picture: "/assets/blog/authors/milan-mareels.webp"
ogImage:
  url: "/assets/blog/function-arguments/function-arguments.webp"
---

Als developers denken we bij "testen" vaak direct aan Unit Tests. Maar de pijn van slecht functie-design (te veel losse argumenten) voel je veel breder. Het raakt je testen, je debugging sessies en zelfs de snelheid waarmee je nieuwe features kunt uitrollen zonder de boel te slopen.

Laten we kijken waarom het Parameter Object Pattern (alles in één object stoppen) je redding is voor je testen.

## 1. Het probleem: De "Domino-steen" update

Stel je hebt een functie `createUser(name, email, age)`. Je hebt hier 50 testen voor geschreven verspreid over je hele applicatie.

Nu komt de business met een wijziging: _"We moeten ook weten of iemand ingeschreven is voor de nieuwsbrief."_

**De Oude Situatie (Losse Argumenten):**
Je verandert de functie naar `createUser(name, email, age, newsletterOptIn)`.

- **Gevolg:** BAM. 50 testen staan op rood.
- **De fix:** Je moet al je testbestanden openen en overal `false` of `true` achteraan plakken. Dit is niet testen, dit is bezigheidstherapie.

**De Nieuwe Situatie (Parameter Object):**
Je functie was al `createUser({ name, email, age, newsletterOptIn })`. Je verandert de logica zodat hij nu `newsletterOptIn` uitleest uit het object.

- **Gevolg:** 0 testen breken. De bestaande testen geven simpelweg die property niet mee, en (als je code goed is) valt hij terug op een default waarde of `undefined`.
- **De fix:** Je schrijft één of een paar nieuwe tests voor de nieuwe functionaliteit. De rest blijft groen.

## 2. Leesbaarheid in je (Unit)Tests

Bij unit tests wil je in één oogopslag begrijpen wat er getest wordt. Als je functies met losse argumenten aanroept, worden foutmeldingen snel onduidelijk.

Bijvoorbeeld een error log met losse parameters:

```text
Error in getUserData: invalid argument. Arguments: (456, true, null)
```

Je moet nu opzoeken waar die waarden voor staan. Is `456` een userId? Is `true` een admin-flag? Is `null` een optionele filter?

Met een object ziet dat er zo uit:

```json
Error in getUserData. Arguments: {
  "userId": 456,
  "includePermissions": true,
  "filter": null
}
```

Nu zie je meteen wat er getest werd. Je weet direct dat het om userId 456 gaat en wat elke waarde betekent. Je hoeft niet te gokken of documentatie te checken. Dat maakt tests sneller te begrijpen en fouten veel makkelijker te debuggen.

## 3. Code Voorbeelden & Tips

Hoe pas je dit toe voor robuustere testen?

### Tip 1: Gebruik "Destructuring" met Default Waardes

Dit is de sleutel tot "Lazy Testing" (op de goede manier). Je hoeft in je test alleen mee te geven waar de test over gaat.

**Slechte Code (Testen is zwaar):**

```javascript
// Functie
function setupScreen(width, height, fullScreen, darkMode, title) {
  // ...
}

// Test: Ik wil alleen de 'title' testen, maar moet ALLES invullen
setupScreen(1920, 1080, false, false, "Home");
```

**Goede Code (Testen is makkelijk):**

```javascript
// Functie: We zetten defaults voor alles wat niet cruciaal is
function setupScreen({ width = 800, height = 600, fullScreen = false, darkMode = false, title = "Untitled" } = {}) {
  // ... logica
}

// Test: Focus puur op wat we testen
setupScreen({ title: "Home" }); // De rest wordt automatisch ingevuld!
setupScreen({ darkMode: true }); // Test alleen darkmode
```

### Tip 2: De "Test Object Factory"

Als je vaak complexe objecten moet aanmaken voor testen (bijvoorbeeld een User object met 20 velden), maak dan een helper functie.

```javascript
// test-helpers.js
export const createFakeUser = (overrides = {}) => ({
  id: 1,
  name: "Test Henk",
  email: "henk@test.com",
  role: "ADMIN",
  status: "ACTIVE",
  lastLogin: new Date(),
  ...overrides, // Hier overschrijven we de defaults met jouw specifieke testdata
});
```

Je testbestand:

```javascript
import { createFakeUser } from "./test-helpers";

it("should block banned users", () => {
  // We hoeven ons geen zorgen te maken over naam, email, id, etc.
  // We focussen puur op de status.
  const bannedUser = createFakeUser({ status: "BANNED" });

  expect(login(bannedUser)).toBe(false);
});
```

## Conclusie

> _"Arguments carry mental weight."_

In testen vertaalt dit "mentale gewicht" zich naar fragiliteit. Elke keer als je een argument toevoegt aan een lijst, maak je je test-suite breekbaarder. Door over te stappen op objecten (named parameters), maak je je testen:

- **Robuust:** Ze breken niet bij uitbreidingen.
- **Leesbaar:** Je ziet direct wat `true` of `false` betekent.
- **Flexibel:** Je test alleen wat nodig is dankzij defaults.

Stop met het jongleren van argumenten. Stop ze in een doosje (een object) en geef dat doosje door. Je toekomstige zelf (die over 6 maanden de tests moet fixen) zal je dankbaar zijn.

---

_Houd er rekening mee dat dit voorbeeld in JavaScript is geschreven; TypeScript zal uiteraard strenger zijn wat betreft deze objectvelden, maar het principe blijft exact hetzelfde._
