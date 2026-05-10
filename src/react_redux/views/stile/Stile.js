export const inputStyle = { 
  padding: "18px", 
  borderRadius: "10px", 
  border: "1px solid #ccc", 
  color: "black", 
  fontSize: "20px",
  width: "100%",
  boxSizing: "border-box"
};
export const buttonActionStyle = {
  padding: "20px 35px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "20px",
  transition: "0.2s opacity"
};
export const hStyle = {
  textAlign:"center", 
  backgroundColor:"#000000", 
  color:"gray", 
  marginBottom: "50px", 
}
export const ulStyle = {
  backgroundColor:"#000000", 
  color:"#FFFFFF", 
  marginBottom: "100px", 
}
export const entrateStyle = (entrate) => ({
  color: entrate > 0 ? "#00FF00" : "#FFFFFF"
});
export const usciteStyle = (uscite) => ({
  color: uscite > 0 ? "#FF0000" : "#FFFFFF"
});
export const ricaviStyle = (ricavi) => ({
  color: ricavi == 0 ? "#FFFFFF" : (ricavi < 0 ? "#FF0000" : "#00FF00")
});



