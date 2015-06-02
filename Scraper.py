from pattern.web import URL, DOM

BASE_SITE = "http://www.presidency.ucsb.edu/2008_election_speeches.php?candidate=44&campaign=2008OBAMA&doctype=5000"
BASE_URL = "http://www.presidency.ucsb.edu/" 
def scrape_text(dom):
	text = dom("span[class='displaytext']")
	print text[0].parent("p")
	print text[0].content
def scrape_data(dom):
	a = dom("table")
	for b in dom("table"):
		print len(b("tr")) 
	c = a[7]("tr")[1]("td > a")[0]
	print c.content
	site = c.attrs['href'][2:]
	url = URL(BASE_URL + site)
	html = url.download()
 	dom = DOM(html)
 	scrape_text(dom)

if __name__ == "__main__":
	url = URL(BASE_SITE)
	html = url.download()
	dom = DOM(html)
	scrape_data(dom)