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

    if lines[3]<3:
        fileNo = str(lines[3]+1)
        fileName =  "file" + fileNo + "." + lines[4]
        filePath = lines[5] + fileName
    else: 
        fileNo = str(lines[3])
        fileName =  "file" + fileNo + "." + lines[4]
        filePath = lines[5] + fileName
        os.remove(lines[5] + "file0" + "." + lines[4])
        os.rename(lines[5] + "file1" + "." + lines[4],lines[5] + "file0" + "." + lines[4])
        os.rename(lines[5] + "file2" + "." + lines[4],lines[5] + "file1" + "." + lines[4])
        os.rename(lines[5] + "file3" + "." + lines[4],lines[5] + "file2" + "." + lines[4])

    df.to_csv(filePath,index=False)

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