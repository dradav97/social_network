const mysql = require('mysql2')

const config = require('../config')

const dbConfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
}

let connection

function handlecon() {
    connection = mysql.createConnection(dbConfig)

    connection.connect((err)=>{
        if(err){
            console.error('[db error]', err)
            setTimeout(handlecon, 2000)
        }else {
            console.log('DB Connected!')
        }
    })

    connection.on('error', err=> {
        console.error('[db error]', err)
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            handlecon()
        }else {}
    })

}

handlecon()

function list(table){
    return new Promise( (resolve,reject)=>{
        connection.query(`SELECT * FROM ${table}`, (err,data)=>{
            if(err) return reject(err)
            resolve(data)
        })
    })
}

function get(table, id){
    return new Promise( (resolve,reject)=>{
        connection.query(`SELECT * FROM ${table} WHERE id='${id}'`, (err,data)=>{
            if(err) return reject(err)
            resolve(data)
        })
    })
}

function insert(table, data){
    return new Promise( (resolve,reject)=>{
        connection.query(`INSERT INTO ${table} SET ?`,data, (err,result)=>{
            if(err) return reject(err)
            resolve(result)
        })
    })
}

function update(table, data){
    return new Promise( (resolve,reject)=>{
        connection.query(`UPDATE ${table} SET ? WHERE id=?`, [data, data.id], (err,result)=>{
            if(err) return reject(err)
            resolve(result)
        })
    })
}

function upsert(table, data){
    get(table, data.id)
        .then( (result)=>{
            if(result.length === 0){
                return insert(table, data)
            }else{
                return update(table, data)
            }
        })
        .catch( (err)=>{
            return console.error(err)
        })
    
}

function query(table, query){
    return new Promise((resolve, reject)=>{
        connection.query(`SELECT * FROM ${table} WHERE ?`, query, (err,res)=>{
            if(err) return reject(err)
            resolve(res[0] || null)
        })
    })
}

module.exports = {
    list,
    get,
    insert,
    upsert,
    query,
}