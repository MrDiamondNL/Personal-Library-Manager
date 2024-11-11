import { useRef, useEffect, useState } from 'react'

export const ImageCapture = () => {
    const videoRef = useRef(null);
    const photoRef = useRef(null);
    const [hasPhoto, setHasPhoto] = useState(false);

    const getVideo = () => {
        navigator.mediaDevices.getUserMedia(
            { video: { width: 200, height: 300 } }
        ).then(stream => {
            let video = videoRef.current;
            video.srcObject = stream;
            video.play();
        }).catch(error => {
            console.log(error);
        })
    }

    const takePhoto = () => {
        const width = 200;
        const height = 300;

        let video = videoRef.current;
        let photo = photoRef.current;

        photo.width = width;
        photo.height = height;

        let ctx = photo.getContext("2d");
        ctx.drawImage(video, 0, 0, width, height);
        setHasPhoto(true);
    }

    useEffect(() => {
        getVideo();
    }, [videoRef]);

    return (
        <>
            <div className="camera">
                <video ref={videoRef}></video>
                <button onClick={takePhoto}>Capture</button>
            </div>
            <div className={"result" + (hasPhoto ? "hasPhoto" : "")}>
                <canvas ref={photoRef}></canvas>
            </div>
        </>

    )
}
