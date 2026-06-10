import { fileReader, Greeting, Help } from './func/func.js'
import type { Task, CommandEvent } from './types/types.ts'
import inquirer from 'inquirer'

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

const createTaskInteractive = async () => {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Название задачи:',
            validate: (input: string) => input.length > 0 || 'Название не может быть пустым'
        },
        {
            type: 'input',
            name: 'description',
            message: 'Описание (можно пропустить):',
            default: 'Нет описания'
        },
        {
            type: 'confirm',
            name: 'isCompleted',
            message: 'Сразу отметить как выполненную?',
            default: false
        }
    ]);
    
    await createTask(answers.title, answers.description, answers.isCompleted);
};

const removeTask = async (count: number): Promise<void> => {
    const tasks = await getTasks();

    try {
        if (!tasks) throw new Error("Cant get tasks for remove")
        const taskIndex = count - 1;
        
        if (taskIndex < 0 || taskIndex >= tasks.length) {
            console.log(chalk.red(`❌ Задачи с номером ${count} не существует`));
            return;
        }

        const filePath = path.resolve(__dirname, "tasks", `task${tasks[taskIndex].id}.json`)
        await fs.rm(filePath)
        console.log(chalk.green(`✅ Задача "${tasks[taskIndex].title}" успешно удалена!`));
    } catch (err) {
        console.error(err)
        return
    }
}

const removeTaskInteractive = async () => {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'count',
            message: 'Введите номер задачи:',
            validate: (input: string) => {
                if (!input) return 'Введите номер задачи';
                const num = parseInt(input);
                if (isNaN(num)) return 'Введите число';
                if (num < 1) return 'Номер должен быть больше 0';
                return true;
            }
        },
        {
            type: 'confirm',
            name: 'deleting',
            message: 'Вы точно хотите удалить задачу?',
            default: true
        }
    ]);

    if (answers.deleting) {
        await removeTask(answers.count)
    } else {
        rl.prompt()
    }
}

export const getTasks = async (): Promise<undefined | Task[]> => {
    const tasks: Task[] = []; 

    try {
        const folderPath: string = path.resolve(__dirname, "tasks")
        const data = await fs.opendir(folderPath)

        for await (const entry of data) {
            if (entry.isFile() && entry.name.endsWith('.json')) {
                const content = await fileReader(path.resolve(folderPath, entry.name));
                tasks.push(JSON.parse(content));
            }
        }
    } catch (err) {
        console.error(err)
        return
    }

    return tasks.sort((a, b) => b.id - a.id);
}

const showDetails = async (count: number): Promise<Task | undefined> => {
    const tasks = await getTasks();

    try {
        if (!tasks) throw new Error("Cant get tasks for showing details")
        const taskIndex = count - 1;

        if (taskIndex < 0 || taskIndex >= tasks.length) {
            console.log(chalk.red(`❌ Задачи с номером ${count} не существует`));
            return;
        }

        const current = tasks[taskIndex]
        console.log(`Task ${taskIndex}:\n\nTitle: ${current.title}
${chalk.gray.italic("ID: ")}${chalk.gray.italic(current.id)}\nDescription: ${current.description}
IsCompleted: ${current.isCompleted ? chalk.green(current.isCompleted) : current.isCompleted}`)
    } catch (err) {
        console.error(err)
        return
    }
}

const showDetailsInteractive = async () => {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'count',
            message: 'Введите номер задачи:',
            validate: (input: string) => {
                if (!input) return 'Введите номер задачи';
                const num = parseInt(input);
                if (isNaN(num)) return 'Введите число';
                if (num < 1) return 'Номер должен быть больше 0';
                return true;   
            }
        }
    ]);

    showDetails(answers.count)
}

const completeTask = async (count: number): Promise<Task | undefined> => {
    let tasks = await getTasks();

    try {
        if (!tasks) throw new Error("Cant get tasks for remove")
        const taskIndex = count - 1;
        
        if (taskIndex < 0 || taskIndex >= tasks.length) {
            console.log(chalk.red(`❌ Задачи с номером ${count} не существует`));
            return;
        }

        const current = tasks[taskIndex];
        const filePath = path.resolve(__dirname, "tasks", `task${current.id}.json`)
        const newData = { ...current, isCompleted: true, id: current.id };
        await fs.writeFile(filePath, JSON.stringify(newData), "utf-8")
        console.log(chalk.green(`✅ Задача "${tasks[taskIndex].title}" выполнена!`));
    } catch (err) {
        console.error(err)
        return
    }
}

const completeTaskInteractive = async () => {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'count',
            message: 'Введите номер задачи:',
            validate: (input: string) => {
                if (!input) return 'Введите номер задачи';
                const num = parseInt(input);
                if (isNaN(num)) return 'Введите число';
                if (num < 1) return 'Номер должен быть больше 0';
                return true;   
            }
        }
    ]);

    completeTask(answers.count)
}

const Exit = async () => {
    console.log(chalk.yellow('\n👋 До свидания!\n'));
    rl.close();
    process.exit(1);
}

const CommandHandler = async (input: string): Promise<void> => {
    const trimmed = input.trim().toLowerCase();
    const [command] = trimmed.split(' ');

    switch(command) {
        case 'add':
            await createTaskInteractive();
            break;
        case 'list':
            await getTasks();
            break;
        case 'delete':
            await removeTaskInteractive();
            break;
        case 'details': 
            await showDetailsInteractive();
            break;
        case 'complete':
            await completeTaskInteractive();
            break;
        case 'exit':
            await Exit();
            break;
        default:
            await Help()
    }
    
    rl.prompt();
}

const RunProgram = async (): Promise<void> => {
    const tasks = await getTasks()
    Greeting()

    if (tasks && tasks.length > 0) {
        console.log(chalk.cyan('\n📋 Последние задачи:'));
        tasks.slice(-5).forEach(task => {
            const status = task.isCompleted ? '✅' : '⬜';
            console.log(`Task ${(tasks.indexOf(task)) + 1}:\n ${status} ${task.title} ${chalk.gray.italic("ID:")} ${chalk.gray.italic(task.id)}`);
        });
    }

    rl.prompt()

    rl.on('line', async (input: string) => {
        const trimmed = input.trim();
        
        if (trimmed === '') {
            console.log(chalk.gray('💡 Введите "help" для списка команд'));
            rl.prompt();
            return;
        }
        
        await CommandHandler(trimmed);
        rl.prompt();
    })

    rl.on('close', () => {
        console.log(chalk.yellow('\n👋 До свидания!\n'));
        process.exit(0);
    });
}

RunProgram()

