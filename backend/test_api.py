import requests
import json

url = "http://127.0.0.1:8000/api/v1/chat"
headers = {"Content-Type": "application/json"}
data = {
    "messages": [
        {"role": "user", "content": "Generate a 2-mark assignment on Neural Networks."}
    ]
}

try:
    response = requests.post(url, headers=headers, json=data)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        print(f"Response: {response.json()}")
    else:
        print(f"Request Failed: {response.text}")

except Exception as e:
    print(f"Error: {e}")
