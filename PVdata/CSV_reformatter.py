#!/usr/bin/env python
# Name: Thomas van der Wardt
# Student number: 10900578
# Programming Project: CSV_reformatter.py
'''
This script reformats data from a csv into one large CSV file with aligned columns, and one large JSON file
'''
# Python standard library imports
import csv
import os





def main():

    for file in os.listdir("StatesCSVs/"):
        print "reformatting..." + file
        FILENAME = "StatesCSVs/" + file  
        OUTPUT_CSV = "reformatted/" + file
    
        zipcode = []
        state = []
        size = []
        cost = []
        date = []
    
        seperator = ","
        with open(FILENAME, 'r') as csvfile:
            reader = csv.reader(csvfile, delimiter= seperator)
            for row in reader:
                zipcode.append(row[0])
                state.append(row[1])
                size.append(row[2])
                cost.append(row[3])
                current_date = row[4]
                current_date = current_date.replace("-", "/")
                date.append(current_date)
    
        
    
        with open(OUTPUT_CSV, 'ab') as f:
            writer = csv.writer(f)
            for i in range(len(zipcode)):
                writer.writerow([zipcode[i], 
                             state[i], 
                            size[i], 
                            cost[i], 
                            date[i]])
         

if __name__ == '__main__':
    main()
    
