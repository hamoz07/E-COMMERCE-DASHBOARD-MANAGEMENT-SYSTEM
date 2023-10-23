import { Children, createContext, useState } from "react";

const CONACT = createContext("")


import React from 'react'

const ContextManager = ({children}) => {
   const [open,setOpen] = useState(false)
  return (
    <CONACT.Provider value={{open,setOpen}}>{children}</CONACT.Provider>
  )
}

export  {CONACT,ContextManager}
