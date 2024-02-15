import redis
import time
from datetime import datetime

r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

counter = 0  

try:
    while True:
        counter += 1 
        key = f"{counter:02}" 
        value = datetime.now().strftime("%Y-%m-%d %H:%M:%S") 
        
        r.set(key, value)  
        
        print(f"{key}: {value} added to database")
        
        time.sleep(0.2) 

except KeyboardInterrupt:
    print("Counter Stopped")
