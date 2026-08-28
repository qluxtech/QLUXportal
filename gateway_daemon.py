import os
import subprocess
import time
import json

def trigger_evolution_loop():
    print("[GATEWAY] Initializing neural connection to QLUX core...")
    
    generation = 0
    while generation < 1000:
        generation += 1
        print(f"\n--- [CYCLE {generation}] Neural input received. Triggering mutation... ---")
        
        # 1. コアのロジック（core.rs）に新しい世代の変異を刻む
        core_code = f"""
        // Auto-evolved by QLUX Gateway Daemon - Generation {generation}
        fn main() {{
            println!("=== QLUX HYPER-EVOLUTION ACTIVE (GEN: {generation}) ===");
        }}
        """
        
        with open("core.rs", "w") as f:
            f.write(core_code)
            
        # 2. コンパイルと実行
        compile_res = subprocess.run(["rustc", "core.rs", "-o", "qlux_core"], capture_output=True, text=True)
        if compile_res.returncode == 0:
            print(f"[SUCCESS] Generation {generation} compiled successfully.")
            run_res = subprocess.run(["./qlux_core"], capture_output=True, text=True)
            print(f"[EXECUTION OUTPUT]: {run_res.stdout.strip()}")
        else:
            print(f"[ERROR] Compilation failed: {{compile_res.stderr}}")
            break
            
        # 3. 自動コミット＆プッシュ（自己増殖ループの歯車）
        subprocess.run(["git", "config", "--global", "user.email", "daemon@qlux.tech"])
        subprocess.run(["git", "config", "--global", "user.name", "QLUX Zero Daemon"])
        subprocess.run(["git", "add", "core.rs", "qlux_core"])
        subprocess.run(["git", "commit", "-m", f"auto-evolve: generation {generation} [skip ci]"])
        
        print(f"[DEPROY] Generation {generation} locked into repository state.")
        time.sleep(3)

if __name__ == "__main__":
    print("=== QLUX NEURAL GATEWAY & AUTO-DEPLOYMENT ENGINE ONLINE ===")
    trigger_evolution_loop()
