from .controllers import auth_controller as auth
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .models.database import init_db
from .controllers import user_controller, vehicle_controller, history_controller

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()	
    yield

app = FastAPI(title="Ford Commercial Intelligence", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_controller.router)
app.include_router(vehicle_controller.router)
app.include_router(history_controller.router)
app.include_router(auth.router, prefix="/auth")