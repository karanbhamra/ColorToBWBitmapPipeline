var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function () {
    let fileInput = document.getElementById("fileButton");
    fileInput.addEventListener('change', fileButtonPressed);
    function fileButtonPressed(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = this.files[0];
            let fileModel = new FileModel();
            let contentBase64String = yield readUploadedFileAsTextAsync(file);
            contentBase64String = stripBase64Prefix(contentBase64String);
            fileModel.Title = "Test";
            fileModel.Content = contentBase64String;
            let resp = yield postDataAsync('http://localhost:7071/api/ProcessBitmap', fileModel);
            let data = yield resp.json();
            console.log(data);
            console.log('image bitmap info');
            console.log(data.content);
            let img = document.createElement('img');
            img.src = 'data:image/png;base64,' + data.content;
            document.body.appendChild(img);
        });
    }
    function postDataAsync(url, jsonObject) {
        return __awaiter(this, void 0, void 0, function* () {
            let resp = fetch("http://localhost:7071/api/ProcessBitmap", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonObject),
                redirect: 'follow'
            });
            return yield resp;
        });
    }
    function stripBase64Prefix(contentBase64String) {
        const index = contentBase64String.indexOf(',');
        return contentBase64String.substr(index + 1, contentBase64String.length);
    }
    function readUploadedFileAsTextAsync(inputFile) {
        const temporaryFileReader = new FileReader();
        return new Promise((resolve, reject) => {
            temporaryFileReader.onerror = () => {
                temporaryFileReader.abort();
                reject(new DOMException("Problem parsing input file."));
            };
            temporaryFileReader.onload = () => {
                resolve(temporaryFileReader.result);
            };
            temporaryFileReader.readAsDataURL(inputFile);
        });
    }
    class FileModel {
        constructor() {
        }
    }
})();
//# sourceMappingURL=fileupload.js.map