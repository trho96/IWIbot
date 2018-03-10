# Navigation
Das Navigationsfeature des IWIBots bietet eine Navigation auf dem Campus der Hochschule Karlsruhe an. Der Nutzer kann sich anhand von Wegpunkten und einer Karte von seinem aktuellen Standort an bestimmte Wegpunkte navigieren lassen. Die Navigation besteht aus einem Navigation-Service im Backend und einer Frontend-Logik mit einer interaktiven Karte.
Es ist außerdem möglich, auf dem Server Events zu hinterlegen, die an eine Location gebunden sind. Läuft der Nutzer in einen bestimmten Bereich, kann ihm so über den Chat eine positionsbezogene Nachricht ausgegeben werden.
## Backend

### coordinates.txt

Die coordinates.txt Datei gibt den Aufbau des Hochschul-Campus fuer den IWI-Bot an. Die Datei ist dabei nach einem bestimmten Format aufgebaut:
+ Wegpunkte werden auf der obersten Ebene mit ; getrennt. Sprich, split(‘;‘) auf den Dateiinhalt als String gibt ein Array aller Wegpunkte zurück.
+ Die verschiedenen Arten von Informationen in einem Wegpunkt werden mit : getrennt Sprich, split(‘:‘) auf einen Wegpunkt als String gibt ein Dreiertupel bestehend aus Koordinaten, Name und Nachbarn des Wegpunktes als Array zurück (Werte des Tupels stehen jeweils in einem String).
+ Die Wegpunkt-Informationen werden mit , getrennt. Sprich, spilt(‘‚‘) auf die Wegpunktkoorinaten gibt ein Zweiertupel bestehend aus Längengrad und Breitengrad zurück. Angewandt auf die Nachbarn gibt spilt(‘‚‘) ein Array aller Nachbarn, sprich aller vom Wegpunkt aus erreichbarer Wegpunkte, aus.

Der Name eines Wegpunktes ist auch gleichzeitig seine Navigationsanweisung. Zum Beispiel würde ein Wegpunkt mit dem Namen „XYZ“ bei erreichen seines Vorgängers in der Navigation zur Navigationsanweisung „Gehe links/rechts/geradeaus XYZ“ führen. 
Es reicht in der Theorie aus eine Erreichbarkeit zwischen zwei Wegpunten einmal in coordinates.txt anzugeben. Die Applikation wird automatisch schließen, dass diese Erreichbarkeit auch umgekehrt gilt. Aus Gründen der Übersichtlichkeit wird jedoch dazu geraten,  für jeden Wegpunkt immer alle Nachbarn in seiner Zeile in coordinates.txt anzugeben.
Leerzeichen werden sind im Namen in coordinates.txt als Unterstriche anzugeben. Sprich der Name „Bau G Eingang“ sollte in coordinates.txt als „Bau_G_Eingang“ geschrieben werden. In der letzendlichen Textausgabe im IWI-Bot werden die Unterstriche wieder in Leerzeichen abgeaendert.

**Aktuelle Wegpunkte (annavigierbare Wegpunkte sind rot markiert; Stand: 4.3.2018):**

