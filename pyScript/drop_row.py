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
<<<<<<< HEAD
    df = df.replace(r"^\s*$", np.NaN, regex=True)
    df = df.replace(r"NA", np.NaN, regex=True)
=======
    
    #replace blank cell of NAN with np.nan
    df = df.replace(r'^\s*$', np.NaN, regex=True)
    df = df.replace(r'NA', np.NaN, regex=True)
>>>>>>> 07d6e6e174df2de762a0e473d862e501b42882a0

    df = df.dropna(axis=0, how="any", subset=lines[1])

<<<<<<< HEAD
    df.to_csv(lines[0], index=False)


# start process
=======
    #output dataframe to csv
    df.to_csv(lines[0],index=False)

>>>>>>> 07d6e6e174df2de762a0e473d862e501b42882a0
if __name__ == "__main__":
    main()