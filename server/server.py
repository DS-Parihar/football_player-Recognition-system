from flask import Flask, request, jsonify, render_template, send_from_directory
import util

app = Flask(__name__)



@app.route('/static/<path:filename>')
def static_files(filename):
    response = send_from_directory('static', filename)

    # Set cache headers to expire after 1 hour
    response.cache_control.max_age = 3600

    return response



@app.route('/')
def hello_world(name=None):
    return render_template('app.html', name=name)
@app.route('/classify_image', methods=['GET', 'POST'])
def classify_image():
    image_data = request.form['image_data']
    print(util.classify_image(image_data))

    response = jsonify(util.classify_image(image_data))
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


if __name__ == "__main__":
    print("Starting Python Flask Server For Sports Celebrity Image Classification")
    util.load_saved_artifacts()
    app.run(port=5000)

