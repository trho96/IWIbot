# IWIbot Classifier

IWIbot Classifier ist ein Text Classification Module, das Neuronale Netzwerke benutzt. Es basiert auf den Algorithmen aus [Text Classification using Neural Networks](https://machinelearnings.co/text-classification-using-neural-networks-f5cd7b8765c6) und ist Teil des IWIbot Projekts der [Hochschule Karlsruhe](https://hs-karlsruhe.de). Das Classification Module wird als eine Python Flask App bereitgestellt und kann auf die IBM Cloud deployt werden.

Dieses Dokument soll dabei helfen die Entwicklungsumgebung für den IWIbot Classifier aufzusetzen und soll hilfreiche Tipps geben für die weitere Entwicklung. 

## Voraussetzungen

Folgende Komponenten werden benötigt:
* [IBM Cloud account](https://console.ng.bluemix.net/registration/)
* [Cloud Foundry CLI](https://github.com/cloudfoundry/cli#downloads)
* [Git](https://git-scm.com/downloads)
* [Python](https://www.python.org/downloads/)
* [PyCharm](https://www.jetbrains.com/pycharm/) (optional)

## 1. Clone die IWIbot App

Clone das IWIBot Repository und gehe in das Verzeichnis in dem sich der IWIBot Classifier befindet.

  ```
git clone https://github.com/HSKA-IWI-VSYS/IWIbot
cd IWIbot/classification
  ```

## 2. Führe den Classifier lokal aus

Installiere die Abhängigkeiten die in der [requirements.txt ![External link icon](../../icons/launch-glyph.svg "External link icon")](https://pip.readthedocs.io/en/stable/user_guide/#requirements-files) gelistet sind um den Classifier lokal ausführen zu können.

Es ist möglich optional eine [virtuellle Umgebung ![External link icon](../../icons/launch-glyph.svg "External link icon")](https://packaging.python.org/installing/#creating-and-using-virtual-environments) zu erstellen um zu verhindern das die Abhängigkeiten mit anderen in anderen Python Projekten konfligieren oder dem Betriebssystem.
  ```
pip install -r requirements.txt
  ```

Führe den Classifier aus.
  ```
python rest.py
  ```
  
In PyCharm kann die **rest.py** auch einfach gestartet und debugged werden.  

 Eine Webtest-Oberfläche befindet sich unter: http://localhost:8000

## 3. Bereite den Classifier für das Deployment vor

Um in die IBM Cloud zu deployen, ist es wichtig das manifest.yml richtig zu konfigurieren. Der Classifier kommt mit einem bereits vorkonfigurierten Manifest.

Das manifest.yml beinhaltet Basis-Informationen über die zu den Classifier, wie den Namen in der Cloud, wie viel Speicher für pro Instanz alloziert werden soll und die Route. Im aktuellen manifest.yml **random-route: false** generiert den Classifier immer unter der gleichen Route. Sollen mehrere Classifier Instanz deployen werden kann dies in **random-route: true** geändert werden und es wird eine zufällige Route erzeugt die einen Konflikt mit anderen verhindert.  Es ist auch möglich **random-route: false** mit **host: IWIbotChosenHostName**, um einen Hostnamen selbst zu wählen. [Weitere Informationen...](https://console.bluemix.net/docs/manageapps/depapps.html#appmanifest)
 ```
 applications:
 - name: IWIBotClassifier
   random-route: false
   memory: 128M
 ```

## 4. Deploye den Classifier

Es ist möglich den Classifier über die Cloud Foundry CLI zu deployen.

Wähle den passenden API Endpunkt
   ```
cf api <API-endpoint>
   ```

Ersetze das *API-endpoint* im Befehl mit einem API endpoint aus der folgenden Liste.

|URL                             |Region          |
|:-------------------------------|:---------------|
| https://api.ng.bluemix.net     | US South       |
| https://api.us-east.bluemix.net| US East        |
| https://api.eu-de.bluemix.net  | Germany        |
| https://api.eu-gb.bluemix.net  | United Kingdom |
| https://api.au-syd.bluemix.net | Sydney         |


Loge in deinen IBM Cloud Account

  ```
cf login
  ```

Aus dem *classification* Verzeichnis heraus pushe den Classifier in die IBM Cloud
  ```
cf push IWIBotClassifier -b https://github.com/cloudfoundry/buildpack-python.git
  ```
Der Classifier wird immer mit der aktuellen Python Version deployt in der **runtime.txt** kann die Python Version angepasst werden.

Das Deployen kann einige Minuten dauern. Kommt es zu Fehlern im Deployment Prozess kann mit dem Befehl `cf logs IWIBotClassifier --recent` der Fehler gesucht werden.

Nach abgeschlossenem Deployment sollte eine Meldung anzeigen das der Classifier läuft.  Nun ist es möglich den Classifier unter der gelisteten URL in der Ausgabe des push Befehls anzusprechen.  Es ist auch möglich den Befehl
  ```
cf apps
  ```
  auszuführen um eine Übersicht über den Status des Classifiers einzusehen und um die URL zu sehen.

## 5. Eine Datenbank hinzufügen

Der Classifier benötigt eine NoSQL Datenbank zum persistieren seiner Daten. Aus diesem Grund wird der IBM Cloud ein Service hinzugefügt der diese bereitstellt und es findet die Konfiguration diese Datenbank in der IBM Cloud als auch lokal zu verwenden. 

1. Öffne IBM Cloud in deinem Browser. Öffne das `Dashboard`. Wähle den Classifier aus durch klicken auf den Namen in der `Name` Spalte.
2. Wähle `Connections`/`Verbindungen` aus und dann `Connect new`/`Neue verbdinen`. (Optional kann auch eine bereits erstelle verbunden werden)
2. Im `Data & Analytics` Bereich, wähle `Cloudant NoSQL DB` und `Create` den Service.
3. Wähle `Restage` wenn gefragt wird. Die IBM Cloud wird den Classifier neu starten und die Datenbank Credentials für den Classifier bereitstellen mit der`VCAP_SERVICES` Umgebungsvariable. Diese Umgebungsvariable ist nur verfügbar wenn der Classifier auf der IBM Cloud ausgeführt wird.

Umgebungsvariablen ermöglichen es die Deployment Einstellungen vom Quellcode zu separieren, es ist also nicht nötig ein Datenbank Passwort im COde zu setzen, es ist auch mögliche diese Umgebungsvariable im Quellcode zu speichern.

**Warnung:** Beim ersten Starten des Classifiers auf der IBM Cloud kann es bei einer neuen Datenbank dazu kommen das mit einer Lite Strategie der Classifier nicht startet da das initiale mehr Anfragen an die Datenbank pro Sekunde stellt als die Strategie erlaubt.  Es wird empfohlen die Datenbank lokal zu fühlen mit **Breakpoints** in der popolute Funktion.

## 6. Benutze die Datenbank lokal

Um den Classifier lokal auszuführen ist es nötig lokal eine Verbindung mit der Datenbank aufzubauen. Dafür wird eine JSON Datei die die Credentials für den zu benutzenden Datenbank Service speichert. Diese Datei wird NUR verwendet wenn der Classifier lokal ausgeführt wird. Falls es in der IBM Cloud ausgeführt wird, werden die Credentials aus der VCAP_SERVICES Umgebungsvariable gelesen.

1. Erstelle eine Datei mit Namen `vcap-local.json` im `IWIbotClassifier` Verzeichnis mit dem folgenden Inhalt:
  ```
  {
    "services": {
      "cloudantNoSQLDB": [
        {
          "credentials": {
            "username":"CLOUDANT_DATABASE_USERNAME",
            "password":"CLOUDANT_DATABASE_PASSWORD",
            "host":"CLOUDANT_DATABASE_HOST"
          },
          "label": "cloudantNoSQLDB"
        }
      ]
    }
  }
  ```

2. In der IBM Cloud UI, wähle den Classifier -> Connections/Verbindungen -> Cloudant -> View Credentials

3. Kopiere und ersetze die `username`, `password`, und `host` aus den Credentials in das selbe Feld als in der `vcap-local.json` Datei und ersetze **CLOUDANT_DATABASE_USERNAME**, **CLOUDANT_DATABASE_PASSWORD**, und **CLOUDANT_DATABASE_URL**.

4. Führe den Classifier local aus.
  ```
python rest.py
  ```

oder starte den Classifier in PyCharm.

  Der Classifier kann unter: http://localhost:8000 getestet werden. Der Text der in das Feld eingeben wird, wird dann klassifiziert und das Resultat wird ausgegeben.

5. Mache die Änderungen die du willst und re-deploye zur IBM Cloud!
  ```
cf push IWIBotClassifier -b https://github.com/cloudfoundry/buildpack-python.git
  ```

Schaue die Instanz an unter der gelisteten URL in der Ausgabe des push Befehls, zum Beispiel, *iwibotclassifier.mybluemix.net*.
