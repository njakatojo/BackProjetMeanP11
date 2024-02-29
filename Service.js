class Service{
    constructor(data){
        this._id = data._id;
        this.nom  =  data.nom
        this.prix  =  data.prix
        this.duree = data.duree 
        this.commission = data.commission
    }
}
module.exports = Service