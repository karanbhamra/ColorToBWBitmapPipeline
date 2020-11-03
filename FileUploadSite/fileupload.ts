(function () {

    let fileInput = document.getElementById("fileButton");
    fileInput.addEventListener('change', fileButtonPressed);

    async function fileButtonPressed(event) {
        const file = this.files[0];
        let fileModel = new FileModel();

        let contentBase64String: string = <string>await readUploadedFileAsTextAsync(file);

        contentBase64String = stripBase64Prefix(contentBase64String);
        fileModel.Title = "Test";
        fileModel.Content = contentBase64String;

        let resp = await postDataAsync('http://localhost:7071/api/ProcessBitmap', fileModel);

        let data = await resp.json();
        console.log(data);

        console.log('image bitmap info');
        console.log(data.content);

        let img = document.createElement('img');
        img.src = 'data:image/png;base64,' + data.content;
        document.body.appendChild(img);

    }

    async function postDataAsync(url: string, jsonObject) {

        let resp = fetch("http://localhost:7071/api/ProcessBitmap", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonObject),
            redirect: 'follow'
        });

        return await resp;
    }

    function stripBase64Prefix(contentBase64String: string) {
        const index: number = contentBase64String.indexOf(',');
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
        public Title: string;
        public Content: string;

        constructor() {
        }
    }
})();