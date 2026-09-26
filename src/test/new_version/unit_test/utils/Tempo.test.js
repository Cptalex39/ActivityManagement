import { getGiornoOrarioAttuale } from "../../../../utils/Tempo";

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








