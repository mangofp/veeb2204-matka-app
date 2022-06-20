const express = require('express')
const { MongoClient } = require('mongodb')
const app = express()

const path = require('path')
const PORT = process.env.PORT || 5000

const andmebaas = "matka-app"
const salasona = "HerneSupp12"
const mongoUrl = `mongodb+srv://matka-app:${salasona}@cluster0.lcorlm9.mongodb.net/${andmebaas}?retryWrites=true&w=majority`

const client = new MongoClient(mongoUrl)

const matk1 = {
    id: 0,
    nimetus: "Süstamatk Soomaal",
    kirjeldus: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo veritatis ratione error a. Quod ipsam illum similique alias amet fugit, veritatis quasi? Voluptas magnam quis, consectetur eligendi fuga aliquid dicta?",
    pildiUrl: "/assets/syst1.jpg",
    osalejaid: 0,
    kohti: 10
}

const matk2 = {
    id: 1,
    nimetus: "Rattamatk Jõgevamaal",
    kirjeldus: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo veritatis ratione error a. Quod ipsam illum similique alias amet fugit, veritatis quasi? Voluptas magnam quis, consectetur eligendi fuga aliquid dicta?",
    pildiUrl: "/assets/rattamatk.jpg",
    osalejaid: 0,
    kohti: 10
}

const matk3 = {
    id: 2,
    nimetus: "Krabidega tutvumas",
    kirjeldus: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo veritatis ratione error a. Quod ipsam illum similique alias amet fugit, veritatis quasi? Voluptas magnam quis, consectetur eligendi fuga aliquid dicta?",
    pildiUrl: "/assets/syst_krabi.jpg",
    osalejaid: 0,
    kohti: 10
}

const matk4 = {
    id: 3,
    nimetus: "Matk mägi-Eestis",
    kirjeldus: "Matkame mägedes ja orgudes",
    pildiUrl: "/assets/matkaja.png",
    osalejaid: 0,
    kohti: 10
}

const matkad = [matk1, matk2, matk3, matk4]

let uudised = [
    {
      id:0,
      pealkiri: "Uudis 1",
      kokkuvote: 'Lühike tekst',
      tekst: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium quas dolore fugiat earum cum libero exercitationem fugit facere voluptatibus incidunt, illo iste eos. Facilis veritatis quos molestias dicta itaque rerum!",
      pildiUrl: "/assets/syst_krabi.jpg",
    },
    {
      id:1,
      pealkiri: "Uudis 2",
      kokkuvote: 'Lühike tekst',
      tekst: `
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        </p>
        <p>
          Laudantium quas dolore fugiat earum cum 
          libero <strong>exercitationem fugit</strong> facere voluptatibus incidunt, 
          illo iste eos. Facilis veritatis quos molestias dicta 
        </p>
        <h4>
          Tavaline alapealkiri
        </h4>
        <p>
          itaque rerum!
        </p>  
          `
        ,
      pildiUrl: "/assets/syst1.jpg",
    },
    {
      id:3,
      pealkiri: "Uudis 3",
      kokkuvote: 'Lühike tekst',
      tekst: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium quas dolore fugiat earum cum libero exercitationem fugit facere voluptatibus incidunt, illo iste eos. Facilis veritatis quos molestias dicta itaque rerum!",
      pildiUrl: "/assets/syst_krabi.jpg",
    }
  ]

let registreerumised = []  

async function laeRegistreerumised() {
    await client.connect();
    const database = client.db(andmebaas)
    const osalejadCol = database.collection("osalejad")
    const tulemus = await osalejadCol.find().toArray()
    //TODO: Vaja lisada kontroll, et andmete lugemine õnnestus
    console.log('Laetud registreerumised')
    console.log(tulemus)
    registreerumised = tulemus
    await client.close()
}

function annaMatkaleRegistreerunud(matkaId) {
    const tulemus = []

    for (const registreerumine of registreerumised) {
        if (registreerumine.id == matkaId) {
            tulemus.push(registreerumine)
        }
    }
    return tulemus
}

async function registreeriMatkale(req, res) {
    if (!matkad[req.query.id]) {
        res.send('Registreerumine ebaõnnestus. Proovi uuesti')
        return
    }

    if (!req.query.email) {
        res.send('Registreerumine ebaõnnestus. Email puudub')
        return
    }
    const uusRegistreerumine = req.query

    await client.connect();
    const database = client.db(andmebaas)
    const osalejadCol = database.collection("osalejad")
    const result = await osalejadCol.insertOne(uusRegistreerumine)
    await client.close()

    console.log("Lisati uus registreerumine")
    console.log(uusRegistreerumine)

    registreerumised.push(uusRegistreerumine)

    const registreerunuid =  annaMatkaleRegistreerunud(req.query.id)   
    matkad[req.query.id].osalejaid = registreerunuid.length

    res.render("pages/kinnitus", {matk: matkad[req.query.id]} )
    console.log(registreerumised)
}

async function lisaMatk(req, res) {
    const uusMatk = req.query
    //TODO: Lisa uus matk andmebaasi kollektsiooni matkad
    //analoogiliselt uue registreerumise lisamisele
    await client.connect();
    const database = client.db(andmebaas)
    const  matkadCol = database.collection("matkad")
    const result = await matkadCol.insertOne(uusMatk)
    console.log('Uus lisatav matk:')
    console.log(uusMatk)
    
    res.send(uusMatk)
}

laeRegistreerumised()
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index', {matkad: matkad}))
app.get('/test', (req, res) => res.render('pages/test'))
app.get('/kontakt', (req, res) => res.render('pages/kontakt'))
app.get("/uudised", (req, res) => res.render("pages/uudised", { uudised: uudised }))
app.get("/uudis/:id", (req, res) => res.render("pages/uudis", { uudis: uudised[req.params.id] }))
app.get('/kinnitus', registreeriMatkale)
app.get('/registreerumine/:matk', (req, res) => res.render('pages/registreerumine', {matk: matkad[req.params.matk]}))
app.get('/api/registreerumised/:id', (req, res) => res.send(annaMatkaleRegistreerunud(req.params.id))) 
app.get('/api/lisaMatk', lisaMatk)
app.get('/api/matkad', (req,res) => res.send(matkad))
app.get('/admin', (req, res) => res.render("pages/admin"))


app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
