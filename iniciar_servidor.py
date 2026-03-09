import http.server
import socketserver
import webbrowser
import os

PORTA = 8899
os.chdir(os.path.dirname(os.path.abspath(__file__)))

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    """Desabilita cache do navegador para sempre servir os arquivos mais recentes."""
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

print(f"✅ Servidor iniciado em http://localhost:{PORTA}")
print("   Pressione Ctrl+C para encerrar.\n")

webbrowser.open(f"http://localhost:{PORTA}")

with socketserver.TCPServer(("", PORTA), NoCacheHandler) as httpd:
    httpd.serve_forever()
