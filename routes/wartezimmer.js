const express = require('express');
const router = express.Router();

let wartezimmer = [];

router.get('/', wartezimmerListe);
router.post('/', personHinzufuegen);

function wartezimmerListe(req, res) {
    res.json(wartezimmer);
}

function personHinzufuegen(req, res) {
    setTimeout(function() {
        wartezimmer.push(req.body);
        res.sendStatus(200);
    }, 200);  // Wir verzögern die Antwort um 5ms
}

router.get('/:warteNr', einzelnePersonAnzeigen);
router.delete('/:warteNr', einzelnePersonLoeschen);

function einzelnePersonAnzeigen(req, res) {
    let warteNr = req.params.warteNr;
    console.log("Wartezimmer GET " + warteNr);

    let kunde = wartezimmer[warteNr];
    res.json(kunde);
}

function einzelnePersonLoeschen(req, res) {
    console.log("Wartezimmer DEL " + req.params.warteNr);

    // Wir sind schlampig und löschen immer die erste Person im Array,
    // egal welche Nummer wir erhalten
    let kunde = wartezimmer.shift();
    res.json(kunde);
}

module.exports = router;
