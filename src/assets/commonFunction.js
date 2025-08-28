import { mkConfig, generateCsv, download } from "export-to-csv";
import { emailSendPdf } from "../service/admin";
import * as xlsx from "xlsx";
export function exportCsv(json, fileName) {
    const csvConfig = mkConfig({ useKeysAsHeaders: true, filename: fileName ? fileName : 'exported_data' });
 
    let csv = generateCsv(csvConfig)(json);
    download(csvConfig)(csv);
}


export async function csvToJsons(e) {
    return await new Promise((resolve, reject) => {
        if (e.target !== undefined) {
            e.preventDefault();

            if (e.target.files) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const data = event.target.result;
                        const workbook = xlsx.read(data, { type: "array" });
                        const sheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[sheetName];
                        const json = xlsx.utils.sheet_to_json(worksheet);
                        if (json.length !== 0) {
                            resolve(json);
                        } else {
                            alert("You uploaded an empty file. Please check!");
                            reject(new Error("Empty file"));
                        }
                    } catch (error) {
                        reject(error);
                    }
                };
                reader.readAsArrayBuffer(e.target.files[0]);
            } else {
                reject(new Error("No files selected"));
            }
        } else {
            reject(new Error("Invalid event"));
        }
    });
}

export async function sendPdfbyEmail(pdfBlob,email,name,amount,date,number,type,url){
    try{
        let file = new FormData()
        file.append('file', pdfBlob, 'file.pdf')
        file.append('email', email)
        file.append('name', name)
        file.append('amount', amount)
        file.append('date', date)
        file.append('number', number)
        file.append('type', type)
        file.append('url', url)


        let response = await emailSendPdf(file)
        return response
    }catch(err){
        console.log(err)
    }
}
