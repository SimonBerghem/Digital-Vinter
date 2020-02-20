# 1 Inledning
## 1.1 Bakgrund
I detta projekt finns det mycket material att utgå från då projektet har funnits ett flertal år där flera projektgrupper har arbetat med projektet. Föregående grupper har gjort mycket av grundarbetet, där de hämtar data från Trafikverkets API lägger det på en server och sedan tar datan från servern till en hemsida/webbserver. På hemsidan visualiseras datan på en karta där det enkelt går att se alla sensorer som finns. klicka på sensorerna för att se den senaste bilden sensorn har tagit och mätdatan från sensorn. Det behov som behöver mötas är att förbättra den nuvarande lösning med till exempel felhantering även så behövs en utveckling av den nuvarande lösning. Denna utveckling är inte fastställd än men det finns ett flertal ideér såsom att implementera vägar på kartan och färger på vägarna beronde på väg temperaturen. 

## 1.2 Problembeskrivning
Projektet bygger vidare på en tidigare lösning. Trafikverket var nöjd med denna lösning och vill vidareutveckla den. Problematiken blir att ta ägandeskap av nuvarande lösning och sedan förbättra och utveckla lösningen.


## 1.3 Uppgift
Uppgiften i detta projekt består av att vidareutveckla projektet “Road condition monitoring and visualization” som har utvecklats i kursen D0020E under tidigare år. Projektet går ut på att skapa ett verktyg för aggregation och analys av data för vägförhållanden. Första steget för att kunna vidareutveckla projektet är att studera det tidigare arbetet, förstå hur de har arbetat, förstå hur deras kod hänger samman och sen även att lära sig om programmeringsspråken som de har använt. Sedan skall en intervju med områdes-experten äga rum för att reda på vilka funktioner hon önskar samt så ska den föregående gruppens backlog tas del av. Det för att få en bra uppfattning utav framtida utvecklingar vi kan implementera i projektet. Efter jul börjar utvecklingsfasen där de önskade funktionerna implementeras och testas.
 

## 1.4 Avgränsning
Projektgruppen kommer inte göra några flera moduler då dem är redan färdiga. Det är ej tänkt att göra några större ändringar i backend och databasen. Istället så skall fokuset ligga på att utveckla funktionalitet samt att förfina existerande funktioner såsom grafer.

<br/><br/>
<br/><br/>

# 2 Systemdesign
Figuren nedan är ett modul-diagram över nuvarande lösning. Då uppgiften är att förbättra/bygga på denna lösning så kommer den ha samma struktur fast med några ändrade detaljer. Diagrammet beskriver hur en backend kommunicerar med trafikverkets API Datex II och fyller i en databas. APIet är skrivet i programmeringsspråket Rust. Frontend vilket är skrivet i JavaScript kommunicerar med databasen och använder sig av paket som OpenStreetMap för att visa en karta över Sverige. Strukturen på systemet ska reflektera dataflödet.


<img src="ModulDiagram.png"
     alt="Modul-diagram"
     style="float: left; margin-right: 10px;" />



### 3.2 Arbetstillvägagång

Vi har först suttit tillsammans i grupp och skrivit ihop stories och medföljande tasks efter vad vår produktägare Sofia Sollén (expert)  har begärt. Därefter har vi delegerat ut dem efter intresse så att alla känt sig nöjda. Då vi är ett udda antal i gruppen så delade vi upp oss 2-2-1 då vi hade två stora stories och en mindre. Detta har lett till en ökad flexibilitet då vi har haft möjligheten att omfördela arbetsuppgifter efter behov.  Till nästa sprint kanske vi sitter 2 och 3 istället för att öka robustheten i projektet ifall någon skulle bli sjuk eller dylikt.

Vi har jobbat effektivt med våra stories, både jobbat hemifrån och sen träffats och skrivit tillsammans i grupp. Två gånger i veckan, i starten och slutet, så har vi genomfört scrum-möten där vi gått igenom vad vi gjort på våra stories, eventuella svårigheter och sedan bestämt vad som skall göras inför nästa möte. Det har fungerat bra och vi har fått en bra översikt vad alla gör under sprinten. 

