from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/paradoxes')
def paradoxes():
    return render_template('paradoxes.html')

@app.route('/paradox/monty-hall')
def monty_hall():
    return render_template('monty-hall.html')

@app.route('/paradox/birthday')
def birthday():
    return render_template('birthday.html')

@app.route('/paradox/braess')
def braess():
    return render_template('braess.html')

# @app.route('/paradox/simpson')
# def simpson():
#     return render_template('simpson.html')

# @app.route('/paradox/parrondo')
# def parrondo():
#     return render_template('parrondo.html')

# @app.route('/paradox/prisoner')
# def prisoner():
#     return render_template('prisoner.html')


@app.route('/settings')
def settings():
    return render_template('settings.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)