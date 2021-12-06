#!/usr/bin/python

# Tidies the population_raw dataset

import pandas as pd

data = pd.read_csv('supl/population_raw.csv')

tidy = pd.melt(
    data,
    id_vars=['municipality', 'year', 'source'],
    var_name='attribute',
    value_name='value'
)
tidy['municipality'] = tidy.municipality.apply(lambda v: str(v).zfill(4))
tidy['source'] = 'censo2007'
tidy.to_csv('supl/population.csv', index=False)
