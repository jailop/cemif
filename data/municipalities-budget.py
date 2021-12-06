#!/usr/bin/python

import pandas as pd
from multiprocessing import Pool, cpu_count

def preproc_1(tag):
    data = pd.read_csv(tag[0], sep=';', low_memory=False)
    data.rename(columns={
        'EJERCICIO': 'year',
        'MES': 'month',
        'AREA': 'area',
        'AREA_DESC': 'area_name',
        'ALCALDIA': 'municipality',
        'FFIN': 'source',
        'FFIN_DESC': 'source_name',
        'FREC': 'financier',
        'FREC_DESC': 'financier_name',
        'TIPOPRES': 'ppto',
        'OE': 'object',
        'OE_DESC': 'object_name',
        'PROY': 'project',
        'PROY_DESC': 'project_name',
        'UNIDAD': 'unit',
        'LINEA' : 'line',
        'VOTADO': 'APR',
        'MODIFICADO': 'MOD',
        'DEVENGADO': 'ACR',
    }, inplace=True)
    data['unit_name'] = data.unit.apply(lambda s: ' '.join(s.split()[1:]))
    data['unit'] = data.unit.apply(lambda s: s.split()[0])
    data['line_name'] = data.line.apply(lambda s: ' '.join(s.split()[1:]))
    data['line'] = data.line.apply(lambda s: s.split()[0])
    catalog = data[[
        'year', 'municipality', 'object', 'object_name'
    ]].drop_duplicates()
    catalog.to_csv('supl/municipalities-budget-%d.csv' % tag[1], index=False)
    units = data[['year', 'municipality', 'unit', 'unit_name']] \
        .rename(columns={'unit': 'program', 'unit_name': 'program_name'})
    lines = data[['year', 'municipality', 'line', 'line_name']] \
        .rename(columns={'line': 'program', 'line_name': 'program_name'})
    programs = pd.concat([units, lines]). drop_duplicates()
    programs.to_csv('supl/municipalities-programs-%d.csv' % tag[1], index=False)
    data['program'] = data['unit'].apply(lambda v: str(v).zfill(2)) + data['line'].apply(lambda v: str(v).zfill(2))
    movs = data[[
        'year', 'month', 'area', 'municipality', 'source', 'financier', 'ppto',
        'object', 'project', 'program',
        'APR', 'MOD', 'ACR'
    ]]
    tidy = pd.melt(movs,
        id_vars=[
            'year', 'month', 'area', 'municipality', 'source', 'financier',
            'ppto', 'object', 'project', 'program'
        ],
        value_vars=[
            'APR', 'MOD', 'ACR'
        ],
        var_name='class', value_name='amount'
    )
    tidy.to_csv("movs/municipalities-budget-%d.csv" % tag[1], index=False)
    print(tag[1]);

if __name__ == '__main__':
    tags = [
        ('tmp/2010.dsv', 2010),
        ('tmp/2011.dsv', 2011),
        ('tmp/presup2012.dsv', 2012),
        ('tmp/2013.dsv', 2013),
        ('tmp/2014.dsv', 2014),
        ('tmp/MUN_PRESUP1589920277682-012015-132015.csv', 2015),
        ('tmp/MUN_PRESUP1564524594616-012016-132016.csv', 2016),
        ('tmp/MUN_PRESUP1603895684705-012017-132017.csv', 2017),
        ('tmp/MUN_PRESUP1611869076994-012018-132018.csv', 2018),
        ('tmp/MUN_ECON1635534289122-012019-132019.csv', 2019),
        ('tmp/MUN_PRESUP1635540179777-012020-132020.csv', 2020),
        ('tmp/MUN_PRESUP1635540418643-012021-132021.csv', 2021),
    ]
    with Pool(cpu_count()) as p:
        p.map(preproc_1, tags)
