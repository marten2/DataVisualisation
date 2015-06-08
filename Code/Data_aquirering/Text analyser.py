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
	for i, a in enumerate(data):
		if i == 0:
			continue
		if a[3] == "":
			continue
		words = get_words_list(a[3])
		sentence_len = get_average_sentence_len(a[3])
		word_len = get_average_word_len(a[3], len(words))
		dif_index = get_dificulty_index(words)
		temp = [sentence_len, word_len]
		output.append([a[0], a[1], a[2], temp[0], temp[1]])
	return output
	# still need to add distance between words!

def get_words_list(text):
	lines = text.split(".")
	words = []
	for l in lines:
		for w in l.split(' '):
			words.append(w)
	return words

def get_dificulty_index(words):
	dictionary = import_dictionary("../../docs/lib/Basic_word_list.txt")
	total = 0
	d = 0
	for w in words:
		if w.lower() not in dictionary:
			total += 1
		else:
			d += 1

def get_average_sentence_len(text):
	sentences = text.split(".")
	tot_amount = len(sentences)
	tot_words = 0
	for s in sentences:
		tot_words += len(s.split(" "))

	return tot_words/tot_amount

def get_average_word_len(text, total_words):
	sentences = text.split(".")
	Tchars = 0
	for s in sentences:
		words = s.split(" ")
		for w in words:
			Tchars += len(w)
	average = Tchars/total_words
	return average

def outputCsv(data, filename):
	firstrow = ["speeker", "date", "title", "sen", "word"]
	with open(filename, "wb") as fout:
		writer = csv.writer(fout)
		writer.writerow(firstrow)
		writer.writerows(data)

def import_dictionary(filename):
	with open(filename, "r") as fin:
		words = fin.readlines()
		b = set()
		for w in words:
			if w[-1:] == "\n":
				w = w[:-1]
			b.add(str(w))
		return b

def changes_dates(data):
	months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
	for i, d in enumerate(data):
		date = d[1].split(" ")
		if len(date) > 3:
			continue
		month = ""
		for j in range(11):
			if date[0] == months[j]:
				num_month = j + 1
				if num_month < 10:
					month = "0"+ str(num_month)
				else:
					month = str(num_month)
			if date[0] == "December":
				month = "12"
		day = int(date[1][:-1]) + 1
		if day < 10:
			day = "0" + str(day)
		else:
			day = str(day)
		data[i][1] = date[2] + "/" + month + "/" + day 
	return data
if __name__ == "__main__":
	data = loadData("../../docs/Hillary/Hillary_Speeches.csv")
	stat_data =  statistics(data)
	stat_data = changes_dates(stat_data)
	outputCsv(stat_data, "../../docs/prepared_data/Hillary_data.csv")