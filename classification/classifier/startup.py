# -*- coding: utf-8 -*-
from .trainer import Trainer

def populate(client, cache):
    populate_intents(client)
    populate_entities_for_meal(client)
    populate_entities_for_timetables(client)
    populate_entities_for_navigation(client)
    cache["intents"].load()
    cache["entities@timetables"].load()
    cache["entities@meal"].load()
    cache["entities@navigation"].load()
    cache["entities@learn"].load()
    cache["entities@test"].load()

def populate_intents(client):
    intents = Trainer("intents", client)
    intents.add_intent_to_trainingset("Guten Tag", "greeting", [], True)
    intents.add_intent_to_trainingset("Good day", "greeting", [], True)
    intents.add_intent_to_trainingset("Hallo", "greeting", [], True)
    intents.add_intent_to_trainingset("Hello", "greeting", [], True)
    intents.add_intent_to_trainingset("Hey", "greeting", [], True)
    intents.add_intent_to_trainingset("Hi", "greeting", [], True)
    intents.add_intent_to_trainingset("Servus", "greeting", [], True)
    intents.add_intent_to_trainingset("Grüß Gott", "greeting", [], True)
    intents.add_intent_to_trainingset("Grüße", "greeting", [], True)
    intents.add_intent_to_trainingset("Ave", "greeting", [], True)
    intents.add_intent_to_trainingset("Bonjour", "greeting", [], True)
    intents.add_intent_to_trainingset("Guten Morgen", "greeting", [], True)
    intents.add_intent_to_trainingset("Good morning", "greeting", [], True)
    intents.add_intent_to_trainingset("Guten Abend", "greeting", [], True)
    intents.add_intent_to_trainingset("Good evening", "greeting", [], True)
    intents.add_intent_to_trainingset("hello, good morning", "greeting", [], True)
    intents.add_intent_to_trainingset("hello, good evening", "greeting", [], True)
    intents.add_intent_to_trainingset("Moin", "greeting", [], True)
    intents.add_intent_to_trainingset("Can you tell me a joke?", "joke", [], True)
    intents.add_intent_to_trainingset("Erzähl mir einen Witz", "joke", [], True)
    intents.add_intent_to_trainingset("Erzähl mir etwas witziges", "joke", [], True)
    intents.add_intent_to_trainingset("Erzähl mir etwas lustiges", "joke", [], True)
    intents.add_intent_to_trainingset("Fun", "joke", [], True)
    intents.add_intent_to_trainingset("Funny", "joke", [], True)
    intents.add_intent_to_trainingset("Joke", "joke", [], True)
    intents.add_intent_to_trainingset("Kannst du mir einen Witz erzählen?", "joke", [], True)
    intents.add_intent_to_trainingset("Lachen", "joke", [], True)
    intents.add_intent_to_trainingset("Bring mich zum Lachen", "joke", [], True)
    intents.add_intent_to_trainingset("Laugh", "joke", [], True)
    intents.add_intent_to_trainingset("Tell me a joke", "joke", [], True)
    intents.add_intent_to_trainingset("Tell me something funny", "joke", [], True)
    intents.add_intent_to_trainingset("Witz", "joke", [], True)
    intents.add_intent_to_trainingset("Unterhalte mich", "joke", [], True)
    intents.add_intent_to_trainingset("Dinner", "meal", ["essen1", "essen2", "aktionstheke", "gutundguenstig", "buffet", "schnitzelbar"], True)
    intents.add_intent_to_trainingset("Eating", "meal", ["essen1", "essen2", "aktionstheke", "gutundguenstig", "buffet", "schnitzelbar"], True)
    intents.add_intent_to_trainingset("Essen", "meal", ["essen1", "essen2", "aktionstheke", "gutundguenstig", "buffet", "schnitzelbar"], True)
    intents.add_intent_to_trainingset("Food", "meal", ["essen1", "essen2", "aktionstheke", "gutundguenstig", "buffet", "schnitzelbar"], True)
    intents.add_intent_to_trainingset("Lunch", "meal", ["essen1", "essen2", "aktionstheke", "gutundguenstig", "buffet", "schnitzelbar"], True)
    intents.add_intent_to_trainingset("Meal", "meal", ["essen1", "essen2", "aktionstheke", "gutundguenstig", "buffet", "schnitzelbar"], True)
    intents.add_intent_to_trainingset("Mensa", "meal", ["essen1", "essen2", "aktionstheke", "gutundguenstig", "buffet", "schnitzelbar"], True)
    intents.add_intent_to_trainingset("Ich habe Hunger", "meal", ["essen1", "essen2", "aktionstheke", "gutundguenstig", "buffet", "schnitzelbar"], True)
    intents.add_intent_to_trainingset("Was gibt es zu Essen", "meal", ["essen1", "essen2", "aktionstheke", "gutundguenstig", "buffet", "schnitzelbar"], True)
    intents.add_intent_to_trainingset("Was gibt es in der Mensa", "meal", ["essen1", "essen2", "aktionstheke", "gutundguenstig", "buffet", "schnitzelbar"], True)
    intents.add_intent_to_trainingset("Wahlessen", "meal", ["essen1", "essen2", "aktionstheke", "gutundguenstig", "buffet", "schnitzelbar"], True)
    intents.add_intent_to_trainingset("Aktionstheke", "meal", ["essen1", "essen2", "aktionstheke", "gutundguenstig", "buffet", "schnitzelbar"], True)
    intents.add_intent_to_trainingset("Gut & Günstig", "meal", ["essen1", "essen2", "aktionstheke", "gutundguenstig", "buffet", "schnitzelbar"], True)
    intents.add_intent_to_trainingset("Buffet", "meal", ["essen1", "essen2", "aktionstheke", "gutundguenstig", "buffet", "schnitzelbar"], True)
    intents.add_intent_to_trainingset("Schnitzelbar", "meal", ["essen1", "essen2", "aktionstheke", "gutundguenstig", "buffet", "schnitzelbar"], True)
    intents.add_intent_to_trainingset("Garnicht", "notAtAll", [], True)
    intents.add_intent_to_trainingset("Not at all", "notAtAll", [], True)
    intents.add_intent_to_trainingset("Give me my timetable", "timetables", ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"], True)
    intents.add_intent_to_trainingset("Lecture", "timetables", ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"], True)
    intents.add_intent_to_trainingset("Stundenplan", "timetables", ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"], True)
    intents.add_intent_to_trainingset("Time table", "timetables", ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"], True)
    intents.add_intent_to_trainingset("Timetable", "timetables", ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"], True)
    intents.add_intent_to_trainingset("Was habe ich heute?", "timetables", ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"], True)
    intents.add_intent_to_trainingset("Welche Vorlesung hab ich heute?", "timetables", ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"], True)
    intents.add_intent_to_trainingset("What lecture do i have today?", "timetables", ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"], True)
    intents.add_intent_to_trainingset("What's on my schedule?", "timetables", ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"], True)
    intents.add_intent_to_trainingset("Wie sieht mein Tag aus?", "timetables", ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"], True)
    intents.add_intent_to_trainingset("Tell me about my day", "timetables", ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"], True)
    intents.add_intent_to_trainingset("Show me my schedule", "timetables", ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"], True)
    intents.add_intent_to_trainingset("Zeig mir meinen Stundenplan", "timetables", ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"], True)
    intents.add_intent_to_trainingset("weather", "weather", [], True)
    intents.add_intent_to_trainingset("Wie ist das Wetter?", "weather", [], True)
    intents.add_intent_to_trainingset("Wie wird das Wetter heute?", "weather", [], True)
    intents.add_intent_to_trainingset("Wird es heute schön?", "weather", [], True)
    intents.add_intent_to_trainingset("Wie ist es draußen", "weather", [], True)
    intents.add_intent_to_trainingset("Regnet es?", "weather", [], True)
    intents.add_intent_to_trainingset("Scheint die Sonne?", "weather", [], True)
    intents.add_intent_to_trainingset("Brauche ich einen Regenschirm?", "weather", [], True)
    intents.add_intent_to_trainingset("Brauche ich einen Schirm?", "weather", [], True)
    intents.add_intent_to_trainingset("Wie kalt ist es draußen?", "weather", [], True)
    intents.add_intent_to_trainingset("Wie warm ist es draußen?", "weather", [], True)
    intents.add_intent_to_trainingset("Brauche ich eine Jacke?", "weather", [], True)
    intents.add_intent_to_trainingset("Wer bist du?", "who", [], True)
    intents.add_intent_to_trainingset("Who are you?", "who", [], True)
    intents.add_intent_to_trainingset("Navigate", "navigation", ["Aula", "building E", "building F", "building LI", "building M", "building P", "building R", "cafeteria", "main entrance", "Mensa"], True)
    intents.add_intent_to_trainingset("Navigation", "navigation", ["Aula", "building E", "building F", "building LI", "building M", "building P", "building R", "cafeteria", "main entrance", "Mensa"], True)
    intents.add_intent_to_trainingset("Navigiere", "navigation", ["Aula", "building E", "building F", "building LI", "building M", "building P", "building R", "cafeteria", "main entrance", "Mensa"], True)
    intents.add_intent_to_trainingset("Route", "navigation", ["Aula", "building E", "building F", "building LI", "building M", "building P", "building R", "cafeteria", "main entrance", "Mensa"], True)
    intents.add_intent_to_trainingset("Show me the Way", "navigation", ["Aula", "building E", "building F", "building LI", "building M", "building P", "building R", "cafeteria", "main entrance", "Mensa"], True)
    intents.add_intent_to_trainingset("Do you know da way?", "navigation", ["Aula", "building E", "building F", "building LI", "building M", "building P", "building R", "cafeteria", "main entrance", "Mensa"], True)
    intents.add_intent_to_trainingset("Way", "navigation", ["Aula", "building E", "building F", "building LI", "building M", "building P", "building R", "cafeteria", "main entrance", "Mensa"], True)
    intents.add_intent_to_trainingset("Weg", "navigation", ["Aula", "building E", "building F", "building LI", "building M", "building P", "building R", "cafeteria", "main entrance", "Mensa"], True)
    intents.add_intent_to_trainingset("test", "test", ["buffet"], True)
    intents.add_intent_to_trainingset("lerne bitt etwas dazu", "learn", ["buffet"], True)
    intents.add_intent_to_trainingset("Würdest du mir den gefallen tun?", "learn", ["buffet"], True)
    intents.start_training()


def populate_entities_for_meal(client):
    entities_for_meal = Trainer("entities@meal", client)
    entities = Trainer("entities", client)

    ll = Trainer("entities@learn", client)
    ll.add_entity_to_trainingset("Buffet", "buffet")
    ll.start_training(entities=True)
    t = Trainer("entities@test", client)
    t.add_entity_to_trainingset("Buffet", "buffet")
    t.start_training(entities=True)

    #entities_for_meal.add_entity_to_trainingset("1", "essen1")
    #entities.add_entity_to_trainingset("1", "essen1")
    entities_for_meal.add_entity_to_trainingset("Wahlessen 1", "essen1")
    entities.add_entity_to_trainingset("Wahlessen 1", "essen1")
    #entities_for_meal.add_entity_to_trainingset("One", "essen1")
    #entities.add_entity_to_trainingset("One", "essen1")
    #entities_for_meal.add_entity_to_trainingset("Eins", "essen1")
    #entities.add_entity_to_trainingset("Eins", "essen1")
    #entities_for_meal.add_entity_to_trainingset("2", "essen2")
    #entities.add_entity_to_trainingset("2", "essen2")
    entities_for_meal.add_entity_to_trainingset("Wahlessen 2", "essen2")
    entities.add_entity_to_trainingset("Wahlessen 2", "essen2")
    #entities_for_meal.add_entity_to_trainingset("Two", "essen2")
    #entities.add_entity_to_trainingset("Two", "essen2")
    #entities_for_meal.add_entity_to_trainingset("Zwei", "essen2")
    #entities.add_entity_to_trainingset("Zwei", "essen2")
    #entities_for_meal.add_entity_to_trainingset("3", "aktionstheke")
    #entities.add_entity_to_trainingset("3", "aktionstheke")
    entities_for_meal.add_entity_to_trainingset("Aktionstheke", "aktionstheke")
    entities.add_entity_to_trainingset("Aktionstheke", "aktionstheke")
    #entities_for_meal.add_entity_to_trainingset("Three", "aktionstheke")
    #entities.add_entity_to_trainingset("Three", "aktionstheke")
    #entities_for_meal.add_entity_to_trainingset("Drei", "aktionstheke")
    #entities.add_entity_to_trainingset("Drei", "aktionstheke")
    #entities_for_meal.add_entity_to_trainingset("4", "gutundguenstig")
    #entities.add_entity_to_trainingset("4", "gutundguenstig")
    entities_for_meal.add_entity_to_trainingset("Gut & Günstig", "gutundguenstig")
    entities.add_entity_to_trainingset("Gut & Günstig", "gutundguenstig")
    entities_for_meal.add_entity_to_trainingset("Gut und Günstig", "gutundguenstig")
    entities.add_entity_to_trainingset("Gut und Günstig", "gutundguenstig")
    #entities_for_meal.add_entity_to_trainingset("Four", "gutundguenstig")
    #entities.add_entity_to_trainingset("Four", "gutundguenstig")
    #entities_for_meal.add_entity_to_trainingset("Vier", "gutundguenstig")
    #entities.add_entity_to_trainingset("Vier", "gutundguenstig")
    #entities_for_meal.add_entity_to_trainingset("5", "buffet")
    #entities.add_entity_to_trainingset("5", "buffet")
    #entities_for_meal.add_entity_to_trainingset("Fünf", "buffet")
    #entities.add_entity_to_trainingset("Fünf", "buffet")
    #entities_for_meal.add_entity_to_trainingset("Five", "buffet")
    #entities.add_entity_to_trainingset("Five", "buffet")
    entities_for_meal.add_entity_to_trainingset("Buffet", "buffet")
    entities.add_entity_to_trainingset("Buffet", "buffet")
    #entities_for_meal.add_entity_to_trainingset("6", "schnitzelbar")
    #entities.add_entity_to_trainingset("6", "schnitzelbar")
    entities_for_meal.add_entity_to_trainingset("Schnitzelbar", "schnitzelbar")
    entities.add_entity_to_trainingset("Schnitzelbar", "schnitzelbar")
    #entities_for_meal.add_entity_to_trainingset("Six", "schnitzelbar")
    #entities.add_entity_to_trainingset("Six", "schnitzelbar")
    #entities_for_meal.add_entity_to_trainingset("Sechs", "schnitzelbar")
    #entities.add_entity_to_trainingset("Sechs", "schnitzelbar")
    entities_for_meal.start_training(entities=True)


def populate_entities_for_timetables(client):
    entities_for_timetables = Trainer("entities@timetables", client)
    entities = Trainer("entities", client)

    entities_for_timetables.add_entity_to_trainingset("1", "Montag")
    entities.add_entity_to_trainingset("1", "Montag")
    entities_for_timetables.add_entity_to_trainingset("Monday", "Montag")
    entities.add_entity_to_trainingset("Monday", "Montag")
    entities_for_timetables.add_entity_to_trainingset("Montag", "Montag")
    entities.add_entity_to_trainingset("Montag", "Montag")
    entities_for_timetables.add_entity_to_trainingset("2", "Dienstag")
    entities.add_entity_to_trainingset("2", "Dienstag")
    entities_for_timetables.add_entity_to_trainingset("Tuesday", "Dienstag")
    entities.add_entity_to_trainingset("Tuesday", "Dienstag")
    entities_for_timetables.add_entity_to_trainingset("Dienstag", "Dienstag")
    entities.add_entity_to_trainingset("Dienstag", "Dienstag")
    entities_for_timetables.add_entity_to_trainingset("3", "Mittwoch")
    entities.add_entity_to_trainingset("3", "Mittwoch")
    entities_for_timetables.add_entity_to_trainingset("Mittwoch", "Mittwoch")
    entities.add_entity_to_trainingset("Mittwoch", "Mittwoch")
    entities_for_timetables.add_entity_to_trainingset("Wednesday", "Mittwoch")
    entities.add_entity_to_trainingset("Wednesday", "Mittwoch")
    entities_for_timetables.add_entity_to_trainingset("4", "Donnerstag")
    entities.add_entity_to_trainingset("4", "Donnerstag")
    entities_for_timetables.add_entity_to_trainingset("Thursday", "Donnerstag")
    entities.add_entity_to_trainingset("Thursday", "Donnerstag")
    entities_for_timetables.add_entity_to_trainingset("Donnerstag", "Donnerstag")
    entities.add_entity_to_trainingset("Donnerstag", "Donnerstag")
    entities_for_timetables.add_entity_to_trainingset("5", "Freitag")
    entities.add_entity_to_trainingset("5", "Freitag")
    entities_for_timetables.add_entity_to_trainingset("Friday", "Freitag")
    entities.add_entity_to_trainingset("Friday", "Freitag")
    entities_for_timetables.add_entity_to_trainingset("Freitag", "Freitag")
    entities.add_entity_to_trainingset("Freitag", "Freitag")
    entities_for_timetables.add_entity_to_trainingset("6", "Samstag")
    entities.add_entity_to_trainingset("6", "Samstag")
    entities_for_timetables.add_entity_to_trainingset("Saturday", "Samstag")
    entities.add_entity_to_trainingset("Saturday", "Samstag")
    entities_for_timetables.add_entity_to_trainingset("Samstag", "Samstag")
    entities.add_entity_to_trainingset("Samstag", "Samstag")
    entities_for_timetables.add_entity_to_trainingset("7", "Sonntag")
    entities.add_entity_to_trainingset("7", "Sonntag")
    entities_for_timetables.add_entity_to_trainingset("Sunday", "Sonntag")
    entities.add_entity_to_trainingset("Sunday", "Sonntag")
    entities_for_timetables.add_entity_to_trainingset("Sonntag", "Sonntag")
    entities.add_entity_to_trainingset("Sonntag", "Sonntag")
    entities_for_timetables.start_training(entities=True)


def populate_entities_for_navigation(client):
    entities_for_navigation = Trainer("entities@navigation", client)
    entities = Trainer("entities", client)

    entities_for_navigation.add_entity_to_trainingset("Gebäude A", "Aula")
    entities.add_entity_to_trainingset("Gebäude A", "Aula")
    entities_for_navigation.add_entity_to_trainingset("A", "Aula")
    entities.add_entity_to_trainingset("A", "Aula")
    entities_for_navigation.add_entity_to_trainingset("building A", "Aula")
    entities.add_entity_to_trainingset("building A", "Aula")
    entities_for_navigation.add_entity_to_trainingset("Aula", "Aula")
    entities.add_entity_to_trainingset("Aula", "Aula")
    entities_for_navigation.add_entity_to_trainingset("Bibliothek", "Aula")
    entities.add_entity_to_trainingset("Bibliothek", "Aula")
    entities_for_navigation.add_entity_to_trainingset("library", "Aula")
    entities.add_entity_to_trainingset("library", "Aula")
    entities_for_navigation.add_entity_to_trainingset("building E", "building E")
    entities.add_entity_to_trainingset("building E", "building E")
    entities_for_navigation.add_entity_to_trainingset("Gebäude E", "building E")
    entities.add_entity_to_trainingset("Gebäude E", "building E")
    entities_for_navigation.add_entity_to_trainingset("E", "building E")
    entities.add_entity_to_trainingset("E", "building E")
    entities_for_navigation.add_entity_to_trainingset("E Bau", "building E")
    entities.add_entity_to_trainingset("E Bau", "building E")
    entities_for_navigation.add_entity_to_trainingset("building F", "building F")
    entities.add_entity_to_trainingset("building F", "building F")
    entities_for_navigation.add_entity_to_trainingset("Gebäude F", "building F")
    entities.add_entity_to_trainingset("Gebäude F", "building F")
    entities_for_navigation.add_entity_to_trainingset("F", "building F")
    entities.add_entity_to_trainingset("F", "building F")
    entities_for_navigation.add_entity_to_trainingset("F Bau", "building F")
    entities.add_entity_to_trainingset("F Bau", "building F")
    entities_for_navigation.add_entity_to_trainingset("LI Bau", "building LI")
    entities.add_entity_to_trainingset("LI Bau", "building LI")
    entities_for_navigation.add_entity_to_trainingset("LI Gebäude", "building LI")
    entities.add_entity_to_trainingset("LI Gebäude", "building LI")
    entities_for_navigation.add_entity_to_trainingset("LI building", "building LI")
    entities.add_entity_to_trainingset("LI building", "building LI")
    entities_for_navigation.add_entity_to_trainingset("LI", "building LI")
    entities.add_entity_to_trainingset("LI", "building LI")
    entities_for_navigation.add_entity_to_trainingset("building M", "building M")
    entities.add_entity_to_trainingset("building M", "building M")
    entities_for_navigation.add_entity_to_trainingset("Gebäude M", "building M")
    entities.add_entity_to_trainingset("Gebäude M", "building M")
    entities_for_navigation.add_entity_to_trainingset("M", "building M")
    entities.add_entity_to_trainingset("M", "building M")
    entities_for_navigation.add_entity_to_trainingset("M Bau", "building M")
    entities.add_entity_to_trainingset("M Bau", "building M")
    entities_for_navigation.add_entity_to_trainingset("building P", "building P")
    entities.add_entity_to_trainingset("building P", "building P")
    entities_for_navigation.add_entity_to_trainingset("P", "building P")
    entities.add_entity_to_trainingset("P", "building P")
    entities_for_navigation.add_entity_to_trainingset("P Bau", "building P")
    entities.add_entity_to_trainingset("P Bau", "building P")
    entities_for_navigation.add_entity_to_trainingset("Gebäude P", "building P")
    entities.add_entity_to_trainingset("Gebäude P", "building P")
    entities_for_navigation.add_entity_to_trainingset("R Bau", "building R")
    entities.add_entity_to_trainingset("R Bau", "building R")
    entities_for_navigation.add_entity_to_trainingset("building R", "building R")
    entities.add_entity_to_trainingset("building R", "building R")
    entities_for_navigation.add_entity_to_trainingset("R", "building R")
    entities.add_entity_to_trainingset("R", "building R")
    entities_for_navigation.add_entity_to_trainingset("Gebäude R", "building R")
    entities.add_entity_to_trainingset("Gebäude R", "building R")
    entities_for_navigation.add_entity_to_trainingset("cafeteria", "cafeteria")
    entities.add_entity_to_trainingset("cafeteria", "cafeteria")
    entities_for_navigation.add_entity_to_trainingset("cafe", "cafeteria")
    entities.add_entity_to_trainingset("cafe", "cafeteria")
    entities_for_navigation.add_entity_to_trainingset("coffee", "cafeteria")
    entities.add_entity_to_trainingset("coffee", "cafeteria")
    entities_for_navigation.add_entity_to_trainingset("Haupteingang", "main entrance")
    entities.add_entity_to_trainingset("Haupteingang", "main entrance")
    entities_for_navigation.add_entity_to_trainingset("main entrance", "main entrance")
    entities.add_entity_to_trainingset("main entrance", "main entrance")
    entities_for_navigation.add_entity_to_trainingset("Hochschuleingang", "main entrance")
    entities.add_entity_to_trainingset("Hochschuleingang", "main entrance")
    entities_for_navigation.add_entity_to_trainingset("Wappen", "main entrance")
    entities.add_entity_to_trainingset("Wappen", "main entrance")
    entities_for_navigation.add_entity_to_trainingset("Mensa", "Mensa")
    entities.add_entity_to_trainingset("Mensa", "Mensa")
    entities_for_navigation.add_entity_to_trainingset("Mensa Moltke", "Mensa")
    entities.add_entity_to_trainingset("Mensa Moltke", "Mensa")
    entities_for_navigation.add_entity_to_trainingset("food court", "Mensa")
    entities.add_entity_to_trainingset("food court", "Mensa")
    entities_for_navigation.start_training(entities=True)
