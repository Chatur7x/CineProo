# CineBook: Ultimate Viva Crash Course & Grilling Defense (Expanded Edition)
*Contains 35 high-probability questions covering Language Basics, Snippet Walkthroughs, and Hard-level Defense scenarios*

---

## PART 1: The Absolute Basics of the Languages (Q1 - Q10)

### Q1. What is JavaScript (JS) and how does it differ from HTML/CSS?
*   **What:** HTML defines the structure of a webpage, CSS defines its layout and styling, and JavaScript adds programmatic logic and interactivity.
*   **How:** JavaScript executes in the browser's engine (like Chrome V8) to manipulate the DOM (Document Object Model) dynamically without reloading the page.
*   **Why:** Without JS, the movie booking map, stepper, and password checks would be completely static and non-functional.

### Q2. What is React and why do we use it in CineBook?
*   **What:** React is a component-based frontend library built by Facebook.
*   **How:** It uses a Virtual DOM to compute changes efficiently and update only the modified nodes of the webpage.
*   **Why:** It enables building CineBook as a Single Page Application (SPA), providing smooth transitions and keeping state (like booking details) consistent across pages.

### Q3. What is the difference between `state` and `props` in React?
*   **State:** A local data store managed *inside* the component itself (e.g., whether a specific seat is clicked). It is mutable.
*   **Props:** Configuration parameters passed down from a *parent* component to a *child* component (e.g., passing a movie ID to a card component). It is read-only.

### Q4. What is a Class in Java and how does it relate to an Object?
*   **What:** A class is a logical blueprint that defines attributes and methods. An object is a physical instance of that class allocated in memory.
*   **How:** We instantiate objects using the `new` keyword (e.g., `Card myCard = new Card()`).
*   **Why:** It allows us to bundle data and behaviors together (like card details and Luhn validation logic).

### Q5. What are the four pillars of Object-Oriented Programming (OOP)?
1.  **Encapsulation:** Hiding internal state details (using `private` fields and getters/setters).
2.  **Inheritance:** Reusing code by allowing a child class to inherit fields and methods from a parent class.
3.  **Polymorphism:** The ability of different classes to respond to the same method call in different ways.
4.  **Abstraction:** Hiding complex implementation details and showing only the essential features (using abstract classes/interfaces).

### Q6. What is method overriding (Runtime Polymorphism) in Java?
*   **What:** When a subclass provides a specific implementation of a method that is already defined in its parent class.
*   **How:** We use the same method signature in the child class (using the `@Override` annotation).
*   **Why:** In our project, `WeakPolicy` and `StrongPolicy` both override the `validate()` method of `PasswordPolicy` to enforce different security criteria.

### Q7. What is an Abstract Base Class (ABC) in Python?
*   **What:** A class that cannot be directly instantiated and defines abstract methods that its subclasses *must* implement.
*   **How:** Inheriting from `abc.ABC` and using the `@abstractmethod` decorator.
*   **Why:** It enforces a contract on all validation classes in the Python auditor, ensuring they all implement a `perform_check()` method.

### Q8. What is the difference between a List and a Set in Java?
*   **List:** An ordered collection that allows duplicate elements (e.g., `ArrayList`). We use it to store all saved credit cards in order.
*   **Set:** An unordered collection that does not allow duplicate elements (e.g., `HashSet`). We use it to collect unique character types in our password analyzer.

### Q9. What is a dictionary (dict) in Python?
*   **What:** An unordered collection of key-value pairs.
*   **How:** Elements are accessed using keys (e.g., `stats['weak'] = 3`).
*   **Why:** We use dicts to aggregate audit metrics and map checking rules dynamically.

### Q10. What is the role of the Java Virtual Machine (JVM)?
*   **What:** The engine that drives Java code execution. It compiles Java source code (.java) into bytecode (.class), which is then interpreted or compiled (JIT) into machine code for the host OS.
*   **Why:** It guarantees the write-once, run-anywhere capability of the Java payment classes.

