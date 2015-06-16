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
	'''does all statistics on the data and returns a list 
		of data specification and statistics'''
	output = []
	for i, a in enumerate(data):
		if i == 0:
			continue
		
		# get rid of empty datasets
		if a[3] == "":
			continue
		
		# get total words 
		words = get_words_list(a[3])
		sentence_len = get_average_sentence_len(a[3])
		word_len = get_average_word_len(a[3], len(words))
		
		# get the dificulty index
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
	'''Chanes date type to readible type for d3'''
	
	months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
	for i, d in enumerate(data):
		
		# split into day, month, year seperatly
		date = d[1].split(" ")
		
		# if date is incorrect leave the data
		if len(date) > 3:
			continue
		
		# get month
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
		# get day
		day = int(date[1][:-1]) + 1
		if day < 10:
			day = "0" + str(day)
		else:
			day = str(day)
		
		# build date in correct form
		data[i][1] = date[2] + "/" + month + "/" + day 
	return data

def change_name(data):
	for i, d in enumerate(data):
		data[i][0] =d[0].split(" ")[1]
	return data

def get_states(data):
	states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"]
	a = 0
	for i, d in enumerate(data):
		words = d[2].split(" ")
		for w in words:
			if w in states:
				data[i][2] = w
				a +=1
	print a
	return data
if __name__ == "__main__":
	data = loadData("../../docs/Hillary/Hillary_Speeches.csv")
	stat_data =  statistics(data)
	stat_data = changes_dates(stat_data)
	stat_data = change_name(stat_data)
	stat_data = get_states(stat_data)
	outputCsv(stat_data, "../../docs/prepared_data/Hillary_data.csv")