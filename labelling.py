import pandas as pd
import sys, json, numpy as np
import csv
import category_encoders as ce

def encodingLabel(df, column, filepath) :
    unique = df[column].unique()
    df[column] = df[column].astype("category")
    df[column] = df[column].cat.codes
    output = {"uniqueValues": list(unique)}
    output = json.dumps(output)
    df.to_csv(filepath,index=False)
    
def oneHotEncoding(df, column, filepath) :
    df = pd.get_dummies(df, columns=[column], prefix = [column])
    df.to_csv(filepath,index=False)

def binaryEncoding(df, column, filepath):
    encoder = ce.BinaryEncoder(cols=[column])
    df = encoder.fit_transform(df)
    df.to_csv(filepath,index=False)


def main():
    lines = sys.stdin.readlines()
    lines = json.loads(lines[0])

    filePath = lines["filePath"]
    column = lines["column"]
    typeOfLabelling = lines["type"] 
    df = pd.read_csv(filePath)

    
    if typeOfLabelling=="findNReplace" :
        print('1')
    elif typeOfLabelling=="encodingLabel" :
        encodingLabel(df, column, filePath)
    elif typeOfLabelling=="oneHotEncoding" :
        oneHotEncoding(df, column, filePath)
    elif typeOfLabelling=="binaryEncoding" :
        binaryEncoding(df, column, filePath)
    

    

# start process
if __name__ == "__main__":
    main()