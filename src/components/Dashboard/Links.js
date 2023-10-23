import {
    faBox,
    faBoxesStacked,
    faParachuteBox,
    faTruckFast,
    faUserGroup,
    faUserPlus,
  } from "@fortawesome/free-solid-svg-icons";

export const links = [
{
    path:"users",
    icon:faUserGroup,
    text:'users',
    role:["1995"]
},
{
    path:"user/create",
    icon:faUserPlus,
    text:'create user',
    role:["1995"]
},
{
    path:"categories",
    icon:faBoxesStacked,
    text:'categories',
    role:["1995","1999"]
},
{
    path:"category/create",
    icon:faParachuteBox,
    text:'create category',
    role:["1995","1999"]
},
{
    path:"products",
    icon:faTruckFast,
    text:'products',
    role:["1995","1999"]
},
{
    path:"product/create",
    icon:faBox,
    text:'create product',
    role:["1995","1999"]
},

]