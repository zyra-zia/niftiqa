const {bytes, units} = require('@zilliqa-js/util');

export const AUCTION_CONTRACT_ADDRESS= "0x58cbdceb49f9dc10b615f7c5c491c5f77b46da39";
export const CHAIN_ID = 333;
export const MSG_VERSION = 1;
export const VERSION = bytes.pack(CHAIN_ID, MSG_VERSION);   
export const myGasPrice = units.toQa('2000', units.Units.Li); // Gas Price that will be used by all transactions