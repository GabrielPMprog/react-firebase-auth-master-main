import React from "react";

import "../styles/editUser.css";

import { useParams } from "react-router-dom";
import { getDatabase, ref, get, update } from "firebase/database";

import { Link } from "react-router-dom";

import { useState, useEffect } from "react";

import { FaRegTrashAlt } from "react-icons/fa";

import {
  listAll,
  ref as sref,
  deleteObject,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage"; // Importando listAll e ref
import { storage } from "../firebase"; // Importando o storage

import { MdFileDownload } from "react-icons/md";

export function EditUser() {
  const [user, setUser] = useState({
    userName: {
      name: "",
      email: "",
      userId: "",
    },
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userFiles, setUserFiles] = useState([]); // Estado para armazenar os arquivos do usuário
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [fileName, setFileName] = useState([]);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTimer, setPopupTimer] = useState("disabledPopup");

  const { id } = useParams();
  const db = getDatabase();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRef = ref(db, "UserSet/" + id);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setUser(snapshot.val());
        } else {
          console.log("Usuário não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };
    fetchUser();
  }, [id]);

  useEffect(() => {
    setName(user.userName.name);
    setEmail(user.userName.email);
  }, [user]);

  useEffect(() => {
    const fetchUserFiles = async () => {
      try {
        const userFilesRef = sref(storage, `${id}/`);
        const filesList = await listAll(userFilesRef);
        setUserFiles(filesList.items);
      } catch (error) {
        console.error("Erro ao buscar arquivos do usuário:", error);
      }
    };
    fetchUserFiles();
  }, [id]);

  const handleChangePopup = (message) => {
    setPopupMessage(message);
    setTimeout(() => {
      setPopupTimer("abledPopup");
    }, 3000);
    setPopupTimer("disabledPopup");
  };


  function handleEdit() {
    const userRef = ref(db, `UserSet/${id}/userName`);

    // Cria um objeto com os novos dados do usuário
    const newData = {
      name: name,
      email: email,
    };

    // Atualiza os dados do usuário no banco de dados
    update(userRef, newData)
      .then(() => {
        handleChangePopup('Usuário atualizado com sucesso!')
      })
      .catch((error) => {
        console.log("Erro ao atualizar usuário:", error);
      });

    //Enviando dados para o backend

    fetch(`http://client.bluassessoriaempresarial.com.br/api/update/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name, email: email }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Erro ao atualizar usuário:", error);
      });
  }
  // Função para deletar um arquivo específico
  const handleDeleteFile = async (fileName) => {
    try {
      const fileRef = sref(storage, `${id}/${fileName}`);
      await deleteObject(fileRef);
      console.log(`Arquivo ${fileName} deletado com sucesso.`);
      // Atualiza a lista de arquivos removendo o arquivo deletado
      setImageList((prevImageList) =>
        prevImageList.filter((_, index) => fileName[index] !== fileName)
      );
      setFileName((prevFileName) =>
        prevFileName.filter((name) => name !== fileName)
      );
    } catch (error) {
      console.error("Erro ao deletar arquivo:", error);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  const handleUpload = (id) => {
    if (file === null || file.length === 0) {
      return;
    }
    setUploading(true); // Ativa o estado de upload

     file.forEach((fileItem) => {
      const imageRef = sref(
        storage,
        `${id}/${getTodayDate()} - ${fileItem.name}  `
      );

       uploadBytes(imageRef, fileItem)
        .then(() => {
          console.log("Upload do arquivo foi concluído");
          setUploading(false); // Desativa o estado de upload quando o envio é concluído
          setFile(null);
        })
        .catch((err) => {
          console.log(err);
          setUploading(false); // Desativa o estado de upload em caso de erro
        });
    });
  };

  const imageRef = sref(storage, `${id}/`);
  useEffect(() => {
    listAll(imageRef).then((res) => {
      res.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageList((prev) => [...prev, url]);
          setFileName((prev) => [...prev, item.name]);
        });
      });
    });
  }, []);

  return (
    <form className="editContainer">
        <span className={popupTimer}>{popupMessage}</span>
      <input
        className="input"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="button" onClick={handleEdit} className="updateBtn">
        Atualizar usuário
      </button>

      <label htmlFor="fileUpdate" className="customFileUpload">
        {file == null ? (
          "Escolha seu arquivo"
        ) : (
          <ul>
            {file.map((fileItem, index) => (
              <li className="listInputFile" key={index}>
                {fileItem.name}
              </li>
            ))}
          </ul>
        )}
        <MdFileDownload className="customFileIcon" />
        <input
          className="inputFile"
          type="file"
          name="fileUpdate"
          id="fileUpdate"
          onChange={(e) => {
            const newFiles = Array.from(e.target.files);
            setFile((prevFiles) =>
              prevFiles ? prevFiles.concat(newFiles) : newFiles
            );
          }}
          multiple
        />
      </label>

      <button
        className={`updateBtn ${uploading ? "disabled" : ""}`}
        onClick={() => {
          handleUpload(id);
        }}
        disabled={uploading} // Desabilita o botão se estiver enviando
      >
        {uploading ? "Enviando..." : "Enviar Arquivos"}
      </button>

      <div className="userFiles">
        <h2>Arquivos do Usuário</h2>
        <ul>
          {fileName.map((name, index) => {
            return (
              <div key={index} className="uploadList">
                <a href={imageList[index]} download={name} className="linkFileName" >
                  {name}
                </a>
              
                  <FaRegTrashAlt 
                  className="trashDelete"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteFile(name);
                  }}/>
            
              </div>
            );
          })}
        </ul>
      </div>

      <Link to={"/private"}>Voltar</Link>
    </form>
  );
}
