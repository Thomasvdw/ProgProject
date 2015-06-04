# -*- coding: utf-8 -*-
"""
Created on Wed May 27 20:06:01 2015

@author: Thomas
"""

# Python standard library imports
import csv
import os

def main():
    
    costs = []
    
    for file in os.listdir("reformatted/"):
        print 'getting data from.. ' + file
        cost_total = []
        cost_2000 = []
        cost_2001 = []
        cost_2002 = []
        cost_2003 = []
        cost_2004 = []
        cost_2005 = []
        cost_2006 = []
        cost_2007 = []
        cost_2008 = []
        cost_2009 = []
        cost_2010 = []
        cost_2011 = []
        cost_2012 = []
        cost_2013 = []
        cost_2014 = []
        cost_2015 = []        
        
        name = "reformatted/" + file
        with open(name, 'r') as csvfile:
            reader = csv.reader(csvfile, delimiter = ",")
            next(csvfile)
            for row in reader:
                date = str(row[4])
                date = date[-4:]
                
                cost = row[10]
                cost = cost.replace(';', '.')
                cost = float(cost) 
                if cost > 2000:
                    if date < "2015":
                        cost_2015.append(cost)
                    if date < "2014":
                        cost_2014.append(cost)
                    if date < "2013":
                        cost_2013.append(cost)
                    if date < "2012":
                        cost_2012.append(cost)
                    if date < "2011":
                        cost_2011.append(cost)
                    if date < "2010":
                        cost_2010.append(cost)
                    if date < "2009":
                        cost_2009.append(cost)
                    if date < "2008":
                        cost_2008.append(cost)
                    if date < "2007":
                        cost_2007.append(cost)
                    if date < "2006":
                        cost_2006.append(cost)
                    if date < "2005":
                        cost_2005.append(cost)
                    if date < "2004":
                        cost_2004.append(cost)
                    if date < "2003":
                        cost_2003.append(cost)
                    if date < "2002":
                        cost_2002.append(cost)
                    if date < "2001":
                        cost_2001.append(cost)
                    if date < "2000":
                        cost_2000.append(cost)
                    cost_total.append(cost)
                else: 
                    pass

        
        try:
            cost2015 = sum(cost_2015) / len(cost_2015)
        except ZeroDivisionError:
            cost2015 = 0
        try:
            cost2014 = sum(cost_2014) / len(cost_2014)
        except ZeroDivisionError:
            cost2014 = 0
        try:
            cost2013 = sum(cost_2013) / len(cost_2013)
        except ZeroDivisionError:
            cost2013 = 0
        try:
            cost2012 = sum(cost_2012) / len(cost_2012)
        except ZeroDivisionError:
            cost2012 = 0
        try:
            cost2011 = sum(cost_2011) / len(cost_2011)
        except ZeroDivisionError:
            cost2011 = 0
        try:
            cost2010 = sum(cost_2010) / len(cost_2010)
        except ZeroDivisionError:
            cost2010 = 0
        try:
            cost2009 = sum(cost_2009) / len(cost_2009)
        except ZeroDivisionError:
            cost2009 = 0
        try:
            cost2008 = sum(cost_2008) / len(cost_2008)
        except ZeroDivisionError:
            cost2008 = 0
        try:
            cost2007 = sum(cost_2007) / len(cost_2007)
        except ZeroDivisionError:
            cost2007 = 0
        try:
            cost2006 = sum(cost_2006) / len(cost_2006)
        except ZeroDivisionError:
            cost2006 = 0
        try:
            cost2005 = sum(cost_2005) / len(cost_2005)
        except ZeroDivisionError:
            cost2005 = 0
        try:
            cost2004 = sum(cost_2004) / len(cost_2004)
        except ZeroDivisionError:
            cost2004 = 0
        try:
            cost2003 = sum(cost_2003) / len(cost_2003)
        except ZeroDivisionError:
            cost2003 = 0
        try:
            cost2002 = sum(cost_2002) / len(cost_2002)
        except ZeroDivisionError:
            cost2002 = 0
        try:
            cost2001 = sum(cost_2001) / len(cost_2001)
        except ZeroDivisionError:
            cost2001 = 0
        try:
            cost2000 = sum(cost_2000) / len(cost_2000)
        except ZeroDivisionError:
            cost2000 = 0
        try:
            costtotal = sum(cost_total) / len(cost_total)
        except ZeroDivisionError:
            costtotal = 0

        all_costs = [int(cost2015), int(cost2014), int(cost2013), int(cost2012),
                     int(cost2011), int(cost2010), int(cost2009), int(cost2008),
                     int(cost2007), int(cost2006), int(cost2005), int(cost2004),
                     int(cost2003), int(cost2002), int(cost2001), int(cost2000), 
                     int(costtotal)]

        costs.append(all_costs)
        
        dates = ['1/1/2015', '1/1/2014', '1/1/2013', '1/1/2012', 
                 '1/1/2011', '1/1/2010', '1/1/2009', '1/1/2008',
                 '1/1/2007', '1/1/2006', '1/1/2005', '1/1/2004',
                 '1/1/2003', '1/1/2002', '1/1/2001', '1/1/2000', "total"]
        
    
    for x, file in enumerate(os.listdir("reformatted/")):
        name = "normalized_costs_growth/" + "cost_per_size_" + file
        with open(name, 'wb') as f:
            writer = csv.writer(f)
            writer.writerow(['Date', 'Cost/size'])
            for i in range(17):
                writer.writerow([dates[i], costs[x][i]])
             
if __name__ == '__main__':
    main()
    
    
    