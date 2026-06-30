# Academic Project Report: CineBook
## Unified Movie Ticket Booking System with Cross-Language Security Integration
**Coursework Submission: Combined Web Dev (React/Vue), Java, and Python Modules**

---

## 1. Abstract & Executive Summary

In contemporary computer science education, languages are often taught in silos, leaving students to guess how separate platforms (e.g., Python scripting, Java server-side collections, and Javascript frontend frameworks) interact in production systems. 

**CineBook** is an academic prototype designed to address this gap. It serves as a unified, production-grade application that brings together:
*   **Web Development (React + Vue + CSS Grid)**: Core Single Page Application (SPA) architecture running an Apple-inspired frosted glass aesthetic.
*   **Java (Collections, Exceptions, I/O, Concurrency)**: Card storage operations (`CardManager`), Mutex seating locking threads, and automated policy validation.
*   **Python (Abstract OOP, Matplotlib, Interactive Terminal)**: Password strength audit metrics, command shell simulators, and graphics canvas plot generation.

By bridging these runtimes on the client side, CineBook demonstrates the implementation of cross-module validations, simulated serialization streams, and thread locking.

---

## 2. Design System Architecture (Apple HIG & District UI)

The user experience has been designed to resemble modern, high-end ticketing and media systems (e.g., Apple TV+, App Store, and District). 

### 2.1 Color Token Framework
*   **OLED Deep Black (`#000000`)**: The baseline backdrop canvas, eliminating visual distraction and conserving panel power.
*   **Frosted Glass (`rgba(28, 28, 30, 0.72)`)**: High blur navbar panels utilizing `backdrop-filter: blur(40px)` for high-contrast contextual layering.
*   **Apple System Accents**: 
    *   Primary: `#0A84FF` (System Blue)
    *   Success: `#30D158` (System Green)
    *   Danger: `#FF453A` (System Red)
    *   Warning: `#FF9F0A` (System Orange)
    *   Auxiliary: `#BF5AF2` (System Purple) & `#64D2FF` (System Teal)

### 2.2 Typography & Layout
*   **Typeface**: **Inter** styled with narrow letter-tracking (`-0.02em` for headlines, `-0.01em` for body) to mimic SF Pro text styling.
*   **Pill Components**: Interactive widgets (buttons, badges, inputs) have a minimum target of `44px` height and a standard pill border-radius (`980px`).
*   **Layout Adapters**: High-adaptability CSS Grid wrappers (`grid-template-columns: repeat(auto-fill, minmax(185px, 1fr))`) and Flex layouts ensure responsiveness across viewport profiles.

---

## 3. Syllabus Concepts Technical Deep Dive

```
               ┌────────────────────────────────────────────────────────┐
               │              CINEBOOK WEB FRAMEWORK                    │
               │         React SPA Host (Hash Route Navigation)         │
               └────────────────────┬───────────────┬───────────────────┘
                                    │               │
      ┌─────────────────────────────▼─┐           ┌─▼─────────────────────────────┐
      │          JAVA MODULE          │           │         PYTHON MODULE         │
      │    ArrayList & CardManager    │           │      Password Auditor ABC     │
      │    Luhn Check Validation      │           │      Interactive Command Line │
      │    Thread Seating Locks       │           │      Matplotlib Plot Export   │
      └───────────────────────────────┘           └───────────────────────────────┘
```

### 3.1 Web Development Implementation
*   **React SPA Host**: Uses a custom hash routing system (`window.location.hash`) to control component loading without page refreshes, maintaining application state across pages.
*   **Global Context State**: `BookingContext.js` provides global access to current states, including:
    *   `selectedMovie`, `selectedTheatre`, `selectedScreen`, `selectedShowtime`
    *   `selectedSeats` (synchronized array of strings)
    *   `bookings` history database
*   **Vue-React Bridge**: Vue instances mount inside React pages (e.g., `CardForm` and `JavaChecker`) by targeting specific container IDs (`#vue-card-form-root`) inside lifecycle hooks, combining both frameworks.

### 3.2 Java Syllabus Integrations
*   **CardManager (Collections & OOP)**: Implements encapsulation principles. The `Card` object encapsulates attributes (`number`, `name`, `expiry`, `cvv`, `bank`) with explicit getters/setters. `CardManager` manages saved credentials via mock memory registers.
*   **BufferedWriter Simulator (File I/O)**: Shows console output representing disk operations (`FileWriter` / `BufferedWriter`) whenever a card is created:
    ```java
    BufferedWriter bw = new BufferedWriter(new FileWriter("cards.dat", true));
    bw.write(card.serialize());
    bw.newLine();
    bw.close();
    ```
