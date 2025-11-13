#!/usr/bin/env python3
"""
Simple test script to verify Gemini API is working
"""
import google.generativeai as genai
from app.config import settings

def test_gemini():
    try:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        # List available models first
        print("Available models:")
        for model_info in genai.list_models():
            if 'generateContent' in model_info.supported_generation_methods:
                print(f"  - {model_info.name}")
        
        model = genai.GenerativeModel("gemini-2.5-flash")
        
        test_text = "This is a test note about machine learning. Machine learning is a subset of artificial intelligence that focuses on algorithms that can learn from data."
        
        prompt = f"Please provide a brief and clear summary of the following text in 2-3 sentences:\n\n{test_text}"
        response = model.generate_content(prompt)
        
        if response and response.text:
            print(" Gemini API is working!")
            print(f"Test summary: {response.text.strip()}")
            return True
        else:
            print(" No response from Gemini API")
            return False
            
    except Exception as e:
        print(f" Gemini API Error: {str(e)}")
        return False

if __name__ == "__main__":
    test_gemini()
