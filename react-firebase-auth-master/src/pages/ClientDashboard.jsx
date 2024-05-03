import { useEffect, useState } from "react";
import { auth, storage } from "../firebase";

import { listAll, ref as sref, getDownloadURL } from "firebase/storage";

import '../styles/ClientDashboard.css'

export const ClientDashboard = () => {
  const [imageList, setImageList] = useState([]);
  const [fileNames, setFileNames] = useState([]);

  const imageRef = sref(storage, `${auth.currentUser.uid}/`);

  useEffect(() => {
    listAll(imageRef).then((res) => {
      const promises = res.items.map((item) => getDownloadURL(item));

      Promise.all(promises)
        .then((urls) => {
          setImageList(urls);
          setFileNames(res.items.map((item) => item.name));
        })
        .catch((error) => {
          console.error("Erro ao obter URLs de download:", error);
        });
    });
  }, []);

  return (
    <div className="dashboardClientContainer">
      <h1>{auth.currentUser.email}</h1>
      {imageList.map((url, index) => (
        <ul>
          <li key={url}>
            <a href={url} download={fileNames[index]}>
              {fileNames[index]}
            </a>
          </li>
        </ul>
      ))}
    </div>
  );
};
