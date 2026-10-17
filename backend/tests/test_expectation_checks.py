import unittest

from backend.tests.expectation_checks import assert_matches


class TestExpectationChecks(unittest.TestCase):
    def setUp(self):
        self.actual = {
            "game_id": "th6",
            "stage_details": [
                {"stage": 1, "score": 100, "power": 128},
                {"stage": 3, "score": 300, "power": 64},
            ],
        }

    def test_partial_fields_and_stage_numbers(self):
        assert_matches(self, self.actual, {
            "game_id": "th6", "stage_details": [{"stage": 3, "score": 300}],
        })

    def test_wrong_score_reports_case_stage_and_field(self):
        with self.assertRaisesRegex(AssertionError, r"sample.*stage=3.*score"):
            assert_matches(self, self.actual, {
                "stage_details": [{"stage": 3, "score": 999}],
            }, "sample")

    def test_missing_stage_fails(self):
        with self.assertRaisesRegex(AssertionError, "missing stage 2"):
            assert_matches(self, self.actual, {"stage_details": [{"stage": 2}]})

    def test_missing_field_fails_even_when_expected_null(self):
        with self.assertRaisesRegex(AssertionError, "missing field"):
            assert_matches(self, self.actual, {"unknown": None})

    def test_duplicate_expected_stage_fails(self):
        with self.assertRaisesRegex(AssertionError, "duplicate expected stage 1"):
            assert_matches(self, self.actual, {"stage_details": [{"stage": 1}, {"stage": 1}]})

    def test_numeric_string_is_not_a_number(self):
        with self.assertRaisesRegex(AssertionError, "value type"):
            assert_matches(self, self.actual, {"stage_details": [{"stage": 1, "score": "100"}]})

    def test_empty_containers_match_only_empty_values(self):
        assert_matches(self, {"stage_details": [], "metadata": {}}, {
            "stage_details": [], "metadata": {},
        }, exact=True)
        for actual, expected in (([1], []), ({"key": 1}, {})):
            with self.subTest(actual=actual):
                with self.assertRaises(AssertionError):
                    assert_matches(self, actual, expected)

    def test_exact_comparison_accepts_all_fields(self):
        assert_matches(self, self.actual, self.actual, exact=True)

    def test_exact_comparison_rejects_missing_fields_and_stages(self):
        for expected in (
            {"game_id": "th6"},
            {"game_id": "th6", "stage_details": [
                {"stage": 1, "score": 100, "power": 128},
            ]},
            {"game_id": "th6", "stage_details": [
                {"stage": 1, "score": 100},
                {"stage": 3, "score": 300, "power": 64},
            ]},
        ):
            with self.subTest(expected=expected):
                with self.assertRaises(AssertionError):
                    assert_matches(self, self.actual, expected, exact=True)

    def test_nested_values_null_and_booleans(self):
        actual = {"metadata": {"enabled": True, "optional": None, "values": [1, 2]}}
        assert_matches(self, actual, actual, exact=True)
        with self.assertRaisesRegex(AssertionError, "value type"):
            assert_matches(self, actual, {"metadata": {"enabled": 1}})
