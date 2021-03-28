import pandas as pd
import sys, json, numpy as np
import csv


def main():
    lines = sys.stdin.readlines()
    # file = json.loads(lines[1])
    lines = json.loads(lines[0])

    df = pd.read_csv(lines[1])
    cols = lines[0]

    df = df.drop(columns=cols)

    df.to_csv(lines[1],index=False)

    # output = {
    #     # "file" : file,
    #     "status" : done,
    # }
    # output = json.dumps(output)

    # print(output)
    

# start process
if __name__ == "__main__":
    main()