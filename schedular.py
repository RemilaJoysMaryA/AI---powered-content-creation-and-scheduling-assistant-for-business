from flask_apscheduler import APScheduler
import requests
from datetime import datetime

# WordPress API details and OAuth2 token
WORDPRESS_URL = "https://public-api.wordpress.com/rest/v1.1/sites/remilajoys5.wordpress.com/posts/new"
ACCESS_TOKEN = "oY)2Q(lFazT)PpFX&jC1Lv$TKTh(EAf3)l6dl2XDfm7I$kYDj$(oM!DjBN$2KxBm"  # Replace with your WordPress OAuth token

# Function to create a post on WordPress
def post_to_wordpress(title, content):
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }

    post_data = {
        "title": title,
        "content": content,
        "status": "draft"  # You can change this to 'publish' if you want to publish directly
    }

    try:
        response = requests.post(WORDPRESS_URL, headers=headers, json=post_data)
        if response.status_code == 201:
            print(f"Draft created successfully at {datetime.now()}")
        else:
            print(f"Failed to create draft: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Error: {e}")

# Function to generate content and post it
def scheduled_task():
    # Call the Flask route to generate content dynamically
    response = requests.post('http://localhost:5000/generate-content', json={'domain': 'Gaming', 'prompt': 'Genertae a blog on Gaming'})
    
    if response.status_code == 200:
        content_data = response.json()
        blog_content = content_data.get('blog_content', 'No content generated.')  # Get only the blog content

        # Ensure that blog_content is valid before posting
        if blog_content and blog_content != "No content generated.":
            # Use the blog content generated and post it to WordPress
            post_to_wordpress("Dive into the world of Gaming🎮", blog_content)
        else:
            print("Blog content is empty or not generated successfully.")
    else:
        print(f"Error in content generation: {response.status_code} - {response.text}")


# APScheduler setup for scheduling posts at intervals
def create_scheduler(app):
    scheduler = APScheduler()
    scheduler.init_app(app)
    
    # Schedule the task to run every 2 minutes (adjust as needed)
    scheduler.add_job(id='Scheduled Task', func=scheduled_task, trigger='interval', minutes=2)
    scheduler.start()

    return scheduler