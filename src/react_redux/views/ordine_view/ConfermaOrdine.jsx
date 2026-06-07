import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const ConfermaOrdine = () => {
  const navigate = useNavigate();
  
  const tornaPaginaNuovoOrdine = () => {
    navigate("/nuovo-ordine")
  }

  return (
    <>
      <Header />      

      <div className="main-content" />

      <div style={{ color: "white", textAlign: "center", marginTop: "120px", padding: "40px" }}>
        <h3 style={{ fontSize: "72px", fontWeight: "900" }}>Ordine confermato! 🎉</h3>
        <p style={{ fontSize: "36px", opacity: 0.9 }}>Il tuo ordine è in fase di elaborazione.</p>
        <button 
          onClick={tornaPaginaNuovoOrdine} 
          style={{ 
            marginTop: "50px", 
            padding: "30px 60px", 
            fontSize: "32px", 
            fontWeight: "bold", 
            borderRadius: "20px", 
            cursor: "pointer",
            backgroundColor: "white",
            color: "black",
            border: "none"
          }}
        >
          Torna allo Shop
        </button>
      </div>
    </>
  );
}

export default ConfermaOrdine;