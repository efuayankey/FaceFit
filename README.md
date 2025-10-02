# FaceFit 👓

AI-powered face shape analysis and glasses recommendation system.

**Upload photo → Get face shape → Receive glasses recommendations**

## Features
- MediaPipe face detection (468 landmarks)
- 6 face shape categories
- Smart glasses recommendations with confidence scores
- Camera integration + drag-and-drop upload

## Tech Stack
- **Backend:** Python, Flask, MediaPipe, OpenCV
- **Frontend:** React, TypeScript, Tailwind CSS

## Quick Start

**Backend:**
```bash
git clone https://github.com/efuayankey/FaceFit.git
cd FaceFit
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python backend/app.py
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

Visit `http://localhost:3000`

## API
- `GET /health` - Health check
- `POST /analyze` - Face analysis (multipart image upload)

## License
MIT