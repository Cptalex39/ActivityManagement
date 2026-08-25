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
| **TC_FRONT_REG_002** | Registrazione Cliente - Errore Campi Vuoti | Utente non loggato, accesso alla pagina di registrazione. | 1. Lasciare uno o più campi obbligatori vuoti.<br>2. Cliccare sul pulsante "Registrati". | Campi obbligatori non compilati | Blocco dell'invio del form e visualizzazione dei messaggi di errore per i campi mancanti. |
| **TC_FRONT_PROF_001** | Modifica Dati Profilo - Caso di Successo | Cliente loggato, accesso alla pagina profilo. | 1. Inserire la password attuale corretta.<br>2. Modificare i dati del profilo (es. Indirizzo).<br>3. Cliccare su "Modifica Profilo" e confermare. | Password attuale corretta, nuovi dati anagrafici | Visualizzazione alert di successo e salvataggio delle modifiche. |
| **TC_FRONT_PROF_002** | Modifica Dati Profilo - Errore Password Errata | Cliente loggato, accesso alla pagina profilo. | 1. Inserire una password attuale errata.<br>2. Cliccare su "Modifica Profilo" e confermare. | Password attuale errata | Blocco delle modifiche e visualizzazione del messaggio di errore rosso a schermo. |
| **TC_FRONT_CLI_001** | Ricerca Clienti - Caso di Successo | Utente autorizzato in pagina ricerca. | 1. Inserire il nome nel campo di ricerca.<br>2. Cliccare sul pulsante "Ricerca". | Nome: Mario | Visualizzazione della scheda del cliente corrispondente. |
| **TC_FRONT_CLI_002** | Controllo pagamenti in sospeso - Sblocco Eliminazione (Happy Path) | Cliente con richiesta eliminazione presente nel sistema. | 1. Caricare la lista dei clienti da eliminare.<br>2. Cliccare su "Controllo pagamenti". | Intercettazione POST su /OTTIENI_NUMERO_PAGAMENTI_NON_CONFERMATI_CLIENTE con result: [{ numero_pagamenti_non_confermati: 0 }] | Visualizzazione alert informativo e comparsa del pulsante rosso "Elimina cliente". |
| **TC_FRONT_AUT_002_ERR** | Login Amministratore - Errore Credenziali Errate (Sad Path) | Utente guest in pagina login-admin. | 1. Inserire uno username o una password errati.<br>2. Cliccare "Accedi". | Username: admin_sbagliato, Password: PasswordErrata1! | Blocco del login, intercettazione errore HTTP 401 e permanenza sulla pagina con mantenimento dati. |
| **TC_FRONT_CLI_003** | Controllo pagamenti in sospeso - Blocco Eliminazione (Sad Path) | Cliente con richiesta eliminazione presente nel sistema. | 1. Caricare la lista dei clienti da eliminare.<br>2. Cliccare su "Controllo pagamenti". | Intercettazione POST su /OTTIENI_NUMERO_PAGAMENTI_NON_CONFERMATI_CLIENTE con result: [{ numero_pagamenti_non_confermati: 2 }] | Visualizzazione alert di errore bloccante e mancata comparsa del pulsante di eliminazione. |
| **TC_FRONT_AUT_001** | Login Cliente - Caso di Successo | Utente guest in pagina di login. | 1. Inserire credenziali valide.<br>2. Cliccare "Accedi". | Credenziali valide | Intercettazione POST su /LOGIN, inizializzazione store come cliente e reindirizzamento. |
| **TC_FRONT_AUT_002** | Login Amministratore - Caso di Successo | Utente guest in pagina login-admin. | 1. Inserire credenziali admin valide.<br>2. Cliccare "Accedi". | Credenziali admin valide | Intercettazione POST su /LOGIN, scrittura dei parametri attività e reindirizzamento al pannello admin. |
| **TC_FRONT_AUT_003** | Modifica Profilo Utente | Utente loggato in pagina profilo. | 1. Inserire password attuale e nuovo username.<br>2. Confermare la modifica. | Password attuale*, nuovo username | Chiamata alla classe AutenticazioneActions e visualizzazione alert di modifica eseguita con successo. |
| **TC_FRONT_AUT_004** | Login Cliente - Errore Credenziali Errate (Sad Path) | Utente guest in pagina di login. | 1. Inserire uno username o una password errati.<br>2. Cliccare "Accedi". | Username: utente_sbagliato, Password: WrongPassword! | Blocco del login, intercettazione errore HTTP 401 e permanenza sulla pagina con mantenimento dati. |
| **TC_FRONT_ORD_001** | Gestione Quantità e Calcolo Totale Carrello | Cliente loggato con articoli nel carrello. | 1. Visualizzare il carrello con articoli presenti. | Rendering del carrello con articolo finto (prezzo 25.00, qtà 2) | Calcolo corretto del totale parziale e del totale complessivo pari a €50.00 e presenza del tasto di checkout. |
| **TC_FRONT_ORD_002** | Visualizzazione Carrello - Caso Carrello Vuoto (Sad Path) | Cliente loggato senza articoli. | 1. Visualizzare il carrello senza articoli presenti. | Array items vuoto | Visualizzazione del testo di avviso 'Il carrello è vuoto' e occultamento del pulsante di checkout. |
| **TC_CatalogoServiziView_001** | Ricerca Catalogo - Caso di Successo (Happy Path) | Cliente loggato, in pagina catalogo. | 1. Cliccare sull'icona di ricerca prodotti. | Dati ricerca di default | Visualizzazione della scheda del servizio 'Servizio Test' con prezzo €10.00. |
| **TC_CatalogoServiziView_002** | Ricerca Catalogo - Elenco Vuoto (Sad Path) | Cliente loggato, in pagina catalogo. | 1. Cliccare sull'icona di ricerca prodotti. | Dati ricerca senza corrispondenze | La griglia rimane vuota e la scheda del servizio non viene renderizzata. |

