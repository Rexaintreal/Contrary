from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/home')
def home(): 
    return render_template('home.html')

@app.route('/monty-hall')
def monty_hall():
    return render_template('monty-hall.html')

@app.route('/birthday')
def birthday():
    return render_template('birthday.html')

@app.route('/zeno')
def zeno():
    return render_template('zeno.html')

if __name__ == '__main__':
    app.run(debug=True)