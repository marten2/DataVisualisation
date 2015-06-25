from __future__ import division
import string
import csv
import dateutil.parser as dateParser

def loadData(filename):
	'''Get data from file, return list of lists with data'''
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

		# Analyse text
		text = a[3].lower() 
		words = get_words_list(text)
		sentence_len = get_average_sentence_len(text)
		word_len = get_average_word_len(text, len(words))
		we_average = get_we_average(text, len(words))
		dif_index = get_dificulty_index(words)

		# save data in output
		output.append([a[0], a[1], a[2], sentence_len, word_len, dif_index, we_average])
	return output

def get_we_average(text, words):
	'''Get percentage of words that is we,
	input is a text and returns a percentage'''
	sentences = text.split(".")
	total_we = 0
	for sentence in sentences:
		for word in sentence.split(" "):
			if word == "we" or word == "We":
				total_we += 1
	return total_we/words * 100

def get_words_list(text):
	'''split text in words, takes text returns list of words'''
	lines = text.split(".")
	words = []
	for l in lines:
		for w in l.split(' '):
			words.append(w)
	return words

def get_dificulty_index(words):
	'''Get the dificulty index of a text
		input is a list of words, outputs dificulty index'''
	dictionary = import_dictionary("../../docs/lib/Basic_word_list.txt")
	total = 0
	d = 0
	for w in words:
		if w.lower() not in dictionary:
			total += 1
		else:
			d += 1
	return total/d

def get_average_sentence_len(text):
	'''Get average sentece length,
	input is a text and returns average sentence length'''
	sentences = text.split(".")
	tot_amount = len(sentences)
	tot_words = 0
	for s in sentences:
		tot_words += len(s.split(" "))

	return tot_words/tot_amount

def get_average_word_len(text, total_words):
	'''Get average word length,
	input is a text and returns average word length'''
	sentences = text.split(".")
	Tchars = 0
	for s in sentences:
		words = s.split(" ")
		for w in words:
			Tchars += len(w)
	average = Tchars/total_words
	return average

def outputCsv(data, filename):
	'''Builds a output csv file, 
	input is a list of lists with the data'''
	firstrow = ["speeker", "date", "title", "Average sentence length", "Average word lengt", "Diffaculty Index", "Percentage of 'We'"]
	with open(filename, "wb") as fout:
		writer = csv.writer(fout)
		writer.writerow(firstrow)
		writer.writerows(data)

def import_dictionary(filename):
	'''Read in lybrary, input is filename, output set with words'''
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
	
	for i, d in enumerate(data):
		data[i][1] = str(dateParser.parse(d[1])).split(" ")[0]
	return data

def change_name(data):
	'''Change dates to useable format for d3'''
	for i, d in enumerate(data):
		data[i][0] =d[0].split(" ")[1]
	return data

def get_states(data):
	'''Tries to get location of speeches
		input data, output changed data'''
	states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"]
	cities_dict, cities_list = import_cities()
	a = 0
	for i, d in enumerate(data):
		words = d[2].split(" ")
		for w in words:
			if w in states:
				data[i][2] = w
				a +=1
				break
			if w in cities_list:
				data[i][2] = cities_dict[w]
				a += 1
				break
	print a
	return data
def import_cities():
	'''Imports list of cities from file, 
		input filename, output list of cities and dictionary linking cities and states'''
	with open("cities.csv", "rb") as fin:
		cities = fin.readlines()
		output_dict = {}
		output_list = [] 
		for line in cities:
			temp = line.split(",")
			output_list.append(temp[0])
			output_dict[temp[0]] = temp[1]
		return output_dict, output_list


def get_stat_data(president):
	'''Get data from speeches and changes data and location,
	gets data ready for d3. Input is a president to read in data, and
	outputs a file with the data gotten from the speeches.'''
	data = loadData("../../docs/Speeches/" + president + "_Speeches.csv")
	stat_data =  statistics(data)
	stat_data = changes_dates(stat_data)
	stat_data = change_name(stat_data)
	stat_data = get_states(stat_data)
	outputCsv(stat_data, "../../docs/prepared_data/" + president + "_data.csv")

if __name__ == "__main__":
	presidents = ["McCain", "Obama", "Hillary", "Huckabee", "Edwards"]
	for president in presidents:
		get_stat_data(president)