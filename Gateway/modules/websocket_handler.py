from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import base64
from PIL import Image
import io
import os

class HTTPRequestHandler(BaseHTTPRequestHandler):
    def __init__(self, camera_handler, *args, **kwargs):
        self.camera_handler = camera_handler
        super().__init__(*args, **kwargs)

    def do_POST(self):
        # Handle CORS
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-type', 'application/json')
        self.end_headers()

        # Read POST data
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))

        if data['type'] == 'add_user':
            try:
                self.handle_new_user(data)
                self.wfile.write(json.dumps({'status': 'success'}).encode())
            except Exception as e:
                self.wfile.write(json.dumps({'status': 'error', 'message': str(e)}).encode())

    def do_OPTIONS(self):
        # Handle CORS preflight
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def handle_new_user(self, data):
        username = data['username']
        images = data['images']

        # Create user directory
        user_dir = os.path.join('known_faces', username)
        os.makedirs(user_dir, exist_ok=True)

        # Save images
        for i, img_base64 in enumerate(images):
            img_data = base64.b64decode(img_base64)
            img = Image.open(io.BytesIO(img_data))
            
            # Convert RGBA to RGB if needed
            if img.mode == 'RGBA':
                # Create white background
                background = Image.new('RGB', img.size, (255, 255, 255))
                # Paste using alpha channel as mask
                background.paste(img, mask=img.split()[3])
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')

            img_path = os.path.join(user_dir, f'image_{i}.jpg')
            img.save(img_path, 'JPEG')

        # Delete existing embeddings file to force retraining
        if os.path.exists('known_faces_embeddings.pkl'):
            os.remove('known_faces_embeddings.pkl')

        # Reload face embeddings
        self.camera_handler.load_known_faces()

class HTTPHandler:
    def __init__(self, camera_handler):
        self.camera_handler = camera_handler
        self.port = 8765

    def start(self):
        handler = lambda *args: HTTPRequestHandler(self.camera_handler, *args)
        server = HTTPServer(('localhost', self.port), handler)
        print(f"HTTP server started on port {self.port}")
        server.serve_forever()