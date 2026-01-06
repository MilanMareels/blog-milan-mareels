---
title: 'De Kunst van Clean Code: Waarom "Werken" Niet Genoeg Is'
excerpt: "Software kan aan de voorkant perfect werken, terwijl de achterkant aan elkaar hangt van duct tape. Waarom Clean Code essentieel is voor leefbare software en respect voor je team."
coverImage: "/assets/blog/clean-code/clean-code.webp"
date: "2026-01-06T05:35:07.322Z"
author:
  name: Milan Mareels
  picture: "/assets/blog/authors/milan-mareels.webp"
ogImage:
  url: "/assets/blog/clean-code/clean-code.webp"
---

Softwareontwikkeling is een vreemd vak. Een schilder ziet meteen of zijn werk rommelig is. Een timmerman ziet direct of een kast scheef staat. Maar bij software? Een applicatie kan aan de voorkant perfect werken, terwijl de achterkant de code aan elkaar hangt van duct tape en pleisters.

Mijn reis in de IT begon tijdens mijn Graduaat opleiding. Daar leerde ik de syntax: hoe krijg ik de computer zover dat hij doet wat ik wil? Maar nu, tijdens mijn Bachelor opleiding, is mijn perspectief verschoven. Het gaat niet meer alleen om functionaliteit, maar om kwaliteit.

Ik ben op een punt gekomen dat ik Clean Code niet alleen belangrijk vind, maar dat het ontbreken ervan me oprecht frustreert. Waarom? Omdat slechte code respectloos is naar je teamgenoten en je toekomstige zelf. In deze blogpost neem ik je mee in mijn visie op leefbare, begrijpbare software.

## 1. Code is Communicatie (Begrijpbaarheid)

