# -*- coding: utf-8 -*-
"""
Created on Wed May 27 20:06:01 2015

@author: Thomas
"""

# Python standard library imports
import csv
import os

def main():
    
    generated = []
    
    for file in os.listdir("reformatted/"):
        print 'getting data from.. ' + file
        generate_total = []
        generate_2000 = []
        generate_2001 = []
        generate_2002 = []
        generate_2003 = []
        generate_2004 = []
        generate_2005 = []
        generate_2006 = []
        generate_2007 = []
        generate_2008 = []
        generate_2009 = []
        generate_2010 = []
        generate_2011 = []
        generate_2012 = []
        generate_2013 = []
        generate_2014 = []
        generate_2015 = []        
        
        name = "reformatted/" + file
        with open(name, 'r') as csvfile:
            reader = csv.reader(csvfile, delimiter = ",")
            next(csvfile)
            for row in reader:
                date = str(row[4])
                date = date[-4:]
                
                cost_size = row[10]                
                
                generate = row[11]
                generate = generate.replace(';', '.')
                generate = float(generate)
                
                if cost_size > 1000:
                    if date < "2015":
                        generate_2015.append(generate)
                    if date < "2014":
                        generate_2014.append(generate)
                    if date < "2013":
                        generate_2013.append(generate)
                    if date < "2012":
                        generate_2012.append(generate)
                    if date < "2011":
                        generate_2011.append(generate)
                    if date < "2010":
                        generate_2010.append(generate)
                    if date < "2009":
                        generate_2009.append(generate)
                    if date < "2008":
                        generate_2008.append(generate)
                    if date < "2007":
                        generate_2007.append(generate)
                    if date < "2006":
                        generate_2006.append(generate)
                    if date < "2005":
                        generate_2005.append(generate)
                    if date < "2004":
                        generate_2004.append(generate)
                    if date < "2003":
                        generate_2003.append(generate)
                    if date < "2002":
                        generate_2002.append(generate)
                    if date < "2001":
                        generate_2001.append(generate)
                    if date < "2000":
                        generate_2000.append(generate)
                    generate_total.append(generate)
                else: 
                    pass

        
        try:
            generate2015 = sum(generate_2015) / len(generate_2015)
        except ZeroDivisionError:
            generate2015 = 0
        try:
            generate2014 = sum(generate_2014) / len(generate_2014)
        except ZeroDivisionError:
            generate2014 = 0
        try:
            generate2013 = sum(generate_2013) / len(generate_2013)
        except ZeroDivisionError:
            generate2013 = 0
        try:
            generate2012 = sum(generate_2012) / len(generate_2012)
        except ZeroDivisionError:
            generate2012 = 0
        try:
            generate2011 = sum(generate_2011) / len(generate_2011)
        except ZeroDivisionError:
            generate2011 = 0
        try:
            generate2010 = sum(generate_2010) / len(generate_2010)
        except ZeroDivisionError:
            generate2010 = 0
        try:
            generate2009 = sum(generate_2009) / len(generate_2009)
        except ZeroDivisionError:
            generate2009 = 0
        try:
            generate2008 = sum(generate_2008) / len(generate_2008)
        except ZeroDivisionError:
            generate2008 = 0
        try:
            generate2007 = sum(generate_2007) / len(generate_2007)
        except ZeroDivisionError:
            generate2007 = 0
        try:
            generate2006 = sum(generate_2006) / len(generate_2006)
        except ZeroDivisionError:
            generate2006 = 0
        try:
            generate2005 = sum(generate_2005) / len(generate_2005)
        except ZeroDivisionError:
            generate2005 = 0
        try:
            generate2004 = sum(generate_2004) / len(generate_2004)
        except ZeroDivisionError:
            generate2004 = 0
        try:
            generate2003 = sum(generate_2003) / len(generate_2003)
        except ZeroDivisionError:
            generate2003 = 0
        try:
            generate2002 = sum(generate_2002) / len(generate_2002)
        except ZeroDivisionError:
            generate2002 = 0
        try:
            generate2001 = sum(generate_2001) / len(generate_2001)
        except ZeroDivisionError:
            generate2001 = 0
        try:
            generate2000 = sum(generate_2000) / len(generate_2000)
        except ZeroDivisionError:
            generate2000 = 0
        try:
            generatetotal = sum(generate_total) / len(generate_total)
        except ZeroDivisionError:
            generatetotal = 0

        all_generated = [int(generate2015), int(generate2014), int(generate2013), int(generate2012),
                     int(generate2011), int(generate2010), int(generate2009), int(generate2008),
                     int(generate2007), int(generate2006), int(generate2005), int(generate2004),
                     int(generate2003), int(generate2002), int(generate2001), int(generate2000), 
                     int(generatetotal)]

        generated.append(all_generated)
        
        dates = ['1/1/2015', '1/1/2014', '1/1/2013', '1/1/2012', 
                 '1/1/2011', '1/1/2010', '1/1/2009', '1/1/2008',
                 '1/1/2007', '1/1/2006', '1/1/2005', '1/1/2004',
                 '1/1/2003', '1/1/2002', '1/1/2001', '1/1/2000', "total"]
        
    
    for x, file in enumerate(os.listdir("reformatted/")):
        name = "annual_generated_kwh_growth/" + "generated_" + file
        with open(name, 'wb') as f:
            writer = csv.writer(f)
            writer.writerow(['Date', 'Annual generated'])
            for i in range(17):
                writer.writerow([dates[i], generated[x][i]])
             
if __name__ == '__main__':
    main()
    
    
    