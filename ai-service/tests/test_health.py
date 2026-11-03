import unittest
from app.main import health_check, detect_issue
from app.schemas import AiAnalysisRequest, InferenceRequest
from app.inference import detector


class TestAIService(unittest.TestCase):
    def test_health_check(self):
        response = health_check()
        self.assertEqual(response.status, "healthy")
        self.assertEqual(response.service, "UrbanFix AI Service")
        self.assertEqual(response.version, "1.0.0")

    def test_pothole_detection(self):
        req = AiAnalysisRequest(
            title="Dangerous pothole on highway",
            description="Deep crater in asphalt causing wheel blowout",
            category_hint="ROADS_INFRASTRUCTURE"
        )
        res = detector.analyze(req)
        self.assertEqual(res.detected_category, "ROADS_INFRASTRUCTURE")
        self.assertEqual(res.suggested_severity, "CRITICAL")
        self.assertGreater(res.confidence, 0.90)
        self.assertTrue(res.ai_verified)
        self.assertGreater(len(res.detected_labels), 0)

    def test_garbage_detection(self):
        req = AiAnalysisRequest(
            title="Overflowing dumpster on main street",
            description="Trash and plastic waste piling up for 3 days",
            category_hint="GARBAGE"
        )
        res = detector.analyze(req)
        self.assertEqual(res.detected_category, "GARBAGE_SANITATION")
        self.assertGreater(res.confidence, 0.80)
        self.assertTrue(res.ai_verified)

    def test_waterlogging_detection(self):
        req = AiAnalysisRequest(
            title="Burst water pipeline",
            description="Flooding sidewalk with dirty sewage leakage",
        )
        res = detector.analyze(req)
        self.assertEqual(res.detected_category, "WATER_DRAINAGE")
        self.assertGreater(res.confidence, 0.85)

    def test_legacy_predict(self):
        req = InferenceRequest(category_hint="Pothole")
        res = detector.predict(req)
        self.assertIn("ROADS", res.issue_type)
        self.assertGreater(res.confidence, 0.8)


if __name__ == "__main__":
    unittest.main()
