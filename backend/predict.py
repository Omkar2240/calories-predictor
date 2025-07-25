import sys
import joblib
import json
import numpy as np

# Load the model
model = joblib.load("xgb_calories_model.jb")

# Parse input from Node.js
input_data = json.loads(sys.argv[1])

# Convert to proper order: [Gender, Age, Height, Weight, Duration, Heart_Rate, Body_Temp]
features = np.array([[
    input_data["Gender"],
    input_data["Age"],
    input_data["Height"],
    input_data["Weight"],
    input_data["Duration"],
    input_data["Heart_Rate"],
    input_data["Body_Temp"]
]])

# Predict
prediction = model.predict(features)
print(prediction[0])