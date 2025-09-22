import numpy as np
import mediapipe as mp

class FaceShapeAnalyzer:
    def __init__(self):
        # key facial landmark indices for MediaPipe 468 landmarks
        self.FACE_OUTLINE = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109]
        self.LEFT_EYE_OUTER = 33
        self.RIGHT_EYE_OUTER = 362
        self.NOSE_TIP = 1
        self.CHIN = 18
        self.FOREHEAD = 9
        self.LEFT_CHEEK = 116
        self.RIGHT_CHEEK = 345
        
    def calculate_face_measurements(self, landmarks):
        """Calculate key facial measurements from landmarks"""
        # convert landmarks to numpy array
        points = np.array([[lm.x, lm.y] for lm in landmarks.landmark])
        
        # face width (distance between outer eye corners)
        face_width = np.linalg.norm(points[self.LEFT_EYE_OUTER] - points[self.RIGHT_EYE_OUTER])
        
        # face length (forehead to chin)
        face_length = np.linalg.norm(points[self.FOREHEAD] - points[self.CHIN])
        
        # jaw width (approximate using cheek points)
        jaw_width = np.linalg.norm(points[self.LEFT_CHEEK] - points[self.RIGHT_CHEEK])
        
        # cheekbone width (using eye outer corners as proxy)
        cheekbone_width = face_width
        
        # forehead width (approximate using face outline points)
        forehead_left = points[21]  # left forehead point
        forehead_right = points[251]  # right forehead point
        forehead_width = np.linalg.norm(forehead_left - forehead_right)
        
        return {
            'face_width': face_width,
            'face_length': face_length,
            'jaw_width': jaw_width,
            'cheekbone_width': cheekbone_width,
            'forehead_width': forehead_width
        }
    
    def classify_face_shape(self, measurements):
        """Classify face shape based on measurements"""
        face_ratio = measurements['face_length'] / measurements['face_width']
        jaw_to_cheek_ratio = measurements['jaw_width'] / measurements['cheekbone_width']
        forehead_to_cheek_ratio = measurements['forehead_width'] / measurements['cheekbone_width']
        
        # classification logic based on ratios
        if 1.2 <= face_ratio <= 1.3:
            if 0.8 <= jaw_to_cheek_ratio <= 1.0:
                return "oval"
            elif jaw_to_cheek_ratio < 0.8:
                return "heart"
            else:
                return "square"
        elif face_ratio < 1.2:
            if jaw_to_cheek_ratio > 0.9:
                return "round"
            else:
                return "heart"
        else:  # face_ratio > 1.3
            if jaw_to_cheek_ratio > 0.9:
                return "oblong"
            else:
                return "diamond"
    
    def analyze_face(self, face_landmarks):
        """Main analysis function"""
        measurements = self.calculate_face_measurements(face_landmarks)
        face_shape = self.classify_face_shape(measurements)
        
        return {
            'face_shape': face_shape,
            'measurements': measurements,
            'ratios': {
                'face_ratio': measurements['face_length'] / measurements['face_width'],
                'jaw_to_cheek': measurements['jaw_width'] / measurements['cheekbone_width'],
                'forehead_to_cheek': measurements['forehead_width'] / measurements['cheekbone_width']
            }
        }