import pandas as pd
import sys, json, numpy as np
import csv

#Method to fill in the null values

def main():
    #input buffer 
    lines = sys.stdin.readlines()
    lines = json.loads(lines[0])

    #dataframe input
    df = pd.read_csv(lines[0])

    #replace blank cell of NAN with np.nan
    df = df.replace(r'^\s*$', np.NaN, regex=True)
    df = df.replace(r'NA', np.NaN, regex=True)

    print(lines[1])
    print(lines[1] == "cat")

    if lines[1] == "cat":
        if lines[3] == "top":
            desc = df[[lines[2]]].describe(include=[object]).values
            df[[lines[2]]] = df[[lines[2]]].fillna(desc[2][0])

        if lines[3] == "unk":
            if 'unk' not in df[[lines[2]]]:
                df[[lines[2]]] = df[[lines[2]]].fillna("unk")
            elif 'unknown' not in df[[lines[2]]]:
                df[[lines[2]]] = df[[lines[2]]].fillna("unknown")



    if lines[1] == "num":
        if lines[3] == "zero":
            df[[lines[2]]] = df[[lines[2]]].fillna(0)
        
        elif lines[3] == "mean":
            fill_val = df[[lines[2]]].mean()
            df[[lines[2]]] = df[[lines[2]]].fillna(fill_val)

        elif lines[3] == "min":
            fill_val = df[[lines[2]]].min()
            df[[lines[2]]] = df[[lines[2]]].fillna(fill_val)

        elif lines[3] == "max":
            fill_val = df[[lines[2]]].max()
            df[[lines[2]]] = df[[lines[2]]].fillna(fill_val)
        
        elif lines[3] == "median":
            fill_val = df[[lines[2]]].median()
            df[[lines[2]]] = df[[lines[2]]].fillna(fill_val)
        
        elif lines[3] == "b_fill":
            df[[lines[2]]] = df[[lines[2]]].fillna(method = "bfill")

        elif lines[3] == "f_fill":
            df[[lines[2]]] = df[[lines[2]]].fillna(method = "ffill")

    #output dataframe to csv
    df.to_csv(lines[0],index=False)

if __name__ == "__main__":
    main()