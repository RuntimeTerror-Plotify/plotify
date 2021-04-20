import pandas as pd
import sys, json, numpy as np
import csv
import math


def main():
    lines = sys.stdin.readlines()
    lines = json.loads(lines[0])

    shape = "empty"
    null_val = "empty"
    colName = "empty"
    dtypes = "empty"
    count = "empty"
    categorical = "empty"
    numerical = "empty"
    mean = "empty"
    median = "empty"
    minimum = "empty"
    maximum = "empty"
    std = "empty"
    quant25 = "empty"
    quant50 = "empty"
    quant75 = "empty"
    skewness = "empty"
    unique = "empty"
    uniqueValues = "empty"
    top = "empty"
    freq = "empty"

    try:
        try:
            df = pd.read_csv(lines)
            df = df.dropna(how="all", axis="columns")
            df.to_csv(lines, index=False)
            df = pd.read_csv(lines)

            colName = []
            dtypes = []
            shape = df.shape

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

            if len(numerical) == 0:
                numerical = "empty"
            else:
                mean = []
                for x in df.mean():
                    if math.isnan(x):
                        mean.append(0.0)
                    else:
                        mean.append(round(x, 4))

                median = []
                for x in df.median():
                    if math.isnan(x):
                        median.append(0.0)
                    else:
                        median.append(round(x, 4))

                minimum = []
                for x in df[numerical].min():
                    if math.isnan(x):
                        minimum.append(0.0)
                    else:
                        minimum.append(round(x, 4))

                maximum = []
                for x in df[numerical].max():
                    if math.isnan(x):
                        maximum.append(0.0)
                    else:
                        maximum.append(round(x, 4))

                std = []
                for x in df.std():
                    if math.isnan(x):
                        std.append(0.0)
                    else:
                        std.append(round(x, 4))

                df.quantile(q=0.25)
                quant25 = []
                for x in df.quantile(q=0.25):
                    if math.isnan(x):
                        quant25.append(0.0)
                    else:
                        quant25.append(round(x, 4))

                quant50 = []
                for x in df.quantile(q=0.5):
                    if math.isnan(x):
                        quant50.append(0.0)
                    else:
                        quant50.append(round(x, 4))

                quant75 = []
                for x in df.quantile(q=0.75):
                    if math.isnan(x):
                        quant75.append(0.0)
                    else:
                        quant75.append(round(x, 4))
                skewness = []
                for i in numerical:
                    skewness.append(round(df[i].skew(), 3))

            if len(categorical) == 0:
                categorical = "empty"
            else:
                cat = df.describe(include=[object]).values
                unique = []
                uniqueValues = []

                for x in cat[1, :]:
                    unique.append(x)

                for i in categorical:
                    unlist = []
                    for j in df[i].unique().tolist():
                        if pd.isna(j):
                            unlist.append("NAN")
                        else:
                            unlist.append(j)

                    uniqueValues.append(unlist)

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

            if len(null_val) == 0:
                null_val = "empty"

        except:
            x = 1

        output = {
            "shape": shape,
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
            "skewness": skewness,
            "categorical": categorical,
            "unique": unique,
            "unique_val": uniqueValues,
            "top": top,
            "freq": freq,
        }

    except:
        output = {"error": "No Data Parsed"}

    output = json.dumps(output)
    print(output)

if __name__ == "__main__":
    main()