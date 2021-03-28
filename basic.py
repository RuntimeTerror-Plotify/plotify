import pandas as pd
import sys, json, numpy as np
import csv
import math


def main():
    lines = sys.stdin.readlines()
    lines = json.loads(lines[0])

    df = pd.read_csv(lines)

    if df.empty:
        output = {
            "columns": "empty",
        }

    else:
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
            if math.isnan(x):
                mean.append(0.0)
            else:
                mean.append(x)

        median = []
        for x in df.median():
            if math.isnan(x):
                median.append(0.0)
            else:
                median.append(x)

        minimum = []
        for x in df.min():
            if type(x) != str:
                if math.isnan(x):
                    minimum.append(0)
                else:
                    minimum.append(x.item())

        maximum = []
        for x in df.max():
            if type(x) != str:
                if math.isnan(x):
                    maximum.append(0)
                else:
                    maximum.append(x.item())

        std = []
        for x in df.std():
            if math.isnan(x):
                std.append(0.0)
            else:
                std.append(x)

        df.quantile(q=0.25)
        quant25 = []
        for x in df.quantile(q=0.25):
            if math.isnan(x):
                quant25.append(0.0)
            else:
                quant25.append(x)

        quant50 = []
        for x in df.quantile(q=0.5):
            if math.isnan(x):
                quant50.append(0.0)
            else:
                quant50.append(x)

        quant75 = []
        for x in df.quantile(q=0.75):
            if math.isnan(x):
                quant75.append(0.0)
            else:
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

        df = df.replace(r"^\s*$", np.NaN, regex=True)
        df = df.replace(r"NA", np.NaN, regex=True)
        null_val = []
        for x in df.isnull().sum():
            null_val.append(x)

        output = {
            "shape": df.shape,
            "columns": colName,
            "dtype": dtypes,
            "count": count,
            "null_val": null_val,
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