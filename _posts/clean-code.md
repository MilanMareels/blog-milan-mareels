---
title: "De kunst van Clean Code: Waarom “Het werkt” niet genoeg is"
excerpt: "Software kan aan de voorkant perfect werken, terwijl de achterkant met plakband aan elkaar hangt. Waarom Clean Code essentieel is voor levensvatbare software en respect voor je team."
coverImage: "/assets/blog/clean-code/clean-code.webp"
date: "2026-01-08T05:35:07.322Z"
author:
  name: Milan Mareels
  picture: "/assets/blog/authors/milan-mareels.webp"
ogImage:
  url: "/assets/blog/clean-code/clean-code.webp"
---

Softwareontwikkeling is een vreemd beroep. Een schilder ziet meteen of zijn werk slordig is. Een timmerman ziet meteen of een kast scheef staat. Maar bij software? Een applicatie kan aan de voorkant perfect werken, terwijl de code aan de achterkant met plakband en verband aan elkaar hangt.

Mijn IT-reis begon tijdens mijn graduaatstudie, waar ik voor het eerst de principes van Clean Code leerde. Nu, tijdens mijn bacheloropleiding, vind ik het frustrerend om te zien dat codekwaliteit vaak over het hoofd wordt gezien. Terwijl veel studenten zich uitsluitend richten op de 'het werkt'-mentaliteit, geloof ik dat we hoger moeten mikken. Voor mij draait softwareontwikkeling niet langer alleen om functionaliteit – het gaat om kwaliteit en vakmanschap.

Ik heb een punt bereikt waarop ik Clean Code niet alleen belangrijk vind, maar het gebrek eraan me oprecht frustreert. Waarom? Omdat slechte code respectloos is tegenover je teamgenoten en je toekomstige zelf. In deze blogpost deel ik mijn visie op leefbare, begrijpelijke software.

## 1. Code is communicatie (Begrijpelijkheid)

