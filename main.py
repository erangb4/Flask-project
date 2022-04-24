from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)

CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///pesachprojectsql.sqlite"  # sqlite db
db = SQLAlchemy(app)


class Customers(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    address = db.Column(db.String(80), nullable=False)


@app.route("/")
def home():
    return render_template('index.html')


@app.route('/customers', methods=['GET', 'POST'])
def get_or_post_customer():

    if request.method == 'GET':
        return_ls = []
        customers = Customers.query.all()
        for customer in customers:
            return_ls.append({"id": customer.id, "name": customer.name, "address": customer.address})
        return jsonify(return_ls)

    if request.method == 'POST':
        new_customer = request.get_json()
        if new_customer["name"] == '' or new_customer["address"] == '':
            return jsonify({"status": "failed", "reason": "missing data"})
        db.session.add(Customers(name=new_customer["name"], address=new_customer["address"]))
        db.session.commit()
        return '{"status": "success"}'


@app.route('/customers/<int:id_>', methods=['GET', 'PUT', 'DELETE'])  # made it only for put(and not both put and patch) cauese we learned only put ajax. also defined all fields not null so works more like patch.
def get_customer_by_id(id_):

    if request.method == 'GET':
        customer = Customers.query.filter_by(id=id_).all()
        if customer:
            return jsonify({"id": customer[0].id, "name": customer[0].name, "address": customer[0].address})
        return jsonify({})
    if request.method == 'PUT':

        updated_new_customer = request.get_json()

        if updated_new_customer["name"] == '' or updated_new_customer["address"] == '':
            return jsonify({"status": "failed", "reason": "missing data"})

        updated_customer = Customers.query.filter_by(id=id_).all()
        if updated_customer:
            updated_customer[0].name = updated_new_customer["name"]
            updated_customer[0].address = updated_new_customer["address"]
            db.session.commit()
            return jsonify(updated_new_customer)
        return jsonify({"status": "failed"})

    if request.method == 'DELETE':
        Customers.query.filter_by(id=id_).delete()
        db.session.commit()

        return_ls = []
        customers = Customers.query.all()
        for customer in customers:
            return_ls.append({"id": customer.id, "name": customer.name, "address": customer.address})
        return jsonify(return_ls)


if __name__ == '__main__':
    app.run(debug=True)
