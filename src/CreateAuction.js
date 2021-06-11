import React from 'react';
import {AUCTION_CONTRACT_ADDRESS, myGasPrice, VERSION} from "./Constants";

const {BN, Long} = require('@zilliqa-js/util');
const {toBech32Address, fromBech32Address} = require('@zilliqa-js/crypto');


export default class CreateAuction extends React.Component {
  
    constructor(props) {
      super(props);
      this.state = {
        tokenAddress: "zil1ecfelp3w3gtlhv3wdrau8n8wvdpkazvx42n3kl",
        tokenId: 1,
        startPrice: 5,
        duration: 10
      };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    componentDidMount() {
    }
  
    handleChange(e){
      switch(e.target.name){
        case "tokenAddress":
          this.setState({tokenAddress: e.target.value});
        break;
        case "tokenId":
          this.setState({tokenId: e.target.value});
        break;
        case "startPrice":
          this.setState({startPrice: e.target.value});
        break;
        case "duration":
          this.setState({duration: e.target.value});
        break;
        default:
          //throw exception?
      }
    }

    async handleSubmit(e){
      e.preventDefault();

      if(window.zilPay.wallet.isEnable){
        this.createAuction();
      }
      else{
        const isConnect = await window.zilPay.wallet.connect();
        if (isConnect) {
          this.createAuction();
        } else {
        alert("Not able to create auction as transaction is rejected");
        }
      }
    }

    async createAuction(){
      let duration = this.state.duration * 60 * 60 * 1000; //convert hours to milliseconds
      let startTime = Date.now();

      let tokenAddress = this.state.tokenAddress;
      if(tokenAddress.startsWith("zil")){
        tokenAddress = fromBech32Address(tokenAddress);
      }
      
      const zilliqa = window.zilPay;
      let contractAddress = AUCTION_CONTRACT_ADDRESS;
      contractAddress = contractAddress.substring(2);
      const ftAddr = toBech32Address(contractAddress);
      try {
          const contract = zilliqa.contracts.at(ftAddr);
          await contract.call(
              'createAuction',
              [
                  {
                      vname: 'tokenAddress',
                      type: 'ByStr20',
                      value: tokenAddress
                  },
                  {
                    vname: 'tokenId',
                    type: 'Uint256',
                    value: this.state.tokenId.toString()
                  },
                  {
                    vname: 'startPrice',
                    type: 'Uint128',
                    value: this.state.startPrice.toString()
                  },
                  {
                    vname: 'duration',
                    type: 'Uint64',
                    value: duration.toString()
                  },
                  {
                    vname: 'startTime',
                    type: 'Uint64',
                    value: startTime.toString()
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
          window.location.href = window.location.href.replace("create-auction", "");
    
      } catch (err) {
          console.log(err);
      }
    }
  
    render(){
      return (
        
        <div className="create-auction row g-5">
          <div className="col-md-7 col-lg-8">
            <h4 className="mb-3">Create Auction</h4>
            <form className="needs-validation" noValidate onSubmit={this.handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label htmlFor="tokenAddress" className="form-label">Token Address</label>
                  <input type="text" className="form-control" id="tokenAddress" name="tokenAddress" placeholder="NFT Token Contract Address" value="zil1ecfelp3w3gtlhv3wdrau8n8wvdpkazvx42n3kl" required onChange={this.handleChange}/>
                  <div className="invalid-feedback">
                    Token address is required.
                  </div>
                </div>
                <div className="col-12">
                  <label htmlFor="tokenId" className="form-label">Token Id</label>
                  <input type="text" className="form-control" id="tokenId" name="tokenId" placeholder="NFT Token ID" value="1" required onChange={this.handleChange}/>
                  <div className="invalid-feedback">
                    Token ID is required.
                  </div>
                </div>
                <div className="col-12">
                  <label htmlFor="startPrice" className="form-label">Start Price (ZIL)</label>
                  <input type="text" className="form-control" id="startPrice" name="startPrice" placeholder="Auction Starting Price" value="5" required onChange={this.handleChange}/>
                  <div className="invalid-feedback">
                    Start Price is required.
                  </div>
                </div>
                <div className="col-12">
                  <label htmlFor="duration" className="form-label">Duration</label>
                  <input type="text" className="form-control" id="duration" name="duration" placeholder="Duration in hours" value="10" required onChange={this.handleChange}/>
                  <div className="invalid-feedback">
                    Duration is required.
                  </div>
                </div>
                <button className="w-100 btn btn-primary btn-lg" type="submit">Create Auction</button>
              </div>
            </form>
          </div>
        </div>
      );
    }
}
  