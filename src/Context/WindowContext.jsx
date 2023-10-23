import React, { createContext, useEffect, useState } from 'react'

const WINContexter  = createContext(null)

const WindowContext = ({children}) => {
    const [windowStroke,setWindowStroke] = useState(window.innerWidth)

        useEffect(()=>{
            function controlWidth(){
                setWindowStroke(window.innerWidth)
            }

            window.addEventListener("resize",controlWidth)

            return ()=>{
                window.removeEventListener("resize",controlWidth)
            }
        },[])

  return (
    <WINContexter.Provider value={{windowStroke,setWindowStroke}}>{children}</WINContexter.Provider>
  )
}

export {WINContexter, WindowContext}
