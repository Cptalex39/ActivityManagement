export const formatoDate = (dateStr, formato) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  if(dateStr === "") {
    return "";
  }
  if(formato === "GG-MM-AAAA") {
    return `${day}-${month}-${year}`;
  }
  else if(formato === "AAAA-MM-GG") {
    return `${year}-${month}-${day}`;
  }
}

export const formatoTime = (timeStr) => {
  const [hours, minutes] = timeStr.split(':');
  return `${hours}:${minutes}`;
}

export const dizionarioOrari = () => {
  return {
    "07:00": [0, 0], "07:30": [1, 0], 
    "08:00": [2, 0], "08:30": [3, 0], 
    "09:00": [4, 0], "09:30": [5, 0], 
    "10:00": [6, 0], "10:30": [7, 0], 
    "11:00": [8, 0], "11:30": [9, 0], 
    "12:00": [10, 0], "12:30": [11, 0], 
    "13:00": [12, 0], "13:30": [13, 0], 
    "14:00": [14, 0], "14:30": [15, 0], 
    "15:00": [16, 0], "15:30": [17, 0], 
    "16:00": [18, 0], "16:30": [19, 0], 
    "17:00": [20, 0], "17:30": [21, 0], 
    "18:00": [22, 0], "18:30": [23, 0], 
    "19:00": [24, 0], "19:30": [25, 0], 
    "20:00": [26, 0], "20:30": [27, 0], 
    "21:00": [28, 0], "21:30": [29, 0], 
    "22:00": [30, 0]
  }
};

export const getGiornoOrarioAttuale = () => {
  const oggi = new Date();

  let giorno = oggi.getDate();
  let mese = oggi.getMonth() + 1;
  let anno = oggi.getFullYear();

  let ora = oggi.getHours();
  let minuti = oggi.getMinutes();
  let secondi = oggi.getSeconds();
  let millisecondi = oggi.getMilliseconds();

  giorno = ("0" + giorno).slice(-2);
  mese = ("0" + mese).slice(-2);
  ora = ("0" + ora).slice(-2);
  minuti = ("0" + minuti).slice(-2);
  secondi = ("0" + secondi).slice(-2);
  millisecondi = ("00" + millisecondi).slice(-3);

  const giornoOrarioAttuale = giorno + "-" + mese + "-" + anno + "_" + ora + "-" + minuti + "-" + secondi + "-" + millisecondi;   

  return giornoOrarioAttuale;
}










