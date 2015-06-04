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

ZIPCODES = "C:\Users\Thomas\Documents\GitHub\ProgProject\zipcode\zipcode.csv"
SOLARRADIATION = "C:\Users\Thomas\Documents\GitHub\ProgProject\PVdata\SolarRadiation\solar_by_zip.csv"
ZIPCODE_TO_COUNTY = "C:\Users\Thomas\Documents\GitHub\ProgProject\zipcode\zipcode_to_county.csv"
COUNTY_TO_INCITS = "C:\Users\Thomas\Documents\GitHub\ProgProject\zipcode\county_to_incits.csv"

def zipcodes():
    zipcodes = {}
    print 'reading in zipcodes..'
    with open(ZIPCODES, 'r') as csvfile:
        reader = csv.reader(csvfile, delimiter = ",")
        for row in reader:
            zipcodes[row[1]] = [row[6], row[7]]
    return zipcodes

def solar_radiation():
    solar_by_zip = {}
    print 'reading in solar radiation per zipcode..'
    with open(SOLARRADIATION, 'r') as csvfile:
        reader = csv.reader(csvfile, delimiter = ",")
        next(csvfile)
        for row in reader:
            solar_by_zip[row[0]] = row[2]
    return solar_by_zip
    
def zipcode_to_county():
    dict_zipcode_to_county = {}
    print 'reading in zipcode to county dictionary..'
    with open(ZIPCODE_TO_COUNTY, 'r') as csvfile:
        reader = csv.reader(csvfile, delimiter = ",")
        next(csvfile)
        for row in reader: 
            dict_zipcode_to_county[row[0]] = row[5]
    return dict_zipcode_to_county
    
def county_to_incits():
    dict_incits = {}
    print 'reading in county to INCITS id dictionary..'
    with open(COUNTY_TO_INCITS, 'r') as csvfile:
        reader = csv.reader(csvfile, delimiter = ",")
        next(csvfile)
        for row in reader:
            dict_incits[row[1]] = row[0]
            
    return dict_incits

def main():
    
    dict_zipcodes = zipcodes()
    dict_solar_by_zip = solar_radiation()
    dict_zipcode_to_county = zipcode_to_county()
    dict_county_to_incits = county_to_incits()
    

    
    FILENAME = "StatesCSVs/Arkansas.csv"
    OUTPUT_CSV = "reformatted/AR.csv"
        
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
    
    zipcode.append('Zipcode')
    state.append('State')
    size.append('Size')
    cost.append('Cost')
    date.append('Date')        
    latitude.append('Latitude')
    longitude.append('Longitude')
    solarradiation.append('Solar Radiation - Annual Average (kWh/m2/day)')
    counties.append('County')
    incits.append('INCITS')
    
    seperator = ","
    with open(FILENAME, 'r') as csvfile:
        reader = csv.reader(csvfile, delimiter= seperator)
        next(csvfile)
        for row in reader:
            zipcode.append(row[0])
            state.append(row[1])
            size.append(row[2])
            cost.append(row[3])
            current_date = row[4]
            current_date = current_date.replace("-", "/")
            date.append(current_date)
            try: 
                latlon = dict_zipcodes[row[0]]
                lat = latlon[0]
                lon = latlon[1]
                latitude.append(lat)
                longitude.append(lon)
                    
                radiation = dict_solar_by_zip[row[0]]
                solarradiation.append(radiation)
                    
                county = dict_zipcode_to_county[row[0]]
                counties.append(county)
                    
                county_id = dict_county_to_incits[county]
                incits.append(county_id)
                    
            except KeyError:
                latitude.append('0')
                longitude.append('0')
                solarradiation.append('0')
                counties.append('0')
                incits.append('0')
                pass        
        
        
    with open(OUTPUT_CSV, 'wb') as f:
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
    
