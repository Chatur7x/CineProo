import os
import sys
import tempfile
import unittest

from password_audit import (
    Password,
    PasswordCheck,
    LengthCheck,
    ComplexityCheck,
    PatternCheck,
    PasswordAuditor,
    AuditReport,
)


class TestLengthCheck(unittest.TestCase):
    def setUp(self):
        self.check = LengthCheck()

    def test_long_password_passes(self):
        deduction, issues = self.check.run_check("LongEnough1")
        self.assertEqual(deduction, 0)
        self.assertEqual(issues, [])

    def test_short_password_fails(self):
        deduction, issues = self.check.run_check("Ab1!")
        self.assertEqual(deduction, 1)
        self.assertIn("too short", issues[0])


class TestComplexityCheck(unittest.TestCase):
    def setUp(self):
        self.check = ComplexityCheck()

    def test_all_complexity_present(self):
        pwd = "Ab1!"
        deduction, issues = self.check.run_check(pwd)
        self.assertEqual(deduction, 0)
        self.assertEqual(issues, [])

    def test_missing_uppercase(self):
        deduction, issues = self.check.run_check("abc1!")
        self.assertEqual(deduction, 1)
        self.assertIn("missing uppercase letter", issues)

    def test_missing_lowercase(self):
        deduction, issues = self.check.run_check("ABC1!")
        self.assertEqual(deduction, 1)
        self.assertIn("missing lowercase letter", issues)

    def test_missing_digit(self):
        deduction, issues = self.check.run_check("Abc!")
        self.assertEqual(deduction, 1)
        self.assertIn("missing digit", issues)

    def test_missing_special(self):
        deduction, issues = self.check.run_check("Abc1")
        self.assertEqual(deduction, 1)
        self.assertIn("missing special character", issues)

    def test_all_missing(self):
        deduction, issues = self.check.run_check("   ")
        self.assertEqual(deduction, 4)


class TestPatternCheck(unittest.TestCase):
    def setUp(self):
        self.check = PatternCheck()

    def test_weak_pattern_detected(self):
        deduction, issues = self.check.run_check("password")
        self.assertEqual(deduction, 4)
        self.assertIn("matches a known weak password", issues)

    def test_weak_pattern_case_insensitive(self):
        deduction, issues = self.check.run_check("PASSWORD")
        self.assertEqual(deduction, 4)

    def test_all_digits(self):
        deduction, issues = self.check.run_check("12345")
        self.assertTrue(deduction >= 3)
        self.assertIn("contains only digits", issues)

    def test_strong_password_no_issues(self):
        deduction, issues = self.check.run_check("Tr0ub4dor&3")
        self.assertEqual(deduction, 0)
        self.assertEqual(issues, [])

    def test_frozenset_is_immutable(self):
        with self.assertRaises(AttributeError):
            PatternCheck.WEAK_PATTERNS.add("new_weak_pwd")


class TestPassword(unittest.TestCase):
    def test_encapsulation(self):
        pw = Password("Test@123")
        with self.assertRaises(AttributeError):
            _ = pw._score
        with self.assertRaises(AttributeError):
            _ = pw._issues

    def test_property_getters(self):
        pw = Password("Test@123")
        self.assertEqual(pw.password, "Test@123")
        pw.analyze()
        self.assertIsInstance(pw.score, int)
        self.assertIsInstance(pw.issues, list)

    def test_is_duplicate_setter(self):
        pw = Password("Test@123")
        pw.is_duplicate = True
        self.assertTrue(pw.is_duplicate)
        pw.is_duplicate = False
        self.assertFalse(pw.is_duplicate)

    def test_analyze_returns_self(self):
        pw = Password("Test@123")
        self.assertIs(pw.analyze(), pw)

    def test_strong_password(self):
        pw = Password("Str0ng!p@$s").analyze()
        self.assertEqual(pw.strength, "Strong")
        self.assertGreaterEqual(pw.score, 4)

    def test_medium_password(self):
        pw = Password("Hello123").analyze()
        self.assertIn(pw.strength, ("Medium", "Strong"))

    def test_weak_password(self):
        pw = Password("abc").analyze()
        self.assertEqual(pw.strength, "Weak")
        self.assertLess(pw.score, 2)

    def test_score_never_negative(self):
        pw = Password("password").analyze()
        self.assertGreaterEqual(pw.score, 0)