Det vi kan förbättra till nästa sprint är kanske att jobba mer tillsammans i grupp, då kan vi lättare diskutera problem och få ännu bättre insikt i vad alla i gruppen gör. Vi bör även vara mer gedigna med att begära och slutföra pull-requests så att vi snabbare kan hitta eventuella problem och även merge:a våra branches med master-branchen.

### 3.2.1 Sprint 1
Temat för sprint 1 är Friktionsdata, efter vårt möte med Sofia Sollén fick vi insikt på vilka funktioner som önskades. Friktionsdatan som förses av Trafikverket ska kunnas laddas upp till sidan och sedan visualiseras. Visualisering ska bestå av en övergripande färgskalad vy, och en mer detaljerad informationsruta vid varje datapunkt. 
Den andra funktionen som efterfrågades var en reparation och utökande av det redan existerande graf-verktyget. En väderstation eller region ska kunna väljas och graf av vald datatyp ska visas över tid, tidsintervallet ska kunna ändras. 

Tre Stories gjordes för sprint 1 
Datagrafer
Friktionsvärdesskala 
Uppladdning av XML Fil




#### Datagrafer
Utförandet har gått bra men har varit långsam på grund av många problem som inte var beräknade initialt i storien. Det mesta av problematiken kom från buggar som härstammade från den befintliga koden. Dessa buggar gjorde att arbetet stod stilla vid vissa punkter och på andra gjorde att man var tvungen att tänka om och utföra det på ett helt annat sätt.

Flash messages var initialt menat att bli implementerat men på grund av stora problem med implementationen samt en väldigt liten användningsområde. Beslutet togs då att inte implementera flash messages i och med även ta bort alla bibliotek och allt som hade men flash messages att göra.    

