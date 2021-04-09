import pandas as pd
import sys, json, numpy as np
import csv
import category_encoders as ce
import os


def encodingLabel(df, column, filepath):
    for col in column:
        df[col] = df[col].astype("category")
        df[col] = df[col].cat.codes
    df.to_csv(filepath, index=False)
    return df


def oneHotEncoding(df, column, filepath):
    for col in column:
        df = pd.get_dummies(df, columns=[col], prefix=[col])
    df.to_csv(filepath, index=False)
    return df

def binaryEncoding(df, column, filepath):
    for col in column:
        encoder = ce.BinaryEncoder(cols=[col])
        df = encoder.fit_transform(df)
    df.to_csv(filepath, index=False)
    return df

def main():
    lines = sys.stdin.readlines()
    lines = json.loads(lines[0])
    
    filePath = lines["filePath"]
    column = lines["column"]
    typeOfLabelling = lines["type"]
    df = pd.read_csv(filePath)
    # print(lines)
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
    

    if typeOfLabelling == "findNReplace":
        print("1")
    elif typeOfLabelling == "encodingLabel":
        df = encodingLabel(df, column, filePath)
    elif typeOfLabelling == "oneHotEncoding":
        df = oneHotEncoding(df, column, filePath)
    elif typeOfLabelling == "binaryEncoding":
        df =  binaryEncoding(df, column, filePath)

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