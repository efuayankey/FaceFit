from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import mediapipe as mp
from PIL import Image
import io
import base64

from face_analyzer import FaceShapeAnalyzer
from glasses_recommender import GlassesRecommender

app = Flask(__name__)
CORS(app)

# initialize MediaPipe
mp_face_mesh = mp.solutions.face_mesh
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

# initialize our custom classes
face_analyzer = FaceShapeAnalyzer()
glasses_recommender = GlassesRecommender()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "FaceFit backend is running"})

@app.route('/analyze', methods=['POST'])
def analyze_face():
    try:
        # get image from request
        if 'image' not in request.files:
            return jsonify({"error": "No image provided"}), 400
        
        image_file = request.files['image']
        
        # convert to OpenCV format
        image_bytes = image_file.read()
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            return jsonify({"error": "Invalid image format"}), 400
        
        # convert BGR to RGB for MediaPipe
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # process with MediaPipe
        with mp_face_mesh.FaceMesh(
            static_image_mode=True,
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5
        ) as face_mesh:
            results = face_mesh.process(rgb_image)
            
            if not results.multi_face_landmarks:
                return jsonify({"error": "No face detected in image"}), 400
            
            # get face landmarks
            face_landmarks = results.multi_face_landmarks[0]
            
            # analyze face shape
            analysis_result = face_analyzer.analyze_face(face_landmarks)
            face_shape = analysis_result['face_shape']
            
            # get glasses recommendations
            recommendations = glasses_recommender.get_recommendations(face_shape, num_recommendations=4)
            
            return jsonify({
                "success": True,
                "face_shape": face_shape,
                "recommendations": recommendations,
                "landmarks_detected": len(face_landmarks.landmark),
                "analysis_details": {
                    "measurements": analysis_result['measurements'],
                    "ratios": analysis_result['ratios']
                }
            })
    
    except Exception as e:
        return jsonify({"error": f"Processing failed: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)