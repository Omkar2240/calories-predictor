
# 🔥 Calories Burnt Predictor App

A full-stack machine learning-powered web app that predicts the number of calories burned during exercise based on user input.

This app uses:
- 🧠 A pre-trained **XGBoost Regression** model (trained in Python)
- 🌐 **Next.js** frontend for user interaction
- ⚙️ **Node.js + Express** backend that executes a **Python script** to serve predictions

---

## 🧠 ML Model Info

- Trained on the [Calories and Exercise Dataset (Kaggle)](https://www.kaggle.com/datasets/fmendes/fmendesdat263xdemos)
- Features used:
  - Gender (0: Male, 1: Female)
  - Age (years)
  - Height (cm)
  - Weight (kg)
  - Duration (minutes)
  - Heart Rate (bpm)
  - Body Temperature (°F)
- Target: `Calories` burned

Model is saved as: `xgb_calories_model.pkl`

---

## 📂 Project Structure

```
calories-predictor/
├── frontend/               # Next.js frontend
│      
├── backend/                # Node.js + Python backend
│   ├── server.js           # Express API
│   ├── predict.py          # Python model runner
│   ├── xgb_calories_model.jb  # Trained XGBoost model
├── README.md
```

---

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Omkar2240/calories-predictor.git
cd calories-predictor
```

---

### 2. Backend Setup (Node.js + Python)

```bash
cd backend
npm install  # installs express and cors
```

Make sure you have Python 3 and install dependencies:

```bash
pip install joblib xgboost scikit-learn numpy
```

Create `predict.py` in `backend/`:

```python
import sys
import joblib
import json
import numpy as np

model = joblib.load("xgb_calories_model.pkl")
input_data = json.loads(sys.argv[1])
features = np.array([[
    input_data["Gender"],
    input_data["Age"],
    input_data["Height"],
    input_data["Weight"],
    input_data["Duration"],
    input_data["Heart_Rate"],
    input_data["Body_Temp"]
]])
prediction = model.predict(features)
print(prediction[0])
```

Start the backend server:

```bash
npm run dev
```

---

### 3. Frontend Setup (Next.js)

```bash
cd ../frontend
npm install
npm run dev
```

Visit 👉 `http://localhost:3000`

---

## 🧪 Sample API Request

POST `http://localhost:8000/predict`

```json
{
  "Gender": 0,
  "Age": 25,
  "Height": 175,
  "Weight": 70,
  "Duration": 30,
  "Heart_Rate": 100,
  "Body_Temp": 98.6
}
```

Response:
```json
{
  "prediction": 235.48
}
```


---


## 👋 Made by Omkar Ramgirwar

# calories-predictor
