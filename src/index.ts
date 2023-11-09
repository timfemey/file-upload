#!/usr/bin/env node
import cluster from "node:cluster";
import { cpus } from "node:os";
import process from "node:process";
import { program } from "commander";

const totalCPU = cpus().length;

program
    .option("-p, --perf", "Enable performance mode", false)
    .option("-s, --max-size <size>", "Maximum file size allowed", parseInt)
    .option(
        "-n, --max-files <count>",
        "Maximum number of files allowed (not greater than 20)",
        parseInt
    )

program.parse(process.argv);

if (process.argv.slice(2).length < 1) {

    program.outputHelp();
    process.exit(1);

}

const options = program.opts()

if (cluster.isWorker == false) {



    if (options.maxSize === undefined || options.maxFiles === undefined) {
        console.error('Error: Arguments not provided.');
        console.log('You must provide the following arguments:');
        console.log('-s, --max-size <size>: Maximum file size allowed.');
        console.log('-n, --max-files <count>: Maximum number of files allowed (not greater than 20).');
        console.log("Optional Arguments include:")
        console.log('-p, --perf: Enable performance mode.');
        process.exit(1);

    }


    if (options.maxSize <= 0 || options.maxSize > 512) {
        console.error('Error: Maximum file size should be a positive number greater than or equal to 512');
        process.exit(1);

    }


    if (options.maxFiles <= 0 || options.maxFiles > 20) {
        console.error('Error: Maximum number of files should be a positive number not greater than 20.');
        process.exit(1);

    }




    //Fork Workers
    for (let i = 0; i < totalCPU; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(
            `Cluster ${worker.process.pid} died, Code: ${code}, Signal: ${signal}`
        );
        console.log("Creating anoter worker");
        cluster.fork();
    });
} else {

    // console.log('Arguments received:');

    // console.log('Performance Mode:', options.perf);

    // console.log('Max File Size:', options.maxSize);

    // console.log('Max Number of Files:', options.maxFiles);
    // console.log(`Number of CPUs is ${totalCPU}`);
    // console.log("Attempting to Start Server")



}
