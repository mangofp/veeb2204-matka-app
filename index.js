const express = require('express')
const app = express()

const path = require('path')
const PORT = process.env.PORT || 5000

const matk1 = {
    id: 0,
    nimetus: "Süstamatk Soomaal",
    kirjeldus: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo veritatis ratione error a. Quod ipsam illum similique alias amet fugit, veritatis quasi? Voluptas magnam quis, consectetur eligendi fuga aliquid dicta?",
    pildiUrl: "/assets/syst1.jpg"
}

const matk2 = {
    id: 1,
    nimetus: "Rattamatk Jõgevamaal",
    kirjeldus: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo veritatis ratione error a. Quod ipsam illum similique alias amet fugit, veritatis quasi? Voluptas magnam quis, consectetur eligendi fuga aliquid dicta?",
    pildiUrl: "/assets/rattamatk.jpg"
}

const matk3 = {
    id: 2,
    nimetus: "Krabidega tutvumas",
    kirjeldus: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo veritatis ratione error a. Quod ipsam illum similique alias amet fugit, veritatis quasi? Voluptas magnam quis, consectetur eligendi fuga aliquid dicta?",
    pildiUrl: "/assets/syst_krabi.jpg"
}

const matk4 = {
    id: 3,
    nimetus: "Matk mägi-Eestis",
    kirjeldus: "Matkame mägedes ja orgudes",
    pildiUrl: "/assets/matkaja.png"
}

const matkad = [matk1, matk2, matk3, matk4]

function registreeriMatkale(req, res) {
    console.log(req.query)
    res.render("pages/kinnitus", {matk: matkad[req.query.id]} )
}

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index', {matkad: matkad}))
app.get('/test', (req, res) => res.render('pages/test'))
app.get('/kontakt', (req, res) => res.render('pages/kontakt'))
app.get('/kinnitus', registreeriMatkale)
app.get('/registreerumine/:matk', (req, res) => res.render('pages/registreerumine', {matk: matkad[req.params.matk]}))
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
