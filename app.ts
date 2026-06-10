import { fileReader, Greeting, Help } from './func/func.js'
import type { Task, CommandEvent } from './types/types.ts'

const path = require('path')
const fs = require('fs/promises')
const readline = require('readline')
const chalk = require('chalk')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
})

const createTask = async (title: string, description: string, isCompleted: boolean = false): Promise<void> => {
    const uniqueID: number = Date.now();

    try {
        const folderPath: string = path.resolve(__dirname, "tasks", `task${uniqueID}.json`);
        const task: Task = {
            id: uniqueID,
            title: title,
            isCompleted: isCompleted,
            description: description
        }

        await fs.writeFile(folderPath, JSON.stringify(task))
        console.log("Successfuly created a task!")
    } catch (err) {
        console.error(err)
        return
    }
}

const removeTask = async (id: string): Promise<void> => {

}

const getTasks = async (): Promise<undefined | Task[]> => {
    const tasks: Task[] = []; 

    try {
        const folderPath: string = path.resolve(__dirname, "tasks")
        const data = await fs.opendir(folderPath)
        let entry = await data.read()

        while (entry !== null) {
            const task = await fileReader(path.resolve(__dirname, "tasks", entry.name))
            tasks.push(JSON.parse(task))
            entry = await data.read()
        }

        await data.close()
    } catch (err) {
        console.error(err)
        return
    }

    tasks.forEach((task) => {
        console.log(`Task ${(tasks.indexOf(task)) + 1}: ${chalk.green(task.title)}`)
    })

    return tasks.sort((a, b) => b.id - a.id);
}

const CommandHandler = async (input: CommandEvent): Promise<void> => {
    const { command } = input;

    switch(command) {
        case 'add':
            break;
        case 'list':
            break;
        case 'delete':
            break;
        case 'exit':
            process.exit(1)
        default:
            await Help()
    }
    
    rl.prompt();
}

const RunProgram = async (): Promise<void> => {
    Greeting()
    await getTasks()
    rl.prompt()

    rl.on('line', CommandHandler)
}

RunProgram()

