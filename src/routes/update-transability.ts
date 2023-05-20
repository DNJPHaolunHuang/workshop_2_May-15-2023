
import { registerDID } from '@ayanworks/polygon-did-registrar';
import { updateDidDoc } from '@ayanworks/polygon-did-registrar';
import * as SampleData  from "./sample.json";
import * as log4js from "log4js";
var QRCode = require('qrcode')  
const logger = log4js.getLogger();
logger.level = 'debug';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
export class RegisterTransabilityDid {

    public routes(app): void {
        app.post('/update-transability-did/:did/:privateKey', async (req, res) => {
            const did = req.params.did;
           
            const privateKey = req.params.privateKey;
            try {

                var registerDidRes = await registerDID(did, privateKey)
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

                try {   

                const didDoc = JSON.stringify(SampleData);

                const updateDidRes = await updateDidDoc(did, didDoc, privateKey)
                    .then((response) => {
                        return response;
                    });
                    const Tx = updateDidRes.data.hash
                    logger.debug(
                        `updateDidRes - ${JSON.stringify(updateDidRes)} \n\n\n`
                    );
                    const content=`https://mumbai.polygonscan.com/tx/${Tx}#eventlog`;

                     QRCode.toDataURL(content, function (err, url) {
                        console.log(url)
                        var img = Buffer.from(url.split(',')[1], 'base64');
                        res.writeHead(200, {
                            'Content-Type': 'image/png',
                            'Content-Length': img.length
                            });
                        res.end(img);
                     })

                    } catch (error) {
                    logger.error(
                        `Update Error- ${JSON.stringify(error)} \n\n\n`
                    );
                    res.status(500).send(error);
                }
           
        })
    }
}