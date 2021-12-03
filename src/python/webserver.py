from http.server import HTTPServer, BaseHTTPRequestHandler
import threading
import base64
from time import sleep
#from picamera import PiCamera
import os
import logging

class  web_server(BaseHTTPRequestHandler):
	def do_GET(self):
		if self.path == "/":
			self.path = "/index.html"
		logging.info ("Serving GET for " + self.path[1:])

		try:
			reply = False
			path = os.path.dirname(os.path.realpath(__file__)) + "/../web/"	#go down a level, then back to web
			logging.info ("Running in " + path)

			if "/api" in self.path:
				mime = "text/plain"
				reply = True
			elif self.path.endswith(".html"):
				mime = "text/html"
				reply = True
			elif self.path.endswith(".jpg"):
				mime = "image/jpg"
				reply = True
			elif self.path.endswith(".js"):
				mime = "application/javascript"
				reply = True
			elif self.path.endswith(".css"):
				mime = "text/css"
				reply = True

			if reply:
				self.send_response(200)
				self.send_header("Content-type", mime)
				self.end_headers()

				if self.path == "/api/getImage":
					logging.info("returning base64 image")
					f = open(path + "target.jpg", "rb")
					self.wfile.write(base64.b64encode(f.read()))
					f.close()
				else:
					logging.info("Sending " + self.path + " - type " + mime)
					f = open(path + self.path, "rb")
					self.wfile.write(f.read())
					f.close()
			return

		except IOError as e:
			logging.error(self.path + "  " + str(e))
			self.send_error(404, "File not found : %s", self.path)


def start_web_server():
	httpd = HTTPServer(("0.0.0.0", 80), web_server)
	logging.info("Starting web server...")
	httpd.serve_forever()

try:
	#configure logging
	path = os.path.dirname(os.path.realpath(__file__))
	logfile = path + "/webserver.log"

	if os.path.exists(logfile):
		print("log file exists")
		### os.remove(logfile)

	logging.basicConfig(
		level=logging.INFO,
		format=('[%(asctime)s] %(levelname)-8s %(name)-12s %(message)s'),
		filename=(logfile)
	)
	logging.info("")

	#this will block, so don't put anything after this...
	start_web_server()

	##uncomment to run on the pi
	##thread = threading.Thread(target=start_web_server)
	##thread.setDaemon(True)
	##thread.start()
	##logging.info("web server started")

except KeyboardInterrupt:
	logging.error("Shutting down the web server")
	#httpd.socket_close()
