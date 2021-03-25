import pandas as pd
import sys, json, numpy as np
import csv


def main():
    lines = sys.stdin.readlines()
    lines = json.loads(lines[0])

    df = pd.read_csv(lines)

    colName = []
    dtypes = []

    for x in df.dtypes.iteritems():
        colName.append(x[0])
        dtypes.append(str(x[1]))

    output = {"shape": df.shape, "col": colName, "dtype": dtypes}
    output = json.dumps(output)

    print(output)


# start process
if __name__ == "__main__":
    main()