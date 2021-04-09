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

    if lines[2]<3:
        fileNo = str(lines[2]+1)
        fileName =  "file" + fileNo + "." + lines[3]
        filePath = lines[4] + fileName
    else: 
        fileNo = str(lines[2])
        fileName =  "file" + fileNo + "." + lines[3]
        filePath = lines[4] + fileName
        os.remove(lines[4] + "file0" + "." + lines[3])
        os.rename(lines[4] + "file1" + "." + lines[3],lines[4] + "file0" + "." + lines[3])
        os.rename(lines[4] + "file2" + "." + lines[3],lines[4] + "file1" + "." + lines[3])
        os.rename(lines[4] + "file3" + "." + lines[3],lines[4] + "file2" + "." + lines[3])
    df.to_csv(filePath, index=False)


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