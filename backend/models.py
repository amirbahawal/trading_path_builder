from pydantic import BaseModel

class QuizInput(BaseModel):
    experience: str = ""
    years: str = ""
    goal: str = ""
    style: str = ""
    time: str = ""
    learning: str = ""
    frustration: str = ""
    risk: str = ""
    tools: str = ""
    focus: str = ""
