class Rendez_vous{
    constructor(data){
        this._id = data._id;
        this.client = data.client
        this.service  =  data.service
        this.employer  =  data.employer
        this.date_heure = data.duredate_heure
        this.etat = data.etat
        this.date_heure = data.date_heure
    }
}
module.exports = Rendez_vous