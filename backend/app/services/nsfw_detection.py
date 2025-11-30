"""
NSFW Image Detection Service
Uses NudeNet to detect inappropriate content in images
"""
from nudenet import NudeDetector
from typing import Dict
import os


from app.core.config import settings

class NSFWDetectionService:
    def __init__(self):
        """Initialize the NSFW detector"""
        self.detector = None
        if settings.ENABLE_HEAVY_MODELS:
            try:
                self.detector = NudeDetector()
                print("NudeNet detector loaded successfully")
            except Exception as e:
                print(f"Failed to load NudeNet detector: {e}")
        else:
            print("Heavy models disabled: NudeNet detector skipped")
        
        # NSFW labels that should trigger blur
        self.nsfw_labels = [
            'FEMALE_GENITALIA_EXPOSED',
            'MALE_GENITALIA_EXPOSED',
            'FEMALE_BREAST_EXPOSED',
            'BUTTOCKS_EXPOSED',
            'ANUS_EXPOSED'
        ]
    
    async def detect_nsfw(self, image_path: str) -> Dict:
        """
        Detect NSFW content in an image
        
        Args:
            image_path: Path to the image file
            
        Returns:
            dict with:
                - is_nsfw: bool
                - confidence: float (0-1)
                - labels: list of detected NSFW labels
                - all_detections: full detection results
        """
        if not self.detector:
            return {
                'is_nsfw': False,
                'confidence': 0.0,
                'labels': [],
                'all_detections': [],
                'skipped': True
            }

        try:
            # Run detection
            detections = self.detector.detect(image_path)
            
            # Check if any NSFW labels were detected
            nsfw_detections = []
            max_confidence = 0.0
            
            for detection in detections:
                label = detection['class']
                confidence = detection['score']
                
                if label in self.nsfw_labels and confidence > 0.6:  # 60% threshold
                    nsfw_detections.append({
                        'label': label,
                        'confidence': confidence
                    })
                    max_confidence = max(max_confidence, confidence)
            
            is_nsfw = len(nsfw_detections) > 0
            
            return {
                'is_nsfw': is_nsfw,
                'confidence': max_confidence,
                'labels': [d['label'] for d in nsfw_detections],
                'all_detections': detections
            }
            
        except Exception as e:
            print(f"NSFW detection error: {str(e)}")
            # On error, assume safe to avoid blocking legitimate content
            return {
                'is_nsfw': False,
                'confidence': 0.0,
                'labels': [],
                'all_detections': [],
                'error': str(e)
            }


# Singleton instance
nsfw_detection_service = NSFWDetectionService()
