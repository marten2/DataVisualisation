# Data Visualisation Project

## Introductie

Het algemene idee is om een woordanalyse uit te voeren over speeches van de americaanse verkiezingen van 2008. Hier worden algemen statistieken, zoals woordlengte vergeleken met populariteit van de running-mates. Hier wil ik een paar algemene statistieken van de runingmates met deze data tegenover elkaar te zetten. Als mogelijk ook een analyse tussen onderlinge speeches en de populariteit die bij deze speeches gewonnen worden. 

## De data
De [data](http://www.presidency.ucsb.edu/2008_election.php) wordt gescraped en omgezet in een georganiseerde database, waar alle verschillende speeches opgeslagen worden. Hier wordt de datum de locatie en de spreker verbonden aan de text. In een ander programma wordt vervolgens een wordt analyse per text toegepast. Alleen de geanalyseerde data, dus hoeveel woorden of zinnen er voorkomen bijvoorbeeld, wordt gebruikt voor de gebruiker. Dus in de visualisatie komt alleen die data te staan en niet de voledige speeches.
De volgende data wordt uit de texten verkregen:
De gemiddelde woordlengte
De gemiddelde zinlengte
Een graad van moeilijkheid(als gedefinieerd door [Hiromi Ban](http://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=5156475))

Als ik tijd over heb wil ik gaan kijken naar bepaalde woorden die vaak voorkomen, of miss woordparen die vaak voorkomen. Een paar algemene begrippen van de verschillende runningmates. Ook het bekijken van meerder datapunten kan dan toegevoegd worden.

## Programma
Het programma zelf zal draaien op javascript en d3. Alle data die nodig is zal zich bevinden in een bijgevoegde map, er is geen on the fly data verzameling van andere API's nodig. Dit omdat alles van te voren wordt gescraped en verzameled. 
De visualisatie bevat een algemene grafiek waar tussen de verschillende statistieken geswitched kan worden. Dit betekend dat voor de afzondelijke data punten andere grafieken worden gegenereerd. Hierin worden alle verschillende presidenten weergegeven, er kan echter wel geselecteerd worden om deze niet te zien. Voor de link tussen presidente en data, wordt kleur en misschien ook vorm gebruikt.

## Werkverdeling 
Week 1:
	Data verzamelen en ordenen:
	1. Data scrapen van de website (Dinsdag)
	2. data analyse(met python) (Woensdag/donderdag)
	
	Begin HTML:
	1. Eerste blok indeling HTML (vrijdag)

week 2:
	Ontwikkeleng Javascript voor plotjes:
	1. ontwikkelen generiek javascript voor 1 plot(maandag/dinsdag)
	2. ontwikkelen controller voor het switchen tussen grafieken(dinsdag/woensdag)
	3. ontwikkelen kaart van america(woendag/vrijdag)
	4. linken kaart aan andere datasets(vrijdag)

week 3:
	HTML mooier en strakker maken(maandag)
	Afmaken van javascript issues

week 4:
	Afmaken HTML
	Verslag schrijven
	presentatie geven
## Probleem punten 
Data analyse moet snel veel tijd in gestoken worden zodat het voor het weekend gedaan is en er begonnen kan worden aan het bouwen van de visualisatie.
Het bouwen van een landkaart en daaraan per state een aantal analyse programma's ophangen wordt nog een lastig punt.
Bepalen van mate van populariteit over de tijd, dus de polls en het vergelijken van niet tegen elkaar runnende mates, zoals hillary clinton en McCain.





