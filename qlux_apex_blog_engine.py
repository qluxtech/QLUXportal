import json
import os
from datetime import datetime

POSTS_FILE = "posts.json"

def generate_article(title, excerpt, content):
    new_post = {
        "slug": title.lower().replace(" ", "-"),
        "title": title,
        "date": datetime.now().strftime("%Y-%m-%d"),
        "excerpt": excerpt,
        "content": content
    }
    
    posts = []
    if os.path.exists(POSTS_FILE):
        try:
            with open(POSTS_FILE, "r", encoding="utf-8") as f:
                posts = json.load(f)
        except json.JSONDecodeError:
            posts = []
            
    posts.insert(0, new_post)
    
    with open(POSTS_FILE, "w", encoding="utf-8") as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)
        
    print(f"Article '{title}' added to {POSTS_FILE}")

if __name__ == "__main__":
    generate_article(
        "Apex Operational Update",
        "Routine system synchronization and node status report.",
        "All decentralized processes and automated routines are operating normally within the QLUX network."
    )
