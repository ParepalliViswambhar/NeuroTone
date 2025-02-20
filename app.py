import os
import numpy as np
import librosa
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

model = tf.keras.models.load_model("sound_to_emotion_model3.keras")
emotion_labels = ['sadness', 'fear','happiness', 'anger','neutral' , 'surprise','disgust']

def augment_audio(y, sr):
    y = y + 0.005 * np.random.randn(len(y))
    return np.roll(y, shift=int(sr * 0.1))

def extract_features(file_path, max_length=100):
    y, sr = librosa.load(file_path, sr=22050)
    y = augment_audio(y, sr)
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=64)
    pad_width = max_length - mfccs.shape[1]
    if pad_width > 0:
        mfccs = np.pad(mfccs, pad_width=((0, 0), (0, pad_width)), mode="constant")
    else:
        mfccs = mfccs[:, :max_length]
    return mfccs[..., np.newaxis]

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files["file"]
    filename = secure_filename(file.filename)
    file_path = os.path.join("uploads", filename)
    file.save(file_path)

    features = extract_features(file_path)
    features = np.expand_dims(features, axis=0)

    predictions = model.predict(features)[0]
    emotion_index = np.argmax(predictions)
    predicted_emotion = emotion_labels[emotion_index]
    
    os.remove(file_path)
    
    return jsonify({
        "emotion": predicted_emotion,
        "probabilities": {emotion_labels[i]: float(predictions[i]) for i in range(len(predictions))}
    })

if __name__ == "__main__":
    app.run(port=5000)
