import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from pydantic.functional_validators import BeforeValidator
from typing_extensions import Annotated

# Reusable typing for MongoDB ObjectIds in Pydantic models
PyObjectId = Annotated[str, BeforeValidator(str)]

class ResumeAnalysis(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    filename: str
    raw_text: str
    score: int
    roast: str
    missing_keywords: List[str]
    client_ip: Optional[str] = None
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
