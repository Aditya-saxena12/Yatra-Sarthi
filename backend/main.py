import sys
import os

# --- SURGEON'S PATCH FOR PYTHON 3.9.0 TYPING BUG ---
# Fixes "TypeError: unhashable type: 'list'" by patching typing.py in memory
import typing
if not hasattr(typing, "_patched_unhashable"):
    original_union_hash = typing._UnionGenericAlias.__hash__
    def patched_hash(self):
        try:
            return original_union_hash(self)
        except TypeError:
            return hash(tuple(self.__args__))
    typing._UnionGenericAlias.__hash__ = patched_hash
    typing._patched_unhashable = True
# --------------------------------------------------

# Ensure roaming site-packages are in path
user_site = os.path.expanduser('~\\AppData\\Roaming\\Python\\Python39\\site-packages')
if user_site not in sys.path:
    sys.path.append(user_site)

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import uuid
from pydantic import BaseModel

from database import engine, get_db
from models import Base, ChatSession, ChatMessage
from agent import get_travel_agent, vectorstore

# Initialize DB on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Yatra Sarthi API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    session_id: str
    message: str

def init_rag_data():
    try:
        data = vectorstore.get()
        ids = data.get('ids') if data else []
        if not ids:
            travel_info = [
                "Cancellation: Flights usually allow 24-hr refunds.",
                "Kerala: Best visited between September and March.",
                "Train Rules: Rajdhani/Shatabdi do not have Sleeper class.",
                "Baggage: Most domestic flights allow 15kg check-in."
            ]
            vectorstore.add_texts(travel_info)
    except Exception as e:
        print(f"RAG_INIT_WARNING: {str(e)}")

@app.on_event("startup")
async def startup_event():
    init_rag_data()

@app.post("/session")
def create_session(db: Session = Depends(get_db)):
    try:
        session_id = str(uuid.uuid4())
        new_session = ChatSession(id=session_id)
        db.add(new_session)
        db.commit()
        return {"session_id": session_id}
    except Exception as e:
        print(f"SESSION_ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail="COULD_NOT_CREATE_SESSION")

@app.post("/chat")
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    session = db.query(ChatSession).filter(ChatSession.id == request.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="SESSION_NOT_FOUND")

    user_msg = ChatMessage(session_id=request.session_id, role="user", content=request.message)
    db.add(user_msg)
    db.commit()

    # Context history
    history = db.query(ChatMessage).filter(ChatMessage.session_id == request.session_id).all()
    chat_history = []
    for h in history[:-1]:
        chat_history.append(("human" if h.role == "user" else "ai", h.content))

    agent = get_travel_agent()
    try:
        response = agent.invoke({"input": request.message, "chat_history": chat_history})
        output = response["output"]
    except Exception as e:
        output = f"I am experiencing a momentary link interruption. Error: {str(e)}"

    bot_msg = ChatMessage(session_id=request.session_id, role="bot", content=output)
    db.add(bot_msg)
    db.commit()

    return {"response": output}

@app.get("/history/{session_id}")
def get_history(session_id: str, db: Session = Depends(get_db)):
    messages = db.query(ChatMessage).filter(ChatMessage.session_id == session_id).all()
    return [{"role": m.role, "content": m.content} for m in messages]
