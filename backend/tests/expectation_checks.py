"""Compare selected replay fields, matching stage entries by their stage number."""

from unittest import TestCase


def assert_matches(
    test: TestCase, actual, expected, path: str = "result", *, exact: bool = False
) -> None:
    if isinstance(expected, dict):
        test.assertIsInstance(actual, dict, path)
        if exact:
            test.assertEqual(set(actual), set(expected), f"{path}: field names")
        if not expected:
            test.assertEqual(actual, expected, path)
        for key, value in expected.items():
            test.assertIn(key, actual, f"{path}: missing field {key!r}")
            assert_matches(test, actual[key], value, f"{path}.{key}", exact=exact)
    elif isinstance(expected, list):
        test.assertIsInstance(actual, list, path)
        if not expected:
            test.assertEqual(actual, expected, path)
            return
        if path.endswith(".stage_details"):
            actual_stages = {}
            for entry in actual:
                test.assertIsInstance(entry, dict, path)
                test.assertIn("stage", entry, path)
                stage = entry["stage"]
                test.assertNotIn(stage, actual_stages, f"{path}: duplicate actual stage {stage}")
                actual_stages[stage] = entry
            seen = set()
            for entry in expected:
                test.assertIsInstance(entry, dict, path)
                test.assertIn("stage", entry, f"{path}: expected stage number is required")
                stage = entry["stage"]
                test.assertIs(type(stage), int, f"{path}: stage must be an integer")
                test.assertNotIn(stage, seen, f"{path}: duplicate expected stage {stage}")
                seen.add(stage)
                test.assertIn(stage, actual_stages, f"{path}: missing stage {stage}")
                assert_matches(
                    test, actual_stages[stage], entry,
                    f"{path}[stage={stage}]", exact=exact,
                )
            if exact:
                test.assertEqual(set(actual_stages), seen, f"{path}: stage numbers")
        else:
            test.assertEqual(len(actual), len(expected), f"{path}: list length")
            for index, value in enumerate(expected):
                assert_matches(test, actual[index], value, f"{path}[{index}]", exact=exact)
    else:
        test.assertIs(type(actual), type(expected), f"{path}: value type")
        test.assertEqual(actual, expected, path)
