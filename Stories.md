# Datagrafer
En användare ska kunna välja en datastation på kartan och i denna station kunna skapa en graf genom att välja två tidpunkter och få all data mellan dessa punkter placerade i en graf.

I nuläget går det att rita upp en graf mellan två datum, dock så finns det ingen felhantering vilket gör att programmet kraschar om det inte finns data i det valda intervallet. För att korrigera detta problem kommer gruppen implementera felhantering så att programmet inte kraschar när det saknas data utan rita upp grafen med noll värden där datan saknas. 

Detta är en implementation av föregående arbete, nu visualiserar gruppen datan i grafer som hämtas från trafikverkets API. Detta är även kopplat till uppladdningen av data från en användare då denna data också kommer användas i graferna. 

Ett test för detta fallet är t.ex.:
Välja en väderstation på kartan och “lägg till”
Klicka på “grafer”
Välja ett tidsintervall
Se om datan visas (korrekt)

### Total Tid: 56 timmar

## Tasks
### Förstå/refaktorera tidigare implementationen.
* Beskrivning: Bygga en djupare förståelse för hur graferna är implementerade i projektet i sitt nuvarande tillstånd.
* Beroende: Detta är första steget i storyn därav är den inte beroende av tidigare steg.
* Tidsuppskattning: 8 timmar
* Risk: Låg.


