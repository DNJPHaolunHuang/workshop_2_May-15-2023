
import { registerDID } from '@ayanworks/polygon-did-registrar';
import * as log4js from "log4js";

const logger = log4js.getLogger();
logger.level = 'debug';

export class RegisterDid {

    public routes(app): void {
        var registerDidRes;
        app.post('/register-did', async (req, res) => {
            try {
                const did = req.body.did;
                const privateKey = req.body.privateKey;
                const serviceEndpoint = req.body.serviceEndpoint;
                const url = req.body.url;
                const contractAddress = req.body.contractAddress;

                registerDidRes = await registerDID(did, privateKey,url,contractAddress)
                    .then((response) => {
                        return response;
                    });
                const gasPrice = registerDidRes.data.txnHash.maxFeePerGas;
                const gasLimit = registerDidRes.data.txnHash.gasLimit;
                const gasPriceDecimal = parseInt(gasPrice._hex.substr(2), 16);
                const gasLimitDecimal = parseInt(gasLimit._hex.substr(2), 16);
                const txnFee = (gasPriceDecimal * gasLimitDecimal / Math.pow(10, 18))
                res.status(201).json({ success: registerDidRes.success, 
                     data: { gasPrice, gasLimit, TX_Fee: txnFee },
                     message: registerDidRes.message });
                logger.debug(
                    `registerDidRes - ${JSON.stringify(registerDidRes)} \n\n\n`
                );
            } catch (error) {
                logger.error(
                    `RegisterDid Error- ${JSON.stringify(error)} \n\n\n`
                );
                res.status(500).send(error);
            }
        })
    }
}