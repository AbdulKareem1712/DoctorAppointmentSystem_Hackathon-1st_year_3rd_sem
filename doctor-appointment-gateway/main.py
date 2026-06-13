import os
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import httpx
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Doctor Appointment API Gateway")

# Allow frontend to access the gateway
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8082")
TIMEOUT = httpx.Timeout(30.0, connect=10.0)

# Create a single client to be reused for connection pooling
client = httpx.AsyncClient(base_url=BACKEND_URL, timeout=TIMEOUT)

@app.on_event("shutdown")
async def shutdown_event():
    await client.aclose()

@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
async def proxy(request: Request, path: str):
    # Prepare URL
    url = httpx.URL(path=request.url.path, query=request.url.query.encode("utf-8"))
    
    # Prepare headers 
    headers = dict(request.headers)
    # Remove host header so httpx can set the correct one for the target
    headers.pop("host", None)
    
    # Prepare content
    content = await request.body()
    
    # Make request to backend
    response = await client.request(
        method=request.method,
        url=url,
        headers=headers,
        content=content,
    )
    
    # Exclude headers that might cause issues when returning from proxy
    excluded_headers = ["content-encoding", "content-length", "transfer-encoding", "connection"]
    response_headers = {
        name: value
        for name, value in response.headers.items()
        if name.lower() not in excluded_headers
    }
    
    return Response(
        content=response.content,
        status_code=response.status_code,
        headers=response_headers,
    )
