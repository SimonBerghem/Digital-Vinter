# 1 Inledning
## 1.1 Bakgrund
I detta projekt finns det mycket material att utgå från då projektet har funnits ett flertal år där flera projektgrupper har arbetat med projektet. Föregående grupper har gjort mycket av grundarbetet, där de hämtar data från Trafikverkets API Datex II flyttar till en server och sedan tar datan från servern till en hemsida/webbserver. På hemsidan visualiseras datan på en karta där det enkelt går att se alla sensorer. klicka på sensorerna för att se den senaste bilden sensorn har tagit och mätdatan från sensorn. Det behov som behöver mötas är att förbättra den nuvarande lösning med till exempel felhantering även så behövs en utveckling av den nuvarande lösning. 

Utvecklingen som är implementerad är: felhantering i grafritningen, uppladdning av friktionsdata via webbklienten till databasen, filtrering av friktionsdatan samt clustering, friktions tabell och sorteringsalternativ har lagts till i web klientens GUI. 

## 1.2 Problembeskrivning
Projektet bygger vidare på en tidigare lösning. Trafikverket var nöjd med denna lösning och vill vidareutveckla den. Problematiken blir att ta ägandeskap av nuvarande lösning och sedan förbättra och utveckla lösningen.


## 1.3 Uppgift
Uppgiften i detta projekt består av att vidareutveckla projektet “Road condition monitoring and visualization” som har utvecklats i kursen D0020E under tidigare år. Projektet går ut på att skapa ett verktyg för aggregation och analys av data för vägförhållanden. Första steget för att kunna vidareutveckla projektet är att studera det tidigare arbetet, förstå hur de har arbetat, förstå hur deras kod hänger samman och sen även att lära sig om programmeringsspråken som de har använt. Sedan skall en intervju med områdes-experten äga rum för att reda på vilka funktioner hon önskar samt så ska den föregående gruppens backlog tas del av. Det för att få en bra uppfattning utav framtida utvecklingar vi kan implementera i projektet. Efter jul börjar utvecklingsfasen där de önskade funktionerna implementeras och testas.
 

## 1.4 Avgränsning
Projektgruppen kommer inte göra några flera moduler då dem är redan färdiga. Det är ej tänkt att göra några större ändringar i backend och databasen. Istället så skall fokuset ligga på att utveckla funktionalitet samt att förfina existerande funktioner såsom filtreringen av friktionsdata.

# 2 Systemdesign
Figuren nedan är ett modul-diagram över nuvarande lösning. Då uppgiften är att förbättra/bygga på denna lösning så kommer den ha samma struktur fast med några ändrade detaljer. Diagrammet beskriver hur en backend kommunicerar med trafikverkets API Datex II och fyller i en databas. APIet är skrivet i programmeringsspråket Rust. Frontend vilket är skrivet i JavaScript kommunicerar med databasen och använder sig av paket som OpenStreetMap för att visa en karta över Sverige. Strukturen på systemet ska reflektera dataflödet.


<img src="ModulDiagram.png"
     alt="Modul-diagram"
     style="float: left; margin-right: 10px;" />
# 3 Genomförande

## 3.1 Arbetsmodell
Under hela projektets gång har SCRUM använts noggrant. Vi har använts oss av GITHUBs egna funktion “Project” som SCRUM board. Projektets task;s organiserades efter “stories” och vilken del av projekten den berörde, detta visades med GITHUBs “Label” funktion som markerade task;sen med taggar. SCRUM Board;et bestod av 4 delar, “TO DO” som var våran backlog, “Doing” som visade vilka task;s som folk arbeta på just då, “Review” som visade tasks som var färdiga men som inte gått igenom med annan utvecklare, den sista delen är “Done” som visade task;sen som inte sågs behöva mer arbete. 
Under de två sprint;sen så har SCRUM-möten hållits, i regel hade vi två SCRUM-möten i veckan och efter behov så kunde det bli fler. SCRUM-möterna ska hållas under 15 minuter, vilket under projektets gång följdes. Under SCRUM-möterna gicks det “varvet runt” där varje individ fick berätta vad som hen hade gjorts sedan senaste SCRUM-mötet och vilka problem som stöttes på och hur hen löste eller inte löste det och fick beskriva problemet kort. Till sist fick alla berätta om vad de skulle tills nästa sprint, och de som var bestämda blev tilldelade av någon annan i gruppen som ansåg att ett område behövde arbetas på.
Efter Scrum mötet så satt vi ofta i grupp och löste mindre problem som presenterades under SCRUM-mötet. 
SCRUM systemet ger en bra översikt över vad som kan göras och vad folk gör. Detta har gjort det enkelt att byta arbetsområde ifall gruppmedlemmar önskade detta. 


