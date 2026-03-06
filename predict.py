import sys
import joblib
import numpy as np

def predict():
    try:
        # Model path
        model_path = 'C:/Users/Pavithra R/OneDrive/Desktop/CropYieldProject/ai-engine/crop_model.pkl'
        model = joblib.load(model_path)
        
        # Inputs from Java
        inputs = [float(arg) for arg in sys.argv[1:]]
        features = np.array([inputs])
        
        # Prediction
        prediction = model.predict(features)
        print(round(prediction[0], 2))

    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    predict()

