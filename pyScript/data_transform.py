import pandas as pd
import sys, json, numpy as np
import csv
import os


def minmax(column, df, filePath):
    for col in column:
        minimum = df[col].min()
        maximum = df[col].max()
        df[col] = (df[col] - minimum) / (maximum - minimum)

    df.to_csv(filePath, index=False)

    return df


def zScore(column, df, filePath):
    for col in column:
        average = df[col].mean()
        std = df[col].std()
        df[col] = (df[col] - average) / (std)

    df.to_csv(filePath, index=False)
    return df


def squareRoot(column, df, filePath):
    for col in column:
        df[col] = np.power((df[col]), 1 / 2)

    df.to_csv(filePath, index=False)
    return df

def cubeRoot(column, df, filePath):
    for col in column:
        df[col] = np.power((df[col]), 1 / 3)

    df.to_csv(filePath, index=False)
    return df

def log(column, df, filePath):
    for col in column:
        df[col] = np.log2((df[col]))

    df.to_csv(filePath, index=False)
    return df

def square(column, df, filePath):
    for col in column:
        df[col] = np.power((df[col]), 2)

    df.to_csv(filePath, index=False)
    return df

def main():
    lines = sys.stdin.readlines()
    lines = json.loads(lines[0])

    filePath = lines["filePath"]
    typeof = lines["type"]
    column = lines["column"]
    df = pd.read_csv(filePath)

    if lines["fileNo"]<3:
        fileNo = str(lines["fileNo"]+1)
        fileName =  "file" + fileNo + "." + lines["fileExt"]
        filePath = lines["folderPath"] + fileName

    else: 
        fileNo = str(lines["fileNo"])
        fileName =  "file" + fileNo + "." + lines["fileExt"]
        filePath = lines["folderPath"] + fileName
        os.remove(lines["folderPath"] + "file0" + "." + lines["fileExt"])
        os.rename(lines["folderPath"] + "file1" + "." + lines["fileExt"],lines["folderPath"] + "file0" + "." + lines["fileExt"])
        os.rename(lines["folderPath"] + "file2" + "." + lines["fileExt"],lines["folderPath"] + "file1" + "." + lines["fileExt"])
        os.rename(lines["folderPath"] + "file3" + "." + lines["fileExt"],lines["folderPath"] + "file2" + "." + lines["fileExt"])
    

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

    output = {
        "filePath": filePath,
        "fileName": fileName,
        "fileNo": fileNo,
    }

    output = json.dumps(output)

    print(output)

# start process
if __name__ == "__main__":
    main()