[Se Appendix för *Datagrafer*](#datagrafer)

 * Tidsfördelning i storleksordning
 * Planerade tasks
 * Buggar
 * Oplanerade tasks



#### Friktionsvärdesskala
Utförandet har gått bra i allmänhet även om det tog längre tid än beräknat. Eftersom vi har övertagit redan existerande kod så tog det lite tid att avgöra var koden bör skrivas. Samt att skalorna använde sig av ett Leaftlet API och inte ren javascript, vilket krävde ytterligare inlärning som ej var förväntad. Detta kan förbättras till nästa sprint genom att ta reda på exakt vad som krävs och därmed kan man göra en mer träffsäker tidsestimering.

[Se Appendix för *Friktionsvärdesskala*](#friktionsvärdesskala)

Tidsfördelning i storleksordning

 * Planerade tasks
 * Skaffat kunskap om Leaflet API:et
 * Oplanerade tasks
 * Fixa bugs


#### Uppladdning av XML fil
Tasks följdes i sin ordning, den större skillnaden som gjordes var att formatet på filen inte var XML utan CSV (Comma Separated Values) detta fick tas i hänsyn vid parsing samt val av bibliotek. Vid uppladdning av mycket stora filer med filstorlek>300mb så fick “heapsize” ökas, samt att filen sparas på disk innan parsing. 
Tiden det tog att utföra Storien var längre än förutsatt vilken inte var helt oväntat då utvecklarna var nya till att arbeta med strukturen som implementerats av tidigare utvecklare. Under utvecklingen av storien så noterades att stora mängder av data fick systemet att gå märkvärt långsammare och en diskussion om hur hanteringen av stora mängder data skulle hanteras effektivt och smidigt inleddes. En framtida story skapades för att i Sprint 2 hantera de problem som skulle kunna uppstå med stora mängder data. Trafikverkets struktur på friktionsdatan har ej varit konsekvent och en story för Sprint 2 för att göra databasen mer robust för förändringar gjordes.
[Se Appendix för *Uppladdning av XML fil*](#uppladdning-av-xml-fil)

Tidsfördelning i storleksordning
Planerade tasks 
Oplanerade tasks
Diskussion och omdesign
Fixa bugs



### 4.2.2 Regressionsrisker
En regression är då en av systemets funktioner upphör att fungera i samband med att kod i systemet ändrats. Det finns tre huvudsakliga typer av regression som är aktuella för projektet.

Local, remote och unmasked. 

* Local: När en bugg upptäcks i den kod som uppdateras.

* Remote: När en bugg upptäcks i en annan del än den som blir uppdaterad.

* Unmasked: När en bugg som redan existerar blir ett problem på grund av den nya och uppdaterade koden.


Den största och mest uppenbara risken utifall det skulle ske en regression är att systemet havererar. Hemsidan, servern eller databasen kan sluta funktionera som planerat och därmed göra hemsidan obruklig eller ha nedsatt funktionalitet. För att motverka det så bör man fokusera på de följande områdena:

* Kodstycken där problem ofta uppstår 

* Kod som nyligen förändrats.  

* De mest fundamentala delarna av systemet


Det här systemets kritiska delar är kartvyn och databasen. Ifall man ej kan se kartan så kommer inte systemet ha möjlighet att förmedla datan till användaren. Det andra känsliga området är databasen, ifall databasen ej lyckas hämta data från Datex så kommer användaren inte ha möjlighet att analysera någon information. I praktiken bör kartvyn fungera utan trafikinformationen men oväntade problem kan eventuellt uppstå.

### 4.2.3 Strategi för regressiontester 


#### 4.2.3.1 
* Spårbarhet(traceability) handlar om att välja tester beroende på beteendet av systemet. Krav och design tillsammans med dokumenterade kvalitets risker används för att veta vilka funktioner som ska testas. Spårbarhets-analys används för att ha kontroll på vilken del av systemet som täcks upp av ett test. Spårbarhet kan användas i projektet för att säkerställa att våra lösningar har fixat problemet.

* Förändringsanalys (Change impact analysis) är en nödvändig aktivitet för underhåll av mjukvara, där man analyserar vilka funktioner som påverkas av förändringarna i mjukvaran och endast testar det som påverkas. Analysen sker ofta via att man tittar på den strukturella förklaringen (klass- och moduldiagram) av systemet och följer hur förändringar rinner vidare genom systemet.

* Bedömning av kvalitetsrisker (Quality risk analysis) är när tester väljs beroende på vad som är viktigast för företaget/systemet. Funktioner som är kopplat till t.ex. personalsäkerhet eller kunders nöjdhet kan testas mer omfattande än andra mindre viktiga funktioner.

* Tvärfunktionell testning (Cross-functional testing) är när man testar kombinationer av funktioner som inte borde påverka varandra. Detta tillvägagångssätt kan användas till utforskande-, system-, acceptans- och enhetstester. Möjliga sätt att applicera tvärfunktionell testning kan vara att t.ex. Täcka stora områden av systemet för att göra initiala svepningar för att leta efter buggar, som sedan kan följas upp av mer fokuserade områden där buggar tidigare har upptäckts med målet att intensifiera tester i områden där nya buggar hittas.

#### 4.2.3.2 Regressionstest Applicering
Förändringsanalys vid små förändringar. kvalitetsrisker pga att trafikverkets data är känslig. Och även tvärfunktionell testning vid större systemförändringar eller sprintavslut.


### 4.2.4
Trafikverket skickar friktions-data månadsvis till individer delaktiga i projektet. Datan som skickas ska kunna laddas upp till servern via hemsidan.

**Krav:** För att testet ska kunna genomföras så ska följande kriterier vara uppfyllda
* Friktions-data ska kunna presenteras grafiskt
* Ludds DUST server ska vara uppsatt
* Trafikverket ska ha skickat Friktions-data


#### 4.2.4.1 Unit Testing
Givet en XML-Fil omvandlar till korrekt SQL-Query. 
Testet genomförs med en XML-Fil och en förväntad output, detta repeteras för 1 års av friktions-data.
Målet med testet är att testa en liten del av systemet. Kontrollera funktionaliteten hos delen externt. 

**Task 1)**
* Handling: Testet väljer en XML fil
* Förväntat Resultat: Testet hittar en XML fil som fungerar.
* Tidsestimering: 1 dag.

**Task 2)**
* Handling: Testet parsar XML filen till en array
* Förväntat Resultat: Testet skapar en array med XML filens innehåll.
* Tidsestimering: 1 dag.

**Task 3)**
* Handling: Testet omvandlar till en korrekt SQL-Query
* Förväntat Resultat: En SQL-Query ska skapas av testet.
* Tidsestimering: 1 dag.


