# -*- coding: utf-8 -*-
"""
Created on Wed May 27 11:28:56 2015

@author: Thomas
"""

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
OUTPUT_CSV = "reformatted/California.csv"

def main():

    with open(OUTPUT_CSV, 'ab') as f:
        writer = csv.writer(f)
        writer.writerow(['Zipcode', 
                         'State',
                         'Size',
                         'Cost', 
                         'Date',
                         'Latitude',
                         'Longitude',
                         'Solar Radiation - Annual Average (kWh/m2/day)', 
                         'County', 
                         'INCITS'])

    for file in os.listdir("California/"):
        print "reformatting..." + file
        FILENAME = "California/" + file  
        
        
        zipcode = []
        state = []
        size = []
        cost = []
        date = []
        latitude = []
        longitude = []
        solarradiation = []
        counties = []
        incits = []
        
        seperator = ","
        with open(FILENAME, 'r') as csvfile:
            reader = csv.reader(csvfile, delimiter= seperator)
            next(csvfile)
            for row in reader:
                zipcode.append(row[0])
                state.append(row[1])
                size.append(row[2])
                cost.append(row[3])
                date.append(row[4])
                latitude.append(row[5])
                longitude.append(row[6])
                solarradiation.append(row[7])
                counties.append(row[8])
                incits.append(row[9])
                
        
        with open(OUTPUT_CSV, 'ab') as f:
            writer = csv.writer(f)
            for i in range(len(zipcode)):
                writer.writerow([zipcode[i], 
                                 state[i], 
                                 size[i], 
                                 cost[i], 
                                 date[i], 
                                 latitude[i], 
                                 longitude[i], 
                                 solarradiation[i], 
                                 counties[i], 
                                 incits[i]])
                                 
                                 
             
             
if __name__ == '__main__':
    main()
    
