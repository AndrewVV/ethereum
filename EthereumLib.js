const fetch = require('node-fetch'); 
const DecimalConverter = require('./DecimalConverter');
let akikey = 'DR18ANXPC9EYQXNTSE5V7T6PIFYMI15X5K';
let provider = 'http://api.etherscan.io/api';

class EthereumLib {
	constructor(){	
		// test
		this.getTxInfo('0x254b742b30fe892abac88fa9d260530e2cb0270a', '7946273')
	}

    getTxInfo(address, startblock){
    	return new Promise(async(resolve,reject)=>{
    	    try{
				let result = [];
				let url = provider+'?module=account&action=txlist&address='+address+'&startblock='+startblock+'&endblock=latest&apikey='+akikey
				let allTx = await this.getMethod(url)
				allTx = allTx.result;
				for(let txKey in allTx){
					let tx = allTx[txKey];
					if(tx.value != 0){
						let hash = tx.hash;
						let amount = tx.value;
						amount = this.toDecimals(amount)
						let blockNumber = tx.blockNumber;
						let txData = await this.formatTxData(hash, amount, blockNumber);
						result.push(txData)
					}
				}
				console.log(result)
				return resolve(result)
    	    }catch(e){
    	        return reject(e);
    	    }
		})
	}

	formatTxData(hash, amount, blockNumber){
		let txData = {
			txHash: hash,
			amount: amount, 
			blockNumber: blockNumber
		};
		return txData;
	}

	getMethod(url){
		return new Promise(async(resolve,reject)=>{
			try{
				let result = await fetch(url)
				.then(function(responce) {
					return responce.json()
				})
				return resolve(result);
			}catch(e){
    	    	return reject(e);
			}
		})
	}

	postMethod(url, body={}){
		return new Promise(async(resolve,reject)=>{
			try{
				let options= {
					method: 'POST',
                	body: JSON.stringify(body),
                	headers: {
						"Content-Type": "application/json"
					}
            	};
				let result = await fetch(url, options)
				.then(function(responce) {
					return responce.json()
				})
				return resolve(result);
			}catch(e){
    	    	return reject(e);
			}
		})
	}

	toDecimals(amount, decimals=18){
        return DecimalConverter.formatToDecimals(amount, decimals);
    }
    fromDecimals(amount, decimals=18){
        return DecimalConverter.formatFromDecimals(amount, decimals);
    }
}

module.exports = EthereumLib;