### 3.1.1 SCRUM reflektioner
Rollen SCRUM-Master gavs till Samuel Gradén som dikterade alla SCRUM-mötena. SCRUM mötena gav den insikt i vad alla utvecklare gjorde som den var avsedd att göra, detta gav ett viss lugn i arbetsprocessen då man alltid visste vart i projektet som man var och ifall någon behövde ta över eller assistera på någon front/task. SCRIM gjorde det lätt att kordinera och diskutera problem. SCRUM-möten sågs lite som en piska i ryggen, då man inte vill komma till SCRUM-Mötet utan att ha gjort något sedan senast. I slutet av mötet så gavs insikt av de andra om vilka delar som bör prioriteras, det var det ofta Martin Larsson som hade bäst insikt i projektet. Det som har fungerat mindre bra är att använda den så kallade issue boarden på git. Det är tydligt att vi i projektet ej har jobbat mycket med det förut och att vi lätt glömmer använda det när vi väl kommer igång och programmerar. Alla i projektet borde försöka förbättra sig på användningen av ett sånt här verktyg. Det handlar om att ha det i sina rutiner: Välj en Issue -> Flytta till Doing -> Gör klar issue -> Flytta till Done -> Upprepa för ny issue. Det handlar om att skapa ett beteende som under tidens gång går tillbaka till issue boarden och uppdaterar den.

#### 3.1.1.Samuel
Samuel tog på sig rollen SCRUM-master eftersom Samuel haft tidigare erfarenhet med att vara SCRUM-master i kursen D0018E. Samuels ansvar var att folk följde SCRUM-boarden och dess struktur under projektets gång. Samuel var även backend ansvarig och skrev de större delarna av backenden. 


#### 3.1.1.Pontus
Pontus Eriksson Jirbatts roll i projektet har varit kommunikationsansvarig, vilket har inneburit att han har ansvarat för all kommunikation extern och intern i gruppen. Han har även ansvarat för att informera gruppmedlemmar som inte har kunnat delta på ett möte eller liknande. Informationen har varit vad som har sagts och vilka beslut som har tagits på mötet.

Extern så har det varit mycket att sätta upp möten med Ulf Bodin och Sofia Sollén för att hålla en öppen kommunikation så de har kunnat ha koll på vart gruppen ligger i projektet samt för projektgruppen att veta vad Ulf och Sofia vill få ut av gruppen och projektet.  

#### 3.1.1.Martin
Martins roll i projektet var git ansvar och fullstack utvecklare. För att göra git användandet så lätt som möjligt gjordes det en guide för hur man använder git och problem såsom merge konflikter löstes tillsammans.

#### 3.1.1.Oskar
Oskar har under projektets gång varit ansvarig för front-end. Alltså skapat och strukturerat nya UI element såsom skalor, knappar, och sliders. Sen har Oskar även arbetat mycket med Leaflet kartan och den utritning som sker på den.

#### 3.1.1.Stefan
Stefan har under projektets gång varit fullstack utvecklare med ansvar på grafer. Från API anpassningar till frontend.

## 3.2 Projektgenomförande
Våra roller i projektet:
* Pontus Eriksson Jirbratt - Graph/Kommunikation 
* Samuel Gradén - Backend/SCRUM-Master 
* Oskar Havo - Frontend 
* Stefan Jonsson - Graph 
* Martin Larsson - Fullstack/Git

Förklaring, se: 3.1.1.namn.

I början av varje sprint har projektgruppen suttit tillsammans i grupp och skrivit ihop stories och medföljande tasks efter vad produktägare Sofia Sollén (expert) har begärt. Därefter har vi delegerat ut dem efter intresse så att alla känt sig nöjda. Då vi är ett udda antal i gruppen så delade vi upp oss 2-2-1 då vi hade två stora stories och en mindre. Detta har lett till en ökad flexibilitet då vi har haft möjligheten att omfördela arbetsuppgifter efter behov.  Eventuellt kan det vara bra att dela upp gruppen i 2 och 3 istället för att öka robustheten i projektet ifall någon skulle bli sjuk eller dylikt.

Vi har jobbat effektivt med våra stories, både jobbat hemifrån och sen träffats och skrivit tillsammans i grupp. Två gånger i veckan, i starten och slutet, så har vi genomfört scrum-möten där vi gått igenom vad vi gjort på våra stories, eventuella svårigheter och sedan bestämt vad som skall göras inför nästa möte. Det har fungerat bra och vi har fått en bra översikt vad alla gör under sprinten. 

Omfattningen på projektet har varit liten eftersom att det inte behövdes genomföras helt från början. Fokuset varit på att utveckla önskvärd funktionalitet med bra kvalite, detta genom att skriva kod som är lätt att förstå och även göra funktionalitet som inte ska gå sönder. T.ex. genom att ge bra variabelnamn, kommentarer, och genom att fastställa kolumnnamn för friktionsdata så att lösningen inte går sönder.

Slutprodukten presenteras som en karta som kan visualiserar stora mängder data som är kopplat till plats för att underlätta översikt, analys och att finna korrelation. I fallet som vi har jobbat på under detta projekt så har det varit RCM i fokus. Om man har en annan typ av data som är kopplat till plats så är det lätt att lägga in sådan data och även visualisera den.

