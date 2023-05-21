
import { registerDID } from '@ayanworks/polygon-did-registrar';
import { updateDidDoc } from '@ayanworks/polygon-did-registrar';
import * as didPolygon from '@ayanworks/polygon-did-resolver';

import * as didResolvers from "did-resolver";

import * as SampleData  from "./sample.json";
import * as log4js from "log4js";
var QRCode = require('qrcode')  
const logger = log4js.getLogger();
logger.level = 'debug';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
export class RegisterTraceabilityDid {
    public resolver: didResolvers.Resolver
    public constructor() {
        this.resolver = new didResolvers.Resolver(
            {
                ...didPolygon.getResolver(),
            },

            { cache: true }
        )
    }
    public routes(app): void {
        app.post('/update-traceability-did/:did/:privateKey', async (req, res) => {
            const did = req.params.did;
           
            const privateKey = req.params.privateKey;
            try {
                var Create_success = false;

                var registerDidRes = await registerDID(did, privateKey)
                    .then((response) => {
                        return response;
                    });
                   logger.debug(
                       `registerDidRes - ${JSON.stringify(registerDidRes)} \n\n\n`
                   );
                   Create_success=true;
                } catch (error) {
                    logger.error(
                        `RegisterDid Error- ${JSON.stringify(error)} \n\n\n`
                    );
                    res.status(500).send(JSON.stringify(error));
                }
                var resolver_response = true;
                var resolver_retry = 0;
                if(Create_success){
                while(resolver_response) {
                try {
                    const returnDidDoc = await this.resolver.resolve(did)
                        .then((response) => {
                        return response;
                    });
                    let didDocRes = returnDidDoc.didDocument;

                    if(didDocRes){
                        resolver_response=false
                        logger.debug(
                            `returnDidDoc - ${JSON.stringify(returnDidDoc)} \n\n\n`
                        );
    
                    }
                } catch (error) {

                    logger.error(
                        `ResolveDid Error- ${JSON.stringify(error)} ${resolver_retry} \n\n\n`
                    );
                    await sleep(1000);
                    resolver_retry+=1;
                    if(resolver_retry>10){
                    res.status(500).send(error);
                    resolver_response=false
                    }
                }
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
                    res.status(500).send(JSON.stringify(error));

                }
            }
        })
   
    }
}