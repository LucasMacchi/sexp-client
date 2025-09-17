import { ITxtData } from "./interface";
import JSZip from "jszip";

export default function (txtLines: ITxtData, samabe: boolean) {
    const zip = new JSZip();
    let cabecera = ""
    let items = ""
    let medpago = ""
    let cco = ""
    txtLines.cabecera.forEach(l => cabecera += l+"\r\n");
    txtLines.items.forEach(l => items += l+"\r\n");
    txtLines.medpago.forEach(l => medpago += l+"\r\n");
    txtLines.cco.forEach(l => cco += l+"\r\n");

    zip.file('CCABECER.txt',cabecera)
    zip.file('CITEMS.txt',items)
    zip.file('CMEDPAGO.txt',medpago)
    zip.file('CCENCOST.txt',cco)

    const dateNow = dateParser(new Date())
    const fileName = samabe ? "-exportacion-samabe.zip" : "-exportacion.zip"
    zip.generateAsync({type: 'blob'}).then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = dateNow+fileName;
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