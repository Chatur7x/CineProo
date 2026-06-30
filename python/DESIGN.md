# PASSWORD AUDIT SYSTEM - DESIGN DOCUMENT

## DESIGN OVERVIEW

### Goals

- Load a file containing multiple passwords (one per line)
- Run multiple validation checks on each password (length, complexity, pattern)
- Detect duplicate passwords
- Generate a comprehensive text-based audit report
- Demonstrate all 18 required Python syllabus topics through a single cohesive project

### Non-Goals

- GUI or web interface (CLI only)
- Database storage (flat file only)
- Password generation or hashing
- Network-based or multi-user features
- Real-time password strength feedback

---

## ARCHITECTURE

### Component Diagram

```
+------------------+
|   passwords.txt  |
+--------+---------+
         |
         v
+------------------+     +------------------+
| PasswordAuditor  |---->|   PasswordCheck  |  (ABC - abstract)
|                  |     +--------+---------+
| - loads file     |              |
| - detects dupes  |     +--------+--------+--------+
| - runs checks    |     |        |        |        |
| - produces dict  |   Length  Complexity Pattern  |
+--------+---------+     |
         |               +---> returns (deduction, [issues])
         v
+------------------+
|    Password      |
| - __score        |
| - __issues       |
| - strength       |
+--------+---------+
         |
         v
+------------------+
|   AuditReport    |
| - writes to file |
+------------------+
```

### Data Flow

1. `passwords.txt` --read by--> `PasswordAuditor.load_passwords()`
2. Each password --wrapped in--> `Password` object
3. `Password.analyze()` --calls--> `LengthCheck.run_check()`, `ComplexityCheck.run_check()`, `PatternCheck.run_check()` (polymorphism)
4. Results stored in `_results_dict: Dict[str, Password]`
5. Duplicates detected using `_duplicate_set: Set[str]`
6. `AuditReport.generate()` --reads--> `PasswordAuditor.get_results_as_tuples()` (list of tuples)
7. Report written to `audit_report.txt`

---

## CORE COMPONENTS

### 1. PasswordCheck (Abstract Base)

- **Type**: ABC using `abc.ABC`
- **Purpose**: Define the interface that all checks must implement
- **Method**: `run_check(password: str) -> Tuple[int, List[str]]`
- **Why abstract**: Cannot be instantiated directly; forces subclasses to implement `run_check()`

### 2. LengthCheck

- **Inherits from**: `PasswordCheck`
- **Purpose**: Verify password meets minimum length of 8 characters
- **Deduction**: 1 point if too short
- **Polymorphism**: Implements `run_check()` uniquely

### 3. ComplexityCheck

- **Inherits from**: `PasswordCheck`
- **Purpose**: Check for uppercase, lowercase, digit, special character
- **Deduction**: 1 point per missing category (max 4)
- **Polymorphism**: Implements `run_check()` uniquely

### 4. PatternCheck

- **Inherits from**: `PasswordCheck`
- **Purpose**: Detect common weak passwords using a `frozenset` blacklist
- **Deduction**: Up to 4 points for known weak passwords
- **Data**: `WEAK_PATTERNS` is a `frozenset` (immutable)
- **Polymorphism**: Implements `run_check()` uniquely

### 5. Password

- **Purpose**: Wraps a password string, runs all checks, stores results
- **Encapsulation**: `__score`, `__issues`, `__password`, `__is_duplicate` are name-mangled private attributes
- **Properties**: `password`, `score`, `issues`, `is_duplicate`, `strength` (public getters)
- **Strength**: Conditional logic - Strong (4-5), Medium (2-3), Weak (0-1)

### 6. PasswordAuditor

- **Purpose**: Orchestrates the entire workflow
- **Data structures**:
  - `_passwords: List[str]` - all passwords from file
  - `_results_dict: Dict[str, Password]` - maps password to its audit object
  - `_duplicate_set: Set[str]` - duplicate tracking
- **Methods**: `load_passwords()`, `get_results_as_tuples()` (list of tuples), `get_passwords_by_strength()` (list comprehension)

### 7. AuditReport

- **Purpose**: Generate the formatted text report
- **File handling**: Writes to `audit_report.txt`
- **Exception handling**: Catches `IOError` on write failure
- **Comprehensions**: Filters results by strength category

---

## SYLLABUS TOPICS MAPPING

| Topic | Where Demonstrated |
|---|---|
| Variables, Data Types | Password.__init__ uses str, int, bool |
| Conditional Statements | Password.strength: if/elif/else |
| Loops | for pwd in self._passwords |
| Functions | def main(), def analyze(), etc. |
| File Handling | open() in load_passwords() and generate() |
| Lists | self._passwords in PasswordAuditor |
| Tuples | get_results_as_tuples() returns list of (pwd, score, issues, strength, is_dup) |
| Dictionaries | self._results_dict {password: Password} |
| Sets | self._duplicate_set for duplicate tracking |
| Frozen Sets | PatternCheck.WEAK_PATTERNS |
| Comprehensions | [pw for pw in ... if pw.strength == category] |
| Classes and Objects | 6 classes, multiple object instances |
| Attributes and Methods | Each class has __init__, properties, methods |
| Inheritance | LengthCheck(PasswordCheck), etc. |
| Polymorphism | run_check() behaves differently per subclass |
| Encapsulation | __score, __issues with @property |
| Abstraction | PasswordCheck cannot be instantiated |
| Exception Handling | try/except for FileNotFoundError, ValueError, IOError |

---

## DESIGN DECISIONS

| Decision | Rationale | Impact |
|---|---|---|
| Single-module structure | All classes in one .py file for simplicity; easier to demonstrate relationships | Clean dependency chain |
| ABC for base class | Enforces run_check() implementation on all subclasses | Guarantees polymorphic interface |
| Name mangling (__score) | True Python encapsulation mechanism | Prevents external direct access |
| Frozenset for weak passwords | Immutable; cannot be modified at runtime | Thread-safe, predictable |
| 5-point scoring | Simple, intuitive scale | Easy to explain and extend |
| Comma-separated issues list | Each check adds its own findings | Clear, auditable trail |

---

## KNOWN LIMITATIONS

- No support for password files with custom delimiters (must be one per line)
- Weak password list is hardcoded (not configurable without editing source)
- No support for multi-threaded/multi-process bulk auditing
- Report format is plain text only (no CSV/JSON/HTML export)

---

## TECHNICAL DEBT

- Test access to `auditor._passwords` and `auditor._results_dict` bypasses encapsulation (acceptable for unit testing)
- No logging framework (uses print statements in main)
- PatternCheck hardcodes 4-point deduction for weak passwords (should be configurable)

---

## SECURITY CONSIDERATIONS

- **Threat**: Passwords displayed in terminal output and plain-text report
  - **Mitigation**: Report is local only; no network transmission
- **Threat**: Weak password list hardcoded in source
  - **Mitigation**: Easily auditable and extensible
- **Threat**: No input sanitization
  - **Mitigation**: Passwords are stripped of whitespace only; non-printable characters may cause unexpected behavior

---

## CHANGE HISTORY

### 2026-06-08 - Initial Version

- Created all 6 classes
- Implemented all 18 syllabus topics
- 41 unit tests passing
- Full documentation generated
