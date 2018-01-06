# Friseur-Problem

Siehe z.B. https://en.wikipedia.org/wiki/Sleeping_barber_problem

## Services

* routes/friseur.js: schläft, wenn nichts zu tun ist; schneidet sonst Haare 
  und sieht im Wartezimmer nach neuer Kundschaft
* routes/wartezimmer.js: im Wesentlichen eine Queue aller wartenden Personen
* routes/lock.js: einfache Implementierung eines Lock-Mechanismus
  (in diesem Kontext auch [Semaphore](https://en.wikipedia.org/wiki/Semaphore_(programming)) genannt)
  
## Client

* client/kunde.js: schaut bei Friseur nach und weckt ihn auf oder geht ins Wartezimmer

## Anmerkungen

Es werden so gut wie keine Fehlerfälle behandelt, nur der "happy path".