### Förstå vad som är fel i tidigare implementation
* Beskrivning: Debugga de relevanta funktionerna för att ta reda på vilken/vilka funktioner som producerar fel i grafhämtningsprocessen.
* Beroende: Detta är beroende av [Förstå/Refaktorera tidigare implementation](#förstårefaktorera-tidigare-implementationen).
* Tidsuppskattning: 8 timmar.
* Risk: Låg.


### Lös det
* Beskrivning: Hitta en lösning på grafhämtningsproccesens fel.
* Beroende: Detta är beroende av [Förstå vad som är fel i tidigare implementation](#förstå-vad-som-är-fel-i-tidigare-implementation).
* Tidsuppskattning:16 timmar.
* Risk: medel.



### Implementation av felhantering
* Beskrivning: Bygga upp ett felhanteringssystem när en användare skapar en graf.
* Beroende: Detta är beroende av [Lös det](#lös-det).
* Tidsuppskattning: Detta är en större Task än tidigare och får därmed betydligt mer tid ca 20 timmar där testing är 3 timmar av tiden. 
* Risk: Hög. Problem med den tidigare funktionen då felhanteringen kan förändra hur funktionen är implementerad. 

# Friktionsvärdesskala
Likt den redan existerande temperaturskalan så är friktionvärdeskalans uppgift att ge en visuell översyn, i detta fall över hur friktionsförhållandet mellan bil och väg ser ut över landet. Olika friktionvärdeintervall kommer att representeras utav olika färger i färgskalan.
Den bör vara lätt att avläsa, inte förbruka mycket kraft samt att designen är enhetlig med den nuvarande designen.

### Total Tid: 12 timmar

## Testfall:
### Fall 1
* Handling: Observera friktionvärdeskalan och dess färger och jämför dem med färgerna utritade på kartan.
* Förväntat Resultat: Friktionsvärdesskalan bör ge en visuell uppfattning om hur friktionsvärdet skiljer sig över landet. Så användaren lätt kan se var det är kallt och varmt.
### Fall 2
* Handling: Tryck på knappen i botten av temperatur- eller friktionvärdeskalan.
* Förväntat Resultat: Den valda skalan bör minimeras så att endast knappen kvarstår.

## Tasks:
### Implementera friktionvärdeskalan visuellt på hemsidan.
* Beroende: Detta är det allra första steget i storyn och är därmed ej beroende av någon annan task.
* Tidsuppskattning: Utvecklingstiden ligger på cirka 4 timmar och sen testning ytterligare 2 timmar för att säkerställa att det fungerar som det ska i olika vyer. Samt att utvecklaren måste sätta sig in i javascript.
* Risker: Det är en obefintlig risk att ej hinna med denna task då tiden är relativt låg och det är den första uppgiften. 


### Skapa en knapp som gör det möjligt att dölja temperatur- och friktionvärdeskalan.
* Beroende: Detta är beroende av [Implementera friktionsvärdeskalan visuellt på hemsidan](#implementera-friktionvärdeskalan-visuellt-på-hemsidan).
* Tidsuppskattning: Cirka 4 timmar. Då temperaturskalan redan existerar så krävs det att omarbeta redan existerande kod för att skapa mer modulära css klasser för knappar och skalor. Testning cirka 2 timmar, då en knapp är lätt att testa så gäller det mer att söka efter oväntade buggar då man omarbetar koden.
* Risker: Beroende på hur lätt koden är att omarbeta så kan tiden variera lite grann, men den bör bli färdigutvecklad under sprint 1.

### Ge lämpliga friktionvärdeintervall till skalan. Innan vi får en friktiondatafil där man kan läsa av vilka de lämpligaste intervallen är så kommer platshållarvärden att användas.
* Beroende: Detta är beroende av [Implementera friktionsvärdeskalan visuellt på hemsidan](#implementera-friktionvärdeskalan-visuellt-på-hemsidan).
* Tidsuppskattning: Under en timme för både implementation och testning. Det tar inte lång tid att ändra enkla värden samt att testa så de visas korrekt.
* Risker: Då denna task ej kan startas innan friktiondatafilen är tillgänglig så är det svårt exakt när den finns. Så länge filen blir tillgänglig innan sprintens slut så kommer task:en att genomföras.




# Uppladdning av XML-fil

En användare, Sofia får friktiondata från Trafikverket och ska kunna ladda upp datan till webbservern.

Det ska finnas en knapp som tar upp en ruta där man kan bläddra och välja en XML-fil att ladda upp. Denna ruta ska ha checkboxes som beskriver vilket format datan har. Datan ska sedan parsas och laddas upp i databasen. Om datan har fel format så ska användaren få ett lämpligt felmeddelande. Då datan som laddas upp är känslig så ska överföringen vara säker.


### Total tid: 28 timmar
## Testfall
1. Klicka på knappen för att ladda upp ny friktiondata
1. Välj en XML-fil och rätt format för denna fil.
1. Ladda upp datan.
1. Se att datan har laddats upp i databasen.

## Tasks:
### Lägg till en knapp som tar upp en modal(ruta)/navigerar till en ny sida för att ladda upp en lokal XML-fil
* Beskrivning: Knappen tar upp en ruta eller navigerar till en ny sida där användaren sedan ska kunna ladda upp en XML-fil. 
* Beroende: Då resten av denna story utvecklas på i denna ruta/sida så måste det här göras först. 
* Tidsåtgång: Då utvecklarna är nybörjare inom detta område så förväntas denna uppgift ta 6 timmar.
* Risk: Låg.



### Modalen
* Beskrivning: Modalen ska visa en simpel vy där redan uppladdad fil syns samt en knapp “Bläddra” för att öppna ett ytterligare fönster för att välja fil
* Beroende: Detta är beroende av [Lägg till en knapp som tar upp en modal(ruta)/navigerar till en ny sida för att ladda upp en lokal XML-fil](#lägg-till-en-knapp-som-tar-upp-en-modalrutanavigerar-till-en-ny-sida-för-att-ladda-upp-en-lokal-xml-fil).
* Tidsåtgång: 1 dag, ingen av utvecklarna har gjort en Modal i node. 
* Risk: Medel.


### Research om lämpligt bibliotek för att kunna ladda upp lokal XML-fil
* Beskrivning: En användare ska kunna ladda upp en XML-fil. För att göra detta så ska hjälp av ett lämpligt bibliotek användas. Uppgiften för utvecklare blir att leta efter ett bibliotek som klarar av denna uppgift.
* Beroende: Inget beroende då research inte beror på nått.
* Tidsåtgång: 2 timmar.
* Risk: Då det finns en risk att det bibliotek man väljer i början inte fungerar som man vill så kan eventuellt mer tidsåtgång behövas. Risken bedöms till medel.

### Välj en lokal XML-fil
* Beskrivning: En användare ska kunna välja en XML fil, vid knapptryckning på “Bläddra” skall vyn för att manövrera sig i filstrukturen och välja en XML fil visas.
* Beroende: 
  * [Modalen](#modalen)
  * [Research om lämpligt bibliotek för att kunna ladda upp lokal XML-fil](#research-om-lämpligt-bibliotek-för-att-kunna-ladda-upp-lokal-xml-fil)
* Tidsåtgång: 5 timmar, 
* Risk: Låg/Medel, Ifall det inte finns i färdigt i valda bibliotek.

### Skicka filen till webbservern
* Beskrivning: När filen har valts så ska den sparas i en variabel på webbservern innan parsing påbörjas. Rimligtvis kommer biblioteket som väljer en lokal fil lösa detta problem.
* Beroende: [Välj en lokal XML-fil](#välj-en-lokal-xml-fil).
* Tidsåtgång: 0 timmar
* Risk: Hög då det är osäkert hur detta kommer funka.

### Kolla på ett bibliotek för att parsa XML
* Beskrivning: Datan som kommer från en XML-fil måste kunna parsas. En utvecklare måste kolla och välja ett bibliotek som klarar av denna uppgift givet att filen redan finns sparad i en variabel.
* Beroende: Inget beroende.
* Tidsåtgång: 2 timme.
* Risk: Låg.


### Parsa data
* Beskrivning: Datan i XML-Filen sparas i olika arrays. Använd ett bibliotek för att parsa XML. Om formatet på filen inte matchar vad webbservern förväntar sig så ge ett lämpligt fel.
* Beroende:
  * [Skicka filen till webbservern](#skicka-filen-till-webbservern)
  * [Kolla på ett bibliotek för att parsa XML](#kolla-på-ett-bibliotek-för-att-parsa-xml)
* Tidsåtgång: 7 timmar.
* Risk: Låg


### Spara i Databasen
* Beskrivning: Webbservern gör om arraysen till lämpliga SQL-Queries.
* Beroende: [Parsa data](#parsa-data)
* Tidsåtgång: 4 timmar, utvecklarna är bekväma med MySQL
* Risk: Låg

