import React from 'react';
import moment from 'moment';
import {AUCTION_CONTRACT_ADDRESS, myGasPrice, VERSION} from "./Constants";

const {BN, Long} = require('@zilliqa-js/util');

export default class AuctionList extends React.Component {
  
    constructor(props) {
      super(props);

      this.state = {
          image: "",
          description: "",
          name: "",
          symbol: "",
          bid: 0
      }

      this.placeBid = this.placeBid.bind(this);
      this.finalize = this.finalize.bind(this);
      this.claimback = this.claimback.bind(this);
      this.handleBidChange = this.handleBidChange.bind(this);

    }
  
    componentDidMount() {
        this.getTokenURI();
    }

    handleBidChange(event){
        this.setState({
            bid: event.target.value
        });
    }

    async placeBid(){console.log(this.state.bid + " is the bid");
        try {
            const contract = this.props.zilliqa.contracts.at(AUCTION_CONTRACT_ADDRESS);
            await contract.call(
                'placeBid',
                [
                    {
                        vname: 'auctionId',
                        type: 'Uint32',
                        value: this.props.id
                    },
                    {
                        vname: 'bidAmount',
                        type: 'Uint128',
                        value: this.state.bid.toString()
                    }
                ],
                {
                    // amount, gasPrice and gasLimit must be explicitly provided
                    version: VERSION,
                    amount: this.props.zilliqa.utils.units.toQa(this.state.bid, this.props.zilliqa.utils.units.Units.Zil),
                    gasPrice: myGasPrice,
                    gasLimit: Long.fromNumber(10000),
                }
            );
      
        } catch (err) {
            console.log(err);
        }
    }

    async finalize(){
        if(this.props.owner.toLowerCase() !== this.props.zilliqa.wallet.defaultAccount.base16.toLowerCase()){
            alert("Only the auction owner can finalize the auction");
            return;
        }
        try {
            const contract = this.props.zilliqa.contracts.at(AUCTION_CONTRACT_ADDRESS);
            await contract.call(
                'finalizeAuction',
                [
                    {
                        vname: 'auctionId',
                        type: 'Uint32',
                        value: this.props.id
                    }
                ],
                {
                    // amount, gasPrice and gasLimit must be explicitly provided
                    version: VERSION,
                    amount: new BN(0),
                    gasPrice: myGasPrice,
                    gasLimit: Long.fromNumber(10000),
                }
            );
      
        } catch (err) {
            console.log(err);
        }
    }

    async claimback(){
        try {
            const contract = this.props.zilliqa.contracts.at(AUCTION_CONTRACT_ADDRESS);
            await contract.call(
                'claimback',
                [
                    {
                        vname: 'auctionId',
                        type: 'Uint32',
                        value: this.props.id
                    }
                ],
                {
                    // amount, gasPrice and gasLimit must be explicitly provided
                    version: VERSION,
                    amount: new BN(0),
                    gasPrice: myGasPrice,
                    gasLimit: Long.fromNumber(10000),
                }
            );
      
        } catch (err) {
            console.log(err);
        }
    }

    async getTokenURI(){
      try {
        const contract = this.props.zilliqa.contracts.at(this.props.tokenAddress);
        let state = await contract.getState();
        const tokenURI = state.token_uris[this.props.tokenId];
        fetch(tokenURI)
        .then(response => response.json())
        .then(data => {
            this.setState({
                image: data.image,
                description: data.description,
                name: data.name,
                symbol: data.symbol
            });
        });
    
      } catch (err) {
          console.log(err);
      }
    }
  
  
    render(){
        let duration = moment.duration(this.props.duration);
        let start = moment(parseInt(this.props.startTime));
        let endingTime = start.add(duration);
        let now = moment();
        
        let timeString = "";
        if(endingTime.milliseconds() < now.milliseconds()){
            //auction has expired
            timeString = "Auction Finished.";
        }
        else{
            timeString = "Ends: " + endingTime.fromNow();
        }

        let highestBidString = "";
        if(this.props.highestBid > 0){
            highestBidString = "Highest Bid is " + this.props.highestBid + " ZIL by " + this.props.highestBidder;
        }
        else {
            highestBidString = "There are no bids yet.";
        }
      return (
        
         <div className="auction-item col-sm-4">
            <div className="card">
            <div className="card-header">
                <h5 className="card-title">{this.state.name}</h5>
            </div>
            <img src={this.state.image} className="card-img-top" alt="NFT"></img>
            <div className="card-body">
                <h6 className="card-title">{this.state.symbol}</h6>
                <p className="card-text">{this.state.description.replace(/(<([^>]+)>)/gi, "")}</p>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">{timeString}</li>
                    <li className="list-group-item">Starting Price: {this.props.startPrice} ZIL</li>
                    <li className="list-group-item">{highestBidString}</li>

                    {this.props.auctionState === "Running"?
                    <li className="list-group-item">
                        <input type="number" onChange={this.handleBidChange}/>
                        <button className="btn btn-primary" onClick={this.placeBid}>Bid</button>
                    </li>
                    :
                    null}
                    {this.props.auctionState === "Finalized"?
                    <li className="list-group-item"><button className="btn btn-primary" onClick={this.claimback}>Claimback Bid</button></li>
                    :
                    <React.Fragment>
                    <li className="list-group-item"><button className="btn btn-primary" onClick={this.finalize}>Finalize Auction</button></li>
                    <li className="list-group-item"><button className="btn btn-primary" onClick={this.claimback}>Claimback Bid</button></li>
                    </React.Fragment>}
                </ul>
                    
            </div>
            </div>
          </div>
      );
    }
}