class TestPasswordAuditor(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()
        self.test_file = os.path.join(self.temp_dir, "test_passwords.txt")

    def _create_file(self, lines):
        with open(self.test_file, 'w') as f:
            f.write("\n".join(lines) + "\n")

    def test_load_passwords_list(self):
        self._create_file(["Hello123", "Test@1", "abc"])
        auditor = PasswordAuditor(self.test_file).load_passwords()
        self.assertIsInstance(auditor._passwords, list)
        self.assertEqual(len(auditor._passwords), 3)

    def test_duplicate_detection_set(self):
        self._create_file(["Hello123", "abc", "Hello123"])
        auditor = PasswordAuditor(self.test_file).load_passwords()
        self.assertEqual(auditor.duplicate_count, 1)
        self.assertIn("Hello123", auditor.duplicate_passwords)

    def test_results_dictionary(self):
        self._create_file(["Hello123", "Test@1"])
        auditor = PasswordAuditor(self.test_file).load_passwords()
        self.assertIsInstance(auditor._results_dict, dict)
        self.assertIn("Hello123", auditor._results_dict)

    def test_get_results_as_tuples(self):
        self._create_file(["Hello123"])
        auditor = PasswordAuditor(self.test_file).load_passwords()
        tuples = auditor.get_results_as_tuples()
        self.assertIsInstance(tuples, list)
        pwd, score, issues, strength, is_dup = tuples[0]
        self.assertIsInstance(pwd, str)
        self.assertIsInstance(score, int)
        self.assertIsInstance(issues, list)
        self.assertIsInstance(strength, str)
        self.assertIsInstance(is_dup, bool)

    def test_comprehension_filter(self):
        self._create_file(["abc", "Hello123", "Str0ng!p@$s"])
        auditor = PasswordAuditor(self.test_file).load_passwords()
        weak = auditor.get_passwords_by_strength("Weak")
        self.assertIsInstance(weak, list)
        for pw in weak:
            self.assertEqual(pw.strength, "Weak")

    def test_file_not_found(self):
        auditor = PasswordAuditor("nonexistent.txt")
        with self.assertRaises(FileNotFoundError):
            auditor.load_passwords()

    def test_empty_file(self):
        self._create_file([])
        auditor = PasswordAuditor(self.test_file)
        with self.assertRaises(ValueError):
            auditor.load_passwords()

    def test_no_valid_passwords(self):
        self._create_file(["", "  ", "\t"])
        auditor = PasswordAuditor(self.test_file)
        with self.assertRaises(ValueError):
            auditor.load_passwords()

    def test_properties(self):
        self._create_file(["abc", "abc", "123"])
        auditor = PasswordAuditor(self.test_file).load_passwords()
        self.assertEqual(auditor.password_count, 3)
        self.assertEqual(auditor.unique_count, 2)
        self.assertEqual(auditor.duplicate_count, 1)


class TestAuditReport(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()
        self.pwd_file = os.path.join(self.temp_dir, "passwords.txt")
        self.report_file = os.path.join(self.temp_dir, "report.txt")
        with open(self.pwd_file, 'w') as f:
            f.write("Hello123\nabc\n")

    def test_generate_report(self):
        auditor = PasswordAuditor(self.pwd_file).load_passwords()
        report = AuditReport(auditor, self.report_file)
        path = report.generate()
        self.assertTrue(os.path.exists(path))
        with open(path, 'r') as f:
            content = f.read()
        self.assertIn("PASSWORD AUDIT REPORT", content)

    def test_report_contains_expected_sections(self):
        auditor = PasswordAuditor(self.pwd_file).load_passwords()
        report = AuditReport(auditor, self.report_file)
        path = report.generate()
        with open(path, 'r') as f:
            content = f.read()
        self.assertIn("PASSWORD AUDIT DETAILS", content)
        self.assertIn("SUMMARY BY STRENGTH", content)
        self.assertIn("ALL RESULTS (Tuples)", content)
        self.assertIn("END OF REPORT", content)

    def test_report_write_error(self):
        auditor = PasswordAuditor(self.pwd_file).load_passwords()
        report = AuditReport(auditor, "/invalid/path/report.txt")
        with self.assertRaises(IOError):
            report.generate()


class TestSyllabusTopics(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp_dir = tempfile.mkdtemp()
        cls.pwd_file = os.path.join(cls.temp_dir, "passwords.txt")
        with open(cls.pwd_file, 'w') as f:
            f.write("Hello123\n")

    def test_inheritance_hierarchy(self):
        self.assertTrue(issubclass(LengthCheck, PasswordCheck))
        self.assertTrue(issubclass(ComplexityCheck, PasswordCheck))
        self.assertTrue(issubclass(PatternCheck, PasswordCheck))

    def test_abstraction_enforced(self):
        with self.assertRaises(TypeError):
            PasswordCheck()

    def test_polymorphism(self):
        checks = [LengthCheck(), ComplexityCheck(), PatternCheck()]
        for check in checks:
            result = check.run_check("Test@123")
            self.assertIsInstance(result, tuple)
            self.assertEqual(len(result), 2)

    def test_encapsulation_private_members(self):
        pw = Password("Test@123")
        self.assertFalse(hasattr(pw, '_score'))

    def test_variable_types(self):
        pw = Password("Test@123").analyze()
        self.assertIsInstance(pw.password, str)
        self.assertIsInstance(pw.score, int)
        self.assertIsInstance(pw.is_duplicate, bool)

    def test_conditional_present_in_strength(self):
        pw = Password("Test@123").analyze()
        self.assertIn(pw.strength, ("Strong", "Medium", "Weak"))

    def test_file_handling(self):
        self.assertTrue(os.path.exists(self.pwd_file))
        with open(self.pwd_file, 'r') as f:
            content = f.read()
        self.assertIsInstance(content, str)

    def test_frozenset_immutable(self):
        fs = PatternCheck.WEAK_PATTERNS
        self.assertIsInstance(fs, frozenset)


if __name__ == "__main__":
    unittest.main()
