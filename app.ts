const Task = require('./types/types.ts');
const path = require('path')
const dotenv = require('dotenv')
const fs = require('fs')
const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
})

const createTask = async (title: string, description: string, isCompleted: boolean = false): Promise<void> => {
    const uniqueID: number = Date.now();

    try {
        const folderPath: string = path.resolve(__dirname, "tasks", `task${uniqueID}.json`);
        const task: typeof Task = {
            id: uniqueID,
            title: title,
            isCompleted: isCompleted,
            description: description
        }

        await fs.promises.writeFile(folderPath, JSON.stringify(task))
        console.log("Successfuly created a task!")
    } catch (err) {
        console.error(err)
        return
    }
}

const RunProgram = async (): Promise<void> => {
    await createTask('test', 'test for my cli todo')
}

RunProgram()

