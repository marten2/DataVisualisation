import csv, re, codecs, cStringIO
from pattern.web import URL, DOM

class UnicodeWriter:
    def __init__(self, f, dialect=csv.excel, encoding="utf-8-sig", **kwds):
        self.queue = cStringIO.StringIO()
        self.writer = csv.writer(self.queue, dialect=dialect, **kwds)
        self.stream = f
        self.encoder = codecs.getincrementalencoder(encoding)()
    def writerow(self, row):
        '''writerow(unicode) -> None
        This function takes a Unicode string and encodes it to the output.
        '''
        # encode to utf-8 and wrte to the queue
        self.writer.writerow([s.encode("utf-8") for s in row])
        
        # read from the queue and decode
        data = self.queue.getvalue()
        data = data.decode("utf-8")
        
        # encode with utf-8-sig and write to file
        data = self.encoder.encode(data)
        self.stream.write(data)
        self.queue.truncate(0)

    def writerows(self, rows):
    	'''
    	Get list of lists to write row by row
    	'''
        for row in rows:
            self.writerow(row)

BASE_SITE = "http://www.presidency.ucsb.edu/2008_election_speeches.php?candidate=68&campaign=2008MCCAIN&doctype=5000"
BASE_URL = "http://www.presidency.ucsb.edu/" 

def scrape_text(dom):
	'''scrape the text on specific webpage'''
	span = dom("span[class='displaytext']")
	output = span[0].content
	for e in span[0].parent("p"):
		output += e.content
	return output.split("<")[0]

def scrape_data(dom):
	'''scrape data from webpage, info about data and 
		link to the text data. Initialise scraper of text data.'''
	a = dom("table")
	output = []


	for i, reff in enumerate(a[7]("tr")):
		if i == 0:
			continue
		row = reff("td")
		c = reff("td > a")[0]
		temp = [row[0].content, row[1].content, c.content]
		site = c.attrs['href'][2:]
		url = URL(BASE_URL + site)
		html = url.download()
	 	dom = DOM(html)
	 	temp.append(scrape_text(dom))
		output.append(temp)
		print i
	return output
if __name__ == "__main__":
	url = URL(BASE_SITE)
	html = url.download()
	dom = DOM(html)
	statements = scrape_data(dom)

	with open("McCain_speeches.csv", "wb") as fout:
		firstrow = ["Actor", "Date", "Title", "Speech"]
		writer = UnicodeWriter(fout)
		writer.writerow(firstrow)
		writer.writerows(statements)
