import pandas as pd
import sys, json, numpy as np
import csv
import os 

#Method to drop columns

def main():
    #buffer input
    lines = sys.stdin.readlines()
    lines = json.loads(lines[0])
    
    #read dataframe
    df = pd.read_csv(lines[1])
    cols = lines[0]

    df = df.drop(columns=cols)

    #write dataframe to file
    df.to_csv(lines[1], index=False)

if __name__ == "__main__":
    main()