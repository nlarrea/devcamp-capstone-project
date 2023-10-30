from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users_auth_api, blogs_api

# SQLite tutorial (Python, FastAPI and React connection)
# https://www.youtube.com/watch?v=0zb2kohYZIM
#
# PostgreSQL with FastAPI documentation
# https://medium.com/@arturocuicas/fastapi-with-postgresql-part-1-70a3960fb6ee
#
# User registration (FastAPI & React)
# https://www.youtube.com/watch?v=O61aRPSuemE

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http:127.0.0.1:3000",
    "localhost:3000",
    "https://nlarrea.github.io"
]

# Routers
app.include_router(users_auth_api.router)
app.include_router(blogs_api.router)

app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
)