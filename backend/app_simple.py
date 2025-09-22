from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

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
        
        # simple face detection using OpenCV Haar cascades (fallback)
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)
        
        if len(faces) == 0:
            return jsonify({"error": "No face detected in image"}), 400
        
        # mock analysis for testing (since we can't use MediaPipe yet)
        face_shape = "oval"  # default for testing
        
        # mock recommendations
        recommendations = [
            {
                "style": "aviator",
                "name": "Classic Aviator",
                "description": "Timeless teardrop shape with thin metal frames",
                "reason": "Balances strong jawlines and adds width to narrow faces - Oval faces can wear almost any style. Maintain the natural balance.",
                "confidence": 0.9
            },
            {
                "style": "wayfarer",
                "name": "Wayfarer",
                "description": "Trapezoidal frame shape, slightly wider at top",
                "reason": "Versatile style that works with most face shapes - Oval faces can wear almost any style. Maintain the natural balance.",
                "confidence": 0.9
            },
            {
                "style": "rectangular",
                "name": "Rectangular Frames",
                "description": "Straight lines and sharp angles",
                "reason": "Adds structure and definition to soft face shapes - Oval faces can wear almost any style. Maintain the natural balance.",
                "confidence": 0.8
            }
        ]
        
        return jsonify({
            "success": True,
            "face_shape": face_shape,
            "recommendations": recommendations,
            "faces_detected": len(faces),
            "note": "Using simplified detection - MediaPipe integration pending"
        })
    
    except Exception as e:
        return jsonify({"error": f"Processing failed: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)