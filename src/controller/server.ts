import express from "express"
const expressInit = express()
import { Server } from "hyper-express";
import HyperExpress from "hyper-express"
import helmet from "helmet"
import { IncomingMessage, ServerResponse } from "node:http";
import fileUpload from "express-fileupload"


function checkServerType(server: "express"): typeof expressInit;
function checkServerType(server: "hyper-express"): Server;

function checkServerType(server: "hyper-express" | "express"): typeof expressInit | Server {
    const Express = server == "hyper-express" ? new HyperExpress.Server({ fast_abort: true }) : expressInit
    return Express;

}




function app(perf: boolean, filesLimits: number, fileSizeLimit: number) {
    if (perf) {
        const server = checkServerType("hyper-express")
        server.use((req, res, next) => {
            let satisfactoryRes = res as unknown as ServerResponse;
            let satisfactoryReq = req as unknown as IncomingMessage;
            let runHelmet = helmet()
            runHelmet(satisfactoryReq, satisfactoryRes, (err) => {
                if (err) {
                    console.error(err)
                    res.status(500).json({ message: "Server Failed to Operate", status: false })
                } else {
                    next()
                }
            })
        })
        server.use((req, res, next) => {
            if (req.method == "PUT" || req.method == "POST") {
                next()
            } else {
                res.status(400).json({ message: "Invalid Method , Only PUT and POST methods allowed and file name should be `file` " })
            }
        })

    } else {
        const server = checkServerType("express")
        server.use(helmet())
        server.use(fileUpload({ abortOnLimit: true, limits: { fileSize: fileSizeLimit, files: filesLimits } }))
    }


}



export { app }


