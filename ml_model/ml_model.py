from flask import Flask, request, jsonify
import numpy as np

app = Flask(__name__)


def predict_water_quality(features):
    """
    Dummy function to simulate predictions.
    Replace this with your trained ML model's prediction logic.
    """
    predicted_quality = sum(features)
    return predicted_quality

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        features = data['features']
        
        if not isinstance(features, list) or len(features) != 3:
            return jsonify({"error": "Invalid input. Expected a list of 3 features."}), 400
        
        features_array = np.array(features)
        prediction = predict_water_quality(features_array)
        
        return jsonify({"predicted_quality": prediction})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    
    app.run(host='0.0.0.0', port=5001)
