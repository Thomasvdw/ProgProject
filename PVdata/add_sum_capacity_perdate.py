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
                    if size > 200 or len(str(size)) > 6:
                        size = 0
                    if date < "2015":
                        size_2015.append(size)
                    if date < "2014":
                        size_2014.append(size)
                    if date < "2013":
                        size_2013.append(size)
                    if date < "2012":
                        size_2012.append(size)
                    if date < "2011":
                        size_2011.append(size)
                    if date < "2010":
                        size_2010.append(size)
                    if date < "2009":
                        size_2009.append(size)
                    if date < "2008":
                        size_2008.append(size)
                    if date < "2007":
                        size_2007.append(size)
                    if date < "2006":
                        size_2006.append(size)
                    if date < "2005":
                        size_2005.append(size)
                    if date < "2004":
                        size_2004.append(size)
                    if date < "2003":
                        size_2003.append(size)
                    if date < "2002":
                        size_2002.append(size)
                    if date < "2001":
                        size_2001.append(size)
                    if date < "2000":
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

        all_sizes = [int(size2015), int(size2014), int(size2013), int(size2012),
                     int(size2011), int(size2010), int(size2009), int(size2008),
                     int(size2007), int(size2006), int(size2005), int(size2004),
                     int(size2003), int(size2002), int(size2001), int(size2000), 
                     int(sizetotal)]

        sizes.append(all_sizes)
        
        dates = ['1/1/2015', '1/1/2014', '1/1/2013', '1/1/2012', 
                 '1/1/2011', '1/1/2010', '1/1/2009', '1/1/2008',
                 '1/1/2007', '1/1/2006', '1/1/2005', '1/1/2004',
                 '1/1/2003', '1/1/2002', '1/1/2001', '1/1/2000', "total"]
        
           
    for x, file in enumerate(os.listdir("reformatted/")):
        name = "population_energy_growth/solar_size/" + "solar_size_" + file
        with open(name, 'wb') as f:
            writer = csv.writer(f)
            writer.writerow(['Date', 'Size'])
            for i in range(17):
                writer.writerow([dates[i], sizes[x][i]])
                

    
    return sizes, dates
             
if __name__ == '__main__':
    sizes, dates = main()
    
    
    