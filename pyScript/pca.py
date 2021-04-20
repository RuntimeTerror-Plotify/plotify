import pandas as pd
import sys, json, numpy as np
import csv
import seaborn as sns
from sklearn.decomposition import PCA
from sklearn import preprocessing
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

#Method to perform feature reduction 

def main():
    #input buffer 
    lines = sys.stdin.readlines()
    lines = json.loads(lines[0])
    filePath = lines["filePath"]

    #dataframe input
    df = pd.read_csv(filePath)
    df = df.select_dtypes(include=np.number)

    sc = StandardScaler()
    df = sc.fit_transform(df)

    pca = PCA()
    newData = pca.fit_transform(df)

    perVar = np.round(pca.explained_variance_ratio_ * 100, decimals=1)

    columnNames = ["PC" + str(x) for x in range(1, len(perVar) + 1)]

    newDf = pd.DataFrame(newData, columns=columnNames)

    #output dataframe to csv
    newDf.to_csv(filePath, index=False)

    perVar = perVar.tolist()

    keep = 0
    summ = 0
    for i in perVar:
        summ += i
        keep += 1
        if summ > 90:
            break

    output = {"columnNames": columnNames, "values": perVar, "keep": keep}

    #dump the output to buffer
    output = json.dumps(output)

    print(output)

if __name__ == "__main__":
    main()