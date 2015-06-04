# -*- coding: utf-8 -*-
"""
Created on Wed May 27 20:06:01 2015

@author: Thomas
"""

# Python standard library imports
import csv
import os

OUTPUT_CSV = "id_and_size.csv"

def main():
    with open(OUTPUT_CSV, 'wb') as f:
        writer = csv.writer(f)
        writer.writerow(['id', 'rate'])
    
    for file in os.listdir("reformatted/"):
        print "copying from " + file +  "..."
        
        incits = []
        size = []
        
        FILENAME = "reformatted/" + file
        
        seperator = ","
        with open(FILENAME, 'r') as csvfile:
            reader = csv.reader(csvfile, delimiter= seperator)
            next(csvfile)
            for row in reader:
                incits.append(row[9])
                size.append(row[2])
        
        with open(OUTPUT_CSV, 'ab') as f:
            writer = csv.writer(f)
            for i in range(len(incits)):
                writer.writerow([incits[i], size[i]])
            
if __name__ == '__main__':
    main()
    