#### 4.2.4.1 System Testing
En XML-Fil skickas från en klient till servern och ska sen uppdatera vyn och visa de nya datapunkterna. I detta fall kommer de nya datapunkterna vara friktions datan från tre olika aktörer. De tre olika aktörernas data ska kunna filtreras så att klienten ska kunna välja vilken vy och vilka/vilken aktörs data de vill se.
Målet med testet är att testa en stor del av systemt. Kontrollera funktionaliteten och hastigheten hos delen externt.

**Task 1)**

* Handling: Testet hämtar en XML fil 
* Förväntat Resultat: Testet tar emot en XML fil.
* Tidsestimering: 1 dag.

**Task 2)**

* Handling: Testet uppdaterar vyn med XML filens data.
* Förväntat Resultat: Vyn uppdateras korrekt.
* Tidsestimering: 3 dagar.

**Task 3)**

* Handling: Testet ska visa de nya datapunkterna från XML filen
* Förväntat Resultat: Datapunkterna visas korrekt.
* Tidsestimering: 2 dagar.

# Appendix

## Datagrafer
En användare ska kunna välja en datastation på kartan och i denna station kunna skapa en graf genom att välja två tidpunkter och få all data mellan dessa punkter placerade i en graf.

I nuläget går det att rita upp en graf mellan två datum, dock så finns det ingen felhantering vilket gör att programmet kraschar om det inte finns data i det valda intervallet. För att korrigera detta problem kommer gruppen implementera felhantering så att programmet inte kraschar när det saknas data utan rita upp grafen med noll värden där datan saknas. 

Detta är en implementation av föregående arbete, nu visualiserar gruppen datan i grafer som hämtas från trafikverkets API. Detta är även kopplat till uppladdningen av data från en användare då denna data också kommer användas i graferna. 

Ett test för detta fallet är t.ex.:
Välja en väderstation på kartan och “lägg till”
Klicka på “grafer”
Välja ett tidsintervall
Se om datan visas (korrekt)

#### Total Tid: 56 timmar

### Tasks
#### Förstå/refaktorera tidigare implementationen.
* Beskrivning: Bygga en djupare förståelse för hur graferna är implementerade i projektet i sitt nuvarande tillstånd.
* Beroende: Detta är första steget i storyn därav är den inte beroende av tidigare steg.
* Tidsuppskattning: 8 timmar
* Risk: Låg.


