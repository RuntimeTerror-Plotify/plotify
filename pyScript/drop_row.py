import pandas as pd
import sys, json, numpy as np
import csv
import os


def main():
    lines = sys.stdin.readlines()
    # file = json.loads(lines[1])
    lines = json.loads(lines[0])

    df = pd.read_csv(lines[0])
    df = df.replace(r'^\s*$', np.NaN, regex=True)
    df = df.replace(r'NA', np.NaN, regex=True)

    if lines[1] == "all":
        # print("all")
        df = df.dropna()

    if lines[1] == "specific":
        sub = []
        if type(lines[2]) == str:
            sub.append(lines[2])
        else:
            sub = lines[2]
        # print("specific")
        # print(sub)
        df = df.dropna(axis = 0, how = 'any',subset = sub)

    df.to_csv(lines[0],index=False)

    

# start process
if __name__ == "__main__":
    main()