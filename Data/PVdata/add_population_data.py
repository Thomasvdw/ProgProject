# -*- coding: utf-8 -*-
"""
Created on Wed May 27 20:06:01 2015

@author: Thomas
"""

# Python standard library imports
import csv
import os

POPULATION_CSV = "C:\Users\Thomas\Documents\GitHub\ProgProject\Population_data\Populationstates_Annual.csv"

def main():
    
    dates = []
    

    
    with open(POPULATION_CSV, 'r') as csvfile:
        reader = csv.reader(csvfile, delimiter = ",")
        next(csvfile)
        for row in reader:
            population = []
            dates.append(row[0])
            for i in range(1, 53):
                population.append(row[i])
            dates.append(population)
    

    item = 0
    
    for file in os.listdir("reformatted/"):
        print "copying from " + file +  "..."
        name = file[0:2]
        OUTPUT_CSV = "population_energy_growth/" + name + "_population.csv"
        
        
        with open(OUTPUT_CSV, 'wb') as f:
            
            
            writer = csv.writer(f)
            writer.writerow(['Date', 'Population'])
            x = 0
            for i in range(0, 35):
                writer.writerow([dates[x], dates[x + 1][item]])
                x += 2
            item += 1
        
                
            
if __name__ == '__main__':
    main()
    