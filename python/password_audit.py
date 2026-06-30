import abc

class PasswordCheck(abc.ABC):
    """Abstract base class for all password checks."""

    @abc.abstractmethod
    def run_check(self, password):
        """Run validation on a password string.
        Returns:
            tuple: (deduction_points: int, issues: list[str])
        """
        pass


class LengthCheck(PasswordCheck):
    """Checks if password meets minimum length requirement."""

    MIN_LENGTH = 8

    def run_check(self, password):
        if len(password) < self.MIN_LENGTH:
            return (1, [f"too short ({len(password)} chars, need {self.MIN_LENGTH})"])
        return (0, [])


class ComplexityCheck(PasswordCheck):
    """Checks for presence of uppercase, lowercase, digit, special char."""

    SPECIAL_CHARS = "!@#$%^&*()-_=+[]{}|;:,.<>?/~`"

    def run_check(self, password):
        issues = []
        deduction = 0

        if not any(c.isupper() for c in password):
            issues.append("missing uppercase letter")
            deduction += 1
        if not any(c.islower() for c in password):
            issues.append("missing lowercase letter")
            deduction += 1
        if not any(c.isdigit() for c in password):
            issues.append("missing digit")
            deduction += 1
        if not any(c in self.SPECIAL_CHARS for c in password):
            issues.append("missing special character")
            deduction += 1

        return (deduction, issues)


class PatternCheck(PasswordCheck):
    """Checks against common weak passwords (frozenset blacklist)."""

    WEAK_PATTERNS = frozenset({
        "password", "password123", "123456", "12345678",
        "qwerty", "abc123", "monkey", "letmein", "admin",
        "welcome", "football", "iloveyou", "sunshine",
        "princess", "passw0rd", "111111", "000000", "666666",
        "dragon", "master", "shadow", "trustno1"
    })

    def run_check(self, password):
        issues = []
        deduction = 0

        if password.lower() in self.WEAK_PATTERNS:
            issues.append("matches a known weak password")
            deduction = 4
        elif password.isdigit():
            issues.append("contains only digits")
            deduction = max(deduction, 3)
        elif len(password) < 4:
            issues.append("too short (less than 4 characters)")
            deduction = max(deduction, 2)

        return (deduction, issues)


class Password:
    """Stores a single password and its audit results.
    Encapsulation: __score and __issues are private (name-mangled), exposed via @property.
    """

    MAX_SCORE = 5

    def __init__(self, password_str):
        self.__password = password_str
        self.__score = self.MAX_SCORE
        self.__issues = []
        self.__is_duplicate = False

    @property
    def password(self):
        return self.__password

    @property
    def score(self):
        return self.__score

    @property
    def issues(self):
        return list(self.__issues)

    @property
    def is_duplicate(self):
        return self.__is_duplicate

    @is_duplicate.setter
    def is_duplicate(self, value):
        self.__is_duplicate = bool(value)

    def analyze(self):
        """Run all password checks (polymorphism in action)."""
        self.__score = self.MAX_SCORE
        self.__issues = []

        checks = [LengthCheck(), ComplexityCheck(), PatternCheck()]
        for check in checks:
            deduction, check_issues = check.run_check(self.__password)
            self.__score -= deduction
            self.__issues.extend(check_issues)

        self.__score = max(0, self.__score)
        return self

    @property
    def strength(self):
        if self.__score >= 4:
            return "Strong"
        elif self.__score >= 2:
            return "Medium"
        else:
            return "Weak"

    def __str__(self):
        dup = " [DUPLICATE]" if self.__is_duplicate else ""
        return f"{self.__password} | Score: {self.__score}/5 ({self.strength}){dup}"

    def __repr__(self):
        return f"Password('{self.__password}', score={self.__score})"


class PasswordAuditor:
    """Orchestrates loading, checking, and analyzing bulk passwords.
    Uses:
        - List: stores all passwords from file
        - Set: detects duplicates
        - Dict: maps password string -> Password object
        - Comprehensions: filters by strength category
    """

    def __init__(self, filepath):
        self._filepath = filepath
        self._passwords = []
        self._password_objects = []
        self._results_dict = {}
        self._duplicate_set = set()

    def load_passwords(self):
        try:
            with open(self._filepath, 'r') as f:
                lines = f.readlines()
        except FileNotFoundError:
            raise FileNotFoundError(f"ERROR: File '{self._filepath}' not found.")

        if not lines:
            raise ValueError("ERROR: Password file is empty.")

        self._passwords = [line.strip() for line in lines if line.strip()]

        if not self._passwords:
            raise ValueError("ERROR: No valid passwords found in file.")

        seen = set()
        for pwd in self._passwords:
            if pwd in seen:
                self._duplicate_set.add(pwd)
            seen.add(pwd)

        for pwd in self._passwords:
            pw_obj = Password(pwd)
            pw_obj.analyze()
            pw_obj.is_duplicate = pwd in self._duplicate_set
            self._password_objects.append(pw_obj)
            self._results_dict[pwd] = pw_obj

        return self

    @property
    def password_count(self):
        return len(self._passwords)

    @property
    def unique_count(self):
        return len(set(self._passwords))

    @property
    def duplicate_count(self):
        return self.password_count - self.unique_count

    @property
    def duplicate_passwords(self):
        return sorted(self._duplicate_set)

    @property
    def password_objects(self):
        return list(self._password_objects)

    def get_results_as_tuples(self):
        results = []
        for pwd, pw_obj in self._results_dict.items():
            results.append((
                pwd,
                pw_obj.score,
                list(pw_obj.issues),
                pw_obj.strength,
                pw_obj.is_duplicate
            ))
        return results

    def get_result(self, password):
        return self._results_dict.get(password, None)

    def get_passwords_by_strength(self, category):
        return [pw for pw in self._password_objects if pw.strength == category]


