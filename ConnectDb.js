const { MongoClient } = require('mongodb')
// const url = 'mongodb://localhost:27017'
// const dbname = 'local'
const url = 'mongodb+srv://mongo:mongo1234@tpmeanp11.hx6pz9h.mongodb.net/?retryWrites=true&w=majority&appName=TpMeanP11'
const dbname = 'mongoproject'
class ConnectDb{
    constructor(){
        this.connecter()
    }
    async connecter() {
        try {
            this.client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
            this.client.connect();
            this.db = this.client.db(dbname); 
            console.log('Connecter a la base de donnee MongoDB')
        } catch (error) {
            console.error('erreur sur : ', error)
        }
    }

}
module.exports = new ConnectDb()
