import chalk from "chalk";
import { Task } from "../types/types"
import { getTasks } from "../app.js"

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

export const Greeting = async () => {
    console.log(chalk.cyan.bold('\n📝 CLI Task Manager v1.0\n'));
    const tasks = await getTasks();
    if (!tasks) throw new Error("Cant read tasks for greeting")

    const completed = tasks.filter(t => t.isCompleted).length;
    console.log(chalk.gray(`📊 У вас ${tasks.length} задач, ${completed} выполнено\n`));
};

export const Help = async (): Promise<void> => {
    console.log(`Commands: add, all, delete, exit, details`)
}
