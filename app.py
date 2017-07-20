from flask import Flask, render_template, url_for, request, redirect, flash, Response
from datetime import datetime
from flask_cors import CORS, cross_origin
import cStringIO as StringIO
from PIL import Image, ImageFont, ImageDraw
import urllib2
import numpy as np
import dlib
import io
import json


app = Flask(__name__)
CORS(app)

@app.route("/")
def landingpage():
    return render_template("landingpage.html")

@app.route('/dashboard', methods=['GET','POST'])
def dashboard():
    return render_template("dashboard.html")

@app.route('/elements_cards', methods=['GET','POST'])
def elements_cards():
    return render_template('elements_cards.html')

#======================================================================
#Dlib
@app.route('/recieveResponseFromEdge', methods=['GET','POST'])
def recieveResponseFromEdge():
    if request.method == 'POST':
	print "ok"
	post_data = request.get_json(silent=True)
	print "   --------- "
	print post_data[data]
	print type(post_data)
	#json.loads(post_data)
	# json read
	# Json.dumps
	# json filename Save
	# 
	return "returning String"


#    if request.method == 'GET':
#	print "ok"
#	return "returning response to browser"

@app.route('/ip_page', methods=['GET','POST'])
def ip_page():
    return render_template('ip_page.html')

def gen(anom_type):
	if anom_type=="mobilephones":
		detector=dlib.simple_object_detector("detector.svm")
	elif anom_type=="ciggarette":
		detector=dlib.simple_object_detector("cigg_detector.svm")
	elif anom_type=="id":
		detector=dlib.simple_object_detector("ID_detector.svm")
	
	try:
		host = "10.15.2.7:8080/video"
		hoststr = 'http://' + host

		stream=urllib2.urlopen(hoststr)

		bytes=''

		while True:
			bytes+=stream.read(1024)
			a = bytes.find('\xff\xd8')
			b = bytes.find('\xff\xd9')
			if a!=-1 and b!=-1:
				jpg = bytes[a:b+2]
				bytes= bytes[b+2:]
				streamline = StringIO.StringIO(jpg)
				img = Image.open(streamline)
				


				#basewidth = 300
				#wpercent = (basewidth/float(img.size[0]))
				#hsize = int((float(img.size[1])*float(wpercent)))
				#img = img.resize((basewidth,hsize), PIL.Image.ANTIALIAS)

				frame=np.array(img)		
				
				color = np.array([0, 255, 0], dtype=np.uint8)
				dets = detector(frame)
				for k, d in enumerate(dets):
					print("Mobile Detected")
					boundingbox=(d.left(), d.top()), (d.right(), d.bottom())
					im = Image.fromarray(frame)
					dr = ImageDraw.Draw(im)
					dr.rectangle(((d.left(),d.top()),(d.right(),d.bottom())), outline = "blue")
					frame=np.array(im)
				convjpg = Image.fromarray(frame)
				imgByteArr=io.BytesIO()
				convjpg.save(imgByteArr,format="jpeg")
				imgByteArr=imgByteArr.getvalue()				
				#print("-------------")
				#print(convjpg)
				#print(frame)
				yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + imgByteArr + b'\r\n')
	except Exception as e:
		pass

@app.route('/raspberry/<input_str>')
def raspberry(input_str):
	return Response(gen(input_str),
		mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/component', methods=['GET','POST'])
def component():
    return render_template('component.html')
#========================================================================
#gis
@app.route('/gis', methods=['GET','POST'])
def gis():
    return render_template('gis.html')

@app.route('/mapWindow', methods=['GET','POST'])
def mapWindow():
    return render_template('mapWindow.html')
#========================================================================	
#@app.route('/singlepage', methods=['GET','POST'])
#def singlepage():
#    return render_template('singlepage.html')
#========================================================================
#Main Starts Here
if __name__ == "__main__":
    app.run(debug=True)