Er heerst een misverstand dat programmeurs code schrijven voor computers. Dat is onzin. Computers lezen binaire code (nullen en enen). Broncode (zoals JavaScript, C# of Java) schrijven we voor mensen.

### Cognitive Load

Een belangrijk concept dat ik tijdens mijn research tegenkwam, is **Cognitive Load**. Elke keer dat een developer een stuk code leest en moet denken: _"Wacht even, wat doet variabele x hier ook alweer?"_, stijgt de mentale belasting.

Als jouw code vol zit met onduidelijke afkortingen, gigantische functies en slimme "hacks", put je het brein van je lezer uit. Het gevolg? Fouten. Bugs. Frustratie.

Clean Code verlaagt die cognitieve belasting. Het leest als een boek.

**Slecht:**

```javascript
const d = 10; // verstreken dagen
```

**Goed:**

```javascript
const daysSinceLastLogin = 10;
```

In het tweede geval is commentaar overbodig, omdat de code zichzelf uitlegt.

## 2. Leefbaarheid en Technical Debt

Tijdens projecten op mijn opleiding merk ik vaak dat studenten snel resultaat willen zien. "Het werkt toch?" zeggen ze dan. Maar dat is kortetermijndenken.

Slechte code creëert wat we in de industrie **Technical Debt** noemen. Zie het als een financiële lening. Je kunt nu tijd besparen door rommelige code te schrijven (snel geld lenen), maar later betaal je rente. Die rente betaal je in de vorm van:

- Extra tijd die nodig is om simpele features toe te voegen.
- Bugs die opduiken op plekken waar je ze niet verwacht.
- Nieuwe developers die dagen nodig hebben om het project te begrijpen.

Mijn doel in mijn Bachelor-projecten is om die schuld op nul te houden. Ik wil dat mijn code over een jaar nog steeds 'leefbaar' is.

### De Boy Scout Rule

Robert C. Martin (Uncle Bob) introduceerde een prachtige regel die ik altijd probeer toe te passen: _"Leave the campground cleaner than you found it."_ Zie je ergens rommelige code in een bestand waar je aan werkt? Ruim het op, ook al heb jij het niet geschreven.

> **Noot:** Wees hier wel verstandig in. Ga niet de hele applicatie verbouwen vlak voor een deadline, dat veroorzaakt conflicten. Verbeter kleine dingen stap voor stap.

## 3. Structuur en Complexiteit: Less is More

Naast naamgeving zijn de structuur van je if-statements en de grootte van je functies bepalend voor de kwaliteit. Hier maak je als developer het verschil tussen junior en senior gedrag.

### Stop met Nesten: Gebruik "Guard Clauses"

Je kent het wel: een if in een if in een if. Dit noemen we de "Arrow Head" stijl, omdat de code steeds verder naar rechts inspringt in de vorm van een pijlpunt. Dit is funest voor de leesbaarheid. Je moet als lezer continu onthouden in welke conditie je zit.

De oplossing is simpel: **Return Early**. Draai de logica om.

**Diep geneste code:**

```javascript
function saveUser(user) {
  if (user.isValid) {
    if (db.isConnected) {
      if (user.hasPermission) {
        db.save(user);
      }
    }
  }
}
```

**Clean Code met Guard Clauses:**

```javascript
function saveUser(user) {
  if (!user.isValid) return;
  if (!db.isConnected) return;
  if (!user.hasPermission) return;

  db.save(user);
}
```

Het resultaat is exact hetzelfde, maar de mentale belasting is veel lager. Je handelt de randgevallen direct af en vergeet ze daarna.

### Functies: Hoe kleiner, hoe beter

Een van de meest gemaakte fouten die ik zie (en zelf ook maakte), zijn functies van 50 of 100 regels code.

Een functie zou zich moeten houden aan het **Single Responsibility Principle**. Een functie moet één ding doen, en dat ding goed doen.

- Moet je scrollen om de hele functie te zien? Te groot.
- Bevat de functie het woord "en" (bv. `validateAndSaveUser`)? Te groot (splits het op in `validateUser` en `saveUser`).

Kleine functies zijn makkelijker te lezen, makkelijker te testen en makkelijker te hergebruiken. Als een functie klein is, is de kans op bugs nihil, simpelweg omdat er geen plek is voor bugs om zich te verstoppen.

## 4. Mijn Gereedschapskist: Automatiseer Kwaliteit

Je hoeft niet te vertrouwen op wilskracht alleen. In mijn setup (VS Code) gebruik ik tools die mij dwingen netjes te werken. Dit raad ik iedereen aan:

### De Linter (ESLint)

Een Linter is als een strenge leraar die over je schouder meekijkt. Hij analyseert je code terwijl je typt. Gebruik je een variabele die niet bestaat? Linter waarschuwt. Maak je een lus die nooit eindigt? Linter ziet het. Dit voorkomt domme fouten nog voordat je de code draait.

### Prettier (Formatter)

Ik weiger om nog discussies te voeren over spaties versus tabs of waar de accolades `{` moeten staan. Ik gebruik de Prettier extensie in VS Code. Ik heb mijn editor zo ingesteld op "Format on Save". Ik typ mijn code, ram op `Ctrl+S`, en poef: mijn code verspringt naar de perfecte uitlijning. Het geeft rust in je hoofd en zorgt voor een uniforme stijl in het hele team.

## 5. De Lakmoesproef: Dirty vs. Clean Code

Laten we de theorie in de praktijk brengen met een voorbeeld dat alles combineert: naamgeving, structuur en returns.

**Dirty Code (De "Het Werkt Toch?" Methode)**

```javascript
// Wat gebeurt hier? Wat is 0.1? Wat is type 2?
function check(u) {
  if (u.type === 2 && u.yrs > 5) {
    return u.amt * 0.1;
  } else {
    return 0;
  }
}
```

Dit is pijnlijk om te lezen. Als ik dit over twee maanden terugzie, moet ik de hele database doorzoeken om te weten wat type 2 betekent.

**Clean Code (De Professionele Methode)**

```javascript
const GOLD_CUSTOMER_TYPE = 2;
const LOYALTY_THRESHOLD_YEARS = 5;
const DISCOUNT_RATE = 0.1;

function calculateLoyaltyDiscount(customer) {
  // 1. Duidelijke variabelen
  const isGoldCustomer = customer.type === GOLD_CUSTOMER_TYPE;

  const isLoyalLongTerm = customer.yearsActive > LOYALTY_THRESHOLD_YEARS;

  // 2. Early return voor snelle exit
  if (!isGoldCustomer || !isLoyalLongTerm) {
    return 0;
  }

  // 3. De berekening is nu triviaal
  return customer.totalAmount * DISCOUNT_RATE;
}
```

Hier zie je direct de bedrijfslogica. We gebruiken constanten om "Magic Numbers" te vermijden en de flow is glashelder.

## 6. De Clean Code Checklist voor je PR

Voordat ik een Pull Request (PR) indien of mijn code commit, loop ik in mijn hoofd altijd dit lijstje af. Je kunt dit kopiëren en gebruiken voor je volgende project:

- **Leesbaarheid:** Kan een junior developer begrijpen wat hier staat zonder dat ik het uitleg?
- **Naming:** Zijn mijn variabelenamen beschrijvend (geen `x`, `data` of `temp`)?
- **Complexiteit:** Heb ik diepe nesting (if in if in if) voorkomen door 'Guard Clauses' (Early Returns) te gebruiken?
- **Single Responsibility:** Doen mijn functies slechts één ding en zijn ze klein genoeg (idealiter < 20 regels)?
- **Tooling:** Is het bestand geformatteerd met Prettier en geeft de Linter geen errors meer?

## Conclusie

De overstap van Graduaat naar Bachelor heeft me doen inzien dat programmeren meer is dan logica kloppen; het is vakmanschap. Het frustreert me als medestudenten of collega's slordig zijn, omdat het laat zien dat ze niet nadenken over de houdbaarheid van hun werk.

Clean Code is een investering. Het kost in het begin 10% meer tijd, maar het bespaart je aan het einde 200% aan ellende. Laten we trots zijn op wat we bouwen, niet alleen op de buitenkant, maar ook onder de motorkap.

### Bronvermelding & Onderzoek

Voor dit artikel en mijn dagelijkse werkzaamheden heb ik mij gebaseerd op de volgende bronnen:

- Martin, R. C. (2008). [_Clean Code: A Handbook of Agile Software Craftsmanship_](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882). Prentice Hall. (Hét standaardwerk over dit onderwerp).
- Thomas, D., & Hunt, A. (2019). [_The Pragmatic Programmer: Your Journey to Mastery_](https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/). Addison-Wesley Professional.
- Fowler, M. [_Refactoring_](https://refactoring.com/). (Online resources via martinfowler.com).
- McConnell, S. (2004). [_Code Complete: A Practical Handbook of Software Construction_](https://www.amazon.com/Code-Complete-Practical-Handbook-Construction/dp/0735619670). Microsoft Press.
