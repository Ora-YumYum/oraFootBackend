

const compression = require("compression"); 

const compressImages = require("compress-images")

const fileSystem = require('file-system');


exports.imageComproser = (request,uploadFolder) => {
    const image = request.files.image
    try {
        if (image.size > 0) {

            if (image.type == "image/png" || image.type == "image/jpeg") {
                fileSystem.readFile(image.path, function (error, data) {
                    if (error) throw error
    
                    const filePath = "temp-uploads/" + (new Date().getTime()) + "-" + image.name
                    const compressedFilePath = `uploads/${uploadFolder}`; 
                    const compression = 60
                    console.log(compressedFilePath)
                    fileSystem.writeFile(filePath, data, async function (error) {
                        if (error) throw error
    
                        compressImages(filePath, compressedFilePath, { compress_force: false, statistic: true, autoupdate: true }, false,
                            { jpg: { engine: "mozjpeg", command: ["-quality", compression] } },
                            { png: { engine: "pngquant", command: ["--quality=" + compression + "-" + compression, "-o"] } },
                            { svg: { engine: "svgo", command: "--multipass" } },
                            { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
                            async function (error, completed, statistic) {
                                console.log("-------------")
                                console.log(error)
                                console.log(completed)
                                console.log(statistic)
                                console.log("-------------")
    
                                fileSystem.unlink(filePath, function (error) {
                                    if (error) throw error
                                })
                            }
                        )
    
                        result.send("File has been compressed and saved.")
                        return image.name;
                    })
    
                    fileSystem.unlink(image.path, function (error) {
                        console.log(error)
                        if (error) throw error
                    })
                })
            } else {
                result.send("Please select an image")
            }
        } else {
            result.send("Please select an image")
        }
    } catch (error) {
        console.log(error)
    }
}