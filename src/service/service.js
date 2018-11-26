var Message = require( '../bean/message')
class Service {
    constructor(DB) {
        this.db = DB
        console.log(DB.insertMessage)
    }
    getMessage({id}) {
        const message = this.db.queryMessage(id)
        if(message.success) {
            message.data = new Message(id, message.data)
        }
        return message
    }
    createMessage({input}) {
        var id = require('crypto').randomBytes(10).toString('hex')
        var mes = new Message(id, input)
        this.db.insertMessage(mes).then(res => {
            console.log(res)
            const message = res
            if(message.success) {
                message.data = new Message(id, input)
            }
            return message
        })

    }
    updateMessage({id, input}) {
        const message = this.db.updateMessage({id, input})
        if(message.success) {
            message.data = new Message(id, input)
        }
        return message
    }
    deleteMessage({id}) {
        const message = this.db.deleteMessage({id})
        if(message.success) {
            message.data = new Message(id, message.data)
        }
        return message
    }
}
module.exports = Service