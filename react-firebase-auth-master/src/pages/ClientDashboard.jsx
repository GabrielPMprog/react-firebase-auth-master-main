import { useEffect, useState } from "react";
import { auth, storage } from "../firebase";

import { listAll, ref as sref, getDownloadURL } from "firebase/storage";

export const ClientDashboard = () => {
  const [imageList, setImageList] = useState([]);

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  const imageRef = sref(storage, `${auth.currentUser.uid}/${getTodayDate()}`);

  useEffect(() => {
    listAll(imageRef).then((res) => {
      res.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageList((prev) => [...prev, url]);
        });
      });
    });
  }, []);

  return (
    <div>
      <h1>{auth.currentUser.displayName}</h1>
      <h1>{auth.currentUser.email}</h1>
      {imageList.map((url) => {
        return <a href={url} key={url} download={`Blu-${getTodayDate()}`}>Instale aqui seu arquivo</a>;
      })}
    </div>
  );
};
