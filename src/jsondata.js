export function getTableData(sql) {
    return Promise.resolve(
        {
            headers: ['name', 'status'],
            data: [
                ['John Smith', 'Employed'],
                ['Randal White', 'Unemployed',],
                ['Stephanie Sanders', 'Employed',],
                ['Steve Brown', 'Employed',],
                ['Joyce Whitten', 'Employed',],
                ['Samuel Roberts', 'Employed',],
                ['Adam Moore', 'Employed',],
            ],
        }
    );
}