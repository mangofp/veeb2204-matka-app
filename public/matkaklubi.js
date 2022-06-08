function saadaKontakt() {
    const kontakt = {
        nimi: document.getElementById('nimi').value,
        markus: document.getElementById('markus').value
    }
    console.log(kontakt)
    document.getElementById('nimi').value = ''
    document.getElementById('markus').value = ''
}