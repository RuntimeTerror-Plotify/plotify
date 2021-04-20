import pandas as pd
import sys, json, numpy as np
import csv
import os

#Method to drop rows

def main():
    #buffer input
    lines = sys.stdin.readlines()
    lines = json.loads(lines[0])

    #dataframe input
    df = pd.read_csv(lines[0])
    
    #replace blank cell of NAN with np.nan
    df = df.replace(r'^\s*$', np.NaN, regex=True)
    df = df.replace(r'NA', np.NaN, regex=True)

    
    df = df.dropna(axis = 0,how='any',subset = lines[1])

    #output dataframe to csv
    df.to_csv(lines[0],index=False)

if __name__ == "__main__":
    main()