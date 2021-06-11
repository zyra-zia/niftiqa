import React from 'react';
import { AUCTION_CONTRACT_ADDRESS } from './Constants';
import Auction from "./Auction";
import {Link} from "react-router-dom";

export default class AuctionList extends React.Component {
  
    constructor(props) {
      super(props);
      this.state = {
        auctionList: []
      };
  
      this.getContractState = this.getContractState.bind(this);
    }
  
    componentDidUpdate(prevProps){
      if (this.props.update !== prevProps.update) {
        console.log("getting contract state");
       this.getContractState();
      }
    }

    componentDidMount() {
      this.getContractState();
    }

    async getContractState(){
      console.log("getting contract state");
      if (typeof window.zilPay !== 'undefined') {
        // ZilPay user detected. You can now use the provider.
        const zilliqa = window.zilPay;
        try {
            const contract = zilliqa.contracts.at(AUCTION_CONTRACT_ADDRESS);
            let contractState = await contract.getState();
            console.log(contractState);
            let auctionList = [];
            for(let i=0; i<contractState.auctionCount; i++){
              let args = contractState.auctionsMap[i].arguments;
              let id = args[0];
              let tokenAddress = args[1];
              let tokenId = args[2];
              let startPrice = args[3];
              let duration = args[4];
              let startTime = args[5];
              let owner = args[6];
              let highestBid = args[7];
              let highestBidder = args[8];
              let aucitonState = args[9];
              auctionList.push(<Auction key={i} 
                id={id} 
                tokenAddress={tokenAddress} 
                tokenId={tokenId} 
                startPrice={startPrice} 
                duration={duration} 
                startTime={startTime}
                owner={owner}
                highestBid={highestBid}
                highestBidder={highestBidder}
                auctionState={aucitonState.arguments[0]}
                zilliqa={zilliqa}>
                </Auction>);
            }
            this.setState({
              auctionList: auctionList
            });

        } catch (err) {
            console.log(err);
        }
      }
      else {
        setTimeout(this.getContractState, 500);
      }
      
    }
  
    render(){
      return (
        
          <div className="auction-list row">
            {(this.state.auctionList.length === 0)?
            <div>
                There are currently no auctions.
                <br/>
                <Link to="/create-auction" className="btn btn-primary">Create New Auction</Link>
            </div>
            :
            <div className="row">{this.state.auctionList}</div>
            }
          </div>
      );
    }
}
  