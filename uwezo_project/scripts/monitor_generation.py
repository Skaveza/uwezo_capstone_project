#!/usr/bin/env python3
"""
Monitor generation process and auto-restart if needed
"""

import subprocess
import time
import psutil
import os

def monitor_generation():
    """Monitor the generation process and restart if memory gets too high"""
    
    command = [
        "python", "generate_synthetic_data_optimized.py",
        "--ids", "2500",
        "--statements", "2500", 
        "--output", "./data/synthetic_part1",
        "--batch-size", "100"
    ]
    
    max_memory_mb = 6000  # Restart if over 6GB
    
    while True:
        print("Starting generation process...")
        process = subprocess.Popen(command)
        
        try:
            while process.poll() is None:
                # Check memory usage
                memory_usage = psutil.virtual_memory().used / 1024 / 1024
                
                if memory_usage > max_memory_mb:
                    print(f"Memory too high ({memory_usage:.0f}MB), restarting process...")
                    process.terminate()
                    process.wait()
                    time.sleep(10)  # Wait for cleanup
                    break
                    
                time.sleep(30)  # Check every 30 seconds
            
            if process.returncode == 0:
                print("Generation completed successfully!")
                break
                
        except KeyboardInterrupt:
            print("Stopping monitor...")
            process.terminate()
            break

if __name__ == "__main__":
    monitor_generation()