class AuditReport:
    """Generates a formatted audit report file."""

    def __init__(self, auditor, output_path="audit_report.txt"):
        self._auditor = auditor
        self._output_path = output_path

    def generate(self):
        try:
            with open(self._output_path, 'w') as f:
                f.write(self._build_content())
            return self._output_path
        except IOError as e:
            raise IOError(f"ERROR: Failed to write report - {e}")

    def _build_content(self):
        a = self._auditor
        lines = []
        lines.append("=" * 60)
        lines.append("                    PASSWORD AUDIT REPORT")
        lines.append("=" * 60)
        lines.append(f"  Total passwords loaded:    {a.password_count}")
        lines.append(f"  Unique passwords:          {a.unique_count}")
        lines.append(f"  Duplicate passwords:       {a.duplicate_count}")
        lines.append("=" * 60)

        if a.duplicate_passwords:
            lines.append("\n  --- DUPLICATE PASSWORDS ---")
            for pwd in a.duplicate_passwords:
                lines.append(f"    * {pwd}")

        results = a.get_results_as_tuples()
        lines.append("\n" + "-" * 60)
        lines.append("  PASSWORD AUDIT DETAILS")
        lines.append("-" * 60)

        for pwd, score, issues, strength, is_dup in results:
            dup_tag = " [DUPLICATE]" if is_dup else ""
            lines.append(f"\n  Password: {pwd}{dup_tag}")
            lines.append(f"  Score:    {score}/5 ({strength})")
            if issues:
                for issue in issues:
                    lines.append(f"    - {issue}")
            else:
                lines.append(f"    (no issues)")

        weak_list = [t for t in results if t[3] == "Weak"]
        medium_list = [t for t in results if t[3] == "Medium"]
        strong_list = [t for t in results if t[3] == "Strong"]

        lines.append("\n" + "-" * 60)
        lines.append("  SUMMARY BY STRENGTH")
        lines.append("-" * 60)
        lines.append(f"  Weak passwords:   {len(weak_list)}")
        for t in weak_list:
            lines.append(f"    - {t[0]} (Score: {t[1]}/5)")
        lines.append(f"  Medium passwords: {len(medium_list)}")
        for t in medium_list:
            lines.append(f"    - {t[0]} (Score: {t[1]}/5)")
        lines.append(f"  Strong passwords: {len(strong_list)}")
        for t in strong_list:
            lines.append(f"    - {t[0]} (Score: {t[1]}/5)")

        lines.append("\n" + "-" * 60)
        lines.append("  ALL RESULTS (Tuples)")
        lines.append("-" * 60)
        for t in results:
            lines.append(f"    {t}")

        lines.append("\n" + "=" * 60)
        lines.append("                    END OF REPORT")
        lines.append("=" * 60)

        return "\n".join(lines)


def main():
    import sys

    input_file = sys.argv[1] if len(sys.argv) > 1 else "passwords.txt"
    output_file = "audit_report.txt"

    print("=" * 50)
    print("  PASSWORD AUDIT SYSTEM")
    print("=" * 50)
    print(f"  Input file:  {input_file}")
    print(f"  Output file: {output_file}")
    print()

    try:
        print("  Loading passwords...", end=" ")
        auditor = PasswordAuditor(input_file)
        auditor.load_passwords()
        print(f"Done ({auditor.password_count} loaded)")

        print(f"  Duplicates found: {auditor.duplicate_count}")
        print(f"  Unique passwords: {auditor.unique_count}")
        print()

        print("  Generating report...", end=" ")
        report = AuditReport(auditor, output_file)
        path = report.generate()
        print(f"Done -> {path}")

        results = auditor.get_results_as_tuples()
        print()
        print("  Quick summary:")
        for pwd, score, issues, strength, is_dup in results:
            dup = " [DUP]" if is_dup else ""
            print(f"    {pwd:20s}  {score}/5  ({strength:7s}){dup}")

        print()
        print(f"  Full audit report written to: {path}")
        print("=" * 50)

    except (FileNotFoundError, ValueError, IOError) as e:
        print(f"\n  ERROR: {e}")
        print(f"  Create a file named '{input_file}' with one password per line.")


if __name__ == "__main__":
    main()
