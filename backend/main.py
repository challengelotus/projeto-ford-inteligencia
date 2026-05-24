from .controllers import auth_controller as auth

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

from .utils.helpers import limiter
from .controllers import vehicle_controller
from contextlib import asynccontextmanager
from dotenv import load_dotenv

from .models.database import init_db
from .controllers import user_controller, vehicle_controller, history_controller

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()	
    yield

app = FastAPI(title="Ford Commercial Intelligence", lifespan=lifespan)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(user_controller.router)
app.include_router(vehicle_controller.router)
app.include_router(history_controller.router)
app.include_router(auth.router, prefix="/auth")