import subprocess
import os
import signal
import sys
import time
import shutil

def check_requirements():
    """Check if required commands are available."""
    if not shutil.which("npm"):
        print("Error: npm is not installed or not in PATH. Install Node.js from https://nodejs.org/")
        sys.exit(1)
    if not shutil.which("python"):
        print("Error: python is not installed or not in PATH. Install Python from https://www.python.org/")
        sys.exit(1)
    try:
        result = subprocess.run(["python", "-m", "uvicorn", "--version"], capture_output=True, text=True)
        print(f"Uvicorn version: {result.stdout.strip()}")
    except subprocess.CalledProcessError:
        print("Error: uvicorn is not installed. Run: pip install uvicorn")
        sys.exit(1)

def run_frontend():
    """Run the frontend Vite server (npm run dev)."""
    frontend_dir = os.path.join(os.getcwd(), "frontend")
    if not os.path.exists(frontend_dir):
        print(f"Error: Frontend directory {frontend_dir} does not exist.")
        sys.exit(1)
    
    # Check if package.json exists
    if not os.path.exists(os.path.join(frontend_dir, "package.json")):
        print(f"Error: package.json not found in {frontend_dir}")
        sys.exit(1)
    
    cmd = ["cmd", "/c", "npm", "run", "dev"] if os.name == "nt" else ["npm", "run", "dev"]
    
    try:
        process = subprocess.Popen(
            cmd,
            cwd=frontend_dir,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        return process
    except Exception as e:
        print(f"Failed to start frontend: {str(e)}")
        sys.exit(1)

def run_backend():
    """Run the backend FastAPI server (uvicorn main:app --reload)."""
    backend_dir = os.path.join(os.getcwd(), "backend")  # Adjust to 'backend/' if needed
    main_file = os.path.join(backend_dir, "main.py")
    if not os.path.exists(main_file):
        print(f"Error: {main_file} not found. Ensure main.py exists in {backend_dir}")
        sys.exit(1)
    
    # Use virtual environment's Python if available, else system Python
    python_exe = os.path.join(backend_dir, "venv", "Scripts", "python.exe" if os.name == "nt" else "bin", "python")
    if not os.path.exists(python_exe):
        python_exe = "python"
    
    cmd = [python_exe, "-m", "uvicorn", "main:app", "--reload", "--port", "8000"]
    
    try:
        process = subprocess.Popen(
            cmd,
            cwd=backend_dir,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        # Check if process started
        time.sleep(1)
        if process.poll() is not None:
            error_output = process.stderr.read()
            print(f"Backend failed to start: {error_output}")
            sys.exit(1)
        return process
    except Exception as e:
        print(f"Failed to start backend: {str(e)}")
        sys.exit(1)

def main():
    print("Checking requirements...")
    check_requirements()
    print("Starting frontend and backend servers...")
    
    frontend_process = run_frontend()
    backend_process = run_backend()
    
    def stream_output(process, name):
        while process.poll() is None:
            line = process.stdout.readline()
            if line:
                print(f"[{name}] {line.strip()}")
            err_line = process.stderr.readline()
            if err_line:
                print(f"[{name} ERROR] {err_line.strip()}")
            time.sleep(0.1)
    
    try:
        import threading
        threading.Thread(target=stream_output, args=(frontend_process, "Frontend"), daemon=True).start()
        threading.Thread(target=stream_output, args=(backend_process, "Backend"), daemon=True).start()
        
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down servers...")
        frontend_process.terminate()
        backend_process.terminate()
        
        try:
            frontend_process.wait(timeout=5)
            backend_process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            print("Processes did not terminate gracefully. Killing...")
            frontend_process.kill()
            backend_process.kill()
        
        print("Servers stopped.")
        sys.exit(0)

if __name__ == "__main__":
    main()
    # frontend on port 5173
    # backend on port 8000