import unittest
from app.main import health_check
from app.schemas import InferenceRequest
from app.inference import detector


class TestAIService(unittest.TestCase):
    def test_health_check(self):
        response = health_check()
        self.assertEqual(response.status, "healthy")
        self.assertEqual(response.service, "UrbanFix AI Service")
        self.assertEqual(response.version, "1.0.0")

    def test_mock_inference(self):
        req = InferenceRequest(category_hint="Pothole")
        res = detector.predict(req)
        self.assertEqual(res.issue_type, "Pothole")
        self.assertGreater(res.confidence, 0.8)


if __name__ == "__main__":
    unittest.main()
