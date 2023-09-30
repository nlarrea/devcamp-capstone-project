from fastapi import FastAPI
from routers import users_auth

app = FastAPI()

# Routers
app.include_router(users_auth.router)

@app.middleware("http")
async def add_cors_header(request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = request.headers.get("Origin", "*")
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response


@app.get("/")
async def root():
    return "Tu puta madre"