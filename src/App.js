import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import CreateAuction from "./CreateAuction";
import AuctionList from "./AuctionList";
import { AUCTION_CONTRACT_ADDRESS } from './Constants';
const { Zilliqa } = require('@zilliqa-js/zilliqa');
const { StatusType, MessageType } = require('@zilliqa-js/subscriptions');

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      update: ""
    };

    this.connectZilpay = this.connectZilpay.bind(this);
    this.connectZilpay();
  }

  componentDidMount() {
    this.eventLogSubscription();
  }

  async connectZilpay(){
    try {
      await window.zilPay.wallet.connect();
      if(window.zilPay.wallet.isConnect){
        localStorage.setItem("zilpay_connect", true);
        window.location.reload(false);
      } else {
      alert("Zilpay connection failed, try again...")
    }
    } catch (error) {}
  }  

  // Code that listens to websocket and updates welcome message when getHello() gets called.
  async eventLogSubscription() {console.log("subscribing");
    const zilliqa = new Zilliqa('https://dev-api.zilliqa.com');
    const subscriber = zilliqa.subscriptionBuilder.buildEventLogSubscriptions(
      'wss://dev-ws.zilliqa.com',
      {
        // smart contract address you want to listen on  
        addresses: [AUCTION_CONTRACT_ADDRESS],
      },
    );
    
    subscriber.emitter.on(StatusType.SUBSCRIBE_EVENT_LOG, (event) => {
      // if subscribe success, it will echo the subscription info
      console.log('get SubscribeEventLog echo : ', event);
    });
    
    subscriber.emitter.on(MessageType.EVENT_LOG, (event) => {
      console.log('get new event log: ', JSON.stringify(event));
      // updating the welcome msg when a new event log is received related to getHello() transition
      this.setState({
          update: Date.now().toString()
      });
    });  
    await subscriber.start();
  }

  render(){
    return (
      <Router>
        <div className="App container">
        <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom App-header">
          <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
            <span className="fs-4">Niftiqa</span>
          </a>

            <ul className="nav nav-pills">
              <li className="nav-item"><Link to="/" className="nav-link">Home</Link></li>
              <li className="nav-item"><Link to="/create-auction" className="nav-link">Create Auction</Link></li>
              {/*<li className="nav-item"><a href="#" className="nav-link">Pricing</a></li>
              <li className="nav-item"><a href="#" className="nav-link">FAQs</a></li>
    ``````````<li className="nav-item"><a href="#" className="nav-link">About</a></li>*/}
            </ul>
          </header>
          <Switch>
            <Route path="/create-auction">
              <CreateAuction />
            </Route>
            <Route path="/">
              <AuctionList update={this.state.update}/>
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}