*   **Java Exceptions Stack Trace Console**: Automatically prints Java exception traces to the screen on invalid user inputs (e.g., `java.lang.IllegalArgumentException` on Luhn mismatch, `java.text.ParseException` on incorrect expiration formatting).
*   **Mutex Seating Lock (Concurrency/Threading)**:
    *   Uses a Mutex simulator (`Thread-0`) when entering seat maps.
    *   Simulates background operations like `Mutex.lock()`, database checks, and thread sleep logs.
    *   Maintains a 5-minute seat allocation hold before releasing the lock and returning the user to the home screen.

### 3.3 Python Syllabus Integrations
*   **Password Audit Engine**: Re-implements Python Abstract Base Classes (ABCs). An abstract `PasswordCheck` defines the validation interface, implemented by subclasses (`LengthCheck`, `ComplexityCheck`, and `PatternCheck`) using polymorphic validation behaviors.
*   **Python Shell Interpreter**: A terminal emulator written in the frontend that parses user input and processes commands:
    *   `audit`: Runs checks against user credentials in the database.
    *   `stored`: Displays all audit passwords.
    *   `generate`: Accesses the generation utility class to output randomized sequences.
*   **Matplotlib Simulator**: A visual simulator showing the distribution of password strengths (Strong, Medium, Weak). Users can download the graph as a `.png` file using a canvas exporter.

---

## 4. Key Algorithms

### 4.1 Luhn's Algorithm Check (Java Card Validation)
The application validates payment cards using Luhn's algorithm (Mod 10):
$$\sum d_i \equiv 0 \pmod{10}$$
Where every second digit from the right is doubled. If the doubled digit is greater than 9, 9 is subtracted from it.

```javascript
isLuhnValid: function () {
  var num = this.cardNumber.replace(/\D/g, '');
  if (num.length < 13) return false;
  var sum = 0;
  var shouldDouble = false;
  for (var i = num.length - 1; i >= 0; i--) {
    var d = parseInt(num.charAt(i));
    if (shouldDouble) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}
```

### 4.2 Optimal Seating Suggestion Engine
The seating layout identifies the "sweet spot" for audio-visual alignment (center columns 4–9, rows D–E):

```javascript
// Sweet spot: rows D-E (middle), seats 4-9 (center), for best screen & sound
React.useEffect(function () {
  var bestRows = ["D", "E", "C"];
  var bestCols = [5, 6, 7, 8, 4, 9];
  var suggested = [];
  for (var r = 0; r < bestRows.length && suggested.length < 4; r++) {
    for (var c = 0; c < bestCols.length && suggested.length < 4; c++) {
      var seatId = bestRows[r] + bestCols[c];
      var seat = seats.find(function (s) { return s.id === seatId; });
      if (seat && seat.status === "available") {
        suggested.push(seatId);
      }
    }
  }
  setBestSeats(suggested);
}, [seats]);
```

---

## 5. Verification & Testing Protocol

### 5.1 Manual Verification Procedures
1.  **Booking Workflow**:
    *   Navigate to a Movie details view -> Pick a District -> Choose a Theatre -> Select experience type (IMAX, Dolby, etc.) -> Pick Screen Number -> Pick Showtime.
    *   Use the navigation buttons (`‹ Back`) at the top of each view to verify that layout state and selection history are preserved.
2.  **Seat Selection**:
    *   Confirm that the curved glowing line representing the cinema screen is displayed.
    *   Check the **Recommended Seats** panel. Verify that clicking "Select" automatically adds the suggested seats.
    *   Confirm that selected seats display the movie poster image inside the seat boundaries.
3.  **Payment Checkout**:
    *   Verify the invoice details, including dynamic tax calculations and convenience fees.
    *   Enter invalid card information to check the Luhn algorithm badge status and verify the Java stack trace console output.
    *   Input a weak password and verify that the Python audit alert warning is displayed.

### 5.2 Browser Environment Setup
No external packages are required to run the client-side files.
1.  Open `index.html` in Chrome, Edge, Safari, or Firefox.
2.  Open the developer tools console (`F12`) to verify that there are no runtime warnings or errors.
