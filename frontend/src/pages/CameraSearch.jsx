import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";

export const CameraSearch = () => {

    const [scanResult, setScanResult] = useState(null);

    useEffect(() => {
        //1st argument is the id of the html element you want the scanner to be inserted
        //2nd argument is the options you want to pass in, in an object
        const scanner = new Html5QrcodeScanner("reader", {
            qrbox: {
                width: 400, //should always set the dimensions
                height: 200,
            },
            aspectRatio: 2,
            fps: 5, //how many times a second it will attempt to read, default is 2
        });

        //to start the scanner, call render(), passing 2 functions, a success function that runs when a qr code is succesfully scanned, 
        //and an error when it doesnt't
        scanner.render(success, error);

        function success(result) {
            scanner.clear(); //upon a successful scan, clear the dom of the scanner
            setScanResult(result); //set the result of the scan as the value of the scanResult state
        }

        function error(err) {
            console.warn(err);
        }
    }, []);

    return (
        <div className="scanner-wrapper">
            <h1>QR Scanner app</h1>
            {/* conditional operator to either render the scanner, or the success result if it gets one */}
            {scanResult
                ? <div>Success: <a href={"http://" + scanResult}>{scanResult}</a> </div>
                : <div id="reader"></div>
            }
        </div>
    )
}
