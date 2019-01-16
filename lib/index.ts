import { createInterface } from "readline"
import { createReadStream } from "fs"


export function doitnow<T>(p: () => Promise<T>): Promise<T> { return p() }

function _readFile(filename: string, callback: (err?: any, lines?: string[]) => void) {
    const rl = createInterface({
        input: createReadStream(filename),
        terminal: false
    })
    const ls: string[] = [];
    rl.on('line', function (e) {
        return ls.push(e as string);
    })
    rl.on('close', function () {
        callback(undefined, ls)
    })
}

export async function readFile(filename: string): Promise<string[]> {
    return new Promise<string[]>((res, rej) => {
        _readFile(filename, (err, ls) => {
            res(ls)
        })
    })
}

function _readStdin(callback: (err?: any, lines?: string[]) => void) {
    const ls: string[] = []
    createInterface({
        input: process.stdin,
        // output: process.stdout
    }).on('line', (l: string) => {
        ls.push(l)
    }).on('close', () => {
        callback(undefined, ls)
    })
}
export async function readStdin(): Promise<string[]> {
    return new Promise<string[]>((res, rej) => {
        _readStdin((err, ls) => {
            err ? rej(err) : res(ls)
        })
    })
}
