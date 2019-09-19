import XLSX from 'xlsx';

// function saveAs(obj, fileName) {
//     const tmpA = document.createElement('a');
//     tmpA.download = fileName || '下载';
//     tmpA.href = URL.createObjectURL(obj);
//     tmpA.click();
//     setTimeout(function () {
//         URL.revokeObjectURL(obj);
//     }, 100);
// }

// function s2ab(s) {
//     const buf = new ArrayBuffer(s.length);
//     const view = new Uint8Array(buf);
//     console.log(view);
//     for (let i = 0; i < s.length; i++) {
//         console.log(s[i]);
//         view[i] = s.charCodeAt(i) & 0xFF;
//     }
//     return buf;
// }

// export function table2Excel(dom) {
//     const wb = XLSX.utils.table_to_book(dom);
//     const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' }); /* output format determined by filename */
//     saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'test.xlsx');
// }

export function export2ExcelCommon(option) {
    let module = {
        tableDom: '', // 为节点
        jsonData: {},
        name: '导出',
        cols: [],
        initCeilWidth: 20
    };
    let newOption = Object.assign(module, option);
    let wb = null;
    if (newOption.tableDom && JSON.stringify(newOption.jsonData) == '{}') {
        wb = XLSX.utils.table_to_book(newOption.tableDom);
    } else if (!newOption.tableDom && JSON.stringify(newOption.jsonData) != '{}') {
        wb = {
            SheetNames: [],
            Sheets: { sheet1: '' }
        };
        let ws = XLSX.utils.aoa_to_sheet(newOption.jsonData);
        wb.SheetNames.push('Sheet1');
        wb.Sheets.Sheet1 = ws;
    }
    console.log(wb);
    let widthArr = [];
    let widthArrLength = getColNumber(wb.Sheets.Sheet1['!ref'].split(":")[1].replace(/\d+/g, ''));
    for (let j = 0; j < widthArrLength; j++) {
        widthArr.push({ width: newOption.initCeilWidth });
    }
    wb.Sheets.Sheet1['!cols'] = newOption.cols.length > 0 ? newOption.cols : widthArr;
    let wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), newOption.name + ".xlsx");
    function getColNumber(str) {
        let n = 0;
        let s = str.match(/./g);//求出字符数组
        for (let i = str.length - 1, j = 1; i >= 0; i-- , j *= 26) {
            let c = s[i].toUpperCase();
            if (c < 'A' || c > 'Z') {
                return 0;
            }
            n += (c.charCodeAt(0) - 64) * j;
        }
        return n;
    }

    function saveAs(obj, fileName) {//当然可以自定义简单的下载文件实现方式
        let tmpa = document.createElement("a");
        tmpa.download = fileName || "下载";
        tmpa.href = URL.createObjectURL(obj); //绑定a标签
        tmpa.click(); //模拟点击实现下载
        setTimeout(function () { //延时释放
            URL.revokeObjectURL(obj); //用URL.revokeObjectURL()来释放这个object URL
        }, 100);
    }
    function s2ab(s) {
        let buf = new ArrayBuffer(s.length);
        let view = new Uint8Array(buf);
        for (let i = 0; i != s.length; ++i) {
            view[i] = s.charCodeAt(i) & 0xFF;
        }
        return buf;
        // if (typeof ArrayBuffer !== "undefined") {
        //     let buf = new ArrayBuffer(s.length);
        //     let view = new Uint8Array(buf);
        //     for (let i = 0; i != s.length; ++i) {
        //         view[i] = s.charCodeAt(i) & 0xFF;
        //     }
        //     return buf;
        // } else {
        //     let buf = new ArrayBuffer(s.length);
        //     for (let i = 0; i != s.length; ++i) {
        //         buf[i] = s.charCodeAt(i) & 0xFF;
        //     }
        //     return buf;
        // }
    }
}