#### Förstå vad som är fel i tidigare implementation
* Beskrivning: Debugga de relevanta funktionerna för att ta reda på vilken/vilka funktioner som producerar fel i grafhämtningsprocessen.
* Beroende: Detta är beroende av [Förstå/Refaktorera tidigare implementation](#förstårefaktorera-tidigare-implementationen).
* Tidsuppskattning: 8 timmar.
* Risk: Låg.


#### Lös det
* Beskrivning: Hitta en lösning på grafhämtningsproccesens fel.
* Beroende: Detta är beroende av [Förstå vad som är fel i tidigare implementation](#förstå-vad-som-är-fel-i-tidigare-implementation).
* Tidsuppskattning:16 timmar.
* Risk: medel.



#### Implementation av felhantering
* Beskrivning: Bygga upp ett felhanteringssystem när en användare skapar en graf.
* Beroende: Detta är beroende av [Lös det](#lös-det).
* Tidsuppskattning: Detta är en större Task än tidigare och får därmed betydligt mer tid ca 20 timmar där testing är 3 timmar av tiden. 
* Risk: Hög. Problem med den tidigare funktionen då felhanteringen kan förändra hur funktionen är implementerad. 

## Friktionsvärdesskala
Likt den redan existerande temperaturskalan så är friktionvärdeskalans uppgift att ge en visuell översyn, i detta fall över hur friktionsförhållandet mellan bil och väg ser ut över landet. Olika friktionvärdeintervall kommer att representeras utav olika färger i färgskalan.
Den bör vara lätt att avläsa, inte förbruka mycket kraft samt att designen är enhetlig med den nuvarande designen.

#### Total Tid: 12 timmar

### Testfall:
#### Fall 1
* Handling: Observera friktionvärdeskalan och dess färger och jämför dem med färgerna utritade på kartan.
* Förväntat Resultat: Friktionsvärdesskalan bör ge en visuell uppfattning om hur friktionsvärdet skiljer sig över landet. Så användaren lätt kan se var det är kallt och varmt.
#### Fall 2
* Handling: Tryck på knappen i botten av temperatur- eller friktionvärdeskalan.
* Förväntat Resultat: Den valda skalan bör minimeras så att endast knappen kvarstår.

### Tasks:
#### Implementera friktionvärdeskalan visuellt på hemsidan.
* Beroende: Detta är det allra första steget i storyn och är därmed ej beroende av någon annan task.
* Tidsuppskattning: Utvecklingstiden ligger på cirka 4 timmar och sen testning ytterligare 2 timmar för att säkerställa att det fungerar som det ska i olika vyer. Samt att utvecklaren måste sätta sig in i javascript.
* Risker: Det är en obefintlig risk att ej hinna med denna task då tiden är relativt låg och det är den första uppgiften. 


#### Skapa en knapp som gör det möjligt att dölja temperatur- och friktionvärdeskalan.
* Beroende: Detta är beroende av [Implementera friktionsvärdeskalan visuellt på hemsidan](#implementera-friktionvärdeskalan-visuellt-på-hemsidan).
* Tidsuppskattning: Cirka 4 timmar. Då temperaturskalan redan existerar så krävs det att omarbeta redan existerande kod för att skapa mer modulära css klasser för knappar och skalor. Testning cirka 2 timmar, då en knapp är lätt att testa så gäller det mer att söka efter oväntade buggar då man omarbetar koden.
* Risker: Beroende på hur lätt koden är att omarbeta så kan tiden variera lite grann, men den bör bli färdigutvecklad under sprint 1.

#### Ge lämpliga friktionvärdeintervall till skalan. Innan vi får en friktiondatafil där man kan läsa av vilka de lämpligaste intervallen är så kommer platshållarvärden att användas.
* Beroende: Detta är beroende av [Implementera friktionsvärdeskalan visuellt på hemsidan](#implementera-friktionvärdeskalan-visuellt-på-hemsidan).
* Tidsuppskattning: Under en timme för både implementation och testning. Det tar inte lång tid att ändra enkla värden samt att testa så de visas korrekt.
* Risker: Då denna task ej kan startas innan friktiondatafilen är tillgänglig så är det svårt exakt när den finns. Så länge filen blir tillgänglig innan sprintens slut så kommer task:en att genomföras.




## Uppladdning av XML-fil

En användare, Sofia får friktiondata från Trafikverket och ska kunna ladda upp datan till webbservern.

Det ska finnas en knapp som tar upp en ruta där man kan bläddra och välja en XML-fil att ladda upp. Denna ruta ska ha checkboxes som beskriver vilket format datan har. Datan ska sedan parsas och laddas upp i databasen. Om datan har fel format så ska användaren få ett lämpligt felmeddelande. Då datan som laddas upp är känslig så ska överföringen vara säker.


#### Total tid: 28 timmar
### Testfall
1. Klicka på knappen för att ladda upp ny friktiondata
1. Välj en XML-fil och rätt format för denna fil.
1. Ladda upp datan.
1. Se att datan har laddats upp i databasen.

### Tasks:
#### Lägg till en knapp som tar upp en modal(ruta)/navigerar till en ny sida för att ladda upp en lokal XML-fil
* Beskrivning: Knappen tar upp en ruta eller navigerar till en ny sida där användaren sedan ska kunna ladda upp en XML-fil. 
* Beroende: Då resten av denna story utvecklas på i denna ruta/sida så måste det här göras först. 
* Tidsåtgång: Då utvecklarna är nybörjare inom detta område så förväntas denna uppgift ta 6 timmar.
* Risk: Låg.



#### Modalen
* Beskrivning: Modalen ska visa en simpel vy där redan uppladdad fil syns samt en knapp “Bläddra” för att öppna ett ytterligare fönster för att välja fil
* Beroende: Detta är beroende av [Lägg till en knapp som tar upp en modal(ruta)/navigerar till en ny sida för att ladda upp en lokal XML-fil](#lägg-till-en-knapp-som-tar-upp-en-modalrutanavigerar-till-en-ny-sida-för-att-ladda-upp-en-lokal-xml-fil).
* Tidsåtgång: 1 dag, ingen av utvecklarna har gjort en Modal i node. 
* Risk: Medel.


#### Research om lämpligt bibliotek för att kunna ladda upp lokal XML-fil
* Beskrivning: En användare ska kunna ladda upp en XML-fil. För att göra detta så ska hjälp av ett lämpligt bibliotek användas. Uppgiften för utvecklare blir att leta efter ett bibliotek som klarar av denna uppgift.
* Beroende: Inget beroende då research inte beror på nått.
* Tidsåtgång: 2 timmar.
* Risk: Då det finns en risk att det bibliotek man väljer i början inte fungerar som man vill så kan eventuellt mer tidsåtgång behövas. Risken bedöms till medel.

#### Välj en lokal XML-fil
* Beskrivning: En användare ska kunna välja en XML fil, vid knapptryckning på “Bläddra” skall vyn för att manövrera sig i filstrukturen och välja en XML fil visas.
* Beroende: 
  * [Modalen](#modalen)
  * [Research om lämpligt bibliotek för att kunna ladda upp lokal XML-fil](#research-om-lämpligt-bibliotek-för-att-kunna-ladda-upp-lokal-xml-fil)
* Tidsåtgång: 5 timmar, 
* Risk: Låg/Medel, Ifall det inte finns i färdigt i valda bibliotek.

#### Skicka filen till webbservern
* Beskrivning: När filen har valts så ska den sparas i en variabel på webbservern innan parsing påbörjas. Rimligtvis kommer biblioteket som väljer en lokal fil lösa detta problem.
* Beroende: [Välj en lokal XML-fil](#välj-en-lokal-xml-fil).
* Tidsåtgång: 0 timmar
* Risk: Hög då det är osäkert hur detta kommer funka.

#### Kolla på ett bibliotek för att parsa XML
* Beskrivning: Datan som kommer från en XML-fil måste kunna parsas. En utvecklare måste kolla och välja ett bibliotek som klarar av denna uppgift givet att filen redan finns sparad i en variabel.
* Beroende: Inget beroende.
* Tidsåtgång: 2 timme.
* Risk: Låg.


#### Parsa data
* Beskrivning: Datan i XML-Filen sparas i olika arrays. Använd ett bibliotek för att parsa XML. Om formatet på filen inte matchar vad webbservern förväntar sig så ge ett lämpligt fel.
* Beroende:
  * [Skicka filen till webbservern](#skicka-filen-till-webbservern)
  * [Kolla på ett bibliotek för att parsa XML](#kolla-på-ett-bibliotek-för-att-parsa-xml)
* Tidsåtgång: 7 timmar.
* Risk: Låg


#### Spara i Databasen
* Beskrivning: Webbservern gör om arraysen till lämpliga SQL-Queries.
* Beroende: [Parsa data](#parsa-data)
* Tidsåtgång: 4 timmar, utvecklarna är bekväma med MySQL
* Risk: Låg

### 4.3 Etik
Relationen mellan samhället och Projektet är att projektet visar en vy av samhället, vägnätet samt vägnätets tillstånd i realtid. Detta kan positivt gynna samhället genom att använda projektets arbete till att informera bilister tillståndet av vägen de åker på och är påväg till. Detta kan även ses som något negativt då viss data som projektet hanterat är bundet till individer vilket kan anses vara inkräktande. 

Det finns en stor mängd data som projektet hanterar där majoriteten inte är känslig. Friktonsdatan är dock känslig och hanteras separat från resterande datan och laddas upp till databasen i stället för hämtas från Datex II. Friktionsdatan är då skyddad och utsätts inte för någon säkerhetsrisk.  

I testning av projektet har inte någon etik fråga lyfts då detta projekt inte behöver någon testning med personer eller personlig data. Projektgruppen har tänkt på etiken kring det vi har arbetat med men har inte kunnat hitta någon etisk problematik. 

