export const Textreplacer = (str,limit) =>{
 return str.length > 10 ? `${str.substring(0,limit)}...` : `${str}`;
}