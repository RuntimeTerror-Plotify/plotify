import pandas as pd
import sys, json, numpy as np
import csv
import os 


def main():
    lines = sys.stdin.readlines()
    lines = json.loads(lines[0])
    df = pd.read_csv(lines[1])
    cols = lines[0]

    df = df.drop(columns=cols)

    df.to_csv(lines[1], index=False)



# start process
if __name__ == "__main__":
    main()