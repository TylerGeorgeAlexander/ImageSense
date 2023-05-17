import { useState, useEffect, useRef } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as tf from "@tensorflow/tfjs";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import nookies from "nookies";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

export default function Home() {
  const router = useRouter();

  // Use useEffect to redirect to login in the client side
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }
  }, []);

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
      formData.append("image", files[0]);

      try {
        const response = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // response.data.imageUrl is the image URL returned from the server
        setImageURL(response.data.imageUrl);
      } catch (error) {
        console.error("Error uploading image: ", error);
      }
    }
  };

  const identify = async () => {
    textInputRef.current.value = "";
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

  const logout = () => {
    // Remove token from local storage
    localStorage.removeItem("token");
    // Redirect to login
    router.replace("/login");
  };
  

  if (isModelLoading) {
    return <h2>Model Loading...</h2>;
  }

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#">ImageSense</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link onClick={logout}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div className="container py-5">
        <h1 className="text-center visually-hidden">ImageSense</h1>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="text-center mb-3">
              <Image
                src="/ImageSense-logos/ImageSense-logos_black.png"
                alt="ImageSense Logo"
                className="img-fluid"
                width={500}
                height={300}
                priority
              />
            </div>
            <div className="text-center">
              <input
                type="file"
                accept="image/*"
                capture="camera"
                className="form-control"
                onChange={uploadImage}
                ref={fileInputRef}
              />
            </div>
            <div className="text-center">
              <input
                type="text"
                className="form-control"
                placeholder="Paste image URL"
                ref={textInputRef}
                onChange={handleOnChange}
              />
            </div>
            <div className="text-center mt-3">
              {imageURL && (
                <button className="btn btn-success" onClick={identify}>
                  Identify Image
                </button>
              )}
            </div>
            <div className="text-center mt-4">
              <div className="imageHolder">
                {imageURL && (
                  <img
                    src={imageURL}
                    alt="Upload Preview"
                    crossOrigin="anonymous"
                    ref={imageRef}
                    className="img-fluid rounded shadow mb-3"
                  />
                )}
              </div>
              <div className="resultsHolder">
                {results.length > 0 &&
                  results.map((result, index) => (
                    <div
                      className="alert alert-success"
                      role="alert"
                      key={result.className}
                    >
                      <h4 className="alert-heading">{result.className}</h4>
                      <p>
                        Confidence level:{" "}
                        <span className="font-weight-bold">
                          {(result.probability * 100).toFixed(2)}%
                        </span>
                        {index === 0 && (
                          <span className="text-muted small ml-2">
                            (Best Guess)
                          </span>
                        )}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
            <div className="text-center mt-4">
              <h2 className="mb-3">Search History</h2>
              <div className="row justify-content-center">
                {history.map((image, index) => (
                  <div className="col-6 col-md-4 mb-4" key={`${image}${index}`}>
                    <img
                      src={image}
                      alt="Recent Prediction"
                      className="img-fluid rounded shadow"
                      onClick={() => setImageURL(image)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
