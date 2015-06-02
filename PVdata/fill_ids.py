# -*- coding: utf-8 -*-
"""
Created on Wed May 27 20:06:01 2015

@author: Thomas
"""

# Python standard library imports
import csv
import os

IDS_CSV = "C:\Users\Thomas\Documents\GitHub\ProgProject\county_ids.csv"
OUTPUT_CSV = "C:\Users\Thomas\Documents\GitHub\ProgProject\county_ids_solarradiation.csv"


def main():
    county_ids = {}
    
    with open(IDS_CSV, 'r') as csv_outfile:
        reader = csv.reader(csv_outfile, delimiter = ",")
        next(csv_outfile)
        for row in reader:
            county_ids[row[0]] = 0.1
        
        
    for file in os.listdir("reformatted/"):
        print 'copying from ' + file + '...'
        FILENAME = "reformatted/" + file
        with open(FILENAME, 'r') as csvfile:
            reader = csv.reader(csvfile, delimiter =",")
            next(csvfile)
            for row in reader: 
                county_ids[row[9]] = row[7]
    
    items = county_ids.items()
                 
    with open(OUTPUT_CSV, 'wb') as f: 
        writer = csv.writer(f)
        writer.writerow(['id', 'solar_radiation'])
        for i in range(len(county_ids)):
            writer.writerow([items[i][0], items[i][1]])
            
            
if __name__ == '__main__':
    main()
    