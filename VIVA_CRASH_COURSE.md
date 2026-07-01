# CineBook: Ultimate Viva Crash Course & Grilling Defense
*Prepared for coursework evaluation and recruiter technical interviews*

This guide is written for absolute beginners. If you do not know how to code in JavaScript/React, Java, or Python, read this document. It covers the absolute basics, breaks down code snippets line-by-line, and explains how faculty and recruiters will try to catch you out during your Viva.

---

## PART 1: The Absolute Basics of the Languages

### 1. JavaScript & React (The Frontend)
*   **What is JavaScript (JS)?** JS is the programming language that runs inside the web browser. It makes web pages interactive. If HTML is the skeleton, and CSS is the skin/clothing, JS is the muscle that moves things.
*   **What is React?** React is a JavaScript library built by Facebook. Instead of loading new pages from scratch, React lets us build a Single Page Application (SPA). The page never reloads; instead, components (like the seat map or the checkout form) update dynamically on the fly.
*   **Key React Concepts to Know:**
    *   **Components:** Reusable UI blocks written as JavaScript functions (e.g., `SeatMap()`).
    *   **State (`useState`):** Variables that, when changed, trigger React to instantly re-render that specific part of the web page. For example, if `selectedSeats` state changes from `1` to `2`, the ticket summary updates immediately.

### 2. Java (Object-Oriented Programming - OOP)
*   **What is Java?** A class-based, strongly-typed programming language. It is compiled into bytecode that runs on any machine with a Java Virtual Machine (JVM).
*   **Core OOP Concepts to Explain:**
    *   **Class vs Object:** A *Class* is a blueprint (e.g., the `Card` template). An *Object* is the physical instance created from that blueprint (e.g., `Visa Card with digits 4242...`).
    *   **Encapsulation:** Keeping attributes private (`private String cardNumber`) so that they cannot be modified directly from outside the class. Access is granted only via public methods (Getters/Setters).
    *   **Inheritance:** Creating a child class that inherits properties from a parent class.
    *   **Polymorphism:** Overriding inherited methods to do different things. For example, `WeakPolicy` and `StrongPolicy` both inherit from `PasswordPolicy`, but they validate passwords differently.

### 3. Python (Scripting & Data Analysis)
*   **What is Python?** A highly readable, dynamic language widely used for security scripting, data analysis, and automation.
*   **Key Python Concepts to Know:**
    *   **Abstract Base Class (ABC):** A parent class that cannot be instantiated directly. It acts as a strict template forcing child classes to implement specific methods.
    *   **Matplotlib:** A plotting library in Python used to draw graphs and charts.

---

## PART 2: Line-by-Line Code Walkthroughs

