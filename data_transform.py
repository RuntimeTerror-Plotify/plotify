import pandas as pd
import sys, json, numpy as np
import csv


def minmax(column, df, filePath):
    minimum = df[column].min()
    maximum = df[column].max()

    df[column] = (df[column] - minimum) / (maximum - minimum)

    df.to_csv(filePath, index=False)


def zScore(column, df, filePath):
    average = df[column].mean()
    std = df[column].std()

    df[column] = (df[column] - average) / (std)

    df.to_csv(filePath, index=False)


def squareRoot(column, df, filePath):
    df[column] = np.power((df[column]), 1 / 2)

    df.to_csv(filePath, index=False)


def cubeRoot(column, df, filePath):
    df[column] = np.power((df[column]), 1 / 3)

    df.to_csv(filePath, index=False)


def log(column, df, filePath):
    df[column] = np.log2((df[column]))

    df.to_csv(filePath, index=False)


def square(column, df, filePath):
    df[column] = np.power((df[column]), 2)

    df.to_csv(filePath, index=False)


def main():
    lines = sys.stdin.readlines()
    lines = json.loads(lines[0])

    filePath = lines["filePath"]
    typeof = lines["type"]
    column = lines["column"]
    df = pd.read_csv(filePath)

    if typeof == "min-max":
        minmax(column, df, filePath)
    elif typeof == "z-score":
        zScore(column, df, filePath)
    elif typeof == "square-root":
        squareRoot(column, df, filePath)
    elif typeof == "cube-root":
        cubeRoot(column, df, filePath)
    elif typeof == "log":
        log(column, df, filePath)
    elif typeof == "square":
        square(column, df, filePath)


# start process
if __name__ == "__main__":
    main()