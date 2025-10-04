def build_prompt(answers: dict) -> str:
    prompt = "You are a trading mentor. Based on these answers, build a concise trading path:\n\n"
    for key, value in answers.items():
        prompt += f"{key.capitalize()}: {value}\n"
    prompt += "\nProvide clear guidance in 4–6 sentences."
    return prompt
