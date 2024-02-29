const express = require('express');
const cors = require('cors')
const port = 8282;
const app = express();
const requestHandlers = require('./requestHandlers');
const ConnectDb = require('./ConnectDb');
const { MongoClient } = require('mongodb');
const { ObjectId  } = require('mongodb')
const Manager = require('./Manager');
const Employer = require('./Employer');
const Client = require('./Client');
const Utilitaire = require('./Utilitaire');
const Service = require('./Service');
const path = require('path');
const classMapping = {
    Manager,
    Employer,
    Client,
    Service,
};
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'public', 'views')); 
app.use(express.json())
app.use(cors({
    origin: 'https://m1p10mean-njaka-joston-g9oz.vercel.app',
    credentials: true,
}));
const utilitaire = new Utilitaire()
app.get('/', async (req, res) => {
    const uri = 'mongodb+srv://mongo:mongo1234@tpmeanp11.hx6pz9h.mongodb.net/?retryWrites=true&w=majority&appName=TpMeanP11';
    const dbName = 'mongoproject';
    const collection = await ConnectDb.db.listCollections().toArray()
    console.log('liste collections : ', collection.map(collection => collection.name))
    res.status(201).json(collection)
}).post('/login/:modele', async (req, res) => {
    const Connection = ConnectDb.db
    try {
        const login = req.body.email
        const mdp = req.body.mdp
        const modele = req.params.modele  
        const taille = await utilitaire.Seconnecter(Connection,modele,login,mdp)
        res.status(201).json(taille)
    } catch (error) { 
        console.error(error)
        res.status(500).send('Erreur de Serveur')
    }
}).post('/inscription/:modele', async (req, res) => {
    const Connection = ConnectDb.db
    try {
        const login = req.body.email
        const mdp = req.body.mdp
        const modele = req.params.modele 
        const taille = await utilitaire.Seconnecter(Connection,modele,login,mdp)
        const construct = classMapping[modele]
        if (construct) {
            const New = new constructor(req.body) 
            console.log(New)
            if (taille === 0) {
                await ConnectDb.db.collection(modele).insertOne(New);
                if (modele == 'Employer') {
                    const employer = await utilitaire.GetByEmail(Connection,"Employer",login)
                    const horaire = {
                        employer: {
                          _id: employer._id,
                          nom: employer.nom,
                          prenom: employer.prenom,
                          email: employer.email
                        },
                        lundi: { rentrer: "08:00", duree: 8 },
                        mardi: { rentrer: "08:00", duree: 8 },
                        mercredi: { rentrer: "8:00", duree: 8 },
                        jeudi: { rentrer: "8:00", duree: 8 },
                        vendredi: { rentrer: "8:00", duree: 8 },
                        samedi: { rentrer: "8:00", duree: 8 }
                    };
                    await Connection.collection("Horaire").insertOne(horaire);
                }
                res.status(201).json(New)
            }else{
                res.status(201).json(0)
            }
        }else{
            console.error('class non trouver')
        } 
    } catch (error) { 
        console.error(error)
        res.status(500).send('Erreur de Serveur')
    }
}).post('/nouveau_service', async (req, res) => {
    const service = req.body
    console.log(service)
    await ConnectDb.db.collection('Service').insertOne(new constructor(service));
}).post('/nouveau_rendez_vous', async (req, res) => {
    const rendez_vous = req.body
    const Rdv = new constructor(rendez_vous)
    const dateH = Rdv.date_heure
    const id_cl = Rdv.client._id
    await ConnectDb.db.collection('Rendez_vous').insertOne(new constructor(rendez_vous));
    const Rendez = await utilitaire.GetRDVByIdCl(ConnectDb.db,"Rendez_vous",id_cl,dateH)
    await ConnectDb.db.collection('Payement').insertOne({id_Rdv: Rendez._id,etat: 0});
}).get('/liste_service', async (req, res) => {
    try {
        const collection = ConnectDb.db.collection('Service')
        const liste_service = await collection.find().toArray()
        res.status(201).json(liste_service)
    } catch (error) { 
        console.error(error)
        res.status(500).send('Erreur de Serveur')
    }
}).get('/liste_employer', async (req, res) => {
    try {
        const collection = ConnectDb.db.collection('Employer')
        const liste_employer = await collection.find().toArray()
        res.status(201).json(liste_employer)
    } catch (error) { 
        console.error(error)
        res.status(500).send('Erreur de Serveur')
    }
}).get('/liste_rendez_vous/:id', async (req, res) => {
    try {
        const id = req.params.id 
        const collection = ConnectDb.db.collection('Rendez_vous')
        const liste_rendez_vous = await collection.find({"client._id": id}).toArray()
        res.status(201).json(liste_rendez_vous)
    } catch (error) { 
        console.error(error)
        res.status(500).send('Erreur de Serveur')
    }
}).get('/liste_rendez_vous_employer/:id', async (req, res) => {
    try {
        const id = req.params.id 
        const collection = ConnectDb.db.collection('Rendez_vous')
        const liste_rendez_vous = await collection.find({"employer._id": id}).toArray()
        res.status(201).json(liste_rendez_vous)
    } catch (error) { 
        console.error(error)
        res.status(500).send('Erreur de Serveur')
    }
}).get('/lister/:modele', async (req, res) => {
    try {
        const modele = req.params.modele 
        const collection = ConnectDb.db.collection(modele)
        const listepersonne = await collection.find().toArray()
        res.status(201).json(listepersonne)
    } catch (error) { 
        console.error(error)
        res.status(500).send('Erreur de Serveur')
    }
}).get('/recherche/:modele/:motcle', async (req, res) => {
    try {
        const modele = req.params.modele 
        const motcle = req.params.motcle 
        const collection = await ConnectDb.db.collection(modele)
        const listepersonne = await collection.find(
            {
                $or: [
                    { nom: {$regex: motcle, $options: 'i'} },
                    { prenom: {$regex: motcle, $options: 'i'} },
                    { email: {$regex: motcle, $options: 'i'} },
                  ]
            }
        ).toArray()
        res.status(201).json(listepersonne)
    } catch (error) { 
        console.error(error)
        res.status(500).send('Erreur de Serveur')
    }
}).get('/getById/:modele/:id', async (req, res) => {
    try {
        const modele = req.params.modele 
        const id = req.params.id  
        const collection = await ConnectDb.db.collection(modele)
        const listepersonne = await collection.find({"_id": new ObjectId(id)}).toArray()
        res.status(201).json(listepersonne)
    } catch (error) { 
        console.error(error)
        res.status(500).send('Erreur de Serveur')
    }
}).get('/getHoraire/:id', async (req, res) => {
    try {
        const modele = "Horaire"
        const id = req.params.id  
        const collection = await ConnectDb.db.collection(modele)
        const listepersonne = await collection.find({"employer._id": new ObjectId(id)}).toArray()
        res.status(201).json(listepersonne)
    } catch (error) { 
        console.error(error)
        res.status(500).send('Erreur de Serveur')
    }
}).get('/updateHoraire/:jour/:id/:nouveaurentrer', async (req, res) => {
    try {
        const modele = "Horaire"
        const id = req.params.id  
        const jour = req.params.jour  
        const nouveaurentrer = req.params.nouveaurentrer  
        const collection = await ConnectDb.db.collection(modele)
        const filter = { _id: new ObjectId(id) }; // Filtrer le document à mettre à jour par son _id
        const update = {
            $set: {
              [jour] : {
                rentrer : nouveaurentrer,
                duree : 8
              },
              // Ajoutez d'autres champs à mettre à jour selon vos besoins
            }
          };
        const result = await collection.updateOne(filter, update);
        res.status(201).json(result)
    } catch (error) { 
        // console.error(error)
        res.status(500).send('Erreur de Serveur')
    }
}).post('/updateService', async (req, res) => {
    try {
        const Service = req.body
        const modele = "Service"
        const id = Service.id  
        const nom = Service.nom  
        const prix = Service.prix  
        const duree = Service.duree  
        const commission = Service.commission  
        const collection = await ConnectDb.db.collection(modele)
        const filter = { _id: new ObjectId(id) }; 
        const update = {
            $set: {
                id : new ObjectId(id),
                nom : nom,
                prix : prix,
                duree : duree,
                commission: commission
            }
          };
        const result = await collection.updateOne(filter, update);
        res.status(201).json(result)
    } catch (error) { 
        // console.error(error)
        res.status(500).send('Erreur de Serveur')
    }
}).get('/payer/:idRdv', async (req, res) => {
    try {
        const id = req.params.idRdv  
        const collection = await ConnectDb.db.collection("Rendez_vous")
        const filter = { _id: new ObjectId(id) }; 
        const update = {
            $set: {
                etat : 1
            }
          };
        const result = await collection.updateOne(filter, update);
        res.status(201).json(result)
    } catch (error) { 
        // console.error(error)
        res.status(500).send('Erreur de Serveur')
    }
});
// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${port}/`);
});