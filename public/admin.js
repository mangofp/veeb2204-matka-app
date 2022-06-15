console.log('admin.js töötab')
let matkadeMassiiv = []

async function loeOsalejad(matkaId) {
    let vastus = await fetch('/api/registreerumised/' + matkaId)
    const osalejad = await vastus.json()
    console.log(osalejad)
    return osalejad
}

async function loeMatkad() {
    let vastus = await fetch('/api/matkad')
    let matkad = await vastus.json()
    console.log(matkad)
    if (matkad) {
        matkadeMassiiv = matkad
    }
    naitaMatkadeMenyyd(matkad)
    naitaOsalejateVaade(0)
    return matkad
}

function naitaMatkadeMenyyd(matkad) {
    const matkadMenyyElement = document.getElementById('matkad-menyy')
    let valjund = ''
    for (matk of matkad) {
        valjund += `
        <button class="btn btn-link admin-matk-menyy" onclick="naitaOsalejateVaade(${matk.id})">
           ${matk.nimetus} 
        </button>
        `
    }
    matkadMenyyElement.innerHTML = valjund
}

async function naitaOsalejateVaade(matkaId) {
    console.log(matkaId)
    const matk = matkadeMassiiv[matkaId]
    const matkadAndmedElement = document.getElementById('matkad-andmed')
    let valjund = `
    <h2>${matk.nimetus}</h2>
    <div class="admin-matk-kirjeldus">
        ${matk.kirjeldus}
    </div>
    `
    valjund += `
    <div class="row">
        <div class="col-6 col-md-4">
            nimi
        </div>
        <div class="col-6 col-md-4">
            email
        </div>
        <div class="col-12 col-md-4">
            märkus
        </div>
    </div>
    `

    const osalejad = await loeOsalejad(matkaId)
    for (osaleja of osalejad) {
        valjund += `
        <div class="row">
            <div class="col-6 col-md-4">
                ${osaleja.nimi}
            </div>
            <div class="col-6 col-md-4">
                ${osaleja.email}
            </div>
            <div class="col-12 col-md-4">
                ${osaleja.markus}
            </div>
        </div>
        `
    }

    matkadAndmedElement.innerHTML = valjund
}


loeOsalejad(0)
loeMatkad()