Er is een misvatting dat programmeurs code schrijven voor computers. Dat is onzin. Computers lezen binaire code (nullen en enen). Wij schrijven broncode (zoals JavaScript, C# of Java) voor mensen.

### Cognitieve belasting

Een belangrijk concept dat ik tijdens mijn onderzoek tegenkwam is **Cognitieve Belasting** (Cognitive Load). Elke keer dat een ontwikkelaar een stuk code leest en moet denken: _"Wacht even, wat doet variabele x hier ook alweer?"_, neemt de mentale belasting toe.

Als je code vol staat met obscure afkortingen, gigantische functies en slimme "hacks", put je het brein van je lezer uit. Het resultaat? Fouten. Bugs. Frustratie.

Clean code vermindert die cognitieve belasting. Het leest als een boek.

**Slecht:**

```javascript
const d = 10; // days passed since last login
```

**Goed:**

```javascript
const daysSinceLastLogin = 10;
```

In het tweede geval is commentaar overbodig, omdat de code voor zichzelf spreekt.

## 2. Leefbaarheid en technische schuld

Tijdens projecten in mijn opleiding merk ik vaak dat studenten snel resultaat willen zien. "Het werkt toch?", zeggen ze dan. Maar dat is kortetermijndenken.

Slechte code creëert wat we in de industrie **Technische Schuld** (Technical Debt) noemen. Zie het als een financiële lening. Je kunt nu tijd besparen door rommelige code te schrijven (snel geld lenen), maar later betaal je rente. Je betaalt die rente in de vorm van:

- Extra tijd die nodig is om eenvoudige functies toe te voegen.
- Bugs die opduiken op plaatsen waar je ze niet verwacht.
- Nieuwe ontwikkelaars die dagen nodig hebben om het project te begrijpen.

Mijn doel in mijn bachelorprojecten is om die schuld op nul te houden. Ik wil dat mijn code over een jaar nog steeds "levensvatbaar" is.

### De padvindersregel (The Boy Scout Rule)

Robert C. Martin (Uncle Bob) introduceerde een prachtige regel die ik altijd probeer toe te passen: _"Laat de kampeerplek schoner achter dan je hem aantrof."_ Zie je rommelige code in een bestand waar je aan werkt? Ruim het op, zelfs als jij het niet hebt geschreven.

> **Opmerking:** Wees hier verstandig in. Ga niet de hele applicatie herbouwen vlak voor een deadline, dat veroorzaakt conflicten. Verbeter kleine dingen stap voor stap.

## 3. Structuur en complexiteit: Minder is meer

Naast naamgeving bepalen de structuur van je if-statements en de grootte van je functies de kwaliteit. Dit is waar je je als ontwikkelaar onderscheidt tussen junior en senior gedrag.

### Stop met nesten: Gebruik "Guard Clauses"

Je kent het wel: een if in een if in een if. Dit wordt de "Arrow Head"-stijl genoemd, omdat de code steeds verder naar rechts inspringt in de vorm van een pijlpunt. Dit is funest voor de leesbaarheid. Als lezer moet je constant onthouden in welke conditie je zit.

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

Het resultaat is precies hetzelfde, maar de mentale belasting is veel lager. Je handelt de randgevallen direct af en vergeet ze.

### Functies: Hoe kleiner hoe beter

Een van de meest voorkomende fouten die ik zie (en soms zelf nog maak) zijn functies van 50 of 100 regels code.

Een functie moet voldoen aan het **Single Responsibility Principle**. Een functie moet één ding doen, en dat goed doen.

- Moet je scrollen om de volledige functie te zien? Dan is hij te groot.
- Bevat de functie het woord "en" (bijv. `validateAndSaveUser`)? Te groot (splits het op in `validateUser` en `saveUser`).

Kleine functies zijn makkelijker te lezen, makkelijker te testen en makkelijker te hergebruiken. Als een functie klein is, is de kans op bugs minimaal, simpelweg omdat er geen plek is voor bugs om zich te verstoppen.

### De "slechte" aanpak

Deze functie schendt het Single Responsibility Principle. Het valideert data, handelt databaselogica af, formatteert strings en verstuurt e-mails allemaal op één plek. Het is moeilijk te testen en moeilijk te lezen.

```javascript
function registerAndNotifyUser(userData) {
  // 1. Validation Logic
  if (!userData.email || !userData.email.includes("@")) {
    throw new Error("Invalid email address");
  }
  if (userData.password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  // 2. Database Logic
  const dbConnection = database.connect();
  const existingUser = dbConnection.find({ email: userData.email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  // 3. Data Transformation
  const user = {
    id: Date.now(),
    email: userData.email,
    passwordHash: someHashFunction(userData.password),
    createdAt: new Date(),
  };
  dbConnection.save(user);

  // 4. Notification Logic
  const emailService = new EmailService();
  const emailTemplate = `<h1>Welcome, ${user.email}!</h1>`;
  emailService.send(user.email, "Welcome to our platform", emailTemplate);

  return user;
}
```

### De "goede" aanpak (Clean Code)

Hier is de logica opgesplitst in kleine, gerichte functies. De hoofdfunctie, `registerUser`, fungeert als dirigent. Het leest als een zin, waardoor direct duidelijk is wat de code doet zonder te verzanden in implementatiedetails.

```javascript
// Main Orchestrator
function registerUser(userData) {
  validateUserData(userData);
  const user = createUser(userData);
  sendWelcomeEmail(user);
  return user;
}

// Small, Reusable Helper Functions
function validateUserData(userData) {
  if (!isValidEmail(userData.email)) {
    throw new Error("Invalid email address");
  }
  if (!isValidPassword(userData.password)) {
    throw new Error("Password must be at least 8 characters");
  }
  checkUserExistence(userData.email);
}

function checkUserExistence(email) {
  const dbConnection = database.connect();
  const existingUser = dbConnection.find({ email: email });
  if (existingUser) {
    throw new Error("User already exists");
};

function createUser(userData) {
  const user = {
    id: Date.now(),
    email: userData.email,
    passwordHash: someHashFunction(userData.password),
    createdAt: new Date(),
  };
  database.save(user);
  return user;
}

function sendWelcomeEmail(user) {
  const emailService = new EmailService();
  emailService.send(user.email, "Welcome!", renderWelcomeTemplate(user));
}
```

## 4. Mijn gereedschapskist: Automatiseer kwaliteit

Je hoeft niet alleen op wilskracht te vertrouwen. In mijn setup (VS Code) gebruik ik tools die me dwingen om netjes te werken. Ik raad dit iedereen aan:

### De Linter (ESLint)

Een Linter is als een strenge leraar die over je schouder meekijkt. Het analyseert je code terwijl je typt. Gebruik je een variabele die niet bestaat? De Linter waarschuwt je. Maak je een lus die nooit eindigt? De Linter ziet het. Dit voorkomt domme fouten nog voordat je de code uitvoert.

### Prettier (Formatter)

Ik weiger nog te discussiëren over spaties versus tabs of waar de accolades `{` moeten staan. Ik gebruik de Prettier-extensie in VS Code. Ik heb mijn editor ingesteld op "Format on Save". Ik typ mijn code, druk op `Ctrl+S`, en poef: mijn code springt perfect in lijn. Het geeft rust en zorgt voor een consistente stijl binnen het team.

## 5. De lakmoesproef: Vuile vs. Clean Code

Laten we de theorie in de praktijk brengen met een voorbeeld dat alles combineert: naamgeving, structuur en returns.

**Vuile Code (De "Het werkt toch?" methode)**

```javascript
// What's going on here? What's 0.1? What's type 2?
function check(u) {
  if (u.type === 2 && u.yrs > 5) {
    return u.amt * 0.1;
  } else {
    return 0;
  }
}
```

Dit is pijnlijk om te lezen. Als ik hier over twee maanden naar terugkijk, moet ik de hele database doorzoeken om erachter te komen wat type 2 betekent.

**Clean Code (De professionele methode)**

```javascript
const GOLD_CUSTOMER_TYPE = 2;
const LOYALTY_THRESHOLD_YEARS = 5;
const DISCOUNT_RATE = 0.1;

function calculateLoyaltyDiscount(customer) {
  // 1. Clear variables
  const isGoldCustomer = customer.type === GOLD_CUSTOMER_TYPE;

  const isLoyalLongTerm = customer.yearsActive > LOYALTY_THRESHOLD_YEARS;

  // 2. Early return for a quick exit
  if (!isGoldCustomer || !isLoyalLongTerm) {
    return 0;
  }

  // 3. The calculation is now trivial
  return customer.totalAmount * DISCOUNT_RATE;
}
```

Here you can immediately see the business logic. We use constants to avoid "Magic Numbers," and the flow is crystal clear.

## 6. The Clean Code Checklist for your PR

Before I submit a Pull Request (PR) or commit my code, I always run through this checklist in my head. You can copy it and use it for your next project:

- **Readability:** Can a junior developer understand what's written here without me explaining it?
- **Naming:** Are my variable names descriptive (no `x`, `data`, or `temp`)?
- **Complexity:** Have I prevented deep nesting (if within if within if) by using guard clauses (early returns)?
- **Single Responsibility:** Do my functions do only one thing and are they small enough (ideally < 20 lines)?
- **Tooling:** Is the file formatted with Prettier and does the Linter no longer return errors?

## Conclusion

The transition from graduate to bachelor's degree made me realize that programming is more than just making sense, it's craftsmanship. It frustrates me when fellow students or colleagues are sloppy, because it shows they're not thinking about the sustainability of their work.

Clean code is an investment. It takes 10% more time upfront, but it saves you 200% of the hassle in the end. Of course, the cases I’ve discussed here are just simple examples merely the tip of the iceberg. There is a vast landscape of design patterns, refactoring techniques, and architectural principles that we can all continue to master.

Let's be proud of what we build, not just on the outside, but also under the hood.

### Citation & Research

For this article and my daily work, I relied on the following sources:

- Martin, R. C. (2008). [Clean Code: A Handbook of Agile Software Craftsmanship](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882). Prentice Hall. (The standard work on this subject).
- Thomas, D., & Hunt, A. (2019). [The Pragmatic Programmer: Your Journey to Mastery](https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/). Addison-Wesley Professional.
- Fowler, M. [Refactoring](https://refactoring.com/). (Online resources via martinfowler.com).
- McConnell, S. (2004). [_Code Complete: A Practical Handbook of Software Construction_](https://www.amazon.com/Code-Complete-Practical-Handbook-Construction/dp/0735619670). Microsoft Press.
