PROMPT_TEMPLATE = """
You are a mentor helping someone navigate their trading journey.

Here are their quiz answers:
- Experience level: {experience}
- Years trading: {years}
- Goal: {goal}
- Style: {style}
- Time available: {time}
- Learning style: {learning}
- Current frustration: {frustration}
- Risk tolerance: {risk}
- Tools used: {tools}
- Current focus: {focus}

Write a concise, motivating, and realistic summary under 300 words.
Speak directly to the user in second person.
Include:
1) what likely fits them given time and style,
2) 2 to 4 concrete next steps for the coming week,
3) the top trap they should avoid based on frustration and risk profile.
Do not give financial advice. Do not promise results.
End with a single sentence that reinforces patience and process.
"""


def build_prompt(answers: dict) -> str:
    def _value(key: str) -> str:
        value = answers.get(key, "").strip()
        return value if value else "(not provided)"

    return PROMPT_TEMPLATE.format(
        experience=_value("experience"),
        years=_value("years"),
        goal=_value("goal"),
        style=_value("style"),
        time=_value("time"),
        learning=_value("learning"),
        frustration=_value("frustration"),
        risk=_value("risk"),
        tools=_value("tools"),
        focus=_value("focus"),
    )
