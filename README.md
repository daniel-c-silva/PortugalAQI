# Portugal AQI

**A real-time map displaying the AQI of portuguese cities.**

## Features

* Air quality display 

* Multiple cities

* AI infromation on the city, it's aqi and industry type

* time of last AQI update

## Tech Stack

- **Frontend:** React
- **Backend:** Flask + WAQI API + MISTRAL AI

## Live demo

[https://portugal-aqi.vercel.app](https://portugal-aqi.vercel.app)


## How to Run Locally

Prerequisites: Python 3.8+, Node.js, npm

### Backend Setup
```
cd backend
pip install -r requirements.txt

# run the flask sv:

python main.py => Windows/Linux
python3 main.py => on macOS
```


## Frontend Setup
```
cd frontend
npm install
npm start
```


## Conclusion

This was my last full stack project in awhile, I think because I am going to start learning C and foccusing more on it specifically.

it was my first time integrating AI ever since last summer and I decided on using mistral for various reasons and honestly while the model is clearly not as advanced

as gpt-4-o-mini it works pretty well and is very good for small projects like these, specially when trying to deploy. I might even migrate my other projects.

this helped me sink even deeper into my api integration skills, though react was tougher I need a new challenge.


I'll add more features in a small bit.

