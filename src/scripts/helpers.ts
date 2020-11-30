// рукописная загрузка из CSV
export function customLoadDataFromCsv(filePath: string) {
    return fetch(filePath).then((response) => {
        var contentType = response.headers.get("content-type");
        if (contentType && (contentType.includes("text/csv") || contentType.includes("application/octet-stream"))) {
            return response.ok ? response.text() : Promise.reject(response.status);
        }
        throw new TypeError("Oops, we haven't got CSV!");
    })
}

// csv to array
// @ts-ignore
export function csvToCols(strData, strDelimiter) {
    strDelimiter = strDelimiter || ",";
    let rowData = strData.split("\n");

    let colResult = [];
    for (let i = rowData[0].split(strDelimiter).length - 1; i >= 0; i--) colResult.push([]);
    for (let i = 0, l = rowData.length; i < l; i++) {
        if (rowData[i].length) {
            let row = rowData[i].split(strDelimiter);
            // @ts-ignore
            for (let j = row.length - 1; j >= 0; j--) colResult[j].push(row[j]);
        }
    }
    return colResult;
}