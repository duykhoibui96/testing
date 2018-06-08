
// import runTask from "./worker/async-await";
import Task from "./task";
import { OUTPUT_PATH } from "./config";

const sessionIds = [];
const task = new Task();
task.outputPath = OUTPUT_PATH;

process.argv.forEach(function (val, index, array) {
    if (index === 2)
        task.mode = val
    if (index > 2)
        sessionIds.push(val)
})

if (sessionIds.length > 0)
    task.run(sessionIds)
else
    console.log('Please enter your session ID list. Ex: $ node command.js [sessionId_1] [sessionId_2] ...');