#### 3.2.3.Samuel
Under Sprint 2 ansvarade Samuel för Storien “Visualisera Olycksdata”. Storien var uppdelad i 3 Tasks, i detta stycke kommer varje task att presenteras och diskuteras. Det som inte togs med i tidsestimeringen var konstruering av XML-Parser och databas insättning. Med eftertanke så bör detta har visats som två tasks i storien. Detta tog 8h respektive 9h.
 
**Task 1** som utgick från att data skulle hämtas och hanteras på samma sätt som hämtning för stationsdata. En stor del av tiden gick till att försöka skriva om tidigare kod som var för stations data för att hämta olycksstatistik. Detta visade sig vara onödigt arbete för att olycksstatistik inte sparades på samma sätt som stationsdata. Istället behövdes en post request konstrueras istället för en get som tidigare används. Dokumenteringen för Trafikverkets API var bra och det var enkelt att förstå hur post requesten skulle konstrueras. Konstrueringen av post requesten gjordes i programmet Postman[^2]. Tidsåtgång: 4h. 

Skapandet av requesten i Rust tog längre tid än estimerat och var delen som förväntades ta 8h. Erfarenhet med Rust och brist på exempel fick tasken att ta längre än förväntat. Samuel fick hjälp av Edvin Åkerfeldt en äldre student som läser Civilingenjör Datateknik som är erfaren med Rust. Problematiken låg i att versionerna av de olika biblioteken (Cargo i rust) var utdaterade och syntaxen hade ändrats markant. Tidsåtgång: 13h. Utan Edvin Åkerfeldts hjälp lär tasken ha tagit längre tid. 

**Task 2** som estimerades ta 20h tog 5h
Se 3.2.3.Oskar för tidsåtgång.
Tasken skulle även ha delats upp i Frontend och Server, där Frontend utvecklaren arbetade enskilt med Frontend delen medans Backend,Frontend och Fullstack utvecklare satt tillsammans med Server delen. 

**Task 3** En återkoppling med Sofia Sollén om hur produkten ser ut nu och synpunkter av Sofia Sollén, mötet som skulle ha infallit Måndag 16 Mars blev uppskjutet till Torsdag 19 Mars.

Summering av Storien: En bättre dialog med ansvarig skapare av Storie;n och backend utvecklare. Bug fix i denna storie;n var relativt låg och tog 1.5h. Då Storie;n inte var uppdelad i tillräckligt många tasks så skapades Issues/Task under projektets gång när de dök upp, och SCRUM boarden representerar arbetet. 


#### 3.2.3.Martin
Generellt sätt så var tidsestimeringen i underkant, det som gjorde att tiden drog iväg var att man inte hade en nog bra bild av problemet eller att lösningen inte vart helt korrekt på en gång.

Exempel: I en del av projektet hade vi jobbat med xml-filer så det antogs att även friktionsdatan skulle komma i formen av en xml-fil. Det visade sig senare att friktionsdatan kom från csv-filer. Detta är ett problem som kommer ifrån att man har antagit saker och inte ställt noggranna frågor. En annan del där tiden verkligen drog över var aggregeringen av friktionsdata. Detta kom ifrån att det var ett avancerat problem där det är svårt att hitta eventuella buggar, samt tar tid att felsöka. Till exempel så kom en bugg ifrån att javascript uppfattade en addering av två värden som addering av två strängar och inte två tal.

Det är väl så att desto mer avancerat ett problem är desto större är chansen att man missar detaljer eller hamnar i en situation där man behöver lägga tid på att felsöka lösningen.

Under sprint 2 har Martin:
* Gjort friktionsdatabasen robust för ändringar 8h
* Aggregering av friktionsdata 45h
* Lagt till diverse funktionalitet och visualisering på kartan 20h

#### 3.2.3.Oskar
Oskar har gjort friktionsdataskalan samt gjort om hela temperaturskalan. Många av UI knapparna till vänster, datumslidern och mycket av utritningen av friktionsdatapunkter. Under varje delmoment så blev min tidsestimation kortare än vad den reella tiden blev i slutändan.  Jag underskattade hur lång tid det skulle ta att lära sig de olika API:erna och hur lång tid det tog för att sammanfoga min kod med alla andras. Jag hade nog kunnat förbättra mina tidsuppskattningar avsevärt ifall jag hade gjort mer research om vad exakt som behövde göras. Det är något jag tänker ta mig extra mycket till nästa projekt som vi gör.
 
Under sprint 2 har Oskar:
* Ordnat friktionsintervallen och gjort om skalorna 4h
* Utritning av friktionsdatapunkter 12h
* Datumslider och UI element 18h




#### 3.2.3.Pontus
Estimering av tid var väldigt svårt att göra då man aldrig har jobbat varken i programspråken eller de olika programmiljöerna exkluderat mysql Workbench. Jag försökte ofta estimera i överkant för att det alltid är bättre att jobba snabbare än tänkt, än att gå över den tänkta tiden. 

Till exempel i datagraf storien satte jag tiden 16 timmar på “lös det”, vilket i sig själv är en väldigt vag del av storien för att ha tid utsatt för problem så det inte ska förstöra tidsplanen. 
 