### Snippet 1: Luhn's Algorithm Card Validation (JavaScript/Vue)
Located in [CardForm.js](file:///D:/PROJECTS/WEB-DEV-VOC/NEWFINAL/src/pages/CardForm.js) & [cardManager.js](file:///D:/PROJECTS/WEB-DEV-VOC/NEWFINAL/src/security/cardManager.js):
```javascript
var sum = 0;
var shouldDouble = false;
for (var i = num.length - 1; i >= 0; i--) {
  var digit = parseInt(num.charAt(i));
  if (shouldDouble) {
    digit *= 2;
    if (digit > 9) digit -= 9;
  }
  sum += digit;
  shouldDouble = !shouldDouble;
}
return sum % 10 === 0;
```
*   **Line-by-Line Explanation:**
    1.  `var sum = 0;`: Initializes a counter to store the running sum.
    2.  `var shouldDouble = false;`: A flag that tracks whether to double the current digit. We double every other digit starting from the right.
    3.  `for (var i = num.length - 1; i >= 0; i--)`: Loops through the card number characters from right to left.
    4.  `var digit = parseInt(num.charAt(i))`: Converts the single string character into an integer number.
    5.  `if (shouldDouble) { ... }`: If the flag is true, double the digit. If doubling results in a number greater than 9 (e.g. `8 * 2 = 16`), subtract 9 (`16 - 9 = 7`).
    6.  `sum += digit;`: Adds the digit to our running sum.
    7.  `shouldDouble = !shouldDouble;`: Inverts the flag so the next digit is not doubled, but the one after is.
    8.  `return sum % 10 === 0;`: If the final sum is divisible by 10, the card number is valid and we return `true`.

---

### Snippet 2: Concurrency & Mutex Seating Hold (Java)
Located in [BookingPage.js](file:///D:/PROJECTS/WEB-DEV-VOC/NEWFINAL/src/pages/BookingPage.js):
```java
// Simulated Java Thread Locks
public class MutexLock implements Runnable {
    private boolean isLocked = false;
    public synchronized void acquire() throws InterruptedException {
        while (isLocked) {
            wait();
        }
        isLocked = true;
    }
    public synchronized void release() {
        isLocked = false;
        notify();
    }
}
```
*   **Line-by-Line Explanation:**
    1.  `public class MutexLock implements Runnable`: Declares a class representing a mutual exclusion lock that can run on a concurrent thread.
    2.  `private boolean isLocked = false;`: A state variable tracking if a seat row is currently reserved.
    3.  `public synchronized void acquire()`: The `synchronized` keyword ensures only one thread can execute this method at a time.
    4.  `while (isLocked) { wait(); }`: If another user has already locked the seats, the thread waits in queue.
    5.  `isLocked = true;`: Sets the lock status to true, blocking other users.
    6.  `public synchronized void release()`: Releases the lock, changing `isLocked` to false and calling `notify()` to wake up any waiting threads.

---

### Snippet 3: Python Abstract Base Class (Python)
Located in [password_audit.py](file:///D:/PROJECTS/WEB-DEV-VOC/NEWFINAL/python/password_audit.py):
```python
from abc import ABC, abstractmethod

class PasswordCheck(ABC):
    @abstractmethod
    def perform_check(self, password):
        pass

class LengthCheck(PasswordCheck):
    def perform_check(self, password):
        return len(password) >= 8
```
*   **Line-by-Line Explanation:**
    1.  `from abc import ABC, abstractmethod`: Imports Python's Abstract Base Class modules.
    2.  `class PasswordCheck(ABC)`: Defines the abstract parent class. You cannot create a direct object of this class.
    3.  `@abstractmethod`: A decorator marking `perform_check` as abstract.
    4.  `def perform_check(self, password): pass`: Placeholder method. Any child class inheriting from `PasswordCheck` MUST override this method.
    5.  `class LengthCheck(PasswordCheck)`: Creates a concrete child class inheriting from `PasswordCheck`.
    6.  `def perform_check(self, password): return len(password) >= 8`: Overrides the parent method, checking if the password length is at least 8 characters.

---

## PART 3: Faculty & Recruiter Viva Defense Scenarios

### 🎙️ Scenario A: The Faculty Grilling on Concurrency
*   **Faculty:** *"I see you have a Mutex lock running. Why did you use Mutex instead of a simple boolean variable to lock the seat database?"*
*   **Your Answer:** *"A simple boolean variable is not thread-safe. If two threads (representing two different users) check the boolean at the exact same millisecond, both will see 'false' and both will reserve the seat, causing a double-booking. A Mutex uses Java's synchronized locks to force thread safety. Only one thread can check and write at a time, avoiding race conditions."*
*   **Recruiter Follow-up:** *"Good. What happens if a user closes their browser while holding the Mutex lock? How do you prevent a permanent database lock?"*
*   **Your Answer:** *"We implement a Lease Hold Timer. The Mutex is assigned a Time-To-Live (TTL) of 5 minutes. If no purchase is made within 5 minutes, a background scheduler automatically releases the lock."*

### 🎙️ Scenario B: The Recruiter Grilling on OOP Design
*   **Recruiter:** *"Why did you use abstract classes for password checks instead of a single long function with multiple if-else blocks?"*
*   **Your Answer:** *"Using a single function violates the Single Responsibility Principle and the Open-Closed Principle of SOLID design. If we want to add a new check tomorrow (e.g., checking if the password contains common words), we would have to modify the existing function, which risks breaking current checks. By using an Abstract Base Class, we can add new rules by simply writing new child classes without touching existing codebase files."*

### 🎙️ Scenario C: The Faculty Grilling on Luhn's Algorithm
*   **Faculty:** *"If your card validation fails Luhn's check, does it crash the system? How do you handle it?"*
*   **Your Answer:** *"No, it does not crash. We use Java-style Exception Handling. The validator throws a custom `IllegalArgumentException` with the message 'Luhn check failed'. This exception is caught in a try-catch block, preventing system crashes and displaying a clean error message to the user."*
