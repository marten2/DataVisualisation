# Data Visualisation Project

## Introductie

Dit project gaat over een woordanalyse van de toespraken van de americaanse verkiezingen van 2008. Algemen statistieken zoals woordlengte woorden vergeleken met populariteit van de running-mates. Hiervan is een visualisatie gemaakt, waarbij de verschillende kandidaten vergeleken kunnen worden. Ook wordt er een verband gelegd tussen de toespraken en de locatie waar die gegeven zijn. Dit is allemaal te zien in de visualisatie gebouwd in de index.html in de code folder. Het is een visualisatie voor het open domijn. Een voorbeeld van de grafieken staat hieronder:



## De data
De [data](http://www.presidency.ucsb.edu/2008_election.php) is hiervandaan gehaald. Hier stonden alle toespraken gegeven van de verschillende kandidaten gegeven tijdens de verkeizieng. Hieruit zijn de volgende statistieken gehaald":
De gemiddelde woordlengte
De gemiddelde zinlengte
Een graad van moeilijkheid(als gedefinieerd door [Hiromi Ban](http://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=5156475))
Een percentage van het aantal woorden in een text die "we" zijn. Deze toespraken zijn niet van mij, ik gebruikt ze alleen in deze visualisatie.

## Programma
Het programma zelf zal draait op javascript, d3, queue, boodstrap en jqueri. Deze externe scripts heb ik niet geschreven en zijn dus ook niet van mij, ze worden alleen gebruikt in deze visualisatie. Alle data die nodig is zal zich bevinden in een bijgevoegde map, er is geen on the fly data verzameling van andere API's nodig. Dit omdat alles van te voren wordt gescraped en verzameled. 
De visualisatie bevat een algemene grafiek waar tussen de verschillende statistieken geswitched kan worden. Dit betekend dat voor de afzondelijke data punten andere grafieken worden gegenereerd. Hierin worden alle verschillende presidenten weergegeven, er kan echter wel geselecteerd worden om deze niet te zien. Voor de link tussen presidente en data, wordt kleur en misschien ook vorm gebruikt.
