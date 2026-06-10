import chalk from "chalk";
import { Task } from "../types/types";

const fs = require('fs/promises');

export const fileReader = async (name: string): Promise<string> => {
    if (!name) throw new Error("cant get title from app")

    return fs.readFile(name, "utf-8")
}

export const taskInfo = async (task: Task): Promise<string | void> => {
    if (!task) throw new Error("cant get taskInfo from arr")

    console.log(`title: ${chalk.green(task.title)}, 
    desc: ${chalk.green(task.description)}, 
    is completed: ${task.isCompleted ? chalk.bgGreen('  ') : chalk.bgRed('  ')}`)
}

export const Greeting = (): void => {
    console.log("CLI-TODO-LIST!")
    console.log("Your tasks:")
    console.log("----------")
}

export const Help = async (): Promise<void> => {
    console.log("----------")
    console.log(`Commands: add, all, delete, exit, current`)
}
