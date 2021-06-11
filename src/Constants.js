const {bytes, units} = require('@zilliqa-js/util');

export const AUCTION_CONTRACT_ADDRESS= "0x972121ee5f54d5589338943bc9c03f4eaf4906ba";
export const CHAIN_ID = 333;
export const MSG_VERSION = 1;
export const VERSION = bytes.pack(CHAIN_ID, MSG_VERSION);   
export const myGasPrice = units.toQa('2000', units.Units.Li); // Gas Price that will be used by all transactions