import express from "express"
const expressInit = express()
import { Server } from "hyper-express";
import HyperExpress from "hyper-express"
import helmet from "helmet"
import { IncomingMessage, ServerResponse } from "node:http";
import fileUpload from "express-fileupload"
import { uploadToS3 } from "../helper/upload";
import { randomUUID } from "node:crypto";


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
            if (req.method == "POST") {
                next()
            } else {
                res.status(400).json({ message: "Invalid Method , Only PUT and POST methods allowed and file name should be `file` " })
            }

        })

        server.post("/file", (req, res) => {
            req.multipart({ limits: { files: filesLimits, fileSize: fileSizeLimit }, headers: { "content-type": req.headers["content-type"] } }, async (field) => {
                if (field.name == "file") {
                    const randomName = randomUUID()
                    //@ts-ignore
                    const url = uploadToS3(randomName, field.file.stream)
                    res.json({ data: url, status: true })

                } else {
                    res.json({ message: "No File received, Check Multipart Field Name is specified as `file`", status: false });
                }
            })
        })

    } else {
        const server = checkServerType("express")
        server.use(helmet())
        server.use((req, res, next) => {
            if (req.method == "POST") {
                next()
            } else {
                res.status(400).json({ message: "Invalid Method , Only PUT and POST methods allowed and file name should be `file` " })
            }

        })
        server.use(fileUpload({ abortOnLimit: true, limits: { fileSize: fileSizeLimit, files: filesLimits } }))
        server.post("/file", (req, res) => {
            //@ts-ignore
            const file = req.files.file.data
            const randomName = randomUUID()
            //@ts-ignore
            const url = uploadToS3(randomName, file)
            res.json({ data: url, status: true })

        })
    }


}



export { app }


