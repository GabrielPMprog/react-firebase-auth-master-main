import { useEffect, useState } from "react";
import { auth, storage } from "../firebase";

import { listAll, ref as sref, getDownloadURL } from "firebase/storage";

export const ClientDashboard = () => {
  const [imageList, setImageList] = useState([]);
  const [fileName, setFileName] = useState([]);

  const imageRef = sref(storage, `${auth.currentUser.uid}/`);

  useEffect(() => {
    listAll(imageRef).then((res) => {
      res.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageList((prev) => [...prev, url]);
          setFileName(item.name);
        });
      });
    });
  }, []);

  return (
    <div>
      <h1>{auth.currentUser.email}</h1>
      {imageList.map((url, index) => {
        return (
          <a href={url} download={url} key={url + index}>
            {fileName} 
          </a>
        );
      })}
    </div>
  );
};
