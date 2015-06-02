# -*- coding: utf-8 -*-
"""
Created on Wed May 27 20:06:01 2015

@author: Thomas
"""

# Python standard library imports
import csv

SOLAR_CSV = "C:\Users\Thomas\Documents\GitHub\ProgProject\PVdata\SolarRadiation\solar_by_zip.csv"
OUTPUT_CSV = "C:\Users\Thomas\Documents\GitHub\ProgProject\PVdata\SolarRadiation\solar_by_zip_county_incts.csv"
COUNTY_CSV = "C:\Users\Thomas\Documents\GitHub\ProgProject\zipcode\zipcode_to_county.csv"
INCITS_CSV = "C:\Users\Thomas\Documents\GitHub\ProgProject\zipcode\county_to_incits.csv"

def main():
    zipcode = {}
    radiation = {}
    
    with open(SOLAR_CSV, 'r') as csvfile:
        reader = csv.reader(csvfile, delimiter = ",")
        next(csvfile)
        for row in reader:
            print 'first part..' + row[0]
            zipcode[row[0]] = 0
            radiation[row[0]] = row[2]


    with open(COUNTY_CSV, 'r') as csvfile:
        reader = csv.reader(csvfile, delimiter = ",")
        next(csvfile)
        for row in reader:
            if row[0] in zipcode.keys():
                print 'second part..' + row[0]
                zipcode[row[5]] = row[0]
    
    incits = {}
    
    return incits, zipcode, radiation
              
    
if __name__ == '__main__':
    incits, zipcode, radiation = main() 
    
    with open(INCITS_CSV, 'r') as csvfile:
        reader = csv.reader(csvfile, delimiter = ",")
        next(csvfile)
        for row in reader:
            print 'third part..' + row[0]
            incits[row[0]] = zipcode[row[1]]

    count = 0
    
    with open(OUTPUT_CSV, 'wb') as f:
        writer = csv.writer(f)
        writer.writerow(['INCITS','Zipcode','Radiation'])
        keys = radiation.keys()
        for key in keys:
            try:
                writer.writerow([key, incits[key], radiation[key]])
            except KeyError:
                count += 1
        