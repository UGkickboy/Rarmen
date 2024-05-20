from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ramen.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class RamenShop(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    location = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(250))  # 新しいフィールド

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ramen_shop_id = db.Column(db.Integer, db.ForeignKey('ramen_shop.id'), nullable=False)
    richness = db.Column(db.Integer, nullable=False)
    richness_level = db.Column(db.Integer, nullable=False)
    taste_overall = db.Column(db.Integer, nullable=False)
    ingredients_taste = db.Column(db.Integer, nullable=False)
    service = db.Column(db.Integer, nullable=False)
    cleanliness = db.Column(db.Integer, nullable=False)
    side_menu = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.String(250))

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/api/ramen', methods=['GET'])
def get_ramen_shops():
    shops = RamenShop.query.all()
    ramen_shops = [{"id": shop.id, "name": shop.name, "location": shop.location, "description": shop.description} for shop in shops]
    return jsonify(ramen_shops)

@app.route('/api/ramen', methods=['POST'])
def add_ramen_shop():
    data = request.get_json()
    new_shop = RamenShop(name=data['name'], location=data['location'], description=data.get('description'))
    db.session.add(new_shop)
    db.session.commit()
    return jsonify({"message": "Ramen shop added!"}), 201

@app.route('/api/ramen/<int:id>', methods=['GET'])
def get_ramen_shop(id):
    shop = RamenShop.query.get_or_404(id)
    return jsonify({
        'id': shop.id,
        'name': shop.name,
        'location': shop.location,
        'description': shop.description
    })

@app.route('/api/review', methods=['POST'])
def add_review():
    try:
        data = request.get_json()
        print("Received data:", data)  # デバッグ用
        new_review = Review(
            ramen_shop_id=data['ramen_shop_id'], 
            richness=data['richness'], 
            richness_level=data['richness_level'], 
            taste_overall=data['taste_overall'], 
            ingredients_taste=data['ingredients_taste'], 
            service=data['service'], 
            cleanliness=data['cleanliness'], 
            side_menu=data['side_menu'], 
            comment=data['comment']
        )
        db.session.add(new_review)
        db.session.commit()
        return jsonify({"message": "Review added!"}), 201
    except Exception as e:
        print("Error:", e)  # デバッグ用
        return jsonify({"message": "Failed to add review"}), 500

@app.route('/api/ramen/search', methods=['GET'])
def search_ramen_shops():
    field = request.args.get('field')
    condition = request.args.get('condition')
    value = float(request.args.get('value'))

    if condition == 'greater':
        reviews = db.session.query(
            Review.ramen_shop_id,
            func.avg(getattr(Review, field)).label('average_score')
        ).group_by(Review.ramen_shop_id).having(func.avg(getattr(Review, field)) >= value).all()
    else:
        reviews = db.session.query(
            Review.ramen_shop_id,
            func.avg(getattr(Review, field)).label('average_score')
        ).group_by(Review.ramen_shop_id).having(func.avg(getattr(Review, field)) <= value).all()

    ramen_shop_ids = [review.ramen_shop_id for review in reviews]
    ramen_shops = RamenShop.query.filter(RamenShop.id.in_(ramen_shop_ids)).all()

    result = []
    for shop in ramen_shops:
        result.append({
            'id': shop.id,
            'name': shop.name,
            'location': shop.location,
            'description': shop.description,
        })

    return jsonify(result)

@app.route('/api/reviews/<int:ramen_shop_id>', methods=['GET'])
def get_reviews(ramen_shop_id):
    reviews = Review.query.filter_by(ramen_shop_id=ramen_shop_id).all()
    if not reviews:
        return jsonify({
            'reviews': [],
            'averages': {
                'avg_richness': 0,
                'avg_richness_level': 0,
                'avg_taste_overall': 0,
                'avg_ingredients_taste': 0,
                'avg_service': 0,
                'avg_cleanliness': 0,
                'avg_side_menu': 0
            }
        })

    averages = db.session.query(
        func.avg(Review.richness).label('avg_richness'),
        func.avg(Review.richness_level).label('avg_richness_level'),
        func.avg(Review.taste_overall).label('avg_taste_overall'),
        func.avg(Review.ingredients_taste).label('avg_ingredients_taste'),
        func.avg(Review.service).label('avg_service'),
        func.avg(Review.cleanliness).label('avg_cleanliness'),
        func.avg(Review.side_menu).label('avg_side_menu')
    ).filter(Review.ramen_shop_id == ramen_shop_id).one()

    review_list = [{
        'id': review.id,
        'ramen_shop_id': review.ramen_shop_id,
        'richness': review.richness,
        'richness_level': review.richness_level,
        'taste_overall': review.taste_overall,
        'ingredients_taste': review.ingredients_taste,
        'service': review.service,
        'cleanliness': review.cleanliness,
        'side_menu': review.side_menu,
        'comment': review.comment
    } for review in reviews]

    return jsonify({
        'reviews': review_list,
        'averages': {
            'avg_richness': averages.avg_richness,
            'avg_richness_level': averages.avg_richness_level,
            'avg_taste_overall': averages.avg_taste_overall,
            'avg_ingredients_taste': averages.avg_ingredients_taste,
            'avg_service': averages.avg_service,
            'avg_cleanliness': averages.avg_cleanliness,
            'avg_side_menu': averages.avg_side_menu
        }
    })


    return jsonify(response)
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)