Det var lättare att förutse hur mycket tid det skulle ta när man väl började arbete och förstå sig på programspråket och miljön bättre, så tidsestimeringen för spring två var mycket lättare att sätta och kändes mer exakt än den inför sprint ett. 

Inför sprint 2 var tanken att jag skulle implementera mer filtrering av friktionsdata där man skulle kunna välja tidsintervall och område. På grund av att min arbetsdator inte ville fungera med rust samt andra problem som dök upp var jag tvungen att ominstallera operativsystemet.  Vilket gjorde att jag var tvungen att sätta upp projektet från scratch igen. Detta tog tyvärr en massa tid och då vi i projektet hade en långsam start på sprint två, gjorde detta att vi inte hade så mycket tid kvar. Då beslutades det att Samuel, Martin och Oskar skulle gemensamt implementera filtreringen och att jag skulle fokusera på labbrapporten och presentationen. 

Resultat jag fick fram under sprint två var, en fungerade arbetsdator för projektet, en Mockup för filtrering, mycket omskrivningar i labbrapporten, till lägg i rapporten, en google presentation som sedan alla finslipade sin del på och kommunikationen för gruppen internt samt externt. 

#### 3.2.3.Stefan
Tidsestimeringen har generellt varit satt i överkant för att ge oss mer andrum när det kommer till sprintplanering, och att även ge plats för att lära oss språken som användes i projektet och även förstå oss på tidigare implementationer och standarder i projektet. Det var svårt att tidsestimera punkterna för [Datagrafer] på grund av att vi hade väldigt liten förståelse över hur den tidigare gruppen hade byggt systemet då det 1. Inte fanns någon dokumentation, och 2. Systemet var rusat för att ha någonting att visa upp.

I sprint 2 så har Stefan arbetat på Datagrafer, där från föreståelse till implementation kan delas upp som:
* [Datagrafer:Forstarefaktorera-tidigare-implementation] Förståelse för tidigare implementation: På grund av att projektet tidigare hade rusats ihop för att få med så mycket funktionalitet som möjligt var det begränsat med dokumentation och kodstandarder som gjorde det svårt att förstå hur system hängde ihop. Till följd av detta har det behövts läggas tid på att gå igenom koden och förstå hur det funkar:  5h
* [Datagrafer:Forsta-vad-som-är-fel-i-tidigare-implementation]felsöka tidigare implementation: Systemet för grafer hade gått sönder medans den tidigare projektgruppen arbetade vidare på annan funktionalitet vilket ledde till att det behövdes lägga mycket tid på att hitta vad och vart det hade gått fel. 5h
* [Datagrafer:Los-det] Implementera nya grafer: Efter tidigare punkter så fanns det två alternativ för implementation. Slänga allting och börja om eller försöka skriva om all befintlig kod så att den funkade: i eftersyn så hade det varit klokt att börja om helt och hållet men vi valde att laga den befintliga koden. 20h

### 3.3 Resurs och aktivitetsplanering
Inför varje sprint så diskuterades nya funktioner med Sofia Sollén, Sofia Sollén fick rangordna  de nya funktionerna i prioritet. Innan sprinten delades funktionerna upp i stories som inom gruppen styckades upp i tasks på Scrum boarden. Varje task tidsestimerades och fördelades till gruppmedlemmar efter preferens och ansvarsområden. 

### 3.3.1 Sprint 1
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

* Planerade tasks 
* Oplanerade tasks
* Diskussion och omdesign
* Fixa bugs

### 3.3.2 Sprint 2
Temat för den andra sprinten har också varit friktionsdata dock med ett större fokus på GUIt för att kunna visualisera och avgränsa mängden data. Projektgruppen kom fram med detta efter ett möte med Sofia Sollén. Som diskuterat i föregående sprint så ska en färgskalad vy implementeras för friktionsdatan. För att avgränsa mängden data för att det inte går att visualisera all data utan att krascha programmet, kom vi på ett flertal olika sätt att göra det på. 

Först, att filtrera friktionsdata beroende på variabler såsom: max friktion, organisation, datum. Andra var att klustra friktionsdata, det vill säga slå ihop flera datapunkter till få större punkter och skapa olika typer av aggregering som ger mer eller mindre precision men som möjliggör navigering av data i stora datamängder. Tredje var att enbart visa punkterna för det området användaren såg när det sökte efter punkter. 

Sofia ville även visualisera olycksdata från Datex II då hon var väldigt intresserad i att jämföra friktionsdatan med olycksdata och se om det finns någon korrelation mellan dem. Denna data ska då först hämtas från Datex II via rust servern sen läggas i databasen för att kunna hämtas till frontend för att visualiseras. 
För att kunna sätta upp programmet på en server och inte ha det helt öppet för alla kom vi fram till att sessions behövde bli implementerat så att en användare kan logga in och därmed hålla 
 

#### Utritning av skalor
Utförandet har gått bra i allmänhet och tog ungefär den tid jag allokerat. Eftersom att jag hade jobbat med skalorna i sprint 1 så visste jag redan vad jag behövde göra och var jag skulle skriva all kod. Så det gick bättre denna sprint med tidsallokeringen och jag fick mer gjort totalt sett.


