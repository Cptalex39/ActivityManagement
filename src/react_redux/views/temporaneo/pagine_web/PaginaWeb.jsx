// React
import {useState, Fragment } from "react";
// Riutilizzabile
import { CambioTipoForm, CambioTipoForm2, FormNuovoItem, FormRicercaItems, FormFileItems } from "../form_item/FormItem";
import { CardNuovoItem, CardRicercaItems, CardFileItems, CardInformazioni } from "../card_item/CardItem";
import { RowNuovoItem, RowRicercaItems, RowFileItems } from "../row_item/RowItem";
import { OperazioniItems } from "../Operazioni";
import { Items } from "../Items"
import StyledComponents from "../form_item/StyledFormItem";

export const PaginaWeb = ({componenti, elementi, vistaItem, vistaForm}) => {
  const [tipoForm, setTipoForm] = useState("search");

  const NuovoItemTag = (vistaForm === "form") ? FormNuovoItem : (
    (vistaForm === "card") ? CardNuovoItem : RowNuovoItem
  )

  const RicercaItemsTag = (vistaForm === "form") ? FormRicercaItems : (
    (vistaForm === "card") ? CardRicercaItems : RowRicercaItems
  )

  const FormFileTag = (vistaForm === "form") ? FormFileItems : (
    (vistaForm === "card") ? CardFileItems : RowFileItems
  );

  return (
    <>

      <CambioTipoForm
        elementi={elementi}
        tipoForm={tipoForm}
        setTipoForm={setTipoForm}
        StyledComponents={StyledComponents}
      />

      <br /> <br /> <br /> <br />
      {elementi.map((el, item) => (
        <Fragment key={item}>
          {el === "insert" && tipoForm === "insert" && (
            <>
              <NuovoItemTag 
                campi={componenti.campiNuovoItem}  
                indici={componenti.indiciNuovoItem} 
                eseguiSalvataggio={componenti.handleInsert} 
              />

              <br /> <br /> <br /> <br />
            </>
          )}
          {el === "search" && tipoForm === "search" && (
            <>
              <RicercaItemsTag 
                campi={componenti.campiRicercaItems}
                indici={componenti.indiciRicercaItems}
                handleSearch={componenti.handleSearch}
              />
              
              <br /> <br /> <br /> <br />
            </>
          )}

          {el === "file" && tipoForm === "file" && (
            <>
              <FormFileTag 
                campi={componenti.campiFile} 
                indici={componenti.indiciFile}
                ottieniFileRangePDF={componenti.handleSearchRangeFilePDF}
                ottieniFileRangeExcel={componenti.handleSearchRangeFileExcel}
                eliminaItemsRange={componenti.handleDeleteRangeFile}
              />
              
              <br /> <br /> <br /> <br />
            </>
          )}
        </Fragment>
      ))}

      {(tipoForm !== "file") && (
        <>
          <Items 
            tipoItem={componenti.tipoItem} 
            items={componenti.items} 
            setItems={componenti.setItems}
            operazioneModifica={componenti.operazioneModifica} 
            operazioneElimina={componenti.operazioneElimina}
            campi={componenti.campiItemEsistente}
            handleBlurItem={componenti.handleBlurItem}
            tipoForm={tipoForm}
            vistaItem={vistaItem}
          />

          <br /> <br /> <br /> <br />

          {componenti.visualizzazioneInformazioni === true && componenti.items.length > 0 && (
            <>
              <center>
                <CardInformazioni 
                  totaleItems={componenti.totaleItems}
                />
              </center>

              <br /> <br /> <br /> <br />
            </>
          )}

          <OperazioniItems 
            selectedIdsModifica={componenti.selectedIdsModifica}
            selectedIdsEliminazione={componenti.selectedIdsEliminazione}
            handleEdit={componenti.handleEdit}
            handleDelete={componenti.handleDelete}
          />

          <br /> <br /> <br /> <br />
        </>
      )}
    </>
  )
}










