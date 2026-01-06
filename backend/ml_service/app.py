# -*- coding: utf-8 -*-
import os
import sys
import numpy as np
import librosa
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

# Set UTF-8 encoding for Windows console
if sys.platform == "win32":
    import codecs
    sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())
    sys.stderr = codecs.getwriter("utf-8")(sys.stderr.detach())

app = Flask(__name__)
CORS(app)

# Load the trained model
MODEL_PATH = os.path.join(os.path.dirname(__file__),"sound_to_emotion_model3.keras")
model = tf.keras.models.load_model(MODEL_PATH)

# Emotion labels matching the model output
emotion_labels = ['sadness', 'fear', 'happiness', 'anger', 'neutral', 'surprise', 'disgust']

# Upload folder for temporary audio files
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "temp_uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def augment_audio(y, sr):
    """Apply audio augmentation"""
    y = y + 0.005 * np.random.randn(len(y))
    return np.roll(y, shift=int(sr * 0.1))

def extract_features(file_path, max_length=100):
    """Extract MFCC features from audio file"""
    try:
        y, sr = librosa.load(file_path, sr=22050)
        y = augment_audio(y, sr)
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=64)
        
        # Pad or truncate to fixed length
        pad_width = max_length - mfccs.shape[1]
        if pad_width > 0:
            mfccs = np.pad(mfccs, pad_width=((0, 0), (0, pad_width)), mode="constant")
        else:
            mfccs = mfccs[:, :max_length]
        
        return mfccs[..., np.newaxis]
    except Exception as e:
        raise Exception(f"Error extracting features: {str(e)}")

@app.route("/", methods=["GET"])
def home():
    """Health check endpoint"""
    return jsonify({
        "service": "Emotion Detection ML Service",
        "status": "running",
        "model": "sound_to_emotion_model3.keras",
        "emotions": emotion_labels
    })

@app.route("/predict", methods=["POST"])
def predict():
    """Predict emotion from audio file"""
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files["file"]
    
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    try:
        # Save uploaded file temporarily
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)

        # Extract features and predict
        features = extract_features(file_path)
        features = np.expand_dims(features, axis=0)

        predictions = model.predict(features, verbose=0)[0]
        emotion_index = np.argmax(predictions)
        predicted_emotion = emotion_labels[emotion_index]
        
        # Clean up temporary file
        if os.path.exists(file_path):
            os.remove(file_path)
        
        # Return prediction results
        return jsonify({
            "emotion": predicted_emotion,
            "probabilities": {
                emotion_labels[i]: float(predictions[i]) 
                for i in range(len(predictions))
            },
            "confidence": float(predictions[emotion_index])
        })
    
    except Exception as e:
        # Clean up on error
        if 'file_path' in locals() and os.path.exists(file_path):
            os.remove(file_path)
        
        print(f"❌ Prediction Error: {str(e)}")
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

if __name__ == "__main__":
    print("=" * 42)
    print("   ML Emotion Detection Service")
    print("=" * 42)
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting Flask ML service on port {port}")
    print(f"Model: {MODEL_PATH}")
    print(f"Emotions: {', '.join(emotion_labels)}")
    print("=" * 42)
    app.run(host="0.0.0.0", port=port, debug=False)
