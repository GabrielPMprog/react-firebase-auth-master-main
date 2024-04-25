const admin = require('firebase-admin')

const serviceAccount = require('./credentials.json');

const express = require('express')
const cors = require('cors');
const app = express();

// Permitir solicitações apenas da origem 'http://localhost:5173'
app.use(cors({
  origin: 'http://localhost:5173'
}));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.delete('/api/deleteUser/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      await admin.auth().deleteUser(userId);
      res.status(200).json({ message: 'Usuário excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      res.status(500).json({ error: 'Erro ao excluir usuário' });
    }
  });

  
app.listen(3000,()=>{
    console.log('Backend rodando na porta 3000')
})