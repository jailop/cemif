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
        'TIPOMOV': 'ppto',
        'CTA': 'account',
        'CTA_DESC': 'account_name',
        'SALDO_INI_EJE': 'STR',
        'SALDO_INI_PER': 'STP',
        'DEBE': 'DEB',
        'HABER': 'CRD',
        'SALDO_FIN_PER': 'END'
    }, inplace=True)
    catalog = data[[
        'year', 'municipality', 'account', 'account_name'
    ]].drop_duplicates()
    catalog.to_csv('supl/municipalities-catalog-%d.csv' % tag[1], index=False)
    movs = data[[
        'year', 'month', 'area', 'municipality', 'source', 'financier',
        'ppto', 'account', 'STR', 'STP',
        'DEB', 'CRD', 'END'
    ]]
    tidy = pd.melt(movs,
        id_vars=[
            'year', 'month', 'area', 'municipality',
            'source', 'financier', 'ppto', 'account'
        ],
        value_vars=[
            'STR', 'STP',
            'DEB', 'CRD', 'END'
        ],
        var_name='class', value_name='amount'
    )
    tidy.to_csv("movs/municipalities-contab-%d.csv" % tag[1], index=False)
    print(tag[1])

if __name__ == '__main__':
    tags = [
        ('tmp/MAYO_GENE_INST 2010-utf8-clean.csv', 2010),
        ('tmp/MAYO_GENE_INST2011-utf8-clean.csv', 2011),
        ('tmp/MAYO_GENE_INST 2012-utf8-clean.csv', 2012),
        ('tmp/MAYO_GENE_INST 2013-utf8-clean.csv', 2013),
        ('tmp/MAYO_GENE_INST 2014-utf8-clean.csv', 2014),
        ('tmp/MAYO_GENE_INST 2015-utf8.csv', 2015),
        ('tmp/MUN_CONTA1564442188090-012016-142016.csv', 2016),
        ('tmp/MUN_CONTA1603895237433-012017-142017.csv', 2017),
        ('tmp/MUN_CONTA1619637382206-012018-142018.csv', 2018),
        ('tmp/MUN_CONTA1635534788869-012019-142019.csv', 2019),
        ('tmp/MUN_CONTA1635534992905-012020-142020.csv', 2020),
        ('tmp/MUN_CONTA1635535198444-012021-142021.csv', 2021),
    ]
    with Pool(cpu_count()) as p:
        p.map(preproc_1, tags)
