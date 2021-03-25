import pandas as pd
import sys, json, numpy as np
import csv

rows = []
# Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    # Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])


def main():
    # get our data as an array from read_in()
    lines = read_in()

    df = pd.read_csv(lines)
    for dtype in df.dtypes.iteritems():
        print(dtype)

    # with open(lines, "r") as csvfile:
    #     # creating a csv reader object
    #     csvreader = csv.reader(csvfile)
    #     # extracting field names through first row
    #     fields = next(csvreader)
    #     print(fields)
    #     for row in csvreader:
    #         rows.append(row[0], row[1], row[2:])

    # print(rows)

    # print("Total no. of rows: %d" % (csvreader.line_num))


# start process
if __name__ == "__main__":
    main()