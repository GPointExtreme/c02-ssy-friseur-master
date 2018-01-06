const Request = require('request');
const express = require('express');
const router = express.Router();

// Status des Locks: true ... Lock aktiv/besetzt; false ... Lock frei
let lock = false;

router.get('/', readLock);

// Aktuellen Status ausgeben
function readLock(req, res) {
    res.json(lock);
}

// PUT-Route (PUT, weil Status aktualisiert wird)
router.put('/', updateLock);

function updateLock(request, response) {
    // Parameter auslesen
    let newstate = request.body.lockValue;

    // False -> True // True -> False
    if (newstate !== lock) {
        lock = newstate;
        console.log("Lock-Update: " + lock);
        response.json("success");
    }
    // False -> False // True -> True
    else {
        console.log("Fehler bei Lock-Update");
        response.json("error");
    }
}


/**
 * Lock sichern [für exklusiven Zugriff]
 * Falls fehlgeschlagen: solange weiterprobieren, bis es klappt
 */
function aquireLock(naechsterSchritt) {

    let antwortVonLock = function (error, response, body) {
        if (body === "success") {
            naechsterSchritt();    // Erfolgreich --> dann legen wir los
        } else {
            // Fehler --> wir probieren es in 500ms noch mal
            // Wir müssen den aquireLock-Aufruf in eine anonyme Funktion einpacken,
            // weil setTimeout nur Funktionen ohne Parameter akzeptiert
            setTimeout(function() { aquireLock(naechsterSchritt) }, 500);
        }
    };

    Request.put({
        url: "http://localhost:3000/lock",
        json: { lockValue: true }
    }, antwortVonLock);
}

/**
 * Lock wieder freigeben, indem wir den Lock-Status auf false setzen
 * Antwort ignorieren wir.
 */
function freeLock() {
    Request.put({
        url: 'http://localhost:3000/lock',
        json: { lockValue: false }
    });
}


module.exports = {
    router: router,
    aquire: aquireLock,
    free: freeLock
};
