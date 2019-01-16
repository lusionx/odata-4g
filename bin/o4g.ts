import yargs from 'yargs'
import moment from 'moment'
import axios from 'axios'
import { doitnow, readFile, readStdin } from '../lib'
import { parse } from '../lib/conv'
import * as act from '../lib/x-action'


const argv = yargs.usage('Usage $0 --patch [Type]  --input [cid]')
    .alias('i', 'input')
    .help('h').alias('h', 'help')
    .argv

process.nextTick(async () => {
    const lines = await doitnow(async () => {
        const input = argv['input'] as string
        if (input) {
            return await readFile(input)
        } else {
            return await readStdin()
        }
    })
    const obj = await parse(lines.join(''))
    const res = new Map<string, string>()
    for (const sch of obj.DataServices) {
        sch.EntityTypes ? sch.EntityTypes.map(t => {
            if (argv['patch'] === t.Name) {
                res.set(argv['patch'] + t.Name, act.patch(t))
            }
        }) : undefined
    }
    [...res.values()].map(e => console.log(e))
    console.log(JSON.stringify(obj))
})

process.on("unhandledRejection", (error) => {
    const { response, config } = error
    if (config && response) {
        return console.error({ config, data: response.data })
    }
    console.error(error)
})
