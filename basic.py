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

    count = []
    for x in df.count():
        count.append(x)

    categorical = []
    numerical = []
    for i in range(df.shape[1]):
        if dtypes[i] != "object":
            numerical.append(colName[i])
        else:
            categorical.append(colName[i])

    mean = []
    for x in df.mean():
        mean.append(x)

    median = []
    for x in df.median():
        median.append(x)

    minimum = []
    for x in df.min():
        if type(x) != str:
            minimum.append(x.item())

    maximum = []
    for x in df.max():
        if type(x) != str:
            maximum.append(x.item())

    std = []
    for x in df.std():
        std.append(x)

    df.quantile(q=0.25)
    quant25 = []
    for x in df.quantile(q=0.25):
        quant25.append(x)

    quant50 = []
    for x in df.quantile(q=0.5):
        quant50.append(x)

    quant75 = []
    for x in df.quantile(q=0.75):
        quant75.append(x)

    cat = df.describe(include=[object]).values
    unique = []
    for x in cat[1, :]:
        unique.append(x)

    top = []
    for x in cat[2, :]:
        top.append(x)

    freq = []
    for x in cat[3, :]:
        freq.append(x.item())

    output = {
        "shape": df.shape,
        "columns": colName,
        "dtype": dtypes,
        "count": count,
        "numerical": numerical,
        "mean": mean,
        "median": median,
        "minimum": minimum,
        "maximum": maximum,
        "std": std,
        "quant25": quant25,
        "quant50": quant50,
        "quant75": quant75,
        "categorical": categorical,
        "unique": unique,
        "top": top,
        "freq": freq,
    }
    output = json.dumps(output)

    print(output)


# start process
if __name__ == "__main__":
    main()