## DOCUMENTO 2.a (Parte 2): Report di Esecuzione dei Test (Pre-Modifica)

| ID | Risultato Atteso | Risultato Effettivo | Stato |
| :--- | :--- | :--- | :--- |
| **TC_FRONT_REG_001** | Visualizzazione alert di successo e reindirizzamento automatico alla pagina di login. | L'interfaccia ha mostrato l'alert di conferma e ha reindirizzato l'utente alla pagina di login correttamente. | **PASS** |
| **TC_FRONT_REG_002** | Blocco dell'invio del form e visualizzazione dei messaggi di errore per i campi mancanti. | L'interfaccia ha bloccato l'invio del form e ha mostrato correttamente i messaggi di errore per i campi vuoti. | **PASS** |
| **TC_FRONT_PROF_001** | Visualizzazione alert di successo e salvataggio delle modifiche. | L'interfaccia ha validato la password e ha aggiornato i dati anagrafici mostrando l'alert di successo in totale conformità con le attese. | **PASS** |
| **TC_FRONT_PROF_002** | Blocco delle modifiche e visualizzazione del messaggio di errore rosso a schermo. | Il sistema ha rilevato la password errata, ha bloccato l'invio del form e ha mostrato il messaggio di errore rosso come previsto. | **PASS** |
| **TC_FRONT_CLI_001** | Visualizzazione della scheda del cliente corrispondente. | Il sistema ha filtrato correttamente i dati e ha mostrato l'intestazione del cliente Mario Rossi. | **PASS** |
| **TC_FRONT_CLI_002** | Visualizzazione alert informativo e comparsa del pulsante rosso "Elimina cliente". | Il sistema ha confermato 0 pagamenti in sospeso tramite la risposta del server e ha abilitato correttamente il pulsante "Elimina cliente" a schermo. | **PASS** |
| **TC_FRONT_CLI_003** | Visualizzazione alert di errore bloccante e mancata comparsa del pulsante di eliminazione. | Il sistema ha intercettato i pagamenti pendenti, ha mostrato l'alert di blocco e ha mantenuto nascosto il pulsante distruttivo in totale conformità con le attese. | **PASS** |
| **TC_FRONT_AUT_001** | Intercettazione POST su /LOGIN, inizializzazione store come cliente e reindirizzamento. | L'interfaccia ha risposto in totale conformità con i flussi di business e i parametri grafici. | **PASS** |
| **TC_FRONT_AUT_002** | Intercettazione POST su /LOGIN, scrittura dei parametri attività e reindirizzamento al pannello admin. | L'interfaccia ha risposto in totale conformità con i flussi di business e i parametri grafici. | **PASS** |
| **TC_FRONT_AUT_002_ERR** | Blocco del login, intercettazione errore HTTP 401 e permanenza sulla pagina con mantenimento dati. | Il sistema ha intercettato correttamente lo stato di errore del server simulato, ha bloccato l'accesso e ha mantenuto i dati digitati a schermo in totale conformità con le attese. | **PASS** |
| **TC_FRONT_AUT_003** | Chiamata alla classe AutenticazioneActions e visualizzazione alert di modifica eseguita con successo. | L'interfaccia ha risposto in totale conformità con i flussi di business e i parametri grafici. | **PASS** |
| **TC_FRONT_AUT_004** | Blocco del login, intercettazione errore HTTP 401 e permanenza sulla pagina con mantenimento dati. | Il sistema ha intercettato correttamente lo stato di errore del server finto, ha bloccato l'accesso e ha mantenuto l'utente sulla stessa schermata. | **PASS** |
| **TC_FRONT_ORD_001** | Calcolo corretto del totale parziale e del totale complessivo pari a €50.00 e presenza del tasto di checkout. | Il sistema ha calcolato e mostrato a schermo i totali in modo matematicamente perfetto. | **PASS** |
| **TC_FRONT_ORD_002** | Visualizzazione del testo di avviso 'Il carrello è vuoto' e occultamento del pulsante di checkout. | L'interfaccia ha nascosto il tasto di checkout e mostrato l'avviso correttamente. | **PASS** |
| **TC_CatalogoServiziView_001** | Visualizzazione della scheda del servizio 'Servizio Test' con prezzo €10.00. | L'interfaccia ha reagito mostrando correttamente i prodotti in base al mock di successo. | **PASS** |
| **TC_CatalogoServiziView_002** | La griglia rimane vuota e la scheda del servizio non viene renderizzata. | L'interfaccia ha reagito lasciando la lista vuota in totale conformità con il mock di errore/vuoto. | **PASS** |