---

## PART 2: Snippet Walkthroughs & Layout Logic (Q11 - Q20)

### Q11. Walk through the Luhn's check math sequence.
*   **Math:** Take `4242-4242-4242-4242`. Starting from the right:
    *   Digits at odd positions remain the same: `2, 2, 2, 2, 2, 2, 2, 2` (sum = 16).
    *   Digits at even positions are doubled: `4*2=8`. Since all are 8: `8, 8, 8, 8, 8, 8, 8, 8` (sum = 64).
    *   Total sum = `16 + 64 = 80`.
    *   `80 % 10 == 0`, meaning it passes Luhn verification.

### Q12. Explain the React-Vue bridge initialization script.
*   **How:** In `index.html`, we check `window.location.hash`. If it matches `#/card-form`, we run `new Vue({ el: '#vue-card-form-root' })`.
*   **Why:** React runs the main layout. When navigating to the Java Checker or Card Form, React renders an empty container div, and our router immediately bootstraps a Vue instance on that container.

### Q13. How does the 3D ticket card tilt transform mathematically?
*   **How:** On mousemove, we get the mouse position `clientX, clientY` and subtract the element's bounding rect offsets `left, top` and its half-width/half-height to find the center offset `(x, y)`.
*   **Rotation:** We calculate degrees: `rotateX = -y * factor` and `rotateY = x * factor`, applying it as `transform: perspective(1000px) rotateX(...) rotateY(...)`.

### Q14. Walk through the Seat Map best seats recommendation search.
*   **How:** It iterates from the center rows (e.g., Row E, D) to the edges, picking adjacent empty seats in the premium tier first, then classic tiers.
*   **Why:** Matches real-world theater logic where users want centralized views.

### Q15. Walk through the BufferedWriter serialization code.
*   **How:**
    ```java
    BufferedWriter writer = new BufferedWriter(new FileWriter("cards.dat", true));
    writer.write(card.toString());
    writer.newLine();
    writer.close();
    ```
    *   `FileWriter` opens the file in append mode (`true`).
    *   `BufferedWriter` wraps it to queue characters in memory before writing to disk, reducing disk accesses.

### Q16. How does the Python Shell Console execute custom string commands?
*   **How:** It listens to input, splits the string into arguments (e.g. `audit weak`), and calls corresponding JS methods matching the Python script audits.

### Q17. Walk through the SVG QR Code scanner simulation.
*   **How:** Clicking the QR code updates the ticket state `verified = true`. This updates the CSS class to `.scanned`, displaying a green checkmark and logging the scanning time.

### Q18. How does the card number formatting input parser work?
*   **How:** It strips non-digits: `val.replace(/\D/g, '')`. Then it groups them: `val.replace(/(\d{4})(?=\d)/g, '$1 ')`.

### Q19. How does the password policy validator select the active rules dynamically?
*   **How:** By using a factory pattern. If `activePolicy` matches `'StrongPolicy'`, it instantiates `StrongPolicy` and runs `validate()`.

### Q20. Walk through the Python ComplexityCheck regex.
*   **How:** It checks if a password contains uppercase, lowercase, numbers, and symbols:
    `has_upper = re.search(r"[A-Z]", pwd)`
    `has_special = re.search(r"[!@#$%^&*]", pwd)`

---

## PART 3: Hard-Level / Recruiter Grilling Scenarios (Q21 - Q35)

### Q21. "What is a Race Condition, and how does your seat reservation thread avoid it?"
*   **Grilling:** If two users click a seat at the same time, what happens?
*   **Answer:** *"A race condition occurs when multiple threads read and modify shared data concurrently. In our app, we simulate a synchronized Mutex. Only the thread holding the lock can modify the seat status. Other threads are blocked (`wait()`) until the lock is released."*

