from flask import Flask, request, jsonify
from datetime import datetime
from flask_cors import CORS
import signal, sys

app = Flask(__name__)

def handle_sigint(signum, frame):
    print("SIGINT received. Cleaning up before exiting.")
    # Perform cleanup here
    sys.exit(0)



CORS(app, resources={r"/*": {"origins": "*","methods": ["GET","HEAD","POST","OPTIONS","PUT","PATCH","DELETE"]}})
from lumibot.brokers import Alpaca
from lumibot.backtesting import YahooDataBacktesting
from lumibot.strategies.strategy import Strategy
from datetime import datetime
from alpaca_trade_api import REST
from timedelta import Timedelta
from finbert_utils import estimate_sentiment

API_KEY = "PKSBF5N8RVRMV3GTYA14"
API_SECRET = "Dgna4ROOysrb0RHJIQ6NOIlqJ0vgE3jvxOBs7fdu"
BASE_URL = "https://paper-api.alpaca.markets"

ALPACA_CREDS = {
    "API_KEY": API_KEY,
    "API_SECRET": API_SECRET,
    "PAPER": True
}

class MLTrader(Strategy): 
    def initialize(self, symbol:str="SPY", cash_at_risk:float=.5): 
        self.symbol = symbol
        self.sleeptime = "24H" 
        self.last_trade = None 
        self.cash_at_risk = cash_at_risk
        self.api = REST(base_url=BASE_URL, key_id=API_KEY, secret_key=API_SECRET)

    def position_sizing(self): 
        cash = self.get_cash() 
        last_price = self.get_last_price(self.symbol)
        quantity = round(cash * self.cash_at_risk / last_price,0)
        return cash, last_price, quantity

    def get_dates(self): 
        today = self.get_datetime()
        three_days_prior = today - Timedelta(days=3)
        return today.strftime('%Y-%m-%d'), three_days_prior.strftime('%Y-%m-%d')

    def get_sentiment(self): 
        today, three_days_prior = self.get_dates()
        news = self.api.get_news(symbol=self.symbol, 
                                 start=three_days_prior, 
                                 end=today) 
        news = [ev.__dict__["_raw"]["headline"] for ev in news]
        probability, sentiment = estimate_sentiment(news)
        return probability, sentiment 

    def on_trading_iteration(self):
        cash, last_price, quantity = self.position_sizing() 
        probability, sentiment = self.get_sentiment()

        if cash > last_price: 
            if sentiment == "positive" and probability > .999: 
                if self.last_trade == "sell": 
                    self.sell_all() 
                order = self.create_order(
                    self.symbol, 
                    quantity, 
                    "buy", 
                    take_profit_price=last_price*1.20, 
                    stop_loss_price=last_price*.95
                )
                self.submit_order(order) 
                self.last_trade = "buy"
            elif sentiment == "negative" and probability > .999: 
                if self.last_trade == "buy": 
                    self.sell_all() 
                order = self.create_order(
                    self.symbol, 
                    quantity, 
                    "sell", 
                    take_profit_price=last_price*.8, 
                    stop_loss_price=last_price*1.05
                )
                self.submit_order(order) 
                self.last_trade = "sell"

def sentiment_analysis(start_date: datetime, end_date: datetime):
    
    
    broker = Alpaca(ALPACA_CREDS) 
    strategy = MLTrader(name='mlstrat', broker=broker, 
                        parameters={"symbol":"SPY", 
                                    "cash_at_risk":.5})
    strategy.backtest(
        YahooDataBacktesting, 
        start_date, 
        end_date, 
        parameters={"symbol":"SPY", "cash_at_risk":.5}
)

def reinforcement_learning_analysis(start_date: datetime, end_date: datetime):
    symbol = "SPY"
    broker = Alpaca(ALPACA_CREDS)
    # Placeholder logic for RL
    print(f"Running reinforcement learning analysis for {symbol} from {start_date} to {end_date}.")
    # Add implementation using RL libraries or frameworks

def technical_analysis_trading(start_date: datetime, end_date: datetime):
    broker = Alpaca(ALPACA_CREDS)
    symbol = "SPY"
    print(f"Running technical analysis for {symbol} from {start_date} to {end_date}.")
    # Example implementation for moving averages, RSI, MACD, etc.
    # Example: Fetch data and calculate indicators
    strategy = MLTrader(name='technical_analysis', broker=broker, parameters={"symbol": symbol})
    strategy.backtest(
        YahooDataBacktesting,
        start_date,
        end_date,
        parameters={"symbol": symbol}
    )

def mean_reversion_trading(start_date: datetime, end_date: datetime, symbol: str):
    broker = Alpaca(ALPACA_CREDS)
    print(f"Running mean reversion strategy for {symbol} from {start_date} to {end_date}.")
    # Example: Analyze deviations from historical averages
    strategy = MLTrader(name='mean_reversion', broker=broker, parameters={"symbol": symbol})
    strategy.backtest(
        YahooDataBacktesting,
        start_date,
        end_date,
        parameters={"symbol": symbol}
    )
def parse_date_range(data):
    try:
        start_date = datetime.fromisoformat(data['from'].replace('Z', '+00:00'))
        end_date = datetime.fromisoformat(data['to'].replace('Z', '+00:00'))
        return start_date, end_date
    except KeyError:
        return None, None
    except ValueError:
        return None, None


@app.route('/sentiment_analysis', methods=['GET','POST'])
def sentiment_analysis_route():
    data = request.get_json()
    start_date, end_date = parse_date_range(data)
    if not start_date or not end_date :
        return jsonify({"error": "Missing required parameters"}), 400
    return jsonify({"result": sentiment_analysis(start_date, end_date)})

@app.route('/reinforcement_learning', methods=['GET'])
def reinforcement_learning_route():
    data = request.get_json()
    start_date, end_date = parse_date_range(data)
    if not start_date or not end_date :
        return jsonify({"error": "Missing required parameters"}), 400
    return jsonify({"result": reinforcement_learning_analysis(start_date, end_date)})

@app.route('/technical_analysis', methods=['GET'])
def technical_analysis_route():
    data = request.get_json()
    start_date, end_date = parse_date_range(data)
    if not start_date or not end_date :
        return jsonify({"error": "Missing required parameters"}), 400
    return jsonify({"result": technical_analysis_trading(start_date, end_date)})

@app.route('/mean_reversion', methods=['GET'])
def mean_reversion_route():
    data = request.get_json() 
    start_date, end_date = parse_date_range(data)
    if not start_date or not end_date:
        return jsonify({"error": "Missing required parameters"}), 400
    return jsonify({"result": mean_reversion_trading(start_date, end_date)})

if __name__ == '__main__':
    
    app.run(host='0.0.0.0', port=5999,  threaded=False)