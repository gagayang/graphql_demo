var sqlite3 = require('sqlite3').verbose()

class DB {
    constructor(path = './buildTest.db') {
        const that = this
        this.db = new sqlite3.Database(path, function () {
            that.db.run('create table message(id varchar2(100) primary key, content varchar2(50), author varchar2(3))')
        })
    }
    insertMessage(message) {
       return new Promise((reslove, reject) => {
            const sql = `INSERT INTO message(id, content, author) VALUES(${message.id}, ${message.content}, ${message.author})`
            this.db.prepare(`INSERT INTO message(id, content, author) VALUES(?, ?, ?)`,[message.id, message.content, message.author], function(err, res){
                console.log(res)
                console.log(err)
                if (err) {
                    reslove({
                        err
                    })
                } else {
                    reslove({
                        'success': true,
                        'data': message
                    })
                }
            })
        })

    }
    updateMessage(message) {
        const sql = `UPDATE message SET content = ${message.content}, author = ${message.author} WHERE id = ${message.id}`
        this.db.run(sql, function(err, res){
            if(err) {
                return {
                    err
                }
            } else {
                return {
                    success: true
                }
            }
        })
    }
    queryMessage(message) {
        const sql = `SELECT * FROM message WHERE id = ${message.id}`
        this.db.run(sql, function(err, res){
            if(err) {
                return {
                    err
                }
            } else {
                return {
                    success: true,
                    data: res
                }
            }
        })
    }
    deleteMessage(message) {
        const sql = `DELETE FROM message WHERE ID = ${message.id}`
        this.db.run(sql, function(err, res){
            if(err) {
                return {
                    err
                }
            } else {
                return {
                    success: true,
                    data: res
                }
            }
        })
    }
}
module.exports = DB