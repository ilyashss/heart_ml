from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="Heart Stroke Prediction API"
)

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:3000"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# Load model files
model = joblib.load("KNN_heart.pkl")
scaler = joblib.load("scaler.pkl")
expected_columns = joblib.load("columns.pkl")


# Input schema
class HeartInput(BaseModel):
    Age: int
    Sex: str
    ChestPainType: str
    RestingBP: int
    Cholesterol: int
    FastingBS: int
    RestingECG: str
    MaxHR: int
    ExerciseAngina: str
    Oldpeak: float
    ST_Slope: str



@app.get("/")
def home():
    return {
        "message": "Heart Stroke Prediction API Running"
    }



@app.post("/predict")
def predict(data: HeartInput):

    # Create raw input
    raw_input = {

        "Age": data.Age,
        "RestingBP": data.RestingBP,
        "Cholesterol": data.Cholesterol,
        "FastingBS": data.FastingBS,
        "MaxHR": data.MaxHR,
        "Oldpeak": data.Oldpeak,

        "Sex_" + data.Sex: 1,

        "ChestPainType_" + data.ChestPainType: 1,

        "RestingECG_" + data.RestingECG: 1,

        "ExerciseAngina_" + data.ExerciseAngina: 1,

        "ST_Slope_" + data.ST_Slope: 1
    }


    # dataframe
    input_df = pd.DataFrame([raw_input])


    # Add missing encoded columns
    for col in expected_columns:
        if col not in input_df.columns:
            input_df[col] = 0


    # same order as training
    input_df = input_df[expected_columns]


    # scaling
    scaled_input = scaler.transform(input_df)


    # prediction
    prediction = model.predict(scaled_input)[0]


    if prediction == 1:
        result = "High Risk of Heart Disease"
    else:
        result = "Low Risk of Heart Disease"


    return {
        "prediction": int(prediction),
        "result": result
    }