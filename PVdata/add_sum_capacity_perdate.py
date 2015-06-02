# -*- coding: utf-8 -*-
"""
Created on Wed May 27 20:06:01 2015

@author: Thomas
"""

# Python standard library imports
import csv
import os

def main():
    
    sizes = []
    
    for file in os.listdir("reformatted/"):
        print file
        size_total = []
        size_2000 = []
        size_2001 = []
        size_2002 = []
        size_2003 = []
        size_2004 = []
        size_2005 = []
        size_2006 = []
        size_2007 = []
        size_2008 = []
        size_2009 = []
        size_2010 = []
        size_2011 = []
        size_2012 = []
        size_2013 = []
        size_2014 = []
        size_2015 = []        
        
        name = "reformatted/" + file
        with open(name, 'r') as csvfile:
            reader = csv.reader(csvfile, delimiter = ",")
            next(csvfile)
            for row in reader:
                date = str(row[4])
                date = date[-4:]
                try:
                    size = row[2]
                    size = float(size)                    
                    if date > "2015":
                        size_2015.append(size)
                    if date > "2014":
                        size_2014.append(size)
                    if date > "2013":
                        size_2013.append(size)
                    if date > "2012":
                        size_2012.append(size)
                    if date > "2011":
                        size_2011.append(size)
                    if date > "2010":
                        size_2010.append(size)
                    if date > "2009":
                        size_2009.append(size)
                    if date > "2008":
                        size_2008.append(size)
                    if date > "2007":
                        size_2007.append(size)
                    if date > "2006":
                        size_2006.append(size)
                    if date > "2005":
                        size_2005.append(size)
                    if date > "2004":
                        size_2004.append(size)
                    if date > "2003":
                        size_2003.append(size)
                    if date > "2002":
                        size_2002.append(size)
                    if date > "2001":
                        size_2001.append(size)
                    if date > "2000":
                        size_2000.append(size)
                    size_total.append(size)
                except ValueError:
                    pass
                
        size2015 = sum(size_2015)
        size2014 = sum(size_2014)
        size2013 = sum(size_2013)
        size2012 = sum(size_2012)
        size2011 = sum(size_2011)
        size2010 = sum(size_2010)
        size2009 = sum(size_2009)
        size2008 = sum(size_2008)
        size2007 = sum(size_2007)
        size2006 = sum(size_2006)
        size2005 = sum(size_2005)
        size2004 = sum(size_2004)
        size2003 = sum(size_2003)
        size2002 = sum(size_2002)
        size2001 = sum(size_2001)
        size2000 = sum(size_2000)
        sizetotal = sum(size_total)

        all_sizes = [size2015, size2014, size2013, size2012, size2011, size2010, size2009, size2008,
                     size2007, size2006, size2005, size2004, size2003, size2002, size2001, size2000, sizetotal]

        sizes.append(all_sizes)
           
    for x, file in enumerate(os.listdir("population_energy_growth/")):
        name = "population_energy_growth/solar_size/" + file
        with open(name, 'wb') as f:
            writer = csv.writer(f)
            writer.writerow(['Size'])
            if x > 51: 
                break
            for i in range(16):
                writer.writerow([sizes[x][i]])
                

    
    return sizes
             
if __name__ == '__main__':
    sizes = main()
    
    
    