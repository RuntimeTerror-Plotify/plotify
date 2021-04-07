import pandas as pd
import sys, json, numpy as np
import csv
import seaborn as sns


def main():
    lines = sys.stdin.readlines()
    lines = json.loads(lines[0])

    filePath = lines["filePath"]
    columns = lines["column"]
    df = pd.read_csv(filePath)

    df = df[columns]

    correlation_mat = df.corr()
    arr = correlation_mat.to_numpy()

    arr = arr.tolist()
    output = json.dumps(arr)

    print(output)


# start process
if __name__ == "__main__":
    main()