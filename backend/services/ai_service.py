import os
import json
from openai import AsyncOpenAI
import logging

logging.basicConfig(level=logging.INFO)

# Initialize OpenAI Client (Requires OPENAI_API_KEY env)
api_key = os.getenv("OPENAI_API_KEY")

async def generate_resume_roast(resume_text: str) -> dict:
    """
    Sends the resume text to OpenAI and generates a brutally honest "roast",
    an ATS score, and missing keywords.
    """
    if not api_key:
        logging.warning("OPENAI_API_KEY is missing. Returning mock data.")
        return {
            "score": 38,
            "roast": "This might be a good resume, but my AI circuits are offline. PLEASE ADD AN OPENAI API KEY to backend/.env to see the real roast.",
            "missing_keywords": ["OpenAI_Key", "Backend", "Env_Var"]
        }

    client = AsyncOpenAI(api_key=api_key)
    
    prompt = f"""
    You are a brutally honest, senior tech recruiter and AI ATS system.
    Analyze the following resume text and provide:
    1. A 'score' out of 100 based on how well it gets past an ATS and overall impact.
    2. A short, brutal, but constructive 'roast' (2-3 sentences) on why it might fail.
    3. An array of up to 5 'missing_keywords' or weak points.
    
    Return ONLY a valid JSON object with the keys: "score" (integer), "roast" (string), "missing_keywords" (list of strings).
    
    RESUME TEXT:
    {resume_text[:5000]}
    """
    
    try:
        completion = await client.chat.completions.create(
            model="gpt-4o-mini",
            response_format={ "type": "json_object" },
            messages=[
                {"role": "system", "content": "You are a JSON-only API that analyzes resumes."},
                {"role": "user", "content": prompt}
            ]
        )
        
        result_content = completion.choices[0].message.content
        return json.loads(result_content)
        
    except Exception as e:
        logging.error(f"OpenAI API Error: {e}")
        return {
            "score": 0,
            "roast": f"Failed to connect to OpenAI API: {str(e)}",
            "missing_keywords": ["API_ERROR"]
        }
