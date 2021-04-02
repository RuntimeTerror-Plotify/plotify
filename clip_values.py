import pandas as pd
import sys, json, numpy as np
import csv
from scipy import stats


def main():
    lines = sys.stdin.readlines()
    lines = json.loads(lines[0])

    df = pd.read_csv(lines[0])

    df[[lines[3]]] = df[[lines[3]]].clip(int(lines[1]),int(lines[2]))

    df.to_csv(lines[0],index=False)

    # output = {
    #     # "file" : file,
    #     "status" : done,
    # }
    # output = json.dumps(output)

    # print(output)

# start process
if __name__ == "__main__":
    main()