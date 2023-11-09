import express from "express"
const expressInit = express()
import { Server } from "hyper-express";
import HyperExpress from "hyper-express"

function checkServerType(server: "express"): typeof expressInit;
function checkServerType(server: "hyper-express"): typeof Server;

function checkServerType(server: "hyper-express" | "express"): typeof expressInit | typeof Server {
    const Express = server == "hyper-express" ? HyperExpress.Server : expressInit
    return Express;

}



function app(perf: boolean) {

    perf ? checkServerType("hyper-express") : checkServerType("express")
}