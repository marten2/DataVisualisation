# Design Document

## Code opdeling
Het is de bedoeling dat ik een stuk d3 schrijf dat voor mij grafieken kan generen. Dit gebeurt zodanig dat verschillende datasets kunnen worden aangeroepen en dat vannuit daar een grafiek wordt gebouwd. Dit zou handig zijn zodat er makkelijk geswitchd kan worden tussen verschillende data sets en dat ik zodanig gemakkelijk extra data kan toevoegen. 
Er zullen twee soorten reusable grafieken worden opgesteld, een voor een lijn grafiek en en een voor een voor een barchart. 
Er zijn buttons en checkmarks waarmee kan worden geswitched tussen grafieken en sommige lijnen kunnen worden gehighlight.
Op de kaart kan geklickt worden op een state zodat er een barchart verschijnt met de data van die state.

Hiernaast moet een handeler worden geschreven die de acties van de user omzet in wat er gebeurt op het scherm. Dit gebeurt in een aparte file waar alle listeners worden toegevoegd aan de html. 

De data wordt verzameld met Python.


## Externe Libraries
Voor externe bibliotheken wordt d3, queue en topojson gebruikt. queue en topojson voor het inladen en handelen van data. D3 voor het bouwen van grafieken en handelen van data. 

## Data
De data is gescraped van deze [site](http://www.presidency.ucsb.edu/2008_election.php). Hier wordt gebruik van python gemaakt om de data binnen te halen en te analyseren. Via python wordt text omgezet in nummers deze nummers worden gebruikt als dataset. 

## Schets 
Hieronder staat een schets van hoe de visualistatie er ongeveer uit gaat zien. ![Schets](/docs/Images/Sketch.jpg)
