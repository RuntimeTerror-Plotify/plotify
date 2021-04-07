import pandas as pd
import sys, json, numpy as np
import csv
from scipy import stats


def main():
    lines = sys.stdin.readlines()
    lines = json.loads(lines[0])

    
    df = pd.read_csv(lines[0])
    df_num = df.select_dtypes(include=np.number)

    z_thresh = lines[1]

    z_scores = stats.zscore(df_num)
    abs_z_scores = np.abs(z_scores)
    filtered_entries = (abs_z_scores < int(z_thresh)).all(axis=1)

    new_df = df[filtered_entries]

    new_df.to_csv(lines[0],index=False)

    # output = {
    #     # "file" : file,
    #     "status" : done,
    # }
    # output = json.dumps(output)

    # print(output)

# start process
if __name__ == "__main__":
    main()