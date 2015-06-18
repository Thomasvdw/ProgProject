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
                size = row[2]
                size = size.replace(';', '')
                size = size.replace('.', '')
                size = float(size)
                
                date = str(row[4])
                date = date[-4:]
                
                cost_size = row[10]                
                
                generate = row[11]
                generate = generate.replace(';', '.')
                generate = float(generate)
                generate = generate / 1000
                
                if cost_size > 1000 and date > "1995" and size < 1000:
                    if date <= "2015":
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

        
            generate2015 = sum(generate_2015)
            generate2014 = sum(generate_2014)
            generate2013 = sum(generate_2013)
            generate2012 = sum(generate_2012)
            generate2011 = sum(generate_2011)
            generate2010 = sum(generate_2010)
            generate2009 = sum(generate_2009)
            generate2008 = sum(generate_2008)
            generate2007 = sum(generate_2007)
            generate2006 = sum(generate_2006)
            generate2005 = sum(generate_2005)
            generate2004 = sum(generate_2004)
            generate2003 = sum(generate_2003)
            generate2002 = sum(generate_2002)
            generate2001 = sum(generate_2001)
            generate2000 = sum(generate_2000)
            generatetotal = sum(generate_total)


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
    
    
    