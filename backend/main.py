from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users_auth_api, blogs_api

app = FastAPI()

origins = ["https://nlarrea.github.io"]

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