Tidsfördelning i storleksordning

 * Planerade tasks
 * Skrivit om befintlig kod
 * Oplanerade tasks

#### Clustrering/Aggregering av friktionsdata
Utförandet har gått bra. Däremot så uppkom det under utvecklingen några buggar som var svåra att lösa, t.ex. att addition av två tal uppfattades som additionen av två strängar istället för två tal. Det som framför allt gjorde uppgiften mer avancerad var att man ville minska körtiden för aggregeringen. För att korta ner tiden från flertalet timmar till endast minuter gjordes en divide and conquer lösning. Detta fungerade bra då det som gjorde att aggregeringen tog lång tid var att det var en alldeles för stor array att loopa igenom när man skulle leta punkter. Detta skapade dock andra problem såsom att punkter som borde samlas till en större punkt vart flera mindre punkter (då punkterna kan ha legat i olika delar av arrayen). Aggregeringen behövdes därför även den aggregeras, vilket i sig betyder att en punkt kan flyttas två gånger under en aggregering.

[Se Appendix för *Clustering/Aggregering av friktionsdata*](#clustering/aggregering-av-friktionsdata)

Tidsfördelning i storleksordning

* Planerade tasks 
* Fixa bugs
* Oplanerade tasks
* Diskussion och omdesign



#### Visualisera olycksdata
Utförandet har gått bra och blev klar innan sprint 2 avslut. Två problem fick utvecklingen att framgå långsammare. Under planeringen antogs att HTTP requestsen till DATAEX II kunde göras likadant som tidigare requests. Detta visade sig inte stämma och en post request istället för en get krävdes. Tidigare hade projektet hämtat stora mängder sparad data från trafikverket, medans Olycksdatan inte fanns sparad i längre tid. Detta ger som konsekvens att projektet själv måste ha en server som med lämpligt intervall hämtar och sparar olycksdata. Det andra problemet var en utdaterad bibliotek som inte fungerade och uppdatering av det gav ny syntax som införde massvis av errors som krävde korrigering innan nästa task kunde arbetas på. Det senare var inräktat i tidsestimeringen då rust är ett relativt nytt språk och en vis ovana med språket fanns i projektet.

Tidsfördelning i storleksordning

Planerade Tasks
Oplanerade Tasks
Reschearch
Bug fix

#### Session
På grund av tidsbrist så valdes det att prioritera bort Sessions storien. 

### 3.3.3 Reflektioner, planering, genomförande och tidsuppföljning
Den största läroupplevensen kring tidsuppskattning som märktes var att desto mer specifik & liten en task var ju enklare var det att tidsuppskatta, exempel på det är t.ex. att tidsuppskattningen för storien “Uppladdning av XML-fil” från sprint 1 var mycket närmare verkligheten än “Aggregering av friktionsdata” från sprint 2. Vi märkte även att det var generellt enklare att tidsuppskatta i sprint 2 än i sprint 1. En bättre kommunikation mellan gruppmedlem och ansvarig utvecklare för nämnda tasken skulle ha existerat för en bättre tidsuppskattning.

# 4 Resultat
## 4.1 Leverans
Målet med projektet var att vidareutveckla verktyg för aggregation och visualisering av data.

Funktionaliteten som behövdes togs reda på genom intervju med områdes-experten.

Det framgick att det behövs funktionalitet för att ladda upp friktionsdata genom .csv filer och att punkter på kartan ska kunna urskiljas beroende på vilket friktionsvärde de innehåller. Under arbetet uppmärksammades det att den stora mängden friktionsdata som blir uppladdad omöjligt kan renderas i en webbläsare punkt för punkt. Därför blev nästa uppgift att möjliggöra detta. Tre tekniker för att reducera antalet punkter implementerades. Filtrering, aggregering och en speciell typ av marker ‘markercluster’ från Leaflet. Lösningarna tillsammans gör att en användare kan navigera det stora datamängden utan att webbläsaren tar för evigt att svara. 
Utöver detta utvecklades det även visualisering av olycksdata från Trafikverkets API. Databasen för friktionsdata gjordes robust genom att ha en konversation om vilka kolumner som ska finnas med i .csv filerna. Samt se till att tillägg av nya kolumner inte tar sönder nuvarande lösning.

## 4.2 Testning
### 4.2.1 Teststrategi
Vi har varit ansvariga för att utföra relevant testning på våra egna funktioner på vår branch. Sen har vi haft som system att vi laddar upp branchen och då den är färdigutvecklad så gör man en Pull Request där då de andra medlemmarna i gruppen testar funktionen och sedan mergar in den i master branchen. Inför demon som utförts på möten samt seminarier så har vi sett till att vi har en stabil version där alla funktioner fungerar på allas datorer.


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
Målet med testet är att testa en stor del av systemet. Kontrollera funktionaliteten och hastigheten hos delen externt.

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

### 4.3 Etisk bedömning
Relationen mellan samhället och Projektet är att projektet visar en vy av samhället, vägnätet samt vägnätets tillstånd i realtid. Detta kan positivt gynna samhället genom att använda projektets arbete till att informera bilister tillståndet av vägen de åker på och är påväg till. Detta kan även ses som något negativt då viss data som projektet hanterat är bundet till individer vilket kan anses vara inkräktande. 

Det finns en stor mängd data som projektet hanterar där majoriteten inte är känslig. Friktonsdatan är dock känslig och hanteras separat från resterande datan och laddas upp till databasen i stället för hämtas från Datex II. Friktionsdatan är då skyddad och utsätts inte för någon säkerhetsrisk.  

I testning av projektet har inte någon etisk fråga lyfts då detta projekt inte behöver någon testning med personer eller personlig data. Projektgruppen har tänkt på etiken kring det vi har arbetat med men har inte kunnat hitta någon etisk problematik. 

### 4.4 Fortsättning
Kompetensen och kunskapen som krävs för att vidareutveckla detta projekt finns sammanfattat i 7) Instruktioner. Några potentiella utökningar kan vara följande:
**Kortsiktiga mål**
* Säkerhet - Ifall projektet ska deployas så bör sessions implementeras som håller reda på vilka som är inloggade.
* Live uppdatering och utritning - I framtiden så vore det bra om hemsidan hämtar ner den senaste datan under körning och ritar ut den utan att man är tvungen att uppdatera hemsidan.
* Ny trafikdata - På ett liknande sätt som vi i sista sprinten infört olycksstatistik så finns även en mängd annan intressant data att hämta. Allt ifrån hur trafikflödet ser ut till detaljer som till exempel vad den största stenstorleken i asfalten är på en given väg.
* Fler aggregation/filtreringsalternativ - Vi har i nuläget en väldigt omfattande lösning med många olika alternativ för filtreringen. Till exempel att man kanske vill se alla punkter inom 1 km av alla olyckor. Det kan ge insikt för hur vägunderlaget är vid just de olycksdrabbade platserna.

**Långsiktiga mål**
* Vägsystem - Istället för att rita ut friktionsdatan som punkter så skulle det vara möjligt att rita ut Sveriges vägnät och att istället färgkoda vägarna efter friktionsvärdet.
* Nya länder och regioner - Ett väldigt långsiktigt mål kan vara att lägga till fler länder och regioner. Till exempel om Norska vegvesnet hade velat använda vår tjänst så hade vi kunnat göra en lösning med den norska kartan med deras data.






# 5. Slutsats

Projektet hade som primära mål att lägga till funktioner på det tidigare projekten RCM efter produktägare Sofia Solléns önskemål. Första tillägget som Sofia önskade var att kunna visualisera friktionsdatan som hon fick av Trafikverket, innan hade datan givits till projektgruppen. Lösningen var en modal som tillät användaren att ladda upp en fil till servern som sedan matades in i databasen. Visualisering av datan skapades efter produktägarens önskemål. Fokus har legat på att få funktionen att fungera innan sprint avslut och med tid över optimera. Denna struktur har hafts av projektgruppen genom hela projektets gång. 

Under andra sprinten begärde projektägaren att kunna visualisera olycksdata tillsammans med all annan data. Under denna sprinten så implementerade två större funktionaliteter, ett var den begärda visualiseringen av friktionsdata. Samt en optimering av visualisering av friktionsdata som hade nått en kritisk mängd och kunde inte visas i en webbläsare. Lösningen är en aggregering av data som beskrivs i mer detalj [Se Appendix för *Hur aggregering av friktionsdata fungerar*](#hur-aggregering-av-friktionsdata-fungerar)
.

# 6. Referenser
***RUST**
* För att skapa HTTP request med rust så användes reqwest: https://docs.rs/reqwest/0.10.4/reqwest/
* För att Parsa XML i Rust användes xmlparser https://docs.rs/xmlparser/0.13.1/xmlparser/
* För att göra SQL- Quries i Node användes följande i lösningen. https://codeforgeek.com/nodejs-mysql-tutorial/
* Postman: https://www.postman.com/

# 7. Annex A - Instruktioner
**Project README**
# Road-Condition-Monitoring
RCM is a tool for gathering data from [DATEX II](https://datex2.eu/) and presenting the data in a informative and user friendly way.

## Prerequisite
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Node.js](https://nodejs.org/en/download/) and [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [MySQL](https://www.tutorialspoint.com/mysql/mysql-installation.htm)
- Either [OpenJDK](https://openjdk.java.net/install/) or [Rust](https://www.rust-lang.org/tools/install)

## Installation


```
git clone https://github.com/hotpucko/rcm-sommar-2019.git
```

### Webserver
```
cd /rcm-sommar-2019/app/
npm install
npm start
```

### RustBackend

```
cd /rcm-sommar-2019/backend/
cargo update
cargo build
cargo run
```

### Database

See [Docs](https://dev.mysql.com/doc/).


## Built With
* [Leaflet](https://leafletjs.com/) - A JavaScript library for interactive maps
* [OpenStreetMap](https://www.openstreetmap.org/#map=5/62.994/17.637) -  Free wiki world map
* [MapBox](https://www.mapbox.com/) - An open source mapping platform for custom designed maps
* [Chart.js](https://www.chartjs.org/) - Flexible JavaScript charting
* [Boundary-Canvas](https://github.com/aparshin/leaflet-boundary-canvas/) - A plugin for Leaflet mapping library to draw tiled raster layers with arbitrary boundary
* [GeoData](http://kodapan.se/geodata/data/2015-06-26/laen-kustlinjer.geo.json) - Data for county boundaries in Sweden

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Authors
* **Pontus Eriksson Jirbratt** - *Graph* - [98pontan](https://github.com/98pontan)
* **Samuel Gradén** - *Backend* - [samgra-7](https://github.com/samgra-7)
* **Oskar Havo** - *Frontend* - [OskarHavo](https://github.com/OskarHavo)
* **Stefan Jonsson** - *Graph* - [hotpucko](https://github.com/hotpucko)
* **Martin Larsson** - *Fullstack* - [PMMLarsson](https://github.com/PMMLarsson)




## License
[MIT](https://choosealicense.com/licenses/mit/)

## Acknowledgments
Continuous work of [https://github.com/dynematic/rcm-sommar-2019](https://github.com/dynematic/rcm-sommar-2019). A tool built by students at Luleå University of Technology.


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


#### Utritning av skalor
Genom att använda sig utav den tidigare utvecklade friktionsvärdesskalan så ska nu friktionsdatapunkterna ritas ut i dess angivna färg. Formen på datapunkterna skall även vara annorlunda för varje dataleverantör så man lättare kan skilja på dem.









* Testfall:
*Handling: Observera friktionvärdeskalan och dess färger och jämför dem med färgerna utritade på kartan.
*Förväntat Resultat: Friktionsvärdesskalan bör ge en visuell uppfattning om hur friktionsvärdena skiljer sig över landet. Detta bör ge en bild över var det är säkert att färdas.

*Handling: Observera kartan och se att olika symboler ritas ut för varje leverantör.
*Förväntat Resulta: Olika symboler bör ritas ut. Där varje symbol tillhör en viss leverantör.


### Tasks:
 	1
*Beskrivning: Ändra färgerna och intervallen på friktionsvärdesskalan.
*Beroende: Detta är det allra första steget i storyn och är därmed ej beroende av någon annan task.
*Tidsuppskattning: Utvecklingstiden ligger på cirka 1 timme då allt arbete är redan gjort och det handlar om att bara ändra lite värden. Eventuella buggar kan uppstå.
*Risker: Det är en obefintlig risk att ej hinna med denna task då tiden är relativt låg och det är den första uppgiften. 
2
	*Beskrivning: Ändra färgerna på friktionsdatapunkterna.
*Beroende: Denna task saknar beroenden.
*Tidsuppskattning: 3 timmar
*Risker: Det bör vara simpelt då det mesta redan finns på plats.
3
	*Beskrivning: Göra så att friktionsdatapunkterna kan anta olika former.
*Beroende: Denna task saknar beroenden.
*Tidsuppskattning: 5 timmar + research på 2 timmar.
*Risker: Hög risk. Då det är oklart exakt hur man ändrar utritningen av punkter i Leaflet så är chansen stor att utvecklingstiden kan variera rikligt i båda riktningar.
4
	*Beskrivning: Gömma skalorna då grafvyn är i bruk.
*Beroende: Denna task saknar beroenden.
*Tidsuppskattning:  3 timmar. 
*Risker: Hög risk. Då vi sysslade med en liknande uppgift i förra sprinten så vet vi att Leaflet är svårhanterat vilket kan leda till ökade utvecklingstider. Däremot är funktionen inte essentiell så ifall det skulle mot förmodan ta lång tid så är det en lämplig funktion att låta vara.








###Clustering/Aggregering av friktionsdata
En månad av friktionsdata kan vara några miljoner datapunkter. Det blir då ett problem att visualisera detta i webbläsaren. Att visa enskilda datapunkter är inte ett alternativ då webbläsaren kraschar om det är för många element. Lösningen på problemet är att samla flera datapunkter till en stor datapunkt.

Uppgiften blir att ta reda på och implementera en effektivt reducering av antalet datapunkter så att man på kartan kan få en bra översikt över friktionsdatan.

Ett test för denna funktionalitet är att:
*Välj friktionsdata på kartan.
*Punkter dyker upp.
*Klicka på punkt och se att den ger den info som behövs inom en rimlig tidsram

### Tasks:

*Gör research på metod för att aggregera data.
*Beskrivning: Att göra clustering/aggregering av en stor mängd datapunkter är inget unikt problem. Gör research på befintliga lösningar/artiklar.
*Beroende: -
*Tidsåtgång: Då det här kan vara avancerat ämne bör researchen vara ordentlig, 8h.
*Risk: Låg.

*Implementera en passande metod.
*Beskrivning: Följ och anpassa en metod ifrån task 1).
*Beroende: Task 1).
*Tidsåtgång: 30h.
*Risk: Hög, då ingen av oss har stött på detta förut och problemet kan vara av en avancerad karaktär.

*Utvärdera och testa om lösningen är tillräcklig.
*Beskrivning: Fundera på om resultatet av lösningen är bra nog och testa noggrant. Konsultera med användare av kartan för att se om den är okej för dem.
*Beroende: Task 2)
*Tidsåtgång: 1h.
*Risk: Låg.



#### Visualisera Olycksdata 

Efter förra mötet med Sofia Sollén kom vi fram till att en av de nästa datapunkterna hon ville se var olycksdata. Då detta också finns med i Datex II kommer vi behöva hämta datan precis som med mätstationerna och regionerna. 

Uppgift är att hämta olycksstatistiken från Datex II och visualisera den på kartan. Vi kommer först behöva hämta datan med rust servern och sen lägga till den på mysql databasen så informationen lätt han hämtas av webbklienten. I frontend kommer vi behöva lägga till någon ikon för att representera datapunkten samt även lägga till en informationsruta som kommer när man klickar på punkten. 

Ett test för detta är
*Att se olycksdatan på kartan. 
*Att klicka på en olycksdatapunkt och få upp mer information. 


### Tasks:
*Hämtning av olycksdatan i rust
*Beskrivning: För att kunna visualisera datan behöver den först hämtas så den finns tillgänglig för frontend. 
*Beroende: -
*Tidsåtgång: Då rust inte är ett språk vi inte är särkligt bekväma med bör tidsåtgång sättas högt, 8h. 
*Risk: medel.



*Hämta datan från databasen till webbservern samt visualisera
*Beskrivning: Nu är den tillgänglig med behöver bli frågad efter samt så behövs det något att representera datan efter den är hämtad. Implementera querys och skapa visuella datapunkter. 
*Beroende: Föregående task
*Tidsåtgång: 20h.
*Risk: Medel.

*Utvärdera med produktägare och se om hon är nöjd med resultatet
*Beskrivning: Se till att produkten lever upp till en bra standard som kan användas till det ändamål den är avsatt för. 
*Beroende: Föregående tasks.
*Tidsåtgång: 1h.
*Risk: lågl.







#### Session
Efter utvärdering av tidigare implementationen har vi kommit fram till att den inte når upp till säkerhetsförväntningarna på produkten.

Uppgiften är att implementera en säkerhetslösning med inloggning och server side sessions.

### Tasks:
*Identifiera säkeretshål
*Beskrivning: Identifiera alla moduler där sessioner behöver implementeras som säkerhetsskydd.
*Beroende:  -
*Tidsåtgång: 1h
*Risk: låg

*Research
*Beskrivning: Läsa på om sessioner i javascript/Node för korrekt implementering.
*Beroende: -
*Tidsåtgång: 4h
*Risk: medel

*Implementera Sessions
*Beskrivning: Implementera sessions som privilegie baserat säkerhetsskydd i alla relevanta webbsidor.
*Beroende: 1 & 2
*Tidsåtgång: 10h
*Risk: hög

*Testning av säkerhetslösning
*Beskrivning: Testa alla relevanta webbsidor ifall det finns säkerhetsfel.
*Beroende: 3
*Tidsåtgång: 2h
*Risk: hög

## Hur aggregering av friktionsdata fungerar
Friktionsdatan har miljontals rader/månad. Det går ej att rendera allt detta i en webbläsare utan att krascha den och det är dessutom svårt för en användare att navigera så stora datamängder.

För att lösa detta görs en aggregering av friktionsdatan där punkter kombineras ihop till större punkter vilket reducerar antalet punkter som behövs renderas och underlättar navigering. Aggregering sker på:
* Tid (Varje timme, dag)
* Plats (1 km, 1 mil, ... ) distans
* ReporterOrganization
Då detta kan vara tidskrävande (kräver att man gör en sweep genom databasen och aggregerar ihop datapunkter) så bör detta vara en sak en gör en gång för data för att sedan spara i en ny tabell i databasen.

Vilken data ska en aggregerad punkt innehålla (detta blir också hur tabellen kommer se ut)?
* Time (Primary Key)
* TimeAggregation (Primary Key, Ger tidsenhet för denna aggregation)
* Distance (Primary Key, ger radie för denna aggregation)
* ReporterOrganization (Primary Key)
* Longitude (Primary Key)
* Latitude (Primary Key)
* NumberOfMeasuerments
* MeasureValueMedian
* MeasureValueMax
* MeasureValueMin
* MeasureConfidenceMedian
* MeasureConfidenceMax
* MeasureConfidenceMin

För varje tidsenhet skapas flera aggregations punkter på olika platser.

För att snabba upp aggregeringen så görs en divide and conquer lösning. Detta betyder att en aggregering som egentligen ska vara en punkt kan bli flera punkter beroende på hur arrayen som innehåller friktionsdata delas upp. Detta gör att aggregeringen behöver aggregeras vilket inför att en punkt kan flytta ytterliggare en aggregeringsdistans.

