import { formatoDate, formatoTime, dizionarioOrari, getGiornoOrarioAttuale } from "../../../../utils/Tempo";

describe('Vari test su "formatoDate"', () => {
  /** UT_Tem_ForDte_01 **/
  test('dateStr = ""', () => {
    const dateStr = "";
    const formato = "AAAA-MM-GG";

    const result = formatoDate(dateStr, formato);

    expect(result).toEqual("");
  });
  
  /** UT_Tem_ForDte_02 **/
  test('formato ha un valore non gestito', () => {
    const dateStr = "2022-10-08";
    const formato = "FORMATO";

    const result = formatoDate(dateStr, formato);

    expect(result).toBeUndefined();
  });

  /** UT_Tem_ForDte_03 **/
  test('formato = "GG-MM-AAAA"', () => {
    const dateStr = "2022-10-08";
    const formato = "GG-MM-AAAA";

    const result = formatoDate(dateStr, formato);

    expect(result).toEqual("08-10-2022");
  });

  /** UT_Tem_ForDte_04 **/
  test('formato = "AAAA-MM-GG"', () => {
    const dateStr = "2022-10-08";
    const formato = "AAAA-MM-GG";

    const result = formatoDate(dateStr, formato);

    expect(result).toEqual("2022-10-08");
  });
});

describe('Vari test su "formatoTime"', () => {
  /** UT_Tem_ForTim_01 **/
  test('timeStr = ""', () => {
    const timeStr = ""; 

    const result = formatoTime(timeStr);

    expect(result).toEqual(":undefined");
  });

  /** UT_Tem_ForTim_02 **/
  test('timeStr = stringa che non rappresenta un orario', () => {
    const timeStr = "TIME_STR"; 

    const result = formatoTime(timeStr);

    expect(result).toEqual("TIME_STR:undefined");
  });

  /** UT_Tem_ForTim_03 **/
  test('timeStr convertito correttamente', () => {
    const timeStr = "12:34"; 

    const result = formatoTime(timeStr);

    expect(result).toEqual("12:34");
  });
});

describe('Vari test su "dizionarioOrari"', () => {
  /** UT_Tem_DizOrri_01 **/
  test('Ottenimento dizionario degli orari', () => {
    const result = dizionarioOrari();

    expect(result).toEqual({
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
    });
  });
});

describe('Vari test su "getGiornoOrarioAttuale"', () => {
  /** UT_Tem_GetGioOrrioAttle_01 **/
  test('Ottenimento giorno con orario attuale', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 9, 8, 14, 30, 45, 248));

    const result = getGiornoOrarioAttuale();

    expect(result).toEqual("08-10-2026_14-30-45-248");

    jest.useRealTimers();
  });
});








