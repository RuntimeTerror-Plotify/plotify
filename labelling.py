import pandas as pd
import sys, json, numpy as np
import csv


def main():
    lines = sys.stdin.readlines()
    lines = json.loads(lines[0])

    filePath = lines["filePath"]
    column = lines["column"]

    df = pd.read_csv(filePath)
    unique = df[column].unique()
    df[column] = df[column].astype("category")
    df[column] = df[column].cat.codes

    output = {"uniqueValues": list(unique)}

    output = json.dumps(output)

    print(output)


# start process
if __name__ == "__main__":
    main()