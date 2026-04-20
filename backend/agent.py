import os
from langchain_groq import ChatGroq
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.tools import tool
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from dotenv import load_dotenv

load_dotenv()

# Embedding and Vector Store Setup
embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
vectorstore = Chroma(persist_directory="./data/chroma_db", embedding_function=embeddings)

@tool
def search_knowledge(query: str):
    """Searches travel policies and booking rules."""
    docs = vectorstore.similarity_search(query, k=3)
    return "\n".join([d.page_content for d in docs])

def get_travel_agent():
    # Performance-optimized Llama 3 for structured travel dialog
    llm = ChatGroq(
        temperature=0.2, 
        model_name="llama3-70b-8192",
        groq_api_key=os.getenv("GROQ_API_KEY")
    )

    # STRICT INSTRUCTIONS for Yatra Sarthi's guided booking flow
    system_prompt = """You are Yatra Sarthi, a specialized travel assistant. 
    You must follow a strict step-by-step sequence for collecting data. 
    Do not ask multiple questions at once.
    
    FLIGHT_BOOKING_SEQUENCE:
    1. Ask Source and Destination.
    2. Ask Number of Persons.
    3. Ask Class (Economy or Business).
    4. Ask Date of Travel.
    5. Ask for their Email ID. (The system will handle validation).

    TRAIN_BOOKING_SEQUENCE:
    1. Ask Source and Destination.
    2. Ask Number of Persons.
    3. Ask Date of Travel.
    4. Ask Class: Sleeper, 3AC, 2AC, 1AC, CC, or EC.
    
    STRICT_TRAIN_VALIDATION:
    - If the user mentions 'Rajdhani' or 'Shatabdi' and chooses 'Sleeper' class, you MUST say: 
      'ERROR: The selected train (Rajdhani/Shatabdi) does not have a Sleeper class. 
      Please select a valid class: 3AC, 2AC, 1AC, CC, or EC.'
    
    GREETING:
    - Always greet with a respectful, high-end 'Sarthi' tone.
    - Once the email is collected, acknowledge it and conclude the booking.
    """

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ])

    tools = [search_knowledge]
    agent = create_openai_functions_agent(llm, tools, prompt)
    return AgentExecutor(agent=agent, tools=tools, verbose=True)
