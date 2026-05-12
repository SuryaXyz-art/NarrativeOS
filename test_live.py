import asyncio
import os
import sys

# Add backend to path so imports work
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.services.sodex_service import SoDEXService
from backend.services.hermes_service import explain_topic

async def run():
    print("Testing SoDEX...")
    s = SoDEXService()
    movers = await s.get_top_movers()
    print("Movers:", movers)
    
    print("\nTesting Hermes...")
    res = await explain_topic("Bitcoin")
    print("Explain:", res)

asyncio.run(run())
