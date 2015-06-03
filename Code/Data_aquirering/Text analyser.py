from __future__ import division
import string
import csv

def loadData(filename):
	with open(filename, "r") as fin:
		reader = csv.reader(fin)
		output = []
		for row in reader:
			output.append(row)
		return output

def statistics(data):
	output = []
	print len(data)
	for a in data:
		if a[3] == "":
			continue

		sentence_len = get_average_sentence_len(a[3])
		word_len = get_average_word_len(a[3])
		temp = [sentence_len, word_len]
		output.append([a[0], a[1], a[2], temp])
	return output
	# still need to add distance between words!

def get_average_sentence_len(text):
	sentences = text.split(".")
	tot_amount = len(sentences)
	tot_words = 0
	for s in sentences:
		tot_words += len(s.split(" "))

	return tot_words/tot_amount
def get_average_word_len(text):
	sentences = text.split(".")
	Twords = 0
	Tchars = 0
	for s in sentences:
		words = s.split(" ")
		Twords += len(words)
		for w in words:
			Tchars += len(w)
	average = Tchars/Twords
	return average

def outputCsv(data, filename):
	with open(filename, "w") as fout:
		writer = csv.writer(fout)
		for row in data:
			writer.writerow(row)

if __name__ == "__main__":
	data = loadData("D:\documents\Universiteit\DataVisualisation\doc\Obama\Obama_Speeches.csv")
	stat_data =  statistics(data)
	print stat_data
	# outputCsv(stat_data, "pairs_data.csv")