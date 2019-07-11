const express = require('express')
const port = 8632
let EthereumLib = require('./EthereumLib.js')

class Proxy {
	constructor(){ 
		this.app = express();
		this.ethLib = new EthereumLib();
		this.init()
	}

    init(){
        return new Promise(async(resolve,reject)=>{
            try{
            	this.app.listen(port, () => {
				    console.log("Server is up on port " + port)
				})
				// don`t work
				this.app.post('/eth/create-account',  async (req, res) => {
    				return new Promise(async(resolve,reject)=>{
    				    try{
							let data = await this.ethLib.generateAccount();
    				    	let result = JSON.stringify({"address": data.address, "privateKey": data.privateKey});
							res.send(result)
    				    }catch(e){
    				        return reject(e);
    				    }
					})
				})
				// don`t work
				this.app.get('/eth/balance/:address',  async (req, res) => {
    				return new Promise(async(resolve,reject)=>{
    				    try{
							let address = req.params.address;
							let balance = await this.ethLib.getBalance(address)
							balance = JSON.stringify({"balance": balance});
							res.send(balance)
    				    }catch(e){
    				        return reject(e);
    				    }
					})
				})
				// don`t work
				this.app.post('/eth/send/:address/:amount',  async (req, res) => {
    				return new Promise(async(resolve,reject)=>{
    				    try{
							let address = req.params.address;
							let amount = req.params.amount;
							let txHash = await this.tronLib.ethLib(address, amount)
							let result = JSON.stringify({"txHash": txHash});
							res.send(result)
    				    }catch(e){
    				        return reject(e);
    				    }
					})
				})

            }catch (e) {
                console.log(e);
            }
        });
    }
}

let proxy = new Proxy();