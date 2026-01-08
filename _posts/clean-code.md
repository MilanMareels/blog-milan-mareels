---
title: "The Art of Clean Code: Why “It Works” Isn't Enough"
excerpt: "Software can work perfectly on the front end, while the back end is held together by duct tape. Why Clean Code is essential for viable software and respect for your team."
coverImage: "/assets/blog/clean-code/clean-code.webp"
date: "2026-01-08T05:35:07.322Z"
author:
  name: Milan Mareels
  picture: "/assets/blog/authors/milan-mareels.webp"
ogImage:
  url: "/assets/blog/clean-code/clean-code.webp"
---

Software development is a strange profession. A painter can immediately see if his work is messy. A carpenter can immediately see if a cabinet is crooked. But with software? An application can work perfectly on the front end, while the code on the back end is held together with duct tape and bandages.

My IT journey began during my graduate studies (Graduaat), where I first learned the principles of Clean Code. Now, during my bachelor's degree, I find it frustrating to see that code quality is often overlooked. While many students focus solely on the 'it works' mindset, I believe we should aim higher. For me, software development is no longer just about functionality it is about quality and craftsmanship.

I've reached a point where I not only consider Clean Code important, but the lack of it genuinely frustrates me. Why? Because bad code is disrespectful to your teammates and your future self. In this blog post, I'll share my vision for livable, understandable software.

## 1. Code is Communication (Comprehensibility)

There's a misconception that programmers write code for computers. That's nonsense. Computers read binary code (zeros and ones). We write source code (like JavaScript, C#, or Java) for people.

### Cognitive Load

An important concept I came across during my research is **Cognitive Load**. Every time a developer reads a piece of code and has to think: _"Wait a minute, what does variable x do here again?"_, the mental burden increases.

If your code is cluttered with obscure abbreviations, gigantic functions, and clever "hacks," you're exhausting your reader's brain. The result? Errors. Bugs. Frustration.

Clean code reduces that cognitive load. It reads like a book.

**Bad:**

```javascript
const d = 10; // days passed since last login
```

**Good:**

```javascript
const daysSinceLastLogin = 10;
```

In the second case, comments are superfluous, because the code is self-explanatory.

## 2. Livability and Technical Debt

During projects in my program, I often notice that students want to see quick results. "It works, right?" they'll say. But that's short-term thinking.

Bad code creates what we in the industry call **Technical Debt**. Think of it as a financial loan. You can save time now by writing messy code (borrowing money quickly), but later you'll pay interest. You pay that interest in the form of:

- Extra time needed to add simple features.
- Bugs that pop up in places you don't expect them.
- New developers who need days to understand the project.

My goal in my Bachelor's projects is to keep that debt at zero. I want my code to still be "viable" a year from now.

### The Boy Scout Rule

Robert C. Martin (Uncle Bob) introduced a wonderful rule that I always try to apply: _"Leave the campground cleaner than you found it."_ Do you see messy code in a file you're working on? Clean it up, even if you didn't write it.

> **Note:** Be sensible about this. Don't rebuild the entire application just before a deadline, that will cause conflicts. Improve small things step by step.

## 3. Structure and Complexity: Less is More

Besides naming, the structure of your if statements and the size of your functions determine quality. This is where, as a developer, you differentiate between junior and senior behavior.

### Stop Nesting: Use "Guard Clauses"

You know how it is: an if within an if within an if. This is called the "Arrow Head" style, because the code indents further and further to the right in the shape of an arrowhead. This is detrimental to readability. As a reader, you constantly have to remember which condition you're in.

The solution is simple: **Return Early**. Turn the logic around.

**Deeply nested code:**

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

**Clean Code with Guard Clauses:**

```javascript
function saveUser(user) {
  if (!user.isValid) return;
  if (!db.isConnected) return;
  if (!user.hasPermission) return;

  db.save(user);
}
```

The result is exactly the same, but the mental burden is much lower. You handle the edge cases immediately and forget about them.

### Functions: The smaller the better

One of the most common mistakes I see (and sometimes still make myself) is functions of 50 or 100 lines of code.

A function should adhere to the **Single Responsibility Principle**. A function should do one thing, and do it well.

- Do you have to scroll to see the full feature? It's too big.
- Does the function contain the word "and" (e.g. `validateAndSaveUser`)? Too large (split it into `validateUser` and `saveUser`).

Small functions are easier to read, easier to test, and easier to reuse. If a function is small, the chance of bugs is minimal, simply because there's nowhere for bugs to hide.

### The "Bad" Approach

This function violates the Single Responsibility Principle. It validates data, handles database logic, formats strings, and sends emails all in one place. It is difficult to test and hard to read.

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

### The "Good" Approach (Clean Code)

Here, the logic is split into small, focused functions. The main function, `registerUser`, acts as an orchestrator. It reads like a sentence, making it immediately clear what the code does without getting bogged down in implementation details.

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

## 4. My Toolbox: Automate Quality

You don't have to rely on willpower alone. In my setup (VS Code), I use tools that force me to work neatly. I recommend this to everyone:

### The Linter (ESLint)

A Linter is like a strict teacher looking over your shoulder. It analyzes your code as you type. Are you using a variable that doesn't exist? Linter warns you. Are you creating a loop that never ends? Linter sees it. This prevents silly mistakes before you even run the code.

### Prettier (Formatter)

I refuse to argue about spaces versus tabs or where the curly braces `{` should go anymore. I use the Prettier extension in VS Code. I have my editor set to "Format on Save." I type my code, hit `Ctrl+S`, and poof: my code snaps into perfect alignment. It gives you peace of mind and ensures a consistent style across the team.

## 5. The Litmus Test: Dirty vs. Clean Code

Let's put theory into practice with an example that combines everything: naming, structure, and returns.

**Dirty Code (The "It Works Anyway?" Method)**

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

This is painful to read. If I look back at this in two months, I'll have to search the entire database to find out what type 2 means.

**Clean Code (The Professional Method)**

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
