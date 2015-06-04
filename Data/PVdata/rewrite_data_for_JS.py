# -*- coding: utf-8 -*-
"""
Created on Wed May 27 20:06:01 2015

@author: Thomas
"""

# Python standard library imports
import csv
import json

IMPORT_CSV = "C:\Users\Thomas\Documents\GitHub\ProgProject\HTML_JS_CSS\sample_data.csv"
OUTPUT_CSV = "C:\\Users\\Thomas\\Documents\\GitHub\\ProgProject\\HTML_JS_CSS\\reformat_sample_data.csv"
OUTPUT_JSON = "C:\\Users\\Thomas\\Documents\\GitHub\\ProgProject\\HTML_JS_CSS\\reformat_sample_data.json"

def main():

    data = {}

    with open(IMPORT_CSV, 'r') as csvfile:
        reader = csv.reader(csvfile, delimiter = ",")
        next(csvfile)
        for row in reader: 
            data[row[0]] = row[1]
            


    with open(OUTPUT_CSV, 'wb') as f:
        writer = csv.writer(f)
        for key in data.keys():
            writer.writerow([key, data[key]])
    
    with open(OUTPUT_JSON, 'w') as fp:
        json.dump(data, fp)
        
                
            
if __name__ == '__main__':
    main()
    