import os
import requests
import json

if (RECAPTCHA_SECRET := os.getenv("RECAPTCHA_SECRET")) is None:
    raise ValueError("RECAPTCHA_SECRET is not defineded")


def is_verified_recaptcha_token(token: str) -> bool:
    data = {"secret": RECAPTCHA_SECRET, "response": token}
    res = requests.post(
        "https://www.google.com/recaptcha/api/siteverify",
        data=data,
    )
    result = json.loads(res.text)

    if result["success"] == False:
        print("the result is false")
        return False
    print("the result is true")
    return True
