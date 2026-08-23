# DOCUMENTAZIONE DI TESTING FRONTEND - ActivityManagement

## Fase Preparatoria: Definire lo Standard Civile del Test Case
Ogni test case deve essere redatto seguendo rigorosamente questi 6 punti:
1. **ID**: Identificativo univoco del test.
2. **Titolo/Obiettivo**: Descrizione concisa di cosa viene testato.
3. **Precondizioni**: Stato del sistema necessario prima dell'esecuzione.
4. **Passi di Esecuzione**: Sequenza dettagliata di azioni dell'utente.
5. **Dati di Input**: Valori specifici inseriti durante il test.
6. **Risultato Atteso**: Comportamento o output che definisce il successo del test.

## DOCUMENTO 2.a (Parte 1): Specifica dei Casi di Test

| ID | Titolo/Obiettivo | Precondizioni | Passi di Esecuzione | Dati di Input | Risultato Atteso |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_FRONT_REG_001** | Registrazione Cliente - Caso di Successo | Utente non loggato, accesso alla pagina di registrazione. | 1. Inserire Nome, Cognome, Username, Email, Password, Conferma Password e Contatto.<br>2. Cliccare sul pulsante "Registrati". | Nome: Mario, Cognome: Rossi, Username: mario.rossi, Email: mario@example.com, Password: Password123!, Contatto: 3331234567 | Visualizzazione alert di successo e reindirizzamento automatico alla pagina di login. |
