# WebApp "ActivityManagement"
## Scopo del sistema
Lo scopo del sistema è fornire un software in grado di gestire un'attività (attivita barbiere, negozio vestiti, pizzeria, etc.).
## Prerequisiti
- Tecnologie utilizzate
	- Lato Back-End:
		- Node.js (JavaScript).
		- MySQL Workbench.
	- Lato Front-End:
		- HTML5.
		- CSS3.
		- React.js (JavaScript).
		- React Redux.
		- React Bootstrap.
	- Testing:
		- Jest.
		- Selenium Script.
## Installazione e configurazione WebApp "ActivityManagement"
1. Clonare la repository con il seguente comando con 1 dei seguenti modi: 
	1. `git clone https://github.com/GianlucaScisciolo/ActivityManagement.git`.
	2. utilizzando la web URL su GitHub (<> Code --> Local --> HTTPS --> copia).
2. Installare le dipendenze con uno dei seguenti comandi: 
	1. `npm install` oppure: `npm i` nel caso in cui viene eseguita per la prima volta.
	2. `npm update` nel caso in cui `npm i` è già stato eseguito precedentemente.
3. Installare la dipendenza **express** con il seguente comando: `npm install express`.
4. Eseguire il comando `npm audit fix` per risolvere eventuali problemi di sicurezza delle dipendenze (se sono stati risolti dall'autore delle librerie esterne)
5. Modificare il file **/storage/DB.js** con i dati inerente alla propria connessione a MySQL e il nome del proprio database.
## Creazione DataDase "activity_management":
1. Aprire MySQL Workbench.
2. Eseguire lo script **CREATE DATABASE.sql** presente nella cartella **/storage/file_sql** per creare il database.
3. Eseguire lo script **CREATE TABLES.sql** presente nella cartella **/storage/file_sql** per creare le tabelle del database (prima delle modifiche del sistema).
4. Eseguire lo script **MODIFICHE DATABASE.sql** presente nella cartella **/storage/file_sql** per aggiornare le tabelle del database (dopo le modifiche del sistema).
4. Se c'è bisogno di eliminare il database, eseguire lo script **DROP DATABASE.sql** presente nella cartella **/storage/file_sql**.
# Esecuzione WebApp "ActivityManagement"
1. Eseguire il seguente comando: `npm run start-all`.
	- Dopo aver eseguito il comando, se va a buon fine, dovrebbe comparire nel terminale l'url per eseguire la web-app, ovvero, il seguente: `http://localhost:5173/`.
2. Una volta lanciata la webapp, per eseguire il login dell'utente, inserire nel form di login i seguenti dati (che potranno essere modificati successivamente nel form del profilo insieme agli intervalli dell'attività e al numero di clienti per fascia oraria di 1 ora):
	- **Username:** username.
	- **Password:** Password10!!
