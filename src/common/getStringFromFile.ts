import fs from "fs-extra";
import chardet from "chardet";

enum Encoding {
    utf16le = "utf16le",
    utf8 = "utf8"
}

export default  function getStringFromFile(path:string):string {

    if (fs.existsSync(path)) {

        if (!fs.statSync(path).isFile()) {
            throw new Error("Not a file");
        }

        const fileBuffer = fs.readFileSync(path);

        const encoding = ((fileBuffer:Buffer) =>{
            const encodingDetected = chardet.detect(fileBuffer);

            switch (encodingDetected) {
            
                case "UTF-16LE":
                    return Encoding.utf16le;

                default:
                    return Encoding.utf8;
            }
        })(fileBuffer);

        
        console.log(encoding);
      
        return fs.readFileSync(path, encoding)
        
    }
    else {
        throw Error("File does not exist");
    }
}