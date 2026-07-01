# Viva Preparation Guide: CineBook Ticketing & Security System
**Syllabus concepts, implementation details, and defense strategies (Basic, Medium, Hard)**

Use this document to prepare for your viva voce exam. It covers what we did, how we did it, and why we did it across Web Dev, Java OOP, and Python scripting.

---

## 1. Basic Level Questions (Concepts & Definitions)

### Q1. What is Luhn's Algorithm and why is it used in the project?
*   **What:** A simple checksum formula (also known as the "modulus 10" algorithm) used to validate a variety of identification numbers, such as credit card numbers.
*   **How:** It works by doubling every second digit starting from the right. If doubling results in a number greater than 9, you subtract 9 (or add the two digits). Finally, sum all digits. If the total modulo 10 is 0, the number is valid.
*   **Why:** We use it on the client-side card details page to immediately catch typing errors before sending any payment requests.

### Q2. What is Encapsulation in Java and how does this project demonstrate it?
*   **What:** Encapsulation is the practice of hiding an object's internal state (data fields) and restricting direct access to it, exposing it only through public methods (getters and setters).
*   **How:** In [Card.java](file:///D:/PROJECTS/WEB-DEV-VOC/NEWFINAL/java/src/Card.java), the card number, cardholder name, and CVV are declared as private variables (`private String cardNumber`). They can only be accessed or modified via methods like `getCardNumber()` or `setCardNumber()`.
*   **Why:** It protects data integrity and prevents external classes from modifying sensitive payment details arbitrarily.

### Q3. What is an Abstract Base Class (ABC) in Python and where is it used?
*   **What:** An abstract class is a blueprint for other classes. It allows you to declare abstract methods that subclasses *must* implement.
*   **How:** In [password_audit.py](file:///D:/PROJECTS/WEB-DEV-VOC/NEWFINAL/python/password_audit.py) (and mapped in [passwordCheck.js](file:///D:/PROJECTS/WEB-DEV-VOC/NEWFINAL/src/security/passwordCheck.js)), we define `class PasswordCheck(ABC)` with an abstract method `@abstractmethod def perform_check(self)`. Subclasses like `LengthCheck` inherit from it and implement their own version of `perform_check()`.
*   **Why:** It enforces a standard interface across all validator rules, allowing us to run loops of polymorphic audit checks cleanly.

### Q4. What is CSS Glassmorphism and what properties define it?
*   **What:** A design trend characterized by a translucent, "frosted glass" appearance over background elements.
*   **How:** It is created using:
    *   `background: rgba(r, g, b, alpha)` (semi-transparent background)
    *   `backdrop-filter: blur(40px)` (blurs whatever is behind the panel)
    *   `border: 1px solid rgba(255, 255, 255, 0.1)` (adds a subtle edge highlight)
*   **Why:** It matches modern dark themes (like Apple HIG) and adds high-end, premium visual depth to sidebars and modal dialogs.

---

## 2. Medium Level Questions (Implementation details)

### Q5. How does the bidirectional synchronization between the Seat Map and the Stepper work?
*   **What:** Clicking individual seats updates the counter stepper, and changing the stepper updates (selects/deselects) seats dynamically.
*   **How:** In [SeatMap.js](file:///D:/PROJECTS/WEB-DEV-VOC/NEWFINAL/src/components/SeatMap.js):
    *   **Seat Click:** When a seat is toggled, it modifies the selected seats array in the React context. The stepper quantity is bound directly to the length of this array.
    *   **Stepper Change:** If the user increments the stepper, the app automatically finds the next available adjacent seats to fill the gap. If decremented, it pops the last selected seat.
*   **Why:** It prevents discrepancies between selected seat layout visuals and invoice calculations.

### Q6. How does the Java Mutex Seating Hold (Thread Concurrency) work in our app?
*   **What:** It is a simulated background thread management console representing a Mutex (Mutual Exclusion) seating lock.
*   **How:** When a user enters the booking page, a background hold task initiates a 5-minute checkout timer. A simulated thread `Thread-0` periodically logs lock validations (checking database connection pools, caching credentials) to the exception log window.
*   **Why:** In real-world systems, if two users try to select the exact same seat simultaneously, a Mutex lock blocks the second thread, preventing double-bookings.

### Q7. Why do we write logs using BufferedWriter / FileWriter?
*   **What:** Writing transactions or audit checks to local text files.
*   **How:** The Java Payment server utilizes `BufferedWriter` chained with `FileWriter` to serialize card operations onto `cards.dat` and `logs.txt` streams.
*   **Why:** Buffered I/O is far more efficient than writing character-by-character to disk. It holds characters in memory (buffer) and writes them in chunks, reducing costly disk read/write actions.

### Q8. How does the Vue-in-React mounting bridge work in our index.html?
*   **What:** Mounting Vue component instances directly into our React SPA framework.
*   **How:** In [index.html](file:///D:/PROJECTS/WEB-DEV-VOC/NEWFINAL/index.html), we listen to route changes via a hashchange event listener. If the hash matches payment or audit routes, we dynamically initialize new Vue instances (like `#vue-card-form-root` or `#vue-java-checker-root`) onto container `div` placeholders.
*   **Why:** It allows us to showcase both React and Vue framework knowledge in the same project codebase.

---

## 3. Hard Level Questions (Advanced Defense)

### Q9. Why did we simulate JVM Runtime Exceptions on the frontend card form?
*   **What:** Displaying real Java stack traces in the browser console.
*   **How:** Inside the payment sidebar console, whenever validation checks fail (e.g. Luhn's algorithm fails, or password length violates the active policy), our JavaScript script generates an OOP exception object, formats it to match a JVM stack trace structure (pointing to classes like `java.lang.IllegalArgumentException` and method call line references), and writes it to the console log stream.
*   **Why:** It showcases exception handling concepts live inside the browser, showing examiners exactly how invalid inputs map to Java try-catch errors.

### Q10. How does the interactive Python Shell Emulator execute commands in the browser?
*   **What:** A browser command line that processes input strings and behaves like a Python shell.
*   **How:** In [PythonAudit.js](file:///D:/PROJECTS/WEB-DEV-VOC/NEWFINAL/src/pages/PythonAudit.js), we bind an input field to listen to the Enter key. When submitted, we parse command strings (`audit`, `stored`, `generate`, `help`) and execute corresponding JS functions representing the python logic, appending output logs to the virtual console.
*   **Why:** It creates a highly engaging way to demonstrate scripting interactions without requiring students to setup terminal configurations locally during evaluations.

### Q11. Explain the mathematics and CSS properties behind the 3D Ticket Pass Hover effect.
*   **What:** Moving the mouse cursor over a ticket causes it to tilt realistically in 3D.
*   **How:**
    *   **Perspective:** The parent container sets `perspective: 1000px` to give the child 3D depth.
    *   **Rotations:** On mousemove, we calculate the mouse pointer's X and Y offsets relative to the card's bounding box centers.
    *   **Transform:** We multiply these offsets by sensitivity factors to set `transform: rotateX(valDeg) rotateY(valDeg)`.
*   **Why:** It adds a premium, WOW-factor user experience to ticket displays, replacing flat, boring 2D boxes with an interactive card.
