# Navigation

## coordinates.txt

Die coordinates.txt Datei gibt den Aufbau des Hochschul-Campus fuer den IWI-Bot an. Die Datei ist dabei nach einem bestimmten Format aufgebaut:
+ Wegpunkte werden auf der obersten Ebene mit ; getrennt. Sprich, split(‘;‘) auf den Dateiinhalt als String gibt ein Array aller Wegpunkte zurück.
+ Die verschiedenen Arten von Informationen in einem Wegpunkt werden mit : getrennt Sprich, split(‘:‘) auf einen Wegpunkt als String gibt ein Dreiertupel bestehend aus Koordinaten, Name und Nachbarn des Wegpunktes als Array zurück (Werte des Tupels stehen jeweils in einem String).
+ Die Wegpunkt-Informationen werden mit , getrennt. Sprich, spilt(‘‚‘) auf die Wegpunktkoorinaten gibt ein Zweiertupel bestehend aus Längengrad und Breitengrad zurück. Angewandt auf die Nachbarn gibt spilt(‘‚‘) ein Array aller Nachbarn, sprich aller vom Wegpunkt aus erreichbarer Wegpunkte, aus.

Der Name eines Wegpunktes ist auch gleichzeitig seine Navigationsanweisung. Zum Beispiel würde ein Wegpunkt mit dem Namen „XYZ“ bei erreichen seines Vorgängers in der Navigation zur Navigationsanweisung „Gehe links/rechts/geradeaus XYZ“ führen. 
Es reicht in der Theorie aus eine Erreichbarkeit zwischen zwei Wegpunten einmal in coordinates.txt anzugeben. Die Applikation wird automatisch schließen, dass diese Erreichbarkeit auch umgekehrt gilt. Aus Gründen der Übersichtlichkeit wird jedoch dazu geraten,  für jeden Wegpunkt immer alle Nachbarn in seiner Zeile in coordinates.txt anzugeben.
Leerzeichen werden sind im Namen in coordinates.txt als Unterstriche anzugeben. Sprich der Name „Bau G Eingang“ sollte in coordinates.txt als „Bau_G_Eingang“ geschrieben werden. In der letzendlichen Textausgabe im IWI-Bot werden die Unterstriche wieder in Leerzeichen abgeaendert.

**Aktuelle Wegpunkte (annavigierbare Wegpunkte sind rot markiert; Stand: 4.3.2018):**
[[https://github.com/StefanFCMD/IWIbot/blob/master/documentation/images/Waypoints.png]]

## Ablauf Navigationsstart

Das starten der Navigation läuft nach folgendem Muster ab:
+ 1. Durch ein Codewort (z.B. „navigation“) wird dem IWI-Bot signalisiert, dass man eine Navigation starten will. Er wird daraufhin nach dem Zielort fragen und in der JSON- Antwort ein positionFlag uebermitteln, welches das Frontend darauf hinweist, dass es bei der nächsten Anfrage GPS-Coordinaten erheben und an den IWI-Bot als Meta-Daten mitübermitteln soll.
+ 2. Man gibt den Zielort an. Dieser wird vom Conversation-Service erkannt und der entsprechende Index des Zielortes wird an den Navigation-Service weitergegeben. Der Navigation-Service baut daraufhin einen Graphen aus coordinates.txt und findet den nächsten Wegpunkt zur aktuellen Position des Nutzers und brechnet per Dijkstra-Algorithmus die schnellste Route zum Zielort. Der Weg wird daraufhin als Array an das Frontend zurückgegeben und die Navigation wird dort gestartet. Für jeden Wegpunkt werden sein Name/Navigationsanweisung sowie seine Koordinaten uebermittelt. 
