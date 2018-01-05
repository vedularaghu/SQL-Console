import xlsx from 'xlsx';
export function downloadAsFile(content, type, fileName) {
    const data = new Blob([content], { type });
    const textFile = URL.createObjectURL(data);
    console.log(textFile);

    const downloader = document.createElement('a');
    downloader.href = textFile;
    downloader.download = fileName;
    downloader.click()
}

export function csvDownload(headers, data, fileName) {
    const sheet = xlsx.utils.aoa_to_sheet([headers,...data]);
    const csv = xlsx.utils.sheet_to_csv(sheet);
    console.log(csv);
    downloadAsFile(csv, 'text/csv', fileName);
}