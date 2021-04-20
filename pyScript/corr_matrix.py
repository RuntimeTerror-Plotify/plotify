import pandas as pd
import sys, json, numpy as np
import csv
import seaborn as sns

#Script to calculate correlation values and matrix.

def main():
    #buffer input
    lines = sys.stdin.readlines()
    lines = json.loads(lines[0])

    filePath = lines["filePath"]
    columns = lines["column"]

    #dataframe input
    df = pd.read_csv(filePath)

    df = df[columns]

    correlation_mat = df.corr()
    arr = correlation_mat.to_numpy()

    arr = arr.tolist()

    #dump output data to buffer
    output = json.dumps(arr)
    print(output)

#start process
if __name__ == "__main__":
    main()