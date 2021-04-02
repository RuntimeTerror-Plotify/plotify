import pandas as pd
import sys, json, numpy as np
import csv


def main():
    lines = sys.stdin.readlines()
    # file = json.loads(lines[1])
    lines = json.loads(lines[0])

    df = pd.read_csv(lines[0])
    df = df.replace(r'^\s*$', np.NaN, regex=True)
    df = df.replace(r'NA', np.NaN, regex=True)

    if lines[2] == "all":
        # print("all")
        df = df.dropna(thresh = lines[1])

    if lines[2] == "specific":
        sub = []
        if type(lines[3]) == str:
            sub.append(lines[3])
        else:
            sub = lines[3]
        # print("specific")
        # print(sub)
        df = df.dropna(thresh = lines[1],axis = 0, how = 'any',subset = sub)

    df.to_csv(lines[0],index=False)

    # output = {
    #     "file" : (lines[2] == "all"),
    #     "status" : lines[2],
    # }
    # output = json.dumps(output)

    # print(output)
    

# start process
if __name__ == "__main__":
    main()