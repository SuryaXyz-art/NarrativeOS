import sys, os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from main import app  # noqa: E402  (ASGI app served by Vercel Python runtime)