### Q22. "What is a Deadlock and how can it occur in a seating lock scenario?"
*   **Grilling:** How do you prevent thread deadlocks?
*   **Answer:** *"A deadlock occurs when Thread A holds Lock 1 and waits for Lock 2, while Thread B holds Lock 2 and waits for Lock 1. In seat booking, we avoid deadlocks by enforcing lock ordering (seats are always locked in alphabetical/numerical order, never arbitrarily)."*

### Q23. "Why do we override toString() in Java classes?"
*   **Answer:** *"The default `toString()` in Java returns the class name and memory address hash. Overriding it allows us to return structured text representations (like `Card[number=4242...]`), which makes BufferedWriter serialization to log files clean and readable."*

### Q24. "What is the difference between checked and unchecked exceptions in Java?"
*   **Checked Exception:** Exceptions checked at compile-time (e.g., `IOException` when reading files). Code *must* use try-catch or declare it with `throws`.
*   **Unchecked Exception:** Runtime exceptions (e.g., `NullPointerException`, `IllegalArgumentException`). They do not need explicit compile-time declarations. Our Luhn check throws `IllegalArgumentException` (Unchecked).

### Q25. "Explain how the Open-Closed Principle (SOLID) is demonstrated in your Python Auditor."
*   **Answer:** *"The Open-Closed Principle states classes should be open for extension but closed for modification. Our abstract `PasswordCheck` class allows us to add new security rules (like dictionary checks) by writing new subclasses without modifying the auditor's loop logic."*

### Q26. "What is a memory leak, and how does your React app avoid it during routing?"
*   **Answer:** *"A memory leak occurs when resources (like intervals or event listeners) are not cleaned up. In our routing system, we remove global window listeners in React's cleanup hook when components unmount."*

### Q27. "Why is local card verification preferred over server-side verification first?"
*   **Answer:** *"Checking card formatting and Luhn checks locally saves network bandwidth, reduces server load, and gives immediate feedback to users, improving the user experience."*

### Q28. "How does the Python script simulate Matplotlib exporting without a real backend?"
*   **Answer:** *"We compile the audit statistics in JS and render a bar chart dynamically on an HTML5 canvas element. The `canvas.toDataURL()` method is then called to export the chart as a downloadable PNG image."*

### Q29. "What is the difference between Abstract Classes and Interfaces in Java?"
*   **Abstract Class:** Can have both abstract methods (no body) and concrete methods (with body), and can maintain instance states. A subclass can inherit from only one class.
*   **Interface:** Only defines abstract signatures (until Java 8 default methods) and cannot maintain state. A class can implement multiple interfaces.

### Q30. "What is the role of synchronized blocks in Java multithreading?"
*   **Answer:** *"A synchronized block locks an object's monitor, preventing other threads from entering code sections that modify shared resources, ensuring thread safety."*

### Q31. "How do you handle SQL injection vulnerabilities in a real booking app?"
*   **Answer:** *"By using Prepared Statements or Parameterized Queries. This separates the SQL command from the user data input, preventing attackers from injecting malicious queries."*

### Q32. "Why does our CardForm password policy default to WeakPolicy?"
*   **Answer:** *"To prevent user blocks. WeakPolicy only checks length (4+ chars), allowing standard testing inputs to pass checkout smoothly, while keeping StrongPolicy toggleable for testing exception stack traces."*

### Q33. "What are package-lock.json and package.json files?"
*   **package.json:** Declares project metadata, start scripts, and high-level dependency requirements.
*   **package-lock.json:** Locks the exact versions of dependencies installed, ensuring consistent builds across different machines.

### Q34. "What is the Virtual DOM in React?"
*   **Answer:** *"An in-memory representation of the real DOM. When state changes, React updates the Virtual DOM first, runs a diffing algorithm, and patches only the changed elements in the real browser DOM, saving performance."*

### Q35. "Explain how you would deploy this CineBook application to production."
*   **Answer:** *"I would bundle the React SPA into static HTML/CSS/JS files using build compilers (like Webpack or Vite), host the frontend on a CDN (like Vercel or AWS S3), and deploy the Java and Python backend components as API microservices using Docker containers."*
