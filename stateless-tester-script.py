import socket
import time
from datetime import datetime
import redis

r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
counter=0

while True:
    counter += 1
    time_stamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    hostname = socket.gethostname()
    ip = socket.gethostbyname(hostname)
    time.sleep(2)
    key = counter
    value = f"IP Address: {ip}, Current Time: {time_stamp}"
    r.set(key, value)
 
    print(f"IP Address: {ip}, Current Time: {time_stamp}, Count: {counter}")
