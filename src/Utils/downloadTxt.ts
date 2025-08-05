import { ITxtData } from "./interface";
import JSZip from "jszip";

export default function (txtLines: ITxtData) {
    const zip = new JSZip();
    let cabecera = ""
    let items = ""
    let medpago = ""
    let cco = ""
    txtLines.cabecera.forEach(l => cabecera += l+"\n");
    txtLines.items.forEach(l => items += l+"\n");
    txtLines.medpago.forEach(l => medpago += l+"\n");
    txtLines.cco.forEach(l => cco += l+"\n");

    zip.file('CCABECER.txt',cabecera)
    zip.file('CITEMS.txt',items)
    zip.file('CMEDPAGO.txt',medpago)
    zip.file('CCENCOST.txt',cco)

    const dateNow = dateParser(new Date())

    zip.generateAsync({type: 'blob'}).then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = dateNow+'-exportacion.zip';
        link.click();
        URL.revokeObjectURL(url);
    })
}

function dateParser (tDate: Date): string {
    const day = tDate.getUTCDate()
    let dayStr = day.toString()
    const month = tDate.getUTCMonth() + 1
    let mStr = month.toString()
    const year = tDate.getUTCFullYear()
    if(day < 10) dayStr = "0"+dayStr
    if(month < 10) mStr = "0"+mStr
    return year+mStr+dayStr
}