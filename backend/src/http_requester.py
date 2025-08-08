import requests
import json
from getenv import getenv_secure


RECAPTCHA_SECRET = getenv_secure("RECAPTCHA_SECRET")


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
