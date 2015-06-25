import csv, re, codecs, cStringIO
from pattern.web import URL, DOM


BASE_URL = "http://www.city-data.com/top1.html"


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

def scrape_cities(dom):
    '''Get cities from table on the website, return a list of cities and states'''
    table = dom("table")[1]
    output = []
    for tr in table("tr"):
        try: 
            output.append([tr("a")[0].content.split(",")[0], tr("a")[0].content.split(",")[1][1:]])
        except:
            continue
    return output

if __name__ == "__main__":
    url = URL(BASE_URL)
    html = url.download()
    dom = DOM(html)
    cities_list = scrape_cities(dom)
    print cities_list
    with open("cities.csv", "wb") as fout:
        writer = UnicodeWriter(fout)
        writer.writerows(cities_list)
