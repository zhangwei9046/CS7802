import pandas as pd
import numpy as np
# from bokeh.layouts import gridplot
from bokeh.plotting import figure, output_file, show

df = pd.read_csv('./NationalParkVisits.csv')
array = np.array(data)
d = []
for i in xrange(len(array)):
    if str(array[i][1]) != 'nan' and array[i][0].find('NP') != -1 and array[i][0].find('NPRES') == -1:
        d.append([str(array[i][0]), int(array[i][1]), int(array[i][2].replace(',', ''))])


def classify_on_year(array):
    dict = {}
    for x in array:
        if str(x[1]) == 'nan':
            continue
        elif x[1] not in dict:
            dict[x[1]] = [x]
        else:
            dict[x[1]].append(x)
    return dict

lists_on_years = classify_on_year(d)


def calc_ranks_on_year(array):
    array.sort(key=lambda x : x[2], reverse=True)
    for i in range(len(array)):
        array[i].append(i+1)  
    return array

lists_with_ranks = {x: calc_ranks_on_year(lists_on_years[x]) for x in lists_on_years}


def classify_on_year(lists_on_years):
    dict = {}
    for key in lists_on_years:
        for x in lists_on_years[key]:
            if x[0] not in dict:
                dict[x[0]] = [x[1:]]
            else:
                dict[x[0]].append(x[1:])
    return dict

lists_on_parks = classify_on_year(lists_with_ranks)


output_file("index.html")

p = figure(plot_width=700, plot_height=700, title="The most popular National Parks", y_range=(60,1))
p.yaxis.axis_label = 'Rank'

for key in lists_on_parks:
    a = np.array(lists_on_parks[key])
    if key == 'Great Smoky Mountains NP':
        p.line(a[:,0], a[:,2], line_color='brown', line_width=2, legend='Great Smoky Mountains')
    elif key == 'Grand Canyon NP':
        p.line(a[:,0], a[:,2], line_color='navy', line_width=2, legend='Grand Canyon')
    elif key == 'Rocky Mountain NP':
        p.line(a[:,0], a[:,2], line_color='blue', line_width=2, legend='Rocky Mountain')
    elif key == 'Yosemite NP':
        p.line(a[:,0], a[:,2], line_color='green', line_width=2, legend='Yosemite')
    elif key == 'Yellowstone NP':
        p.line(a[:,0], a[:,2], line_color='orange', line_width=2, legend='Yellowstone')
    elif key == 'Zion NP':
        p.line(a[:,0], a[:,2], line_color='red', line_width=2, legend='Zion')
    elif key == 'Acadia NP':
        p.line(a[:,0], a[:,2], line_color='yellow', line_width=2, legend='Acadia')
    elif key == 'Hot Springs NP':
        p.line(a[:,0], a[:,2], line_color='cyan', line_width=2, legend='Hot Springs')
    elif key == 'Denali NP & PRES':
        p.line(a[:,0], a[:,2], line_color='purple', line_width=2, legend='Denali')
    elif key == 'Carlsbad Caverns NP':
        p.line(a[:,0], a[:,2], line_color='blue', line_width=2, legend='Carlsbad Caverns')
    elif key == 'Great Basin NP':
        p.line(a[:,0], a[:,2], line_color='magenta', line_width=2, legend='Great Basin')
    else:
        p.line(a[:,0], a[:,2], line_color='silver', line_width=1)
p.legend.location = "bottom_left"
show(p)


