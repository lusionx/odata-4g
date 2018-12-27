import yargs from 'yargs'
import moment from 'moment'
import axios from 'axios'


const argv = yargs.usage('Usage $0 --component [cid]')
    .demand('component')
    .alias('c', 'component')
    .choices('c', [])
    .help('h').alias('h', 'help')
    .argv

process.nextTick(async () => {
    console.log(moment())
    console.log(axios.arguments)
})