![](https://github.com/StefanFCMD/IWIbot/blob/master/documentation/images/Waypoints.png?raw=true)

### Router-Funktion locationEvents.js
In dieser Klasse werden die Location-Basierten Events behandelt. Dieser erste Prototyp bildet nur eine erste Demo der Funktionalität: Der Client sendet seine aktuelle Position und die Funktion durchsucht ein hart codiertes Array nach auf dem Server gespeicherten Events. Falls für die übermittelte Position ein Event gefunden wurde, werden die entsprechenden Daten an den Client zurückgeliefert und schließlich dem Nutzer angezeigt.  
Die Idee hinter dieser Funktionalität ist, dass dieses Script in einem nächsten Schritt in eine Openwhisk-Action ausgelagert werden könnte, die sich um Location-basierte Events kümmert. Man könnte diese in einer Datenbank oder einem Cache (a la Redis) ablegen und bei jeder Nachfrage eines Clients an den Server abrufen. Diese Struktur würde es außerdem ermöglichen, dass Clients Events einstellen und, wenn der IWIBot um ein Benutzer- und Rollensystem erweitert werden würde, Benutzer- und Rollenspezifische Events zu implementieren.

### Ablauf Navigationsstart

Das starten der Navigation läuft nach folgendem Muster ab:
+ 1. Durch ein Codewort (z.B. „navigation“) wird dem IWI-Bot signalisiert, dass man eine Navigation starten will. Er wird daraufhin nach dem Zielort fragen und in der JSON- Antwort ein positionFlag uebermitteln, welches das Frontend darauf hinweist, dass es bei der nächsten Anfrage GPS-Coordinaten erheben und an den IWI-Bot als Meta-Daten mitübermitteln soll.
+ 2. Man gibt den Zielort an. Dieser wird vom Conversation-Service erkannt und der entsprechende Index des Zielortes wird an den Navigation-Service weitergegeben. Der Navigation-Service baut daraufhin einen Graphen aus coordinates.txt und findet den nächsten Wegpunkt zur aktuellen Position des Nutzers und brechnet per Dijkstra-Algorithmus die schnellste Route zum Zielort. Der Weg wird daraufhin als Array an das Frontend zurückgegeben und die Navigation wird dort gestartet. Für jeden Wegpunkt werden sein Name/Navigationsanweisung sowie seine Koordinaten uebermittelt.

## Frontend

Die Darstellung der Navigation wird im Frontend über den Chat und zusätzlich über eine Karte abgewickelt. Dafür existieren für die Navigation 2 neue Scripts: map.js und locationEventHandler.js.
### map.js
 Dieses Javascript ist dafür da, die Kartendarstellung zu verwalten. Dazu gehört das initialisieren der Karte mit den richtigen Parametern, automatischer Zoom und das verwalten von allen Linien und Markierungen auf der Karte. Dies wird in einem eigenen Skript realisiert, damit alle anderen Frontend-Funktionen auf dieselbe Karte zugreifen können und nicht jede Funktion eine neue Karte rendert. Die Kartendarstellung an sich wird mit leaflet.js (http://leafletjs.com/) realisert, einer Open-Source Library, die es ermöglicht die verschiedensten interaktiven Karten zu erstellen. Als Map Tiles werden die Map Tiles von Open Street Map verwendet.  
In diesem Script werden nur die für diese Anwendung notwendigen Funktionen von leaflet bereitgestellt. Es stellt sozusagen ein Interface zwischen Frontend und der leaflet-Library dar. Werden weitere leaflet-Funktionen im Frontend benögtigt, sollte nach Möglichkeit dieses Skript angepasst werden um die einheitliche Darstellung und nur einmaliges Rendering der Karte zu bewahren.
### locationEventHandler.js
Dieses Script ist für die Navigationslogik im Frontend zuständig. Es verwaltet alle Location-bezogenen Daten, die im Frontend benutzt werden. Für die Navigation wird der Pfad, der im Backend im Navigation-Service berechnet wurde, an dieses Script übergeben, damit es dafür sorgen kann, dass die richtigen Anweisungen abhängig von der aktuellen GPS-Position ausgerechnet und an den Nutzer ausgegeben werden. Außerdem wird hier die Kartendarstellung anhand der Navigationsdaten und der Positionsdaten aktualisiert, wenn sich die Bedingungen ändern. Hier können außerdem auch andere Location-basierte Events angelegt werden und somit darauf reagiert werden, wenn der Nutzer einen bestimmten Bereich betritt. Außerdem wird immer der Server informiert, sobald ein Benutzer eine neue Navigationsanweisung erhält. Der Server kann dann mit einer positionsbezogenen Nachricht antworten, die dem Nutzer dann über den Chat angezeigt wird.  
Konkret funktioniert die Navigation im Frontend so, dass ein Array an Wegpunkten vom Backend angenommen wird. Dieses wird als Navigationspfad gespeichert. Jede Sekunde wird vom System die aktuelle GPS-Position angefragt. Bei jeder dieser Anfragen wird das Wegpunkt-Array durchlaufen und falls der aktuelle Punkt innerhalb eines Bereiches um einen Wegpunkt liegt die neue Navigationsanweisung gegeben und der Server über den neuen Standort informiert. Dann wird das Wegpunkt-Array um den aktuellen und alle vor diesem Punkt liegenden Wegpunkten gekürzt, sodass nur noch der "übrige" Weg gespeichert und angezeigt wird. Dies verhindert einerseits, dass ein Wegpunkt doppelt angelaufen werden kann und verhindert außerdem verwirrende Anweisungen falls sich der Nutzer doch zurück bewegt hat oder einen anderen Weg als vorgesehen gelaufen ist.  
![](https://github.com/jakaZ0806/IWIbot/blob/master/documentation/images/navigation_frontend.PNG?raw=true)
