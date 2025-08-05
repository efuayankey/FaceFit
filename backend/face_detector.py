import cv2
import mediapipe as mp
import numpy as np

class FaceShapeDetector:
    def __init__(self):
        print("🚀 Initializing Face Shape Detector...")
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            static_image_mode=True,
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5
        )
        print("MediaPipe initialized!")
    
    def calculate_face_shape(self, landmarks):
        """Calculate face shape from facial landmarks"""
        # Key landmark points for face shape analysis
        # Forehead width (points 10, 151)
        # Jaw width (points 172, 397) 
        # Face length (points 10, 152)
        # Cheekbone width (points 234, 454)
        
        forehead_left = landmarks[10]
        forehead_right = landmarks[151]
        jaw_left = landmarks[172]
        jaw_right = landmarks[397]
        face_top = landmarks[10]
        face_bottom = landmarks[152]
        cheek_left = landmarks[234]
        cheek_right = landmarks[454]
        
        # calculate measurements
        face_width = abs(forehead_right[0] - forehead_left[0])
        face_length = abs(face_bottom[1] - face_top[1])
        jaw_width = abs(jaw_right[0] - jaw_left[0])
        cheek_width = abs(cheek_right[0] - cheek_left[0])
        
        # calculate ratios for face shape classification
        width_to_length_ratio = face_width / face_length if face_length > 0 else 0
        jaw_to_face_ratio = jaw_width / face_width if face_width > 0 else 0
        cheek_to_face_ratio = cheek_width / face_width if face_width > 0 else 0
        
        print(f"  Face Analysis:")
        print(f"   Width/Length ratio: {width_to_length_ratio:.2f}")
        print(f"   Jaw/Face ratio: {jaw_to_face_ratio:.2f}")
        print(f"   Cheek/Face ratio: {cheek_to_face_ratio:.2f}")
        
        # face shape classification logic
        if width_to_length_ratio > 0.9:
            return "round"
        elif width_to_length_ratio < 0.7:
            return "oval" 
        elif jaw_to_face_ratio > 0.95:
            return "square"
        elif cheek_to_face_ratio > 0.9 and jaw_to_face_ratio < 0.8:
            return "heart"
        else:
            return "diamond"
    
    def detect_face_shape(self, image_path):
        print(f"🔍 Analyzing face in: {image_path}")
        
        # this reads image
        image = cv2.imread(image_path)
        if image is None:
            print(f" Could not load image: {image_path}")
            return None
            
        # Convert BGR to RGB (MediaPipe uses RGB)
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Process image with MediaPipe
        results = self.face_mesh.process(rgb_image)
        
        if results.multi_face_landmarks:
            print("Face detected!")
            # Get first face landmarks
            face_landmarks = results.multi_face_landmarks[0]
            
            # Convert landmarks to pixel coordinates
            h, w, _ = image.shape
            landmarks = []
            for landmark in face_landmarks.landmark:
                x = int(landmark.x * w)
                y = int(landmark.y * h)
                landmarks.append([x, y])
            
            # Calculate face shape
            face_shape = self.calculate_face_shape(landmarks)
            print(f"Detected face shape: {face_shape.upper()}")
            return face_shape
        else:
            print("No face detected in image")
            return None

# testing
if __name__ == "__main__":
    detector = FaceShapeDetector()
    print("Face detector ready to go!")
    
    # Test with actual image
    test_image = "test_face.jpeg"  # Put your image file name here
    result = detector.detect_face_shape(test_image)
    
    if result:
        print(f" Final Result: Your face shape is {result.upper()}!")
    else:
        print(" Could not analyze face shape")