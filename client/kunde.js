const Request = require('request');
const FriseurStatus = require('../routes/friseur').FriseurStatus;
const Lock = require('../routes/lock');

const hostUrl = "http://localhost:3000";

// Wir erzeugen eine zufällige Kunden-ID bzw. holen uns die aus der Kommandozeile
let kundenId = process.argv.length < 3 ? 'kunde-' + Math.round(Math.random()*5000) : process.argv[2];

console.log("Meine Kunden-ID ist " + kundenId);

// Start des Prozesses
Lock.aquire(starteProzess);

/**
 * Nachschauen was der Friseur macht und dann aufwecken oder ins
 * Wartezimmer gehen
 */
function starteProzess() {
    // Wir schauen uns an, was der Friseur macht
    Request.get(hostUrl + '/friseur', function (error, response, body) {
        if (error) {
            throw error;
        }
        let friseur = JSON.parse(body);

        if (friseur.status === FriseurStatus.schlafend) {
            console.log("Der Friseur schläft...");
            friseurAufwecken(friseur);
        } else if (friseur.status === FriseurStatus.schneidend) {
            console.log("Der Friseur ist beschäftigt...");
            setTimeout(insWartezimmerGehen, 200);
        } else {
            throw (new Error("unbekannter Friseur-Status"));
        }
    });
}

function friseurAufwecken(friseur) {

    let antwortVomAufwecken = function(error, response, body) {
        console.log("Friseur aufgewacht: " + body);
        Lock.free();
    };

    // Wir wecken den Friseur auf uns setzen uns selbst als Kunde ein
    friseur.status = FriseurStatus.schneidend;
    friseur.kunde = kundenId;

    Request.post({
            url: hostUrl + '/friseur',
            json: friseur
        }, antwortVomAufwecken
    );
}

function insWartezimmerGehen() {

    let antwortVomWartezimmer = function (error, response, body) {
        console.log("Ins Wartezimmer gegangen: " + body);
        Lock.free();
    };

    Request.post({
            url: hostUrl + '/wartezimmer',
            json: { kundenId: kundenId }
        }, antwortVomWartezimmer
    );
}