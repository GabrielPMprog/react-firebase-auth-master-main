const admin = require("firebase-admin");
const cors = require("cors");

const serviceAccount = require("./credentials.json");

const express = require("express");
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.delete("/api/deleteUser/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    await admin.auth().deleteUser(userId);
    res.status(200).json({ message: "Usuário excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    res.status(500).json({ error: "Erro ao excluir usuário" });
  }
});

app.post("/api/updateUser/:userId", async (req, res) => {
  const id = req.params.userId;
  const newData = req.body; // Os novos dados que você deseja atualizar

  console.log("Novos dados:", newData);

  try {
    await admin.auth().updateUser(id, newData);
    res.status(200).json({ message: "Usuário atualizado com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

app.listen(3000, () => {
  console.log("Backend rodando na porta 3000");
});
