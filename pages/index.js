import { useState, useEffect, useRef } from 'react';
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as tf from '@tensorflow/tfjs';
import axios from 'axios';

export default function Home() {
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);

  const imageRef = useRef();
  const textInputRef = useRef();
  const fileInputRef = useRef();

  const loadModel = async () => {
    setIsModelLoading(true);
    try {
      await tf.ready();
      const model = await mobilenet.load();
      setModel(model);
      setIsModelLoading(false);
    } catch (error) {
      console.log(error);
      setIsModelLoading(false);
    }
  };

  const uploadImage = async (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      const formData = new FormData();
      formData.append('image', files[0]);

      try {
        const response = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // response.data.imageUrl is the image URL returned from the server
        setImageURL(response.data.imageUrl);
      } catch (error) {
        console.error('Error uploading image: ', error);
      }
    }
  };

  const identify = async () => {
    textInputRef.current.value = '';
    const results = await model.classify(imageRef.current);
    setResults(results);
  };

  const handleOnChange = (e) => {
    setImageURL(e.target.value);
    setResults([]);
  };

  const triggerUpload = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    loadModel();
  }, []);

  useEffect(() => {
    if (imageURL) {
      setHistory([imageURL, ...history]);
    }
  }, [imageURL]);

  if (isModelLoading) {
    return <h2>Model Loading...</h2>;
  }

  return (
    <div className="container py-5">
      <h1 className="header text-center mb-5">ImageSense</h1>
      <h2 className="text-center mb-5">Image Identification</h2>
      <div className="row mb-3">
        <div className="col">
          <input type="file" accept="image/*" capture="camera" className="form-control" onChange={uploadImage} ref={fileInputRef} />
        </div>
        <div className="col">
          <button className="btn btn-primary" onClick={triggerUpload}>Upload Image</button>
        </div>
        <div className="col">
          <input type="text" className="form-control" placeholder="Paste image URL" ref={textInputRef} onChange={handleOnChange} />
        </div>
      </div>
      <div className="row text-center">
        <div className="col-md-6">
          <div className="imageHolder">
            {imageURL && <img src={imageURL} alt="Upload Preview" crossOrigin="anonymous" ref={imageRef} className="img-fluid rounded shadow mb-3" />}
          </div>
          {results.length > 0 && (
            <div className="resultsHolder">
              {results.map((result, index) => {
                return (
                  <div className="alert alert-success" role="alert" key={result.className}>
                    <h4 className="alert-heading">{result.className}</h4>
                    <p>
                      Confidence level: <span className="font-weight-bold">{(result.probability * 100).toFixed(2)}%</span>
                      {index === 0 && <span className="text-muted small ml-2">(Best Guess)</span>}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
          {imageURL && (
            <button className="btn btn-success" onClick={identify}>
              Identify Image
            </button>
          )}
        </div>
        {history.length > 0 && (
          <div className="col-md-6">
            <h2 className='m-2 '>Recent Images</h2>
            <div className="row">
              {history.map((image, index) => {
                return (
                  <div className="col-4 mb-4" key={`${image}${index}`}>
                    <img src={image} alt="Recent Prediction" className="img-fluid rounded shadow" onClick={() => setImageURL(image)} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

