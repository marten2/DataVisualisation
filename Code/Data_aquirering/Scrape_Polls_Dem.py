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

def scrape_data(dom):
    table = dom("table")[5]
    output = []
    for i, row in enumerate(table("tr")):
        if i == 0:
            continue
        td = row("td")
        temp_date = td[1]("small")[0].content.split("/")
        print temp_date
        try:
            date = temp_date[0] + "/" + temp_date[1].split("-")[0] + "/20" + temp_date[2]
        except:
            date = temp_date[0] + "/" + temp_date[1].split("-")[0] + "/20" + temp_date[1].split("-")[2]
        Clinton = td[3]("small")[0].content
        Edwards = td[4]("small")[0].content
        Obama = td[5]("small")[0].content
        output.append([date, Clinton, Edwards, Obama])
    return output
if __name__ == '__main__':
	BASE_URL = "http://www.pollster.com/08-US2-Dem-Pres-Primary.html"
	url = URL(BASE_URL)
	html = url.download()
	dom = DOM(html)
	data = scrape_data(dom)
	with open("../../docs/prepared_data/pres_dem_data.csv", "wb") as fout:
	 	writer = UnicodeWriter(fout)
		writer.writerow(["date", "Clinton", "Edwards", "Obama"])
